export const getSuitColor = (suit) => {
  return suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-gray-800';
};

export const createDeck = () => {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck = [];

  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }

  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

export const dealCards = (players, deck) => {
  const dealtPlayers = players.map(player => ({
    ...player,
    cards: [deck.pop(), deck.pop()]
  }));
  return dealtPlayers;
}; 