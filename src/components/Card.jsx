import { getSuitColor } from '../utils/cardUtils';

function Card({ value, suit, isHidden = false }) {
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

export default Card; 