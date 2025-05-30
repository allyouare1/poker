import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.gameId = null;
    this.playerName = null;
    this.isHost = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second delay
  }

  connect() {
    this.socket = io('http://localhost:3000', {
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      timeout: 10000
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
      
      // If we have stored game info, try to reconnect
      const storedGameId = localStorage.getItem('gameId');
      const storedPlayerName = localStorage.getItem('playerName');
      
      if (storedGameId && storedPlayerName) {
        this.reconnect(storedGameId, storedPlayerName);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.emit('connectionError', {
          message: 'Failed to connect to server after multiple attempts',
          error
        });
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('error', error);
    });

    // Set up default event listeners
    this.setupDefaultListeners();
  }

  setupDefaultListeners() {
    this.socket.on('playerJoined', (data) => {
      this.emit('playerJoined', data);
    });

    this.socket.on('playerDisconnected', (data) => {
      this.emit('playerDisconnected', data);
    });

    this.socket.on('playerReconnected', (data) => {
      this.emit('playerReconnected', data);
    });

    this.socket.on('gameState', (data) => {
      this.emit('gameState', data);
    });

    this.socket.on('gameAction', (data) => {
      this.emit('gameAction', data);
    });

    this.socket.on('gameStarted', (data) => {
      this.emit('gameStarted', data);
    });

    this.socket.on('hostStatus', (isHost) => {
      this.isHost = isHost;
      this.emit('hostStatus', isHost);
    });

    this.socket.on('error', (error) => {
      this.emit('error', error);
    });
  }

  joinGame(gameId, playerName) {
    this.gameId = gameId;
    this.playerName = playerName;

    // Store game info for reconnection
    localStorage.setItem('gameId', gameId);
    localStorage.setItem('playerName', playerName);

    this.socket.emit('joinGame', { gameId, playerName });
  }

  reconnect(gameId, playerName) {
    this.gameId = gameId;
    this.playerName = playerName;
    this.socket.emit('reconnect', { gameId, playerName });
  }

  leaveGame() {
    if (this.gameId) {
      this.socket.emit('leaveGame', { gameId: this.gameId });
      localStorage.removeItem('gameId');
      localStorage.removeItem('playerName');
      this.gameId = null;
      this.playerName = null;
      this.isHost = false;
    }
  }

  startGame() {
    if (!this.gameId || !this.isHost) {
      this.emit('error', { message: 'Only the host can start the game' });
      return;
    }
    this.socket.emit('startGame', { gameId: this.gameId });
  }

  performAction(action, amount = 0) {
    if (!this.gameId) {
      this.emit('error', { message: 'Not in a game' });
      return;
    }
    
    this.socket.emit('gameAction', {
      gameId: this.gameId,
      action,
      amount
    });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService; 