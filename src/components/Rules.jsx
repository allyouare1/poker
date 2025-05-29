function Rules() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-blue-800">📜 Texas Hold'em Poker Rules</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Game Setup</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Each player is dealt 2 private cards (hole cards)</li>
            <li>5 community cards are dealt face up in the center</li>
            <li>Players use any combination of their hole cards and community cards to make the best 5-card hand</li>
            <li>The game uses a standard 52-card deck</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Betting Rounds</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">1. Pre-Flop</h3>
              <p>After receiving hole cards, players bet starting with the player to the left of the big blind.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">2. The Flop</h3>
              <p>First three community cards are dealt. Another round of betting follows.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">3. The Turn</h3>
              <p>Fourth community card is dealt. Another round of betting follows.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">4. The River</h3>
              <p>Final community card is dealt. Final round of betting follows.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Hand Rankings (Highest to Lowest)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div className="space-y-2">
              <p><span className="font-semibold">Royal Flush:</span> A, K, Q, J, 10 of same suit</p>
              <p><span className="font-semibold">Straight Flush:</span> Five consecutive cards of same suit</p>
              <p><span className="font-semibold">Four of a Kind:</span> Four cards of same rank</p>
              <p><span className="font-semibold">Full House:</span> Three of a kind plus a pair</p>
              <p><span className="font-semibold">Flush:</span> Five cards of same suit</p>
            </div>
            <div className="space-y-2">
              <p><span className="font-semibold">Straight:</span> Five consecutive cards</p>
              <p><span className="font-semibold">Three of a Kind:</span> Three cards of same rank</p>
              <p><span className="font-semibold">Two Pair:</span> Two different pairs</p>
              <p><span className="font-semibold">One Pair:</span> Two cards of same rank</p>
              <p><span className="font-semibold">High Card:</span> Highest card when no other hand is made</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Basic Strategy Tips</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Position matters - later positions have more information</li>
            <li>Starting hand selection is crucial</li>
            <li>Pay attention to pot odds and implied odds</li>
            <li>Watch for tells and betting patterns</li>
            <li>Manage your bankroll wisely</li>
          </ul>
        </section>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 font-medium">Remember: Poker is a game of skill, strategy, and psychology. Practice makes perfect!</p>
        </div>
      </div>
    </div>
  );
}

export default Rules; 