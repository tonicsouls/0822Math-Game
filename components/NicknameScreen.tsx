import React, { useState } from 'react';
import { Evolution } from '../types';
import { getSpriteUrl } from '../constants';

interface NicknameScreenProps {
  mathmonEvo: Evolution;
  onConfirm: (nickname: string | null) => void;
}

const NicknameScreen: React.FC<NicknameScreenProps> = ({ mathmonEvo, onConfirm }) => {
  const [nickname, setNickname] = useState('');

  const handleConfirm = () => {
    onConfirm(nickname.trim() === '' ? null : nickname.trim());
  };

  return (
    <div className="game-container bg-blue-800 rounded-2xl p-6 text-white text-center">
      <h1 className="font-pixel text-2xl mb-4 text-yellow-300" style={{ textShadow: '2px 2px #c0392b' }}>
        You caught a {mathmonEvo.name}!
      </h1>
      <img src={getSpriteUrl(mathmonEvo.id)} className="h-32 w-32 mx-auto mb-4" alt={mathmonEvo.name} />
      <p className="mb-4">Would you like to give it a nickname?</p>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        maxLength={12}
        className="w-full max-w-xs mx-auto p-2 rounded-lg bg-gray-700 text-white font-pixel text-center border-2 border-gray-600 focus:border-yellow-400 focus:outline-none"
        placeholder={mathmonEvo.name.toUpperCase()}
      />
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleConfirm}
          className="transition-transform transform active:scale-95 bg-green-500 font-pixel p-3 rounded-lg border-b-4 border-green-700"
        >
          Confirm
        </button>
        <button
          onClick={() => onConfirm(null)}
          className="transition-transform transform active:scale-95 bg-gray-500 font-pixel p-3 rounded-lg border-b-4 border-gray-700"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default NicknameScreen;
