
import React from 'react';
import { GameMode } from '../types';

interface ModeSelectScreenProps {
  onModeSelect: (mode: GameMode) => void;
}

const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({ onModeSelect }) => {
  return (
    <div className="game-container bg-gray-800 rounded-2xl p-8 text-center text-white">
      <h1 className="font-pixel text-3xl md:text-4xl mb-8 text-yellow-300" style={{ textShadow: '2px 2px #c0392b' }}>
        Choose Your Path
      </h1>
      <div className="space-y-6">
        <button
          onClick={() => onModeSelect(GameMode.ADVENTURE)}
          className="transition-transform transform hover:translate-y-[-5px] w-full max-w-sm mx-auto bg-green-500 font-pixel p-4 rounded-lg border-b-8 border-green-700"
        >
          <span className="text-xl">Adventure Mode</span>
          <span className="block text-xs mt-2 font-sans">Start with a partner and grow stronger! (Grades 1-3)</span>
        </button>
        <button
          onClick={() => onModeSelect(GameMode.LEGENDARY)}
          className="transition-transform transform hover:translate-y-[-5px] w-full max-w-sm mx-auto bg-purple-600 font-pixel p-4 rounded-lg border-b-8 border-purple-800"
        >
          <span className="text-xl">Legendary Mode</span>
          <span className="block text-xs mt-2 font-sans">Face the ultimate challenge! (Grades 7-8)</span>
        </button>
      </div>
    </div>
  );
};

export default ModeSelectScreen;
