import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Game state management
const games = new Map();

// Helper function to create a new game
const createGame = (gameId) => ({
  id: gameId,
  players: new Map(),
  currentTurn: null,
  deck: [],
  communityCards: [],
  pot: 0,
  currentBet: 0,
  lastAction: null,
  status: 'waiting', // waiting, playing, finished
  round: 'preflop', // preflop, flop, turn, river
  dealer: null,
  smallBlind: 10,
  bigBlind: 20,
  lastActivity: Date.now(),
  gameTimeout: null
});

// Cleanup inactive games
const cleanupInactiveGames = () => {
  const now = Date.now();
  for (const [gameId, game] of games.entries()) {
    if (now - game.lastActivity > 3600000) { // 1 hour
      games.delete(gameId);
    }
  }
};

// Run cleanup every 15 minutes
setInterval(cleanupInactiveGames, 900000);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle player joining a game
  socket.on('joinGame', ({ gameId, playerName }) => {
    let game = games.get(gameId);
    
    if (!game) {
      game = createGame(gameId);
      games.set(gameId, game);
    }

    // Check if game is full (max 6 players)
    if (game.players.size >= 6) {
      socket.emit('error', { message: 'Game is full' });
      return;
    }

    // Check if player name is already taken in this game
    const existingPlayer = Array.from(game.players.values()).find(p => p.name === playerName);
    if (existingPlayer) {
      socket.emit('error', { message: 'Player name already taken' });
      return;
    }

    // Add player to game
    game.players.set(socket.id, {
      id: socket.id,
      name: playerName,
      chips: 1000,
      cards: [],
      isActive: true,
      isFolded: false,
      currentBet: 0,
      lastSeen: Date.now()
    });

    // Join socket room
    socket.join(gameId);

    // Update game activity timestamp
    game.lastActivity = Date.now();

    // Notify all players in the game
    io.to(gameId).emit('playerJoined', {
      playerId: socket.id,
      playerName,
      players: Array.from(game.players.values())
    });

    // If this is the first player, make them the host
    if (game.players.size === 1) {
      socket.emit('hostStatus', true);
    }

    // Send current game state to the new player
    socket.emit('gameState', {
      gameId,
      players: Array.from(game.players.values()),
      communityCards: game.communityCards,
      pot: game.pot,
      currentBet: game.currentBet,
      currentTurn: game.currentTurn,
      status: game.status,
      round: game.round,
      dealer: game.dealer
    });
  });

  // Handle player disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Find and handle the game the player was in
    for (const [gameId, game] of games.entries()) {
      if (game.players.has(socket.id)) {
        const player = game.players.get(socket.id);
        
        // Mark player as inactive and update last seen
        player.isActive = false;
        player.lastSeen = Date.now();
        
        // Notify other players
        io.to(gameId).emit('playerDisconnected', {
          playerId: socket.id,
          playerName: player.name
        });

        // If game is in progress, start a timeout for the disconnected player
        if (game.status === 'playing') {
          const timeout = setTimeout(() => {
            // If player hasn't reconnected after 2 minutes, fold their hand
            if (game.players.get(socket.id)?.isActive === false) {
              const player = game.players.get(socket.id);
              if (player && !player.isFolded) {
                player.isFolded = true;
                io.to(gameId).emit('gameAction', {
                  playerId: socket.id,
                  playerName: player.name,
                  action: 'fold',
                  amount: 0,
                  pot: game.pot,
                  currentBet: game.currentBet
                });
              }
            }
          }, 120000); // 2 minutes

          // Store the timeout reference
          game.gameTimeout = timeout;
        }

        // If no active players left, remove the game
        const activePlayers = Array.from(game.players.values()).filter(p => p.isActive);
        if (activePlayers.length === 0) {
          if (game.gameTimeout) {
            clearTimeout(game.gameTimeout);
          }
          games.delete(gameId);
        }
        
        break;
      }
    }
  });

  // Handle player reconnection
  socket.on('reconnect', ({ gameId, playerName }) => {
    const game = games.get(gameId);
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    // Find the player by name
    const player = Array.from(game.players.values()).find(p => p.name === playerName);
    if (player) {
      // Clear any existing timeout
      if (game.gameTimeout) {
        clearTimeout(game.gameTimeout);
        game.gameTimeout = null;
      }

      // Update player's socket ID and status
      game.players.delete(player.id);
      player.id = socket.id;
      player.isActive = true;
      player.lastSeen = Date.now();
      game.players.set(socket.id, player);

      // Join socket room
      socket.join(gameId);

      // Update game activity timestamp
      game.lastActivity = Date.now();

      // Send current game state to reconnected player
      socket.emit('gameState', {
        gameId,
        players: Array.from(game.players.values()),
        communityCards: game.communityCards,
        pot: game.pot,
        currentBet: game.currentBet,
        currentTurn: game.currentTurn,
        status: game.status,
        round: game.round,
        dealer: game.dealer
      });

      // Notify other players
      io.to(gameId).emit('playerReconnected', {
        playerId: socket.id,
        playerName: player.name
      });
    }
  });

  // Handle game actions (bet, fold, check, etc.)
  socket.on('gameAction', ({ gameId, action, amount }) => {
    const game = games.get(gameId);
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    const player = game.players.get(socket.id);
    if (!player) {
      socket.emit('error', { message: 'Player not found in game' });
      return;
    }

    if (!player.isActive) {
      socket.emit('error', { message: 'Player is not active' });
      return;
    }

    // Update player's last seen timestamp
    player.lastSeen = Date.now();
    game.lastActivity = Date.now();

    // Handle different game actions
    switch (action) {
      case 'bet':
        if (amount > player.chips) {
          socket.emit('error', { message: 'Not enough chips' });
          return;
        }
        if (amount < game.currentBet * 2) {
          socket.emit('error', { message: 'Minimum raise must be double the current bet' });
          return;
        }
        player.chips -= amount;
        game.pot += amount;
        player.currentBet += amount;
        game.currentBet = Math.max(game.currentBet, player.currentBet);
        break;
      
      case 'fold':
        player.isFolded = true;
        break;
      
      case 'check':
        // Only valid if no bets have been made
        if (game.currentBet > 0) {
          socket.emit('error', { message: 'Cannot check when there are bets' });
          return;
        }
        break;

      case 'call':
        const callAmount = game.currentBet - player.currentBet;
        if (callAmount > player.chips) {
          socket.emit('error', { message: 'Not enough chips to call' });
          return;
        }
        player.chips -= callAmount;
        game.pot += callAmount;
        player.currentBet += callAmount;
        break;
    }

    // Update last action
    game.lastAction = {
      playerId: socket.id,
      action,
      amount,
      timestamp: Date.now()
    };

    // Notify all players of the action
    io.to(gameId).emit('gameAction', {
      playerId: socket.id,
      playerName: player.name,
      action,
      amount,
      pot: game.pot,
      currentBet: game.currentBet,
      timestamp: game.lastAction.timestamp
    });
  });

  // Handle game start
  socket.on('startGame', ({ gameId }) => {
    const game = games.get(gameId);
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    const player = game.players.get(socket.id);
    if (!player) {
      socket.emit('error', { message: 'Player not found in game' });
      return;
    }

    // Only host can start the game
    if (game.players.size < 2) {
      socket.emit('error', { message: 'Need at least 2 players to start' });
      return;
    }

    game.status = 'playing';
    game.round = 'preflop';
    game.dealer = Array.from(game.players.keys())[0];
    
    // Deal cards and set up initial game state
    // ... (implement card dealing logic here)

    // Notify all players that the game has started
    io.to(gameId).emit('gameStarted', {
      gameId,
      players: Array.from(game.players.values()),
      dealer: game.dealer,
      round: game.round
    });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 