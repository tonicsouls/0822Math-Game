import React, { useState, useEffect } from 'react';
import { PlayerState } from '../types';
import { READING_ADVENTURE, getSpriteUrl, MATHMONS } from '../constants';

interface ReadingQuestScreenProps {
  player: PlayerState;
  onComplete: (boost: number) => void;
  onEvolve: (newStage: number) => void;
  onBack: () => void;
}

type QuestPhase = 'sentence' | 'spelling' | 'evolving' | 'complete';
type LetterTile = { char: string, id: number, placed: boolean };
type DropZone = { index: number, tile: LetterTile | null };
type Animation = 'attack' | 'hit' | null;

const ReadingQuestScreen: React.FC<ReadingQuestScreenProps> = ({ player, onComplete, onEvolve, onBack }) => {
  const [stage, setStage] = useState(0);
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<QuestPhase>('sentence');
  const [feedback, setFeedback] = useState("Complete the sentence!");
  const [wordsToSpell, setWordsToSpell] = useState<string[]>([]);
  
  // Battle state
  const [currentWord, setCurrentWord] = useState('');
  const [letterTiles, setLetterTiles] = useState<LetterTile[]>([]);
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const [playerHp, setPlayerHp] = useState(3);
  const [enemyHp, setEnemyHp] = useState(3);
  const [playerAnim, setPlayerAnim] = useState<Animation>(null);
  const [enemyAnim, setEnemyAnim] = useState<Animation>(null);

  const playerLeadMon = player.team[0];
  const playerMonData = MATHMONS[playerLeadMon.mathmonKey];
  const playerEvo = playerMonData.evolutions[playerLeadMon.evolutionStage];
  const stageData = READING_ADVENTURE[stage];
  const guide = stageData.guide;

  useEffect(() => {
    if (phase === 'sentence' && round >= 3) {
      startSpellingBattle();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, phase]);

  const checkSentenceAnswer = (selected: string, correct: string) => {
    if (selected === correct) {
      setFeedback("That's right!");
      setWordsToSpell(prev => [...prev, correct]);
      setTimeout(() => {
        setRound(r => r + 1);
        setFeedback("Complete the sentence!");
      }, 1000);
    } else {
      setFeedback("Try again!");
    }
  };

  const startSpellingBattle = () => {
    setPhase('spelling');
    setFeedback("Spell Attack! Unscramble the word.");
    loadNextSpellingWord(wordsToSpell);
  };

  const loadNextSpellingWord = (words: string[]) => {
    if(words.length === 0) return;
    const nextWord = words[0];
    setCurrentWord(nextWord);
    setWordsToSpell(words.slice(1));
    
    const scrambled = nextWord.split('').sort(() => 0.5 - Math.random());
    setLetterTiles(scrambled.map((char, id) => ({char, id, placed: false})));
    setDropZones(nextWord.split('').map((_, index) => ({index, tile: null})));
  };
  
  const handleTileClick = (tileId: number) => {
      const tile = letterTiles.find(t => t.id === tileId && !t.placed);
      if (!tile) return;

      const newDropZones = [...dropZones];
      const emptyZoneIndex = newDropZones.findIndex(dz => dz.tile === null);
      if (emptyZoneIndex !== -1) {
          newDropZones[emptyZoneIndex].tile = tile;
          setDropZones(newDropZones);
          
          const newTiles = letterTiles.map(t => t.id === tileId ? {...t, placed: true} : t);
          setLetterTiles(newTiles);

          checkSpelling(newDropZones);
      }
  };
  
  const resetLetters = () => {
    setDropZones(currentWord.split('').map((_, index) => ({index, tile: null})));
    setLetterTiles(letterTiles.map(t => ({...t, placed: false})));
  }

  const checkSpelling = (currentDropzones: DropZone[]) => {
      if (currentDropzones.every(dz => dz.tile !== null)) {
          const spelledWord = currentDropzones.map(dz => dz.tile!.char).join('');
          let newPlayerHp = playerHp;
          let newEnemyHp = enemyHp;

          if (spelledWord === currentWord) {
              setFeedback("Correct! Attack!");
              newEnemyHp--;
              setPlayerAnim('attack');
              setTimeout(() => {
                setPlayerAnim(null);
                setEnemyAnim('hit');
                setEnemyHp(newEnemyHp);
                setTimeout(() => setEnemyAnim(null), 300);
              }, 400);

          } else {
              setFeedback(`Not quite! ${guide.name} attacks!`);
              newPlayerHp--;
              setEnemyAnim('attack');
              setTimeout(() => {
                  setEnemyAnim(null);
                  setPlayerAnim('hit');
                  setPlayerHp(newPlayerHp);
                  setTimeout(() => setPlayerAnim(null), 300);
              }, 400);
          }

          setTimeout(() => {
              if (newEnemyHp <= 0) {
                  setFeedback(`You defeated ${guide.name}!`);
                  setTimeout(advanceStage, 1500);
              } else if (newPlayerHp <= 0) {
                  setFeedback(`Oh no! Try this stage again.`);
                  setTimeout(resetStage, 1500);
              } else {
                  setFeedback("Spell Attack! Unscramble the word.");
                  loadNextSpellingWord(wordsToSpell);
              }
          }, 1500);
      }
  };

  const resetStage = () => {
      setRound(0);
      setPhase('sentence');
      setFeedback("Complete the sentence!");
      setWordsToSpell([]);
      setPlayerHp(3);
      setEnemyHp(3);
  }

  const advanceStage = () => {
    if ((stage === 0 || stage === 1) && playerLeadMon.evolutionStage < playerMonData.evolutions.length - 1) {
        onEvolve(playerLeadMon.evolutionStage + 1);
    }
    
    if (stage >= READING_ADVENTURE.length - 1) {
      setPhase('complete');
      setFeedback("You are a Reading Master! +10 HP Boost for your next battle!");
    } else {
      setStage(s => s + 1);
      resetStage();
    }
  };

  return (
    <div className="game-container bg-reading rounded-2xl p-4 shadow-2xl text-center relative">
        <button onClick={onBack} className="absolute top-2 right-2 bg-yellow-600 text-white font-bold p-2 rounded-full text-xs z-20 h-8 w-8 font-pixel border-2 border-yellow-800">X</button>
        <h1 className="font-pixel text-lg text-yellow-900 mb-2" style={{ textShadow: '1px 1px #fff' }}>{phase === 'complete' ? "Quest Complete!" : `${guide.name}'s Challenge`}</h1>
        
        <div className={`battle-scene w-full aspect-[4/3] rounded-lg mb-2 relative`}>
            <img src={getSpriteUrl(playerEvo.id)} className={`mathmon-sprite mirrored absolute bottom-[5%] left-[5%] h-28 w-28 md:h-32 md:w-32 ${playerAnim === 'attack' ? 'mirrored attack-anim' : ''} ${playerAnim === 'hit' ? 'hit-anim' : ''}`} alt="Player"/>
            <img src={getSpriteUrl(guide.id)} className={`mathmon-sprite absolute top-[10%] right-[5%] h-28 w-28 md:h-32 md:w-32 ${enemyAnim === 'attack' ? 'attack-anim' : ''} ${enemyAnim === 'hit' ? 'hit-anim' : ''}`} alt="Guide" />
        </div>
        
        {phase === 'spelling' && (
            <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="bg-gray-100 p-2 rounded-lg border-2 border-gray-300">
                    <div className="flex justify-between items-center mb-1"><h2 className="font-bold text-md">{playerLeadMon.nickname || playerEvo.name}</h2></div>
                    <div className="w-full bg-gray-300 rounded-full h-3"><div className="bg-green-500 h-full rounded-full health-bar-inner" style={{width: `${(playerHp/3)*100}%`}}></div></div>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg border-2 border-gray-300">
                    <div className="flex justify-between items-center mb-1"><h2 className="font-bold text-md">{guide.name}</h2></div>
                    <div className="w-full bg-gray-300 rounded-full h-3"><div className="bg-red-500 h-full rounded-full health-bar-inner" style={{width: `${(enemyHp/3)*100}%`}}></div></div>
                </div>
            </div>
        )}

        <div className="bg-black/20 text-white p-4 rounded-lg min-h-[160px]">
            <p className="font-bold text-md text-white h-8 mb-2">{feedback}</p>

            {phase === 'sentence' && round < stageData.quests.length && (
                <div>
                  <p className="text-xl md:text-2xl text-gray-800 bg-white/50 p-4 rounded-lg mb-4 min-h-[80px]">
                      {stageData.quests[round].s[0]}
                      <span className="inline-block bg-gray-300 w-24 h-8 rounded">&nbsp;</span>
                      {stageData.quests[round].s[1] || ''}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                      {stageData.quests[round].o.map(option => (
                          <button key={option} onClick={() => checkSentenceAnswer(option, stageData.quests[round].a)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-4 rounded-lg text-lg border-b-4 border-yellow-600">
                              {option}
                          </button>
                      ))}
                  </div>
                </div>
            )}
            
            {phase === 'spelling' && (
                <div className="w-full">
                    <div className="flex flex-wrap justify-center gap-2 mb-2">
                        {dropZones.map(({index, tile}) => (
                            <div key={index} className="w-10 h-10 border-2 border-dashed border-yellow-400 rounded-lg flex items-center justify-center bg-black/20">
                                {tile && <div className="w-8 h-8 bg-yellow-400 text-black rounded-md flex items-center justify-center font-bold text-xl">{tile.char}</div>}
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {letterTiles.map(tile => (
                            <div key={tile.id} onClick={() => handleTileClick(tile.id)} 
                                className={`w-9 h-9 bg-yellow-500 rounded-md flex items-center justify-center font-bold text-xl cursor-pointer ${tile.placed ? 'opacity-25' : ''}`}>
                                {tile.char}
                            </div>
                        ))}
                    </div>
                     <button onClick={resetLetters} className="transition-transform transform active:scale-95 bg-yellow-600 text-white font-bold py-1 px-3 rounded-lg text-xs mt-3">Reset</button>
                </div>
            )}

            {phase === 'complete' && (
                <button onClick={() => onComplete(10)} className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg text-xl mt-8">Back to Menu</button>
            )}
        </div>
    </div>
  );
};

export default ReadingQuestScreen;