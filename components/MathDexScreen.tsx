import React from 'react';
import { PlayerState } from '../types';
import { MATHMONS, LEGENDARIES, getSpriteUrl } from '../constants';

interface MathDexScreenProps {
  player: PlayerState;
  onBack: () => void;
  onHome: () => void;
}

const MathDexScreen: React.FC<MathDexScreenProps> = ({ player, onBack, onHome }) => {
  
  const allMons = {...MATHMONS};

  const legendaryEvolutions = Object.values(LEGENDARIES).map(legendary => ({
    ...legendary,
    evolutionWins: null,
  }));
  
  const allMonEvolutions = Object.values(allMons).flatMap(m => m.evolutions).concat(legendaryEvolutions);
  const uniqueMons = Array.from(new Map(allMonEvolutions.map(item => [item.id, item])).values());
  const sortedMons = uniqueMons.sort((a, b) => a.id - b.id);
    
  return (
    <>
    <button onClick={onHome} className="absolute -top-2 -right-2 bg-yellow-400 text-black font-bold p-2 rounded-full text-xs z-20 h-10 w-10 font-pixel border-2 border-yellow-600">H</button>
    <div className="game-container bg-gray-800 rounded-2xl p-6 text-white">
      <h1 className="font-pixel text-3xl text-center mb-4 text-yellow-300">MathDex</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-96 overflow-y-auto p-4 bg-black/20 rounded-lg">
        {sortedMons.map(mon => {
          const isCaptured = player.mathdex.includes(mon.id);
          return (
            <div key={mon.id} className="text-center bg-white/5 p-2 rounded-lg">
              <img
                src={getSpriteUrl(mon.id)}
                alt={isCaptured ? mon.name : 'Unknown'}
                className={`h-20 w-20 mx-auto transition-all duration-500 ${isCaptured ? 'filter-none' : 'brightness-0 invert'}`}
              />
              <p className="font-pixel text-xs mt-1">{isCaptured ? mon.name : '???'}</p>
            </div>
          );
        })}
      </div>
      <button
        onClick={onBack}
        className="transition-transform transform active:scale-95 w-full max-w-xs mx-auto bg-blue-500 font-pixel p-4 rounded-lg border-b-8 border-blue-700 mt-4"
      >
        Back
      </button>
    </div>
    </>
  );
};

export default MathDexScreen;