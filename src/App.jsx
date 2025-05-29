// poker-clone-react - Vite + React basic template for online poker project

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Rules from './components/Rules';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';
import SinglePlayer from './components/SinglePlayer';

function App() {
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

export default App;
