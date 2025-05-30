// poker-clone-react - Vite + React basic template for online poker project

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import socketService from './services/socket';

function Home() {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('poker_username') || '';
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }
    setError('');
    localStorage.setItem('poker_username', username);
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${newRoomId}/lobby`, { state: { username } });
  };

  const joinRoom = () => {
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }
    setError('');
    localStorage.setItem('poker_username', username);
      navigate(`/room/${roomId}/lobby`, { state: { username } });
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    setError('');
    if (newUsername.trim()) {
      localStorage.setItem('poker_username', newUsername);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 text-center">
      <h1 className="text-5xl font-bold mb-8 text-blue-800">🎲 Online Poker</h1>
      <div className="max-w-md mx-auto space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
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
        <h2 className="text-3xl font-semibold mb-6 text-blue-800">📜 Texas Hold'em Poker Rules</h2>
        
        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Game Overview</h3>
            <p className="text-gray-700 mb-2">
              Texas Hold'em is a community card poker game where players try to make the best five-card hand using any combination of their two private cards and the five community cards.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Basic Rules</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Each player is dealt two private cards (hole cards)</li>
              <li>Five community cards are dealt face up in the center</li>
              <li>Players can use any combination of their hole cards and community cards</li>
              <li>The best five-card hand wins the pot</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Game Flow</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li><strong>Pre-Flop:</strong> Players receive their hole cards and place initial bets</li>
              <li><strong>Flop:</strong> First three community cards are dealt</li>
              <li><strong>Turn:</strong> Fourth community card is dealt</li>
              <li><strong>River:</strong> Fifth and final community card is dealt</li>
              <li><strong>Showdown:</strong> Players reveal their hands and the best hand wins</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Player Actions</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Fold:</strong> Give up your hand and exit the current round</li>
              <li><strong>Check:</strong> Pass the action to the next player without betting</li>
              <li><strong>Call:</strong> Match the current bet amount</li>
              <li><strong>Raise:</strong> Increase the current bet amount</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Hand Rankings (from highest to lowest)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li><strong>Royal Flush:</strong> A, K, Q, J, 10 of the same suit</li>
              <li><strong>Straight Flush:</strong> Five consecutive cards of the same suit</li>
              <li><strong>Four of a Kind:</strong> Four cards of the same rank</li>
              <li><strong>Full House:</strong> Three of a kind plus a pair</li>
              <li><strong>Flush:</strong> Five cards of the same suit</li>
              <li><strong>Straight:</strong> Five consecutive cards of any suit</li>
              <li><strong>Three of a Kind:</strong> Three cards of the same rank</li>
              <li><strong>Two Pair:</strong> Two different pairs</li>
              <li><strong>One Pair:</strong> Two cards of the same rank</li>
              <li><strong>High Card:</strong> Highest card when no other hand is made</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Tips for Beginners</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Start with strong hands (high pairs, high suited cards)</li>
              <li>Pay attention to the community cards and possible combinations</li>
              <li>Consider your position at the table</li>
              <li>Manage your chips wisely</li>
              <li>Don't be afraid to fold weak hands</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function RoomLobby() {
  const { id: roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // Connect to socket server
    socketService.connect();

    // Join the game room
    socketService.joinGame(roomId, username);

    // Set up event listeners
    socketService.on('playerJoined', (data) => {
      setPlayers(data.players);
    });

    socketService.on('playerDisconnected', (data) => {
      setPlayers(prev => prev.filter(p => p.id !== data.playerId));
    });

    socketService.on('playerReconnected', (data) => {
      setPlayers(prev => prev.map(p => 
        p.id === data.playerId ? { ...p, isActive: true } : p
      ));
    });

    socketService.on('gameStarted', (data) => {
      setGameStarted(true);
      navigate(`/room/${roomId}/game`, { 
        state: { 
          username,
          gameState: data
        }
      });
    });

    socketService.on('error', (error) => {
      setError(error.message);
    });

    // Cleanup on unmount
    return () => {
      socketService.leaveGame();
    };
  }, [roomId, username, navigate]);

  const startGame = () => {
    if (players.length >= 2) {
      socketService.startGame();
    } else {
      setError("Need at least 2 players to start the game!");
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-blue-800">🧑‍🤝‍🧑 Room Lobby</h2>
          <div className="flex items-center space-x-4">
            <div className="text-gray-600">Room ID: {roomId}</div>
            <button
              onClick={copyRoomId}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 text-sm"
            >
              {copySuccess ? 'Copied!' : 'Copy ID'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Players ({players.length}/6)</h3>
          <div className="space-y-2">
            {players.map(player => (
              <div 
                key={player.id}
                className={`p-3 rounded-lg ${
                  player.name === username 
                    ? 'bg-blue-100 border border-blue-300' 
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {player.name}
                    {player.name === username && ' (You)'}
                  </span>
                  <span className="text-gray-500">
                    {player.chips} chips
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {socketService.isHost && (
          <button
            onClick={startGame}
            disabled={players.length < 2}
            className={`w-full py-3 rounded-lg font-semibold ${
              players.length >= 2
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Start Game
          </button>
        )}
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
  const navigate = useNavigate();
  const username = location.state?.username;
  const [gameState, setGameState] = useState(location.state?.gameState || {
    players: [],
    communityCards: [],
    pot: 0,
    currentBet: 50,
    dealer: null,
    currentPlayer: null,
    round: 'preflop',
    revealedCards: 0,
    playersActed: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set up game state event listeners
    socketService.on('gameState', (data) => {
      setGameState(data);
    });

    socketService.on('gameAction', (data) => {
      setGameState(prev => ({
        ...prev,
        pot: data.pot,
        currentBet: data.currentBet
      }));
    });

    socketService.on('error', (error) => {
      setError(error.message);
    });

    // Cleanup on unmount
    return () => {
      socketService.leaveGame();
    };
  }, []);

  const handleAction = (action, amount = 0) => {
    socketService.performAction(action, amount);
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {getRoundName(gameState.round)}
            </h2>
            <div className="text-gray-600">
              Pot: {gameState.pot} | Current Bet: {gameState.currentBet}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {gameState.players.map(player => (
              <div 
                key={player.id}
                className={`p-4 rounded-lg ${
                  player.id === gameState.currentPlayer
                    ? 'bg-yellow-100 border-2 border-yellow-400'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="font-medium">
                  {player.name}
                  {player.name === username && ' (You)'}
                </div>
                <div className="text-gray-600">
                  {player.chips} chips
                </div>
                {player.cards && player.cards.length > 0 && (
                  <div className="mt-2">
                    {player.name === username ? (
                      <div className="flex space-x-2">
                        {player.cards.map((card, i) => (
                          <div key={i} className="w-8 h-12 bg-white border border-gray-300 rounded flex items-center justify-center">
                            {card.value}{card.suit}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        {player.cards.map((_, i) => (
                          <div key={i} className="w-8 h-12 bg-blue-100 border border-blue-300 rounded" />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            {gameState.communityCards.slice(0, gameState.revealedCards).map((card, i) => (
              <div key={i} className="w-12 h-16 bg-white border border-gray-300 rounded flex items-center justify-center">
                {card.value}{card.suit}
              </div>
            ))}
            {Array(5 - gameState.revealedCards).fill(null).map((_, i) => (
              <div key={i} className="w-12 h-16 bg-gray-100 border border-gray-300 rounded" />
            ))}
          </div>

          {isCurrentPlayerTurn() && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleAction('fold')}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Fold
              </button>
              <button
                onClick={() => handleAction('check')}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Check
              </button>
              <button
                onClick={() => handleAction('call')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Call
              </button>
              <button
                onClick={() => handleAction('bet', gameState.currentBet * 2)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Raise
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SinglePlayer() {
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem('poker_username') || 'You';
  
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

  const dealNewCards = () => {
    const deck = createDeck();
    return {
      playerCards: [deck.pop(), deck.pop()],
      botCards: [deck.pop(), deck.pop()],
      communityCards: [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()]
    };
  };
  
  const [gameState, setGameState] = useState({
    players: [
      { id: 1, name: username, cards: [], chips: 1000, bet: 0, isActive: true },
      { id: 2, name: "Bot", cards: [], chips: 1000, bet: 0, isActive: true },
    ],
    communityCards: [],
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

  useEffect(() => {
    const { playerCards, botCards, communityCards } = dealNewCards();
    setGameState(prev => ({
      ...prev,
      players: [
        { ...prev.players[0], cards: playerCards },
        { ...prev.players[1], cards: botCards }
      ],
      communityCards
    }));
  }, []);

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
            const { playerCards, botCards, communityCards } = dealNewCards();
            newState.players = [
              { ...newState.players[0], cards: playerCards, isActive: true },
              { ...newState.players[1], cards: botCards, isActive: true }
            ];
            newState.communityCards = communityCards;
            newState.round = 'preflop';
            newState.revealedCards = 0;
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

        {gameState.currentPlayer === 1 && (
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
        <Route path="/room/:id/lobby" element={<RoomLobby />} />
        <Route path="/room/:id/game" element={<GameRoom />} />
        <Route path="/single" element={<SinglePlayer />} />
      </Routes>
    </Router>
  );
}
