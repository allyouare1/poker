import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Card from './Card';
import { createDeck, dealCards } from '../utils/cardUtils';

function GameRoom() {
  const { id: roomId } = useParams();
  const location = useLocation();
  const username = location.state?.username;

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

export default GameRoom; 