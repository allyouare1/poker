import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

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

export default Lobby; 