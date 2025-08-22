import React from 'react';
import { WORLD_MAPS_DATA } from '../constants';

interface WorldSelectScreenProps {
  unlockedMaps: string[];
  onSelectMap: (mapId: string) => void;
  onBack: () => void;
  onHome: () => void;
}

const WorldSelectScreen: React.FC<WorldSelectScreenProps> = ({ unlockedMaps, onSelectMap, onBack, onHome }) => {
  const allMaps = Object.values(WORLD_MAPS_DATA);

  return (
    <>
      <button onClick={onHome} className="absolute -top-2 -right-2 bg-yellow-400 text-black font-bold p-2 rounded-full text-xs z-20 h-10 w-10 font-pixel border-2 border-yellow-600">H</button>
      <div className="game-container bg-gray-700 rounded-2xl p-6 text-white">
        <h1 className="font-pixel text-3xl text-center mb-6 text-yellow-300">World Map</h1>
        <div className="space-y-4">
          {allMaps.map(map => {
            const isUnlocked = unlockedMaps.includes(map.id);
            return (
              <button
                key={map.id}
                onClick={() => isUnlocked && onSelectMap(map.id)}
                disabled={!isUnlocked}
                className={`w-full p-4 rounded-lg border-b-8 font-pixel text-xl transition-all duration-200 ${
                  isUnlocked
                    ? 'bg-blue-500 border-blue-700 hover:bg-blue-600'
                    : 'bg-gray-500 border-gray-700 opacity-50 cursor-not-allowed'
                }`}
              >
                {map.name} {isUnlocked ? '' : '(Locked)'}
              </button>
            );
          })}
        </div>
        <button
          onClick={onBack}
          className="transition-transform transform active:scale-95 w-full max-w-xs mx-auto bg-red-500 font-pixel p-4 rounded-lg border-b-8 border-red-700 mt-8"
        >
          Back
        </button>
      </div>
    </>
  );
};

export default WorldSelectScreen;
