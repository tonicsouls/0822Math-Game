import React, { useState, useCallback, useEffect } from 'react';
import { GameMode, PlayerState, Screen, BattleResult, SavedGameState, PlayerMathMon, Evolution } from './types';
import { MATHMONS, ALL_MAPS, ALL_TRAINERS, ALL_ITEMS_ON_MAPS } from './constants';

import ModeSelectScreen from './components/ModeSelectScreen';
import CharacterSelectScreen from './components/CharacterSelectScreen';
import MainMenuScreen from './components/MainMenuScreen';
import BattleScreen from './components/BattleScreen';
import MathDexScreen from './components/MathDexScreen';
import ReadingQuestScreen from './components/ReadingQuestScreen';
import OverworldMapScreen from './components/OverworldMapScreen';
import WorldSelectScreen from './components/WorldSelectScreen';
import NicknameScreen from './components/NicknameScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<SavedGameState | null>(() => {
    const saved = localStorage.getItem('mathmon_game_state_v3');
    return saved ? JSON.parse(saved) : null;
  });

  const [screen, setScreen] = useState<Screen>(gameState ? Screen.MAIN_MENU : Screen.MODE_SELECT);
  const [tempGameMode, setTempGameMode] = useState<GameMode | null>(null);
  
  const [battleInfo, setBattleInfo] = useState<{ type: 'wild' | 'trainer', id: string, mapId: string } | null>(null);
  const [dialogue, setDialogue] = useState<{ npcId: string, messages: string[] } | null>(null);
  const [newlyCaptured, setNewlyCaptured] = useState<{ key: string, id: number} | null>(null);

  useEffect(() => {
    if (gameState) {
      localStorage.setItem('mathmon_game_state_v3', JSON.stringify(gameState));
    } else {
      localStorage.removeItem('mathmon_game_state_v3');
    }
  }, [gameState]);
  
  const goHome = () => {
    setGameState(null);
    setTempGameMode(null);
    setBattleInfo(null);
    setDialogue(null);
    setNewlyCaptured(null);
    setScreen(Screen.MODE_SELECT);
  }

  const handleModeSelect = useCallback((mode: GameMode) => {
    setTempGameMode(mode);
    setScreen(Screen.CHARACTER_SELECT);
  }, []);

  const handleCharacterSelect = useCallback((starterKey: string) => {
    if (!tempGameMode) return;

    const mathmonData = MATHMONS[starterKey];
    const isLegendary = tempGameMode === GameMode.LEGENDARY;
    const evolutionStage = isLegendary ? mathmonData.evolutions.length - 1 : 0;
    const currentEvo = mathmonData.evolutions[evolutionStage];

    const starterMon: PlayerMathMon = {
        uid: `${Date.now()}`,
        mathmonKey: starterKey,
        nickname: null,
        evolutionStage: evolutionStage,
        battleWins: 0,
    };

    const newPlayer: PlayerState = {
      team: [starterMon],
      wins: 0, 
      trainingBoost: 0,
      mathdex: [currentEvo.id],
      position: { x: 2, y: 2 },
      inventory: { pokeball: 5 },
      defeatedTrainers: [],
      currentMapId: 'town',
      unlockedMaps: ['town'],
      followerType: 'pokemon',
      currentStreak: isLegendary ? 0 : undefined,
      bestStreak: isLegendary ? 0 : undefined,
    };
    
    setGameState({ player: newPlayer, gameMode: tempGameMode, itemsOnMap: { ...ALL_ITEMS_ON_MAPS } });
    setScreen(Screen.MAIN_MENU);
  }, [tempGameMode]);

  const updatePlayer = (updates: Partial<PlayerState>) => {
    setGameState(prev => {
        if (!prev) return null;
        return { ...prev, player: { ...prev.player, ...updates } };
    });
  };

  const toggleFollower = () => {
    if (!gameState) return;
    const currentType = gameState.player.followerType;
    const nextType: PlayerState['followerType'] = currentType === 'pokemon' ? 'none' : 'pokemon';
    updatePlayer({ followerType: nextType });
  };
  
  const handleStartWildBattle = (tileType: string) => {
      if(!gameState) return;
      setBattleInfo({ type: 'wild', id: tileType, mapId: gameState.player.currentMapId });
      setScreen(Screen.BATTLE);
  };
  
  const handleStartTrainerBattle = (trainerId: string, trainerDialogue: string[]) => {
    if(!gameState) return;
    setDialogue({ npcId: trainerId, messages: trainerDialogue });
  }

  const handleBattleEnd = useCallback((result: BattleResult) => {
    if (!gameState) return;

    let playerUpdates: Partial<PlayerState> = { trainingBoost: 0 };
    const leadMon = gameState.player.team[0];

    if (result.playerWon) {
      playerUpdates.wins = gameState.player.wins + 1;
      leadMon.battleWins += 1;

      if (result.capturedMathmon) {
          if (gameState.player.team.length < 6) {
              setNewlyCaptured(result.capturedMathmon);
              setScreen(Screen.NICKNAME);
              setBattleInfo(null);
              return; 
          } else {
              setDialogue({ npcId: 'system', messages: [`Your team is full! You couldn't keep the ${MATHMONS[result.capturedMathmon.key].name}.`] });
          }
      }
      
      if (result.evolutionOccurred) {
        leadMon.evolutionStage += 1;
      }
      if (battleInfo?.type === 'trainer') {
        playerUpdates.defeatedTrainers = [...gameState.player.defeatedTrainers, battleInfo.id];
      }
      if(gameState.gameMode === GameMode.LEGENDARY) {
        const newStreak = (gameState.player.currentStreak ?? 0) + 1;
        playerUpdates.currentStreak = newStreak;
        playerUpdates.bestStreak = Math.max(gameState.player.bestStreak ?? 0, newStreak);
      }
    } else {
        if(gameState.gameMode === GameMode.LEGENDARY) playerUpdates.currentStreak = 0;
    }
    
    playerUpdates.team = [...gameState.player.team];
    updatePlayer(playerUpdates);
    setScreen(Screen.WORLD_MAP);
    setBattleInfo(null);
  }, [gameState, battleInfo]);
  
  const handleNicknameConfirm = (nickname: string | null) => {
    if (!gameState || !newlyCaptured) return;

    const newMon: PlayerMathMon = {
        uid: `${Date.now()}`,
        mathmonKey: newlyCaptured.key,
        nickname: nickname,
        evolutionStage: 0,
        battleWins: 0,
    };

    updatePlayer({
        team: [...gameState.player.team, newMon],
        mathdex: [...gameState.player.mathdex, newlyCaptured.id],
    });
    
    setNewlyCaptured(null);
    setScreen(Screen.WORLD_MAP);
  };

  const handleInteraction = (characterId: string, messages: string[]) => {
    setDialogue({ npcId: characterId, messages });
  };
  
  const handleTransition = (destMap: string, destX: number, destY: number) => {
      if(!gameState) return;
      const isNewMap = !gameState.player.unlockedMaps.includes(destMap);
      const newUnlocked = isNewMap
        ? [...gameState.player.unlockedMaps, destMap]
        : gameState.player.unlockedMaps;

      if(isNewMap) {
        setDialogue({npcId: 'system', messages: [`${destMap.charAt(0).toUpperCase() + destMap.slice(1)} has been unlocked! You can now fast travel there from the World Map.`]})
      }

      updatePlayer({
          currentMapId: destMap,
          position: {x: destX, y: destY},
          unlockedMaps: newUnlocked
      });
  }

  const handleItemPickup = (itemId: string, pos: {x: number, y: number}) => {
    setGameState(prev => {
      if (!prev) return null;
      const mapId = prev.player.currentMapId;
      const posKey = `${pos.x},${pos.y}`;
      
      const newItemsOnMap = JSON.parse(JSON.stringify(prev.itemsOnMap));
      if(newItemsOnMap[mapId]) {
          delete newItemsOnMap[mapId][posKey];
      }
      
      const newInventory = { ...prev.player.inventory };
      newInventory[itemId] = (newInventory[itemId] || 0) + 1;

      setDialogue({ npcId: 'system', messages: [`You found a ${itemId}!` ]});

      return {
        ...prev,
        itemsOnMap: newItemsOnMap,
        player: { ...prev.player, inventory: newInventory }
      };
    });
  }

  const handleUseItem = (itemId: string) => {
    if(!gameState) return false;
    const currentAmount = gameState.player.inventory[itemId] || 0;
    if (currentAmount > 0) {
      const newInventory = { ...gameState.player.inventory };
      newInventory[itemId] = currentAmount - 1;
      updatePlayer({ inventory: newInventory });
      return true;
    }
    return false;
  }

  const closeDialogue = () => {
    const npcId = dialogue?.npcId;
    const isTrainerDialogue = npcId && ALL_TRAINERS[gameState?.player.currentMapId ?? '']?.[npcId];
    setDialogue(null);
    if (isTrainerDialogue && gameState && !gameState?.player.defeatedTrainers.includes(npcId)) {
        setBattleInfo({ type: 'trainer', id: npcId, mapId: gameState.player.currentMapId });
        setScreen(Screen.BATTLE);
    }
  };
  
  const renderScreen = () => {
    switch (screen) {
      case Screen.MODE_SELECT:
        return <ModeSelectScreen onModeSelect={handleModeSelect} />;
      case Screen.CHARACTER_SELECT:
        if (!tempGameMode) { goHome(); return null; }
        return <CharacterSelectScreen gameMode={tempGameMode} onConfirm={handleCharacterSelect} onHome={goHome} />;
      case Screen.MAIN_MENU:
        if (!gameState) { goHome(); return null; }
        return <MainMenuScreen player={gameState.player} gameMode={gameState.gameMode} onNavigate={setScreen} onHome={goHome} onToggleFollower={toggleFollower} />;
      case Screen.WORLD_SELECT:
        if (!gameState) { goHome(); return null; }
        return <WorldSelectScreen 
            unlockedMaps={gameState.player.unlockedMaps}
            onSelectMap={(mapId) => { updatePlayer({currentMapId: mapId}); setScreen(Screen.WORLD_MAP); }}
            onBack={() => setScreen(Screen.MAIN_MENU)}
            onHome={goHome}
        />;
      case Screen.WORLD_MAP:
        if (!gameState) { goHome(); return null; }
        return <OverworldMapScreen 
            player={gameState.player}
            itemsOnMap={gameState.itemsOnMap[gameState.player.currentMapId] || {}}
            dialogue={dialogue}
            onUpdatePlayer={updatePlayer}
            onStartWildBattle={handleStartWildBattle} 
            onStartTrainerBattle={handleStartTrainerBattle}
            onInteract={handleInteraction}
            onItemPickup={handleItemPickup}
            onCloseDialogue={closeDialogue}
            onTransition={handleTransition}
            onOpenMenu={() => setScreen(Screen.MAIN_MENU)} 
        />;
      case Screen.BATTLE:
        if (!gameState || !battleInfo) { goHome(); return null; }
        return <BattleScreen 
            player={gameState.player} 
            gameMode={gameState.gameMode} 
            battleInfo={battleInfo} 
            onBattleEnd={handleBattleEnd} 
            onUseItem={handleUseItem}
        />;
      case Screen.NICKNAME:
          if (!newlyCaptured) { goHome(); return null; }
          const capturedMonData = MATHMONS[newlyCaptured.key];
          const capturedEvo = capturedMonData.evolutions[0];
          return <NicknameScreen mathmonEvo={capturedEvo} onConfirm={handleNicknameConfirm} />;
      case Screen.MATHDEX:
        if (!gameState) { goHome(); return null; }
        return <MathDexScreen player={gameState.player} onBack={() => setScreen(Screen.MAIN_MENU)} onHome={goHome} />;
      case Screen.READING_QUEST:
          if (!gameState) { goHome(); return null; }
          return <ReadingQuestScreen 
              player={gameState.player} 
              onComplete={(boost) => { updatePlayer({trainingBoost: (gameState.player.trainingBoost || 0) + boost}); setScreen(Screen.MAIN_MENU); }} 
              onEvolve={(newStage) => {
                if(gameState) {
                    const newTeam = [...gameState.player.team];
                    newTeam[0].evolutionStage = newStage;
                    updatePlayer({ team: newTeam });
                }
              }}
              onBack={() => setScreen(Screen.MAIN_MENU)}
          />;
      default:
        goHome();
        return <ModeSelectScreen onModeSelect={handleModeSelect} />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      {renderScreen()}
    </div>
  );
};

export default App;