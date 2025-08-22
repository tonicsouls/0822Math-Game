import React from 'react';
import { PlayerState, GameMode, Screen } from '../types';
import { getSpriteUrl, TRAINER_TITLES, MATHMONS } from '../constants';

interface MainMenuScreenProps {
  player: PlayerState;
  gameMode: GameMode;
  onNavigate: (screen: Screen) => void;
  onHome: () => void;
  onToggleFollower: () => void;
}

const MainMenuScreen: React.FC<MainMenuScreenProps> = ({ player, gameMode, onNavigate, onHome, onToggleFollower }) => {
  const leadMon = player.team[0];
  if (!leadMon) {
      // This case should not happen in normal gameplay, but it's a good safeguard.
      // It might be better to call onHome() to reset the game state.
      onHome();
      return null;
  }
  const leadMonData = MATHMONS[leadMon.mathmonKey];
  const currentEvo = leadMonData.evolutions[leadMon.evolutionStage];
  const currentTitle = TRAINER_TITLES.filter(t => player.wins >= t.wins).pop()?.title || "New Trainer";

  const getChallengeTitle = () => {
    if (gameMode === GameMode.ADVENTURE) {
        return "Your Adventure";
    } else {
      if (player.wins >= 10) return "You are a Legend!";
      return `Boss ${player.wins + 1} / 10`;
    }
  };

  const getFollowerButtonText = () => {
    switch (player.followerType) {
        case 'none': return 'Follower: None';
        case 'pokemon': return 'Follower: Partner';
        default: return 'Toggle Follower';
    }
  };

  return (
    <>
    <button onClick={onHome} className="absolute -top-2 -right-2 bg-yellow-400 text-black font-bold p-2 rounded-full text-xs z-20 h-10 w-10 font-pixel border-2 border-yellow-600">H</button>
    <div className="game-container bg-gray-700 rounded-2xl p-6 text-white">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <img src={getSpriteUrl(currentEvo.id)} className="h-16 w-16 bg-gray-800 rounded-full p-1 mirrored" alt={currentEvo.name}/>
          <div>
            <p className="font-bold text-xl">{leadMon.nickname || currentEvo.name}</p>
            <p className="text-sm text-gray-300">Stage: {leadMon.evolutionStage + 1}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="font-bold text-yellow-400">Wins: {player.wins}</div>
          {player.trainingBoost > 0 && <div className="text-xs text-cyan-300">Training Boost: +{player.trainingBoost} HP</div>}
          {gameMode === GameMode.LEGENDARY && <div className="text-xs text-orange-400">Best Streak: {player.bestStreak || 0}</div>}
        </div>
      </div>
      <p className="text-center font-pixel text-yellow-300 mb-6">{currentTitle}</p>
      <h1 className="font-pixel text-2xl text-center mb-6">{getChallengeTitle()}</h1>
      <div className="space-y-4">
        {gameMode === GameMode.ADVENTURE && (
          <>
            <button
              onClick={() => onNavigate(Screen.WORLD_SELECT)}
              className="transition-transform transform hover:translate-y-[-5px] w-full bg-green-500 font-pixel p-4 rounded-lg border-b-8 border-green-700"
            >
              World Map
            </button>
            <button
              onClick={onToggleFollower}
              className="transition-transform transform hover:translate-y-[-5px] w-full bg-cyan-500 font-pixel p-4 rounded-lg border-b-8 border-cyan-700 text-sm"
            >
              {getFollowerButtonText()}
            </button>
          </>
        )}
        {gameMode === GameMode.LEGENDARY && player.wins < 10 && (
          <button
            onClick={() => onNavigate(Screen.BATTLE)} 
            className="transition-transform transform hover:translate-y-[-5px] w-full bg-green-500 font-pixel p-4 rounded-lg border-b-8 border-green-700"
          >
            Find a Battle!
          </button>
        )}
        {gameMode === GameMode.ADVENTURE && (
             <button
             onClick={() => onNavigate(Screen.READING_QUEST)}
             className="transition-transform transform hover:translate-y-[-5px] w-full bg-blue-500 font-pixel p-4 rounded-lg border-b-8 border-blue-700"
           >
             Reading Quest
           </button>
        )}
        <button
          onClick={() => onNavigate(Screen.MATHDEX)}
          className="transition-transform transform hover:translate-y-[-5px] w-full bg-red-500 font-pixel p-4 rounded-lg border-b-8 border-red-700"
        >
          MathDex
        </button>
      </div>
    </div>
    </>
  );
};

export default MainMenuScreen;