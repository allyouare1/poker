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
  status: 'waiting' // waiting, playing, finished
});

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

    // Add player to game
    game.players.set(socket.id, {
      id: socket.id,
      name: playerName,
      chips: 1000,
      cards: [],
      isActive: true,
      isFolded: false,
      currentBet: 0
    });

    // Join socket room
    socket.join(gameId);

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
  });

  // Handle player disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Find and handle the game the player was in
    for (const [gameId, game] of games.entries()) {
      if (game.players.has(socket.id)) {
        const player = game.players.get(socket.id);
        
        // Mark player as inactive instead of removing
        player.isActive = false;
        
        // Notify other players
        io.to(gameId).emit('playerDisconnected', {
          playerId: socket.id,
          playerName: player.name
        });

        // If no active players left, remove the game
        const activePlayers = Array.from(game.players.values()).filter(p => p.isActive);
        if (activePlayers.length === 0) {
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
      // Update player's socket ID and status
      game.players.delete(player.id);
      player.id = socket.id;
      player.isActive = true;
      game.players.set(socket.id, player);

      // Join socket room
      socket.join(gameId);

      // Send current game state to reconnected player
      socket.emit('gameState', {
        gameId,
        players: Array.from(game.players.values()),
        communityCards: game.communityCards,
        pot: game.pot,
        currentBet: game.currentBet,
        currentTurn: game.currentTurn,
        status: game.status
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

    // Handle different game actions
    switch (action) {
      case 'bet':
        if (amount > player.chips) {
          socket.emit('error', { message: 'Not enough chips' });
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
    }

    // Update last action
    game.lastAction = {
      playerId: socket.id,
      action,
      amount
    };

    // Notify all players of the action
    io.to(gameId).emit('gameAction', {
      playerId: socket.id,
      playerName: player.name,
      action,
      amount,
      pot: game.pot,
      currentBet: game.currentBet
    });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 