# Online Poker Game

A multiplayer poker game built with React, featuring multiplayer and also single-player mode against a bot.

## Features

- **Multiplayer**: Play poker with friends in real-time
- **Single-player**: Practice against an bot opponent
- **Main Page**: Create / join game rooms with unique IDs

## Technical Stack

- **Frontend**: React + Vite
  - Chosen for its fast development experience and excellent hot module replacement
  - Provides modern JavaScript features out of the box
- **Styling**: Tailwind CSS
  - Selected for rapid UI development and consistent design system
  - Reduces CSS bundle size through purging
- **Routing**: React Router
  - Industry standard for React applications
  - Provides clean URL management and navigation
- **State Management**: React Hooks + LocalStorage
  - Keeps the application simple without external dependencies
  - Provides persistence between sessions

## Installation and Running

1. Clone the repository:
```bash
git clone https://github.com/allyouare1/poker.git
cd poker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Start the backend server:
```bash
cd server
npm install
npm start
```

The application will be available at `http://localhost:5173`

## Development Process

### First Step: Simple Interface
- Created responsive layout with Tailwind CSS
- Implemented navigation and routing
- Designed card components and game UI
- Added animations and visual feedback

### Second Step: Game Logic
- Implemented poker game rules
- Created room system with unique IDs
- Added player actions (fold, check, call, raise)
- Implemented game state management

### Third Step: Multiplayer & Singleplayer with Bot
- Implemented AI opponent for single-player mode
- Added lobby system for multi-player games
- Added player ready/not ready states

## Development Compromises and Decisions

1. **State Management**
   - Chose React Hooks over Redux to keep the application simpler
   - Compromise: Less predictable state updates but reduced boilerplate

2. **Real-time Communication**
   - Using WebSocket for real-time updates
   - Compromise: Limited to same-browser multiplayer for initial version

3. **UI/UX Decisions**
   - Prioritized functionality over animations
   - Compromise: Less polished feel but faster development

4. **Backend Architecture**
   - Simple Node.js server instead of microservices
   - Compromise: Less scalable but easier to maintain

## Known Issues

1. **Multiplayer Limitations**
   - Players must be on the same browser
   - No reconnection handling
   - Port conflicts possible (need to ensure port 3001 is free)

2. **Game Logic**
   - Basic hand evaluation
   - Limited betting options
   - No tournament support

3. **UI/UX**
   - No sound effects
   - Limited animations
   - No mobile optimization

4. **Technical**
   - Server port conflicts (EADDRINUSE error on port 3001)
   - No error handling for network issues
   - No proper session management

## Contributing

Open for criticism! Please feel free to give feedback.

## License

MIT License

## Live Demo

The application is deployed at: [poker-roan-six.vercel.app](https://poker-roan-six.vercel.app)
