# Online Poker Game

A real-time multiplayer poker game built with React, featuring both multiplayer and single-player modes against an AI opponent.

## 🎮 Features

- **Multiplayer Mode**: Play Texas Hold'em poker with friends in real-time
- **Single Player Mode**: Practice against an AI opponent
- **Room System**: Create or join game rooms with unique IDs
- **Real-time Updates**: Live game state synchronization
- **Responsive Design**: Works on both desktop and mobile devices
- **Beautiful UI**: Modern design with smooth animations

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/poker-clone-react.git
cd poker-clone-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🛠️ Technical Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Hooks + LocalStorage
- **Real-time Communication**: LocalStorage Events

## 💡 Development Process

### Phase 1: Basic Interface
- Created responsive layout with Tailwind CSS
- Implemented navigation and routing
- Designed card components and game UI
- Added animations and visual feedback

### Phase 2: Game Logic
- Implemented poker game rules
- Created room system with unique IDs
- Added player actions (fold, check, call, raise)
- Implemented game state management

### Phase 3: Multiplayer & AI
- Added real-time state synchronization
- Implemented AI opponent for single-player mode
- Created lobby system for multiplayer games
- Added player ready/not ready states

## 🔄 Compromises & Decisions

1. **LocalStorage vs WebSocket**
   - Chose LocalStorage for simplicity and quick implementation
   - Trade-off: Limited to same-browser multiplayer
   - Future improvement: Implement WebSocket for true multiplayer

2. **State Management**
   - Used React Hooks + LocalStorage instead of Redux
   - Simpler implementation but less scalable
   - Good for MVP, can be upgraded later

3. **AI Implementation**
   - Basic random decision-making for MVP
   - Could be enhanced with ML in future versions

## 🐛 Known Issues

1. **Multiplayer Limitations**
   - Players must be on the same browser
   - No persistence between sessions
   - No reconnection handling

2. **Game Logic**
   - Basic hand evaluation
   - No side pots implementation
   - Limited betting options

3. **UI/UX**
   - No sound effects
   - Limited animations
   - No dark mode

## 🔮 Future Improvements

1. **Technical**
   - Implement WebSocket for true multiplayer
   - Add proper backend with Node.js
   - Implement proper authentication
   - Add database for game history

2. **Game Features**
   - Add more poker variants
   - Implement tournament mode
   - Add chat system
   - Add player statistics

3. **AI Enhancement**
   - Implement ML-based AI
   - Add difficulty levels
   - Add AI personality traits

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
