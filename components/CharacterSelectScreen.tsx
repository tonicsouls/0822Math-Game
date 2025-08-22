import React, { useState } from 'react';
import { GameMode, MoveType } from '../types';
import { MATHMONS, ALL_MOVES, getSpriteUrl, ALL_ABILITIES } from '../constants';

const TypeBadge: React.FC<{type: MoveType}> = ({ type }) => {
    const typeColors: {[key in MoveType]: string} = { add: 'bg-green-500', sub: 'bg-red-500', mul: 'bg-blue-500', div: 'bg-purple-500' };
    return <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${typeColors[type]}`}>{type.toUpperCase()}</span>
}

interface CharacterSelectScreenProps {
  gameMode: GameMode;
  onConfirm: (starterKey: string) => void;
  onHome: () => void;
}

const StatPreview: React.FC<{ starterKey: string | null; gameMode: GameMode }> = ({ starterKey, gameMode }) => {
  if (!starterKey) {
    return (
      <div className="w-full md:w-1/3 bg-black/20 p-4 rounded-lg">
        <h2 className="font-pixel text-lg text-center mb-2">Select a MathMon</h2>
        <div className="h-24 w-24 mx-auto mb-2 bg-gray-700 rounded-full opacity-50" />
        <p className="text-center font-bold"></p>
        <div className="text-center text-xs space-y-1 mt-2"></div>
      </div>
    );
  }

  const mon = MATHMONS[starterKey];
  const evo = gameMode === GameMode.LEGENDARY ? mon.evolutions[mon.evolutions.length - 1] : mon.evolutions[0];
  const ability = ALL_ABILITIES[evo.ability];

  return (
    <div className="w-full md:w-1/3 bg-black/20 p-4 rounded-lg flex flex-col">
      <h2 className="font-pixel text-lg text-center mb-2">{evo.name}</h2>
      <img src={getSpriteUrl(evo.id)} className="h-24 w-24 mx-auto mb-2 mirrored" alt={evo.name} />
      <div className="flex justify-center gap-2 mb-2">
        {evo.types.map(t => <TypeBadge key={t} type={t} />)}
      </div>
      <p className="text-center font-bold">HP: {evo.hp}</p>
      {ability && <div className="text-center my-2"><p className="font-bold text-sm">{ability.name}</p><p className="text-xs text-gray-300">{ability.description}</p></div>}
      <div className="text-center text-xs space-y-1 mt-2 flex-grow">
        <h3 className="font-bold mb-1">Moves</h3>
        {mon.moveset.map(moveKey => (
          <div key={moveKey}>{ALL_MOVES[moveKey].name}</div>
        ))}
      </div>
    </div>
  );
};


const CharacterSelectScreen: React.FC<CharacterSelectScreenProps> = ({ gameMode, onConfirm, onHome }) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const starters = Object.entries(MATHMONS);

  return (
    <>
      <button onClick={onHome} className="absolute -top-2 -right-2 bg-yellow-400 text-black font-bold p-2 rounded-full text-xs z-20 h-10 w-10 font-pixel border-2 border-yellow-600">H</button>
      <div className="game-container bg-blue-800 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <h1 className="font-pixel text-2xl mb-4 text-yellow-300" style={{ textShadow: '2px 2px #c0392b' }}>
              {gameMode === GameMode.ADVENTURE ? 'Choose your Partner!' : 'Choose your Legend!'}
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {starters.map(([key, mon]) => {
                const evo = gameMode === GameMode.LEGENDARY ? mon.evolutions[mon.evolutions.length - 1] : mon.evolutions[0];
                const isSelected = selectedKey === key;
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedKey(key)}
                    className={`bg-gray-700 p-4 rounded-lg border-4 cursor-pointer transition-all duration-200 ${isSelected ? 'border-yellow-400 scale-105' : 'border-transparent hover:translate-y-[-5px]'}`}
                  >
                    <img src={getSpriteUrl(evo.id)} className="h-20 w-20 mx-auto mb-2" alt={evo.name} />
                    <p className="font-pixel text-sm text-center">{evo.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <StatPreview starterKey={selectedKey} gameMode={gameMode} />
        </div>
        <button
          onClick={() => selectedKey && onConfirm(selectedKey)}
          disabled={!selectedKey}
          className={`transition-all duration-300 w-full max-w-xs mx-auto font-pixel p-4 rounded-lg border-b-8 mt-6 ${selectedKey ? 'bg-green-500 border-green-700' : 'bg-gray-500 border-gray-700 opacity-50 cursor-not-allowed'}`}
        >
          Confirm
        </button>
      </div>
    </>
  );
};

export default CharacterSelectScreen;