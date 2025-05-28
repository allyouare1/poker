// poker-clone-react - Vite + React basic template for online poker project

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function Home() {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('poker_username') || '';
  });
  const navigate = useNavigate();

  const createRoom = () => {
    if (!username.trim()) {
      alert('Please enter your username');
      return;
    }
    localStorage.setItem('poker_username', username);
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${newRoomId}/lobby`, { state: { username } });
  };

  const joinRoom = () => {
    if (!username.trim()) {
      alert('Please enter your username');
      return;
    }
    localStorage.setItem('poker_username', username);
    if (roomId.trim()) {
      navigate(`/room/${roomId}/lobby`, { state: { username } });
    } else {
      alert('Please enter a room ID');
    }
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (newUsername.trim()) {
      localStorage.setItem('poker_username', newUsername);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 text-center">
      <h1 className="text-5xl font-bold mb-8 text-blue-800">🎲 Online Poker</h1>
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter your username"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={createRoom}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-200"
          >
            Create Room
          </button>
        </div>
        <div className="flex space-x-4">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            placeholder="Enter Room ID"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={joinRoom}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition-all duration-200"
          >
            Join Room
          </button>
        </div>
        <div className="pt-4">
          <Link to="/single" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg transition-all duration-200">
            Play vs Bot
          </Link>
        </div>
      </div>
    </div>
  );
}

function Rules() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-semibold mb-4 text-blue-800">📜 Poker Rules</h2>
        <p className="text-gray-700">Texas Hold'em poker rules will be here...</p>
      </div>
    </div>
  );
}

function Lobby() {
  const { id: roomId } = useParams();
  const location = useLocation();
  const username = location.state?.username || 'Anonymous';
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const roomData = JSON.parse(localStorage.getItem(`room_${roomId}`) || '{"players": []}');
    const existingPlayer = roomData.players.find(p => p.name === username);
    
    if (existingPlayer) {
      setPlayers(roomData.players.map(p => 
        p.name === username 
          ? { ...p, isCurrentUser: true }
          : { ...p, isCurrentUser: false }
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
      localStorage.setItem(`room_${roomId}`, JSON.stringify({
        players: updatedPlayers
      }));
    }

    const handleStorageChange = (e) => {
      if (e.key === `room_${roomId}`) {
        const newRoomData = JSON.parse(e.newValue);
        setPlayers(newRoomData.players.map(p => 
          p.name === username 
            ? { ...p, isCurrentUser: true }
            : { ...p, isCurrentUser: false }
        ));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [roomId, username]);

  const startGame = () => {
    if (players.filter(p => p.isReady).length >= 2) {
      setGameStarted(true);
      navigate(`/room/${roomId}/game`, { state: { username } });
    } else {
      alert("Need at least 2 ready players to start the game!");
    }
  };

  const togglePlayerReady = (playerId) => {
    const updatedPlayers = players.map(player => 
      player.id === playerId && player.isCurrentUser
        ? { ...player, isReady: !player.isReady }
        : player
    );
    
    setPlayers(updatedPlayers);
    localStorage.setItem(`room_${roomId}`, JSON.stringify({
      players: updatedPlayers
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-blue-800">🧑‍🤝‍🧑 Room Lobby</h2>
          <div className="flex items-center space-x-4">
            <div className="text-gray-600">Room ID: {roomId}</div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                alert('Room ID copied to clipboard!');
              }}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 text-sm"
            >
              Copy ID
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3 text-gray-700">Players ({players.length}/6)</h3>
          <div className="space-y-3">
            {players.map(player => (
              <div 
                key={player.id}
                className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${
                  player.isCurrentUser ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">{player.name}</span>
                  <span className="text-green-600">${player.chips}</span>
                  {player.isCurrentUser && (
                    <span className="text-blue-600 text-sm">(You)</span>
                  )}
                </div>
                {player.isCurrentUser ? (
                  <button
                    onClick={() => togglePlayerReady(player.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      player.isReady 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                    }`}
                  >
                    {player.isReady ? 'Ready' : 'Not Ready'}
                  </button>
                ) : (
                  <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600">
                    {player.isReady ? 'Ready' : 'Not Ready'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            {players.filter(p => p.isReady).length} players ready
          </div>
          <button
            onClick={startGame}
            disabled={players.filter(p => p.isReady).length < 2}
            className={`px-6 py-3 rounded-xl shadow-lg transition-all duration-200 ${
              players.filter(p => p.isReady).length >= 2
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ value, suit, isHidden = false }) {
  const getSuitColor = (suit) => {
    return suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-gray-800';
  };

  if (isHidden) {
    return (
      <div className="w-16 h-24 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg border-2 border-white/20">
        <div className="w-8 h-8 rounded-full bg-white/10"></div>
      </div>
    );
  }

  return (
    <div className="w-16 h-24 bg-white rounded-lg flex flex-col p-2 shadow-lg border border-gray-200">
      <div className={`text-lg font-bold ${getSuitColor(suit)}`}>
        {value}
      </div>
      <div className={`text-2xl ${getSuitColor(suit)}`}>
        {suit}
      </div>
    </div>
  );
}

function GameRoom() {
  const { id: roomId } = useParams();
  const location = useLocation();
  const username = location.state?.username;

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

  const dealCards = (players) => {
    const deck = createDeck();
    const dealtPlayers = players.map(player => ({
      ...player,
      cards: [deck.pop(), deck.pop()],
      bet: 0,
      isActive: true
    }));

    const communityCards = [
      deck.pop(),
      deck.pop(),
      deck.pop(),
      deck.pop(),
      deck.pop()
    ];

    return { dealtPlayers, communityCards };
  };

  const [gameState, setGameState] = useState({
    players: [],
    communityCards: [],
    pot: 0,
    currentBet: 50,
    dealer: 1,
    currentPlayer: 1,
    round: 'preflop',
    revealedCards: 0,
    playersActed: 0
  });

  useEffect(() => {
    const roomData = JSON.parse(localStorage.getItem(`room_${roomId}`) || '{"players": []}');
    const { dealtPlayers, communityCards } = dealCards(roomData.players);

    setGameState(prev => ({
      ...prev,
      players: dealtPlayers,
      communityCards,
      currentPlayer: dealtPlayers[0].id
    }));

    localStorage.setItem(`game_${roomId}`, JSON.stringify({
      ...gameState,
      players: dealtPlayers,
      communityCards,
      currentPlayer: dealtPlayers[0].id
    }));
  }, [roomId]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === `game_${roomId}`) {
        const newGameState = JSON.parse(e.newValue);
        setGameState(newGameState);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [roomId]);

  const handleAction = (action) => {
    setGameState(prevState => {
      const newState = { ...prevState };
      const currentPlayer = newState.players.find(p => p.id === prevState.currentPlayer);
      
      if (currentPlayer.name !== username) {
        return prevState;
      }
      
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

      newState.playersActed++;

      let nextPlayerIndex = (newState.players.findIndex(p => p.id === prevState.currentPlayer) + 1) % newState.players.length;
      while (!newState.players[nextPlayerIndex].isActive) {
        nextPlayerIndex = (nextPlayerIndex + 1) % newState.players.length;
      }
      newState.currentPlayer = newState.players[nextPlayerIndex].id;

      const activePlayers = newState.players.filter(p => p.isActive).length;
      if (newState.playersActed >= activePlayers) {
        newState.playersActed = 0;
        newState.players.forEach(p => p.bet = 0);
        newState.currentBet = 0;

        switch (newState.round) {
          case 'preflop':
            newState.round = 'flop';
            newState.revealedCards = 3;
            break;
          case 'flop':
            newState.round = 'turn';
            newState.revealedCards = 4;
            break;
          case 'turn':
            newState.round = 'river';
            newState.revealedCards = 5;
            break;
          case 'river':
            alert('Round complete!');
            const { dealtPlayers, communityCards } = dealCards(newState.players.map(p => ({
              ...p,
              cards: [],
              bet: 0,
              isActive: true
            })));
            newState.players = dealtPlayers;
            newState.communityCards = communityCards;
            newState.round = 'preflop';
            newState.revealedCards = 0;
            break;
        }
      }

      localStorage.setItem(`game_${roomId}`, JSON.stringify(newState));
      return newState;
    });
  };

  const getRoundName = (round) => {
    switch (round) {
      case 'preflop': return 'Pre-Flop';
      case 'flop': return 'Flop';
      case 'turn': return 'Turn';
      case 'river': return 'River';
      default: return round;
    }
  };

  const isCurrentPlayerTurn = () => {
    const currentPlayer = gameState.players.find(p => p.name === username);
    return currentPlayer && currentPlayer.id === gameState.currentPlayer;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <div className="text-white text-2xl font-semibold">
            {getRoundName(gameState.round)}
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
              {player.id === gameState.currentPlayer && (
                <div className="text-yellow-400 text-xl font-semibold">Current Turn</div>
              )}
            </div>
          ))}
        </div>

        {isCurrentPlayerTurn() && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex space-x-4">
              <button
                onClick={() => handleAction('fold')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all duration-200"
              >
                Fold
              </button>
              <button
                onClick={() => handleAction('check')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-200"
              >
                Check
              </button>
              <button
                onClick={() => handleAction('call')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition-all duration-200"
              >
                Call ${gameState.currentBet}
              </button>
              <button
                onClick={() => handleAction('raise')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg transition-all duration-200"
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
    dealer: 1,
    currentPlayer: 1,
    round: 'preflop',
    revealedCards: 0,
    botThinking: false,
    playersActed: 0,
    roundComplete: false
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

      newState.playersActed++;
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

      newState.playersActed++;
      newState.botThinking = false;
      newState.currentPlayer = 1;

      if (newState.playersActed >= 2) {
        newState.playersActed = 0;
        newState.players.forEach(p => p.bet = 0);
        newState.currentBet = 0;

        switch (newState.round) {
          case 'preflop':
            newState.round = 'flop';
            newState.revealedCards = 3;
            break;
          case 'flop':
            newState.round = 'turn';
            newState.revealedCards = 4;
            break;
          case 'turn':
            newState.round = 'river';
            newState.revealedCards = 5;
            break;
          case 'river':
            alert('Round complete!');
            break;
        }
      }

      return newState;
    });
  };

  const getRoundName = (round) => {
    switch (round) {
      case 'preflop': return 'Pre-Flop';
      case 'flop': return 'Flop';
      case 'turn': return 'Turn';
      case 'river': return 'River';
      default: return round;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <div className="text-white text-2xl font-semibold">
            {getRoundName(gameState.round)}
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

        {gameState.players.find(p => p.name === username)?.id === gameState.currentPlayer && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex space-x-4">
              <button
                onClick={() => handleAction('fold')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all duration-200"
              >
                Fold
              </button>
              <button
                onClick={() => handleAction('check')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-200"
              >
                Check
              </button>
              <button
                onClick={() => handleAction('call')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition-all duration-200"
              >
                Call ${gameState.currentBet}
              </button>
              <button
                onClick={() => handleAction('raise')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg transition-all duration-200"
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
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Home</Link>
          <Link to="/rules" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Rules</Link>
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
