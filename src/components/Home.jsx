import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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

export default Home; 