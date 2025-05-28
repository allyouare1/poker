// poker-clone-react - Vite + React basic template for online poker project

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// Simple Home component with room creation/joining
function Home() {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    if (!username.trim()) {
      alert('Please enter your username');
      return;
    }
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${newRoomId}/lobby`, { state: { username } });
  };

  const joinRoom = () => {
    if (!username.trim()) {
      alert('Please enter your username');
      return;
    }
    if (roomId.trim()) {
      navigate(`/room/${roomId}/lobby`, { state: { username } });
    } else {
      alert('Please enter a room ID');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 text-center">
      <h1 className="text-5xl font-bold mb-8 text-blue-800">🎲 Online Poker</h1>
      <div className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
        />
        <button 
          onClick={createRoom}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl"
        >
          Create Room
        </button>
        <div className="flex space-x-4">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            placeholder="Enter Room ID"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
          />
          <button 
            onClick={joinRoom}
            className="px-6 py-3 bg-green-600 text-white rounded-xl"
          >
            Join Room
          </button>
        </div>
        <Link to="/single" className="block w-full px-6 py-3 bg-purple-600 text-white rounded-xl">
          Play vs Bot
        </Link>
      </div>
    </div>
  );
}

// Simple Rules component
function Rules() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-semibold mb-4 text-blue-800">📜 Poker Rules</h2>
        <div className="text-gray-700 space-y-4">
          <p>1. Each player gets 2 cards</p>
          <p>2. Betting rounds: Pre-flop, Flop, Turn, River</p>
          <p>3. Actions: Fold, Check, Call, Raise</p>
          <p>4. Best 5-card hand wins</p>
        </div>
      </div>
    </div>
  );
}

// Simple Card component
function Card({ value, suit, isHidden = false }) {
  const isRed = suit === '♥' || suit === '♦';
  
  if (isHidden) {
    return (
      <div className="w-16 h-24 bg-blue-600 rounded-lg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-white/10"></div>
      </div>
    );
  }

  return (
    <div className="w-16 h-24 bg-white rounded-lg flex flex-col p-2 shadow-lg">
      <div className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-gray-800'}`}>
        {value}
      </div>
      <div className={`text-2xl ${isRed ? 'text-red-600' : 'text-gray-800'}`}>
        {suit}
      </div>
    </div>
  );
}

// Simple Lobby component
function Lobby() {
  const { id: roomId } = useParams();
  const location = useLocation();
  const username = location.state?.username || 'Anonymous';
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const roomData = JSON.parse(localStorage.getItem(`room_${roomId}`) || '{"players": []}');
    const existingPlayer = roomData.players.find(p => p.name === username);
    
    if (existingPlayer) {
      setPlayers(roomData.players.map(p => 
        p.name === username ? { ...p, isCurrentUser: true } : { ...p, isCurrentUser: false }
      ));
    } else {
      const newPlayer = {
        id: roomData.players.length + 1,
        name: username,
        chips: 1000,
        isReady: false,
        isCurrentUser: true
      };
      const updatedPlayers = [...roomData.players, newPlayer];
      setPlayers(updatedPlayers);
      localStorage.setItem(`room_${roomId}`, JSON.stringify({ players: updatedPlayers }));
    }

    const handleStorageChange = (e) => {
      if (e.key === `room_${roomId}`) {
        const newRoomData = JSON.parse(e.newValue);
        setPlayers(newRoomData.players.map(p => 
          p.name === username ? { ...p, isCurrentUser: true } : { ...p, isCurrentUser: false }
        ));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [roomId, username]);

  const startGame = () => {
    if (players.filter(p => p.isReady).length >= 2) {
      navigate(`/room/${roomId}/game`, { state: { username } });
    } else {
      alert("Need at least 2 ready players to start!");
    }
  };

  const toggleReady = (playerId) => {
    const updatedPlayers = players.map(player => 
      player.id === playerId && player.isCurrentUser
        ? { ...player, isReady: !player.isReady }
        : player
    );
    setPlayers(updatedPlayers);
    localStorage.setItem(`room_${roomId}`, JSON.stringify({ players: updatedPlayers }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6">Room: {roomId}</h2>
        <div className="space-y-4">
          {players.map(player => (
            <div key={player.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">{player.name}</span>
                {player.isCurrentUser && <span className="text-blue-600 ml-2">(You)</span>}
              </div>
              {player.isCurrentUser ? (
                <button
                  onClick={() => toggleReady(player.id)}
                  className={`px-4 py-2 rounded-lg ${
                    player.isReady ? 'bg-green-500 text-white' : 'bg-gray-300'
                  }`}
                >
                  {player.isReady ? 'Ready' : 'Not Ready'}
                </button>
              ) : (
                <div className="px-4 py-2 bg-gray-200 rounded-lg">
                  {player.isReady ? 'Ready' : 'Not Ready'}
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={startGame}
          disabled={players.filter(p => p.isReady).length < 2}
          className={`mt-6 w-full px-6 py-3 rounded-xl ${
            players.filter(p => p.isReady).length >= 2
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

// Simple GameRoom component
function GameRoom() {
  const { id: roomId } = useParams();
  const location = useLocation();
  const username = location.state?.username;
  const [gameState, setGameState] = useState({
    players: [],
    communityCards: [],
    pot: 0,
    currentBet: 50,
    currentPlayer: 1,
    round: 'preflop',
    revealedCards: 0
  });

  useEffect(() => {
    const roomData = JSON.parse(localStorage.getItem(`room_${roomId}`) || '{"players": []}');
    const deck = createDeck();
    const dealtPlayers = roomData.players.map(player => ({
      ...player,
      cards: [deck.pop(), deck.pop()],
      bet: 0,
      isActive: true
    }));

    const communityCards = [
      deck.pop(), deck.pop(), deck.pop(),
      deck.pop(), deck.pop()
    ];

    setGameState({
      ...gameState,
      players: dealtPlayers,
      communityCards,
      currentPlayer: dealtPlayers[0].id
    });

    localStorage.setItem(`game_${roomId}`, JSON.stringify({
      players: dealtPlayers,
      communityCards,
      currentPlayer: dealtPlayers[0].id,
      pot: 0,
      currentBet: 50,
      round: 'preflop',
      revealedCards: 0
    }));
  }, [roomId]);

  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];
    
    for (let suit of suits) {
      for (let value of values) {
        deck.push({ value, suit });
      }
    }
    
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
  };

  const handleAction = (action) => {
    setGameState(prevState => {
      const newState = { ...prevState };
      const currentPlayer = newState.players.find(p => p.id === prevState.currentPlayer);
      
      if (currentPlayer.name !== username) return prevState;
      
      switch (action) {
        case 'fold':
          currentPlayer.isActive = false;
          break;
        case 'check':
          break;
        case 'call':
          const callAmount = prevState.currentBet - currentPlayer.bet;
          currentPlayer.chips -= callAmount;
          currentPlayer.bet += callAmount;
          newState.pot += callAmount;
          break;
        case 'raise':
          const raiseAmount = 100;
          currentPlayer.chips -= raiseAmount;
          currentPlayer.bet += raiseAmount;
          newState.pot += raiseAmount;
          newState.currentBet = currentPlayer.bet;
          break;
      }

      let nextPlayerIndex = (newState.players.findIndex(p => p.id === prevState.currentPlayer) + 1) % newState.players.length;
      while (!newState.players[nextPlayerIndex].isActive) {
        nextPlayerIndex = (nextPlayerIndex + 1) % newState.players.length;
      }
      newState.currentPlayer = newState.players[nextPlayerIndex].id;

      localStorage.setItem(`game_${roomId}`, JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <div className="text-white text-2xl font-semibold">
            {gameState.round.charAt(0).toUpperCase() + gameState.round.slice(1)}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-white text-xl mb-4">Community Cards</h3>
            <div className="flex space-x-4">
              {gameState.communityCards.map((card, index) => (
                <div key={index}>
                  {index < gameState.revealedCards ? (
                    <Card value={card.value} suit={card.suit} />
                  ) : (
                    <Card isHidden={true} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 text-white">
          <div className="text-2xl">Pot: ${gameState.pot}</div>
          <div className="text-2xl">Current Bet: ${gameState.currentBet}</div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {gameState.players.map((player) => (
            <div 
              key={player.id}
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 ${
                player.id === gameState.currentPlayer ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-white">
                  <h3 className="text-xl font-semibold">{player.name}</h3>
                  <p>Chips: ${player.chips}</p>
                  <p>Bet: ${player.bet}</p>
                </div>
                <div className="flex space-x-2">
                  {player.cards.map((card, index) => (
                    <Card 
                      key={index} 
                      value={card.value} 
                      suit={card.suit}
                      isHidden={player.name !== username}
                    />
                  ))}
                </div>
              </div>
              {!player.isActive && (
                <div className="text-red-400 text-xl font-semibold">Folded</div>
              )}
            </div>
          ))}
        </div>

        {gameState.players.find(p => p.name === username)?.id === gameState.currentPlayer && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex space-x-4">
              <button
                onClick={() => handleAction('fold')}
                className="px-6 py-3 bg-red-600 text-white rounded-xl"
              >
                Fold
              </button>
              <button
                onClick={() => handleAction('check')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl"
              >
                Check
              </button>
              <button
                onClick={() => handleAction('call')}
                className="px-6 py-3 bg-green-600 text-white rounded-xl"
              >
                Call ${gameState.currentBet}
              </button>
              <button
                onClick={() => handleAction('raise')}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl"
              >
                Raise
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple SinglePlayer component
function SinglePlayer() {
  const [gameState, setGameState] = useState({
    players: [
      { id: 1, name: "You", cards: [{ value: 'A', suit: '♠' }, { value: 'K', suit: '♠' }], chips: 1000, bet: 0, isActive: true },
      { id: 2, name: "Bot", cards: [{ value: 'Q', suit: '♥' }, { value: 'J', suit: '♥' }], chips: 1000, bet: 0, isActive: true },
    ],
    communityCards: [
      { value: 'A', suit: '♥' },
      { value: 'K', suit: '♦' },
      { value: 'Q', suit: '♣' },
      { value: 'J', suit: '♠' },
      { value: '10', suit: '♥' }
    ],
    pot: 0,
    currentBet: 50,
    currentPlayer: 1,
    round: 'preflop',
    revealedCards: 0,
    botThinking: false
  });

  const handleAction = (action) => {
    setGameState(prevState => {
      const newState = { ...prevState };
      const currentPlayer = newState.players.find(p => p.id === prevState.currentPlayer);
      
      switch (action) {
        case 'fold':
          currentPlayer.isActive = false;
          break;
        case 'check':
          break;
        case 'call':
          const callAmount = prevState.currentBet - currentPlayer.bet;
          currentPlayer.chips -= callAmount;
          currentPlayer.bet += callAmount;
          newState.pot += callAmount;
          break;
        case 'raise':
          const raiseAmount = 100;
          currentPlayer.chips -= raiseAmount;
          currentPlayer.bet += raiseAmount;
          newState.pot += raiseAmount;
          newState.currentBet = currentPlayer.bet;
          break;
      }

      newState.currentPlayer = 2;
      newState.botThinking = true;
      
      setTimeout(() => {
        makeBotMove();
      }, 1000);

      return newState;
    });
  };

  const makeBotMove = () => {
    setGameState(prevState => {
      const newState = { ...prevState };
      const bot = newState.players.find(p => p.id === 2);
      
      const actions = ['fold', 'call', 'raise'];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      switch (action) {
        case 'fold':
          bot.isActive = false;
          break;
        case 'call':
          const callAmount = prevState.currentBet - bot.bet;
          bot.chips -= callAmount;
          bot.bet += callAmount;
          newState.pot += callAmount;
          break;
        case 'raise':
          const raiseAmount = 100;
          bot.chips -= raiseAmount;
          bot.bet += raiseAmount;
          newState.pot += raiseAmount;
          newState.currentBet = bot.bet;
          break;
      }

      newState.botThinking = false;
      newState.currentPlayer = 1;

      return newState;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <div className="text-white text-2xl font-semibold">
            {gameState.round.charAt(0).toUpperCase() + gameState.round.slice(1)}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-white text-xl mb-4">Community Cards</h3>
            <div className="flex space-x-4">
              {gameState.communityCards.map((card, index) => (
                <div key={index}>
                  {index < gameState.revealedCards ? (
                    <Card value={card.value} suit={card.suit} />
                  ) : (
                    <Card isHidden={true} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 text-white">
          <div className="text-2xl">Pot: ${gameState.pot}</div>
          <div className="text-2xl">Current Bet: ${gameState.currentBet}</div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {gameState.players.map((player) => (
            <div 
              key={player.id}
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 ${
                player.id === gameState.currentPlayer ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-white">
                  <h3 className="text-xl font-semibold">{player.name}</h3>
                  <p>Chips: ${player.chips}</p>
                  <p>Bet: ${player.bet}</p>
                </div>
                <div className="flex space-x-2">
                  {player.cards.map((card, index) => (
                    <Card 
                      key={index} 
                      value={card.value} 
                      suit={card.suit}
                      isHidden={player.id === 2}
                    />
                  ))}
                </div>
              </div>
              {!player.isActive && (
                <div className="text-red-400 text-xl font-semibold">Folded</div>
              )}
              {player.id === 2 && gameState.botThinking && (
                <div className="text-yellow-400 text-xl font-semibold">Bot is thinking...</div>
              )}
            </div>
          ))}
        </div>

        {gameState.currentPlayer === 1 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex space-x-4">
              <button
                onClick={() => handleAction('fold')}
                className="px-6 py-3 bg-red-600 text-white rounded-xl"
              >
                Fold
              </button>
              <button
                onClick={() => handleAction('check')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl"
              >
                Check
              </button>
              <button
                onClick={() => handleAction('call')}
                className="px-6 py-3 bg-green-600 text-white rounded-xl"
              >
                Call ${gameState.currentBet}
              </button>
              <button
                onClick={() => handleAction('raise')}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl"
              >
                Raise
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex space-x-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <Link to="/rules" className="text-blue-600 hover:text-blue-800">Rules</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/room/:id/lobby" element={<Lobby />} />
        <Route path="/room/:id/game" element={<GameRoom />} />
        <Route path="/single" element={<SinglePlayer />} />
      </Routes>
    </Router>
  );
}
