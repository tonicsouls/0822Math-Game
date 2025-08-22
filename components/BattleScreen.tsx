import React, { useState, useEffect } from 'react';
import { PlayerState, GameMode, Enemy, Problem, BattleResult, Move, Evolution, MoveType, LegendaryData, Item } from '../types';
import { getSpriteUrl, MATHMONS, LEGENDARIES, ALL_MOVES, TYPE_CHART, ENCOUNTER_ZONES, ALL_TRAINERS, ITEMS } from '../constants';
import { generateProblem } from '../services/gameLogic';

const CRIT_WINDOW_MS = 4000;

type Animation = 'attack' | 'hit' | 'faint' | 'evolution' | 'capture' | null;
type BattlePhase = 'intro' | 'player_turn' | 'answering' | 'player_attack' | 'enemy_attack' | 'outro' | 'bag';

const TypeBadge: React.FC<{type: MoveType}> = ({ type }) => {
    const typeColors: {[key in MoveType]: string} = { add: 'bg-green-500', sub: 'bg-red-500', mul: 'bg-blue-500', div: 'bg-purple-500' };
    return <span className={`px-2 py-1 text-[10px] font-bold text-white rounded-full ${typeColors[type]}`}>{type.toUpperCase()}</span>
}

const HealthBar: React.FC<{ name: string, currentHp: number, maxHp: number, types: MoveType[] }> = ({ name, currentHp, maxHp, types }) => {
    const percentage = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
    const barColor = percentage < 25 ? 'bg-red-500' : percentage < 50 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="bg-gray-100 p-3 rounded-lg border-2 border-gray-300">
            <div className="flex justify-between items-center mb-1">
                <h2 className="font-bold text-lg truncate">{name}</h2>
                <div className="flex gap-1">
                  {types.map(t => <TypeBadge key={t} type={t} />)}
                </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-300 rounded-full h-4">
                  <div className={`h-full rounded-full health-bar-inner ${barColor}`} style={{ width: `${percentage}%` }}></div>
              </div>
              <span className="text-sm font-semibold">{`${currentHp}/${maxHp}`}</span>
            </div>
        </div>
    );
};

const ResultModal: React.FC<{ result: BattleResult | null; onNext: () => void; onCapture: () => void; canCapture: boolean }> = ({ result, onNext, onCapture, canCapture }) => {
    if (!result) return null;

    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
                <h3 className="text-4xl font-bold mb-4">{result.playerWon ? 'Victory!' : 'Game Over!'}</h3>
                <div className="text-lg mb-6 min-h-[50px]">
                    {result.evolutionOccurred && <div>{`Your ${result.evolutionOccurred.from.name} evolved into ${result.evolutionOccurred.to.name}!`}</div>}
                    {!result.evolutionOccurred && <div>{result.playerWon ? 'You won the battle!' : 'Better luck next time.'}</div>}
                </div>
                {result.playerWon && canCapture && (
                    <button onClick={onCapture} className="transition-transform transform active:scale-95 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg text-2xl">
                        Capture!
                    </button>
                )}
                 {(!result.playerWon || !canCapture) && (
                    <button onClick={onNext} className="transition-transform transform active:scale-95 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-2xl mt-2">
                        Continue
                    </button>
                 )}
            </div>
        </div>
    );
};

interface BattleScreenProps {
  player: PlayerState;
  gameMode: GameMode;
  battleInfo: { type: 'wild' | 'trainer', id: string, mapId: string };
  onBattleEnd: (result: BattleResult) => void;
  onUseItem: (itemId: string) => boolean;
}

const BattleScreen: React.FC<BattleScreenProps> = ({ player, gameMode, battleInfo, onBattleEnd, onUseItem }) => {
    const [enemy, setEnemy] = useState<Enemy | null>(null);
    const [playerCurrentHp, setPlayerCurrentHp] = useState(0);
    const [message, setMessage] = useState('');
    const [phase, setPhase] = useState<BattlePhase>('intro');
    const [problem, setProblem] = useState<Problem | null>(null);
    const [questionStartTime, setQuestionStartTime] = useState(0);
    const [enemyKey, setEnemyKey] = useState<string>('');
    
    const [playerAnim, setPlayerAnim] = useState<Animation>(null);
    const [enemyAnim, setEnemyAnim] = useState<Animation>(null);
    const [showCrit, setShowCrit] = useState(false);
    const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
    
    const [playerWasAtFullHp, setPlayerWasAtFullHp] = useState(true);
    const [background, setBackground] = useState('bg-grass');

    const playerLeadMon = player.team[0];
    const playerMonData = MATHMONS[playerLeadMon.mathmonKey];
    const playerEvo = playerMonData.evolutions[playerLeadMon.evolutionStage];
    const playerMaxHp = playerEvo.hp + player.trainingBoost;
    
    const canCapture = battleResult?.playerWon && 
                       !player.mathdex.includes(enemy?.id ?? 0) &&
                       battleInfo.type === 'wild' &&
                       player.inventory.pokeball > 0 &&
                       player.team.length < 6;

    // --- Battle Initialization ---
    useEffect(() => {
        let enemyData: Evolution | LegendaryData;
        let introMessage: string;
        
        if (battleInfo.type === 'wild') {
            const zone = ENCOUNTER_ZONES[battleInfo.mapId]?.[battleInfo.id];
            if (!zone) { onBattleEnd({ playerWon: false }); return; }
            setBackground(zone.background);
            const newEnemyKey = zone.enemyPool[Math.floor(Math.random() * zone.enemyPool.length)];
            setEnemyKey(newEnemyKey);
            
            if (MATHMONS[newEnemyKey]) {
                const enemyMonData = MATHMONS[newEnemyKey];
                let enemyEvoStage = player.wins >= 5 ? 1 : 0;
                enemyEvoStage = Math.min(enemyEvoStage, enemyMonData.evolutions.length - 1);
                enemyData = enemyMonData.evolutions[enemyEvoStage];
            } else {
                enemyData = LEGENDARIES[newEnemyKey];
            }
            introMessage = `A wild ${enemyData.name} appeared!`;
        } else { // Trainer battle
            const trainer = ALL_TRAINERS[battleInfo.mapId]?.[battleInfo.id];
            if (!trainer) { onBattleEnd({ playerWon: false }); return; }
            setBackground('bg-cave'); // Generic trainer background
            const enemyInfo = trainer.team[0]; // For now, only first MathMon
            enemyData = MATHMONS[enemyInfo.key].evolutions[enemyInfo.level]; 
            introMessage = `You are challenged by Trainer ${trainer.id}!`;
        }
        
        const newEnemy: Enemy = { ...enemyData, currentHp: enemyData.hp, wasAtFullHp: true };
        setEnemy(newEnemy);
        setPlayerCurrentHp(playerMaxHp);
        setPlayerWasAtFullHp(true);
        setMessage(introMessage);
        
        const timeout = setTimeout(() => {
            setMessage('Your turn! Choose a move.');
            setPhase('player_turn');
        }, 2000);
        
        return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUseItem = (item: Item) => {
        if (phase !== 'bag' || playerCurrentHp === playerMaxHp) return;

        if (onUseItem(item.id)) {
            if (item.id === 'potion') {
                const newHp = Math.min(playerMaxHp, playerCurrentHp + 50);
                setPlayerCurrentHp(newHp);
                setMessage(`You used a ${item.name}!`);
                setTimeout(enemyTurn, 1500);
            }
        } else {
            setMessage(`You have no ${item.name}s left!`);
            setTimeout(() => setPhase('player_turn'), 1000);
        }
    };

    const handleMoveSelect = (move: Move) => {
        if (phase !== 'player_turn') return;
        let difficultyLevel = 1;
        if (gameMode === GameMode.ADVENTURE) {
            if (player.wins >= 7) difficultyLevel = 3;
            else if (player.wins >= 4) difficultyLevel = 2;
        } else {
            difficultyLevel = 4;
        }
        const newProblem = generateProblem(difficultyLevel, move.type);
        setProblem(newProblem);
        setMessage(newProblem.text);
        setQuestionStartTime(performance.now());
        setPhase('answering');
    };

    const submitAnswer = (choice: number) => {
        if (phase !== 'answering' || !problem) return;
        const timeTaken = performance.now() - questionStartTime;
        const isCorrect = choice === problem.answer;
        const isCrit = isCorrect && timeTaken <= CRIT_WINDOW_MS;

        if (isCorrect) {
            playerAttack(isCrit, problem.moveType);
        } else {
            setMessage(`Oops! The correct answer was ${problem.answer}.`);
            setPhase('enemy_attack');
            setTimeout(enemyTurn, 1500);
        }
        setProblem(null);
    };
    
    const playerAttack = (isCrit: boolean, moveType: MoveType) => {
        if (!enemy) return;
        setPhase('player_attack');
        
        let damage = 30 + (playerLeadMon.evolutionStage * 10) + Math.floor(Math.random() * 10) + (problem?.difficulty || 1) * 5;
        
        const lowHpThreshold = playerMaxHp / 3;
        if (playerCurrentHp <= lowHpThreshold) {
            if (playerEvo.ability === 'overgrow' && moveType === 'add') damage *= 1.5;
            if (playerEvo.ability === 'blaze' && moveType === 'mul') damage *= 1.5;
            if (playerEvo.ability === 'torrent' && moveType === 'div') damage *= 1.5;
        }

        let effectivenessMultiplier = 1;
        enemy.types.forEach(enemyType => {
            if (TYPE_CHART[moveType].superEffective === enemyType) effectivenessMultiplier *= 1.5;
            if (TYPE_CHART[moveType].notEffective === enemyType) effectivenessMultiplier *= 0.5;
        });
        damage *= effectivenessMultiplier;
        
        const effectivenessMessage = effectivenessMultiplier > 1 ? " It's super effective!" : effectivenessMultiplier < 1 ? " It's not very effective..." : "";

        if (isCrit) { damage = Math.floor(damage * 1.5); setShowCrit(true); setTimeout(() => setShowCrit(false), 1000); }
        damage = Math.floor(damage);
        
        setMessage(`${playerEvo.name} attacks!${isCrit ? ' A critical hit!' : ''}${effectivenessMessage}`);
        setPlayerAnim('attack');
        
        setTimeout(() => {
            setPlayerAnim(null);
            setEnemyAnim('hit');
            let newHp = Math.max(0, enemy.currentHp - damage);

            if(enemy.ability === 'sturdy' && enemy.wasAtFullHp && newHp === 0) {
                newHp = 1;
                setTimeout(() => setMessage(`${enemy.name} held on using Sturdy!`), 500);
            }

            setEnemy(prev => prev ? {...prev, currentHp: newHp, wasAtFullHp: false} : null);
            setTimeout(() => setEnemyAnim(null), 300);

            if (newHp <= 0) setTimeout(() => endGame(true), 1000);
            else setTimeout(enemyTurn, 1500);
        }, 400);
    };

    const enemyTurn = () => {
        if (!enemy) return;
        setPhase('enemy_attack');
        let damage = 20 + (Math.min(playerLeadMon.evolutionStage, 2) * 10) + Math.floor(Math.random() * 10);
        if (player.wins >= 7 || gameMode === 'legendary' || battleInfo.type === 'trainer') damage += 15;
        
        setMessage(`${enemy.name} attacks back!`);
        setEnemyAnim('attack');

        setTimeout(() => {
            setEnemyAnim(null);
            setPlayerAnim('hit');
            let newHp = Math.max(0, playerCurrentHp - damage);

            if (playerEvo.ability === 'sturdy' && playerWasAtFullHp && newHp === 0) {
                newHp = 1;
                setTimeout(() => setMessage(`${playerEvo.name} held on using Sturdy!`), 500);
            }

            setPlayerWasAtFullHp(false);
            setPlayerCurrentHp(newHp);
            setTimeout(() => setPlayerAnim(null), 300);
            
            if (newHp <= 0) setTimeout(() => endGame(false), 1000);
            else setTimeout(() => { setMessage('Your turn! Choose a move.'); setPhase('player_turn'); }, 1500);
        }, 400);
    };

    const endGame = (playerWon: boolean) => {
        if(!enemy) return;
        setPhase('outro');
        const result: BattleResult = { playerWon };
        
        if (playerWon) {
            setEnemyAnim('faint');
            const leadMon = player.team[0];
            const currentMonData = MATHMONS[leadMon.mathmonKey];
            const currentEvo = currentMonData.evolutions[leadMon.evolutionStage];
            if (gameMode === 'adventure' && currentEvo.evolutionWins !== null && leadMon.battleWins + 1 >= currentEvo.evolutionWins) {
                if (leadMon.evolutionStage < currentMonData.evolutions.length - 1) {
                    result.evolutionOccurred = { from: currentEvo, to: currentMonData.evolutions[leadMon.evolutionStage + 1] };
                }
            }

            if (!player.mathdex.includes(enemy.id) && battleInfo.type === 'wild' && enemyKey) {
                result.capturedMathmon = { key: enemyKey, id: enemy.id };
            }
        } else {
            setPlayerAnim('faint');
        }
        setBattleResult(result);
    };

    const handleCapture = () => {
        if (!onUseItem('pokeball')) return;

        setEnemyAnim('capture');
        setMessage(`You used a Poké Ball!`);
        setTimeout(() => {
            setMessage(`Gotcha! ${enemy?.name} was captured!`);
            setTimeout(() => onBattleEnd(battleResult!), 2000);
        }, 1500);
    };
    
    if (!enemy) return <div className="game-container bg-gray-800 rounded-2xl p-8 text-center text-white font-pixel">Loading Battle...</div>;
    
    return (
        <div className="game-container bg-white rounded-2xl p-4 shadow-2xl relative">
            {showCrit && <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                <h2 className="font-pixel text-5xl text-yellow-400 opacity-0 crit-hit-text" style={{ textShadow: '3px 3px #000' }}>CRITICAL HIT!</h2>
            </div>}

            <div className={`battle-scene w-full aspect-[4/3] rounded-lg mb-4 relative ${background} animated-bg`}>
                <img src={getSpriteUrl(playerEvo.id)} className={`mathmon-sprite mirrored absolute bottom-[5%] left-[5%] h-32 w-32 md:h-40 md:w-40 ${playerAnim === 'attack' ? 'mirrored attack-anim' : ''} ${playerAnim === 'hit' ? 'hit-anim' : ''} ${playerAnim === 'faint' ? 'faint-anim' : ''}`} alt={playerEvo.name} />
                <img src={getSpriteUrl(enemy.id)} className={`mathmon-sprite absolute top-[10%] right-[5%] h-28 w-28 md:h-36 md:w-36 ${enemyAnim === 'attack' ? 'attack-anim' : ''} ${enemyAnim === 'hit' ? 'hit-anim' : ''} ${enemyAnim === 'faint' ? 'faint-anim' : ''} ${enemyAnim === 'capture' ? 'capture-anim' : ''}`} alt={enemy.name}/>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <HealthBar name={playerLeadMon.nickname || playerEvo.name} currentHp={playerCurrentHp} maxHp={playerMaxHp} types={playerEvo.types} />
                <HealthBar name={enemy.name} currentHp={enemy.currentHp} maxHp={enemy.hp} types={enemy.types} />
            </div>

            <div className="bg-gray-800 text-white p-4 rounded-lg min-h-[120px]">
                <p className="text-center text-lg mb-4 h-8 font-semibold">{message}</p>
                <div className={`grid ${phase === 'player_turn' ? 'grid-cols-5' : 'grid-cols-2'} gap-2`}>
                    {phase === 'player_turn' && (
                        <>
                            <div className="grid grid-cols-2 col-span-4 gap-2">
                                {playerMonData.moveset.map(moveKey => {
                                    const move = ALL_MOVES[moveKey];
                                    return <button key={moveKey} onClick={() => handleMoveSelect(move)} className="btn-move bg-gray-200 text-gray-800 p-2 rounded-md text-center shadow-md font-semibold text-xs transition-transform transform active:scale-95">{move.name}</button>
                                })}
                            </div>
                            <button onClick={() => { setPhase('bag'); setMessage('Choose an item.'); }} className="btn-move bg-yellow-500 text-white p-2 rounded-md shadow-md font-semibold text-xs">Bag</button>
                        </>
                    )}
                    {phase === 'bag' && (
                        <>
                            {Object.entries(player.inventory).filter(([, count]) => count > 0).map(([itemId]) => {
                                const item = ITEMS[itemId];
                                return <button key={itemId} onClick={() => handleUseItem(item)} className="btn-move bg-blue-400 text-white p-2 rounded-md text-center shadow-md font-semibold text-xs">{`${item.name} x${player.inventory[itemId]}`}</button>
                            })}
                            <button onClick={() => { setPhase('player_turn'); setMessage('Your turn! Choose a move.'); }} className="btn-move bg-gray-400 text-white p-2 rounded-md shadow-md font-semibold text-xs">Cancel</button>
                        </>
                    )}
                    {phase === 'answering' && problem && problem.choices.map(choice => (
                        <button key={choice} onClick={() => submitAnswer(choice)} className="btn-move bg-yellow-400 text-gray-800 p-3 rounded-md text-center shadow-md font-bold text-xl transition-transform transform active:scale-95">{choice}</button>
                    ))}
                </div>
            </div>

            <ResultModal result={battleResult} onNext={() => onBattleEnd(battleResult!)} onCapture={handleCapture} canCapture={canCapture} />
        </div>
    );
};

export default BattleScreen;