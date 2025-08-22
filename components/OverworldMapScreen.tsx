import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ALL_MAPS, TILE_SIZE, ENCOUNTER_CHANCE, ALL_TRAINERS, ALL_NPCS, ITEMS, PLAYER_SPRITE_URL, MATHMONS } from '../constants';
import { TileType, PlayerState, Direction, Trainer, NPC } from '../types';
import DialogueBox from './DialogueBox';

interface OverworldMapScreenProps {
  player: PlayerState;
  itemsOnMap: { [position: string]: string };
  dialogue: { npcId: string, messages: string[] } | null;
  onUpdatePlayer: (updates: Partial<PlayerState>) => void;
  onStartWildBattle: (locationId: string) => void;
  onStartTrainerBattle: (trainerId: string, trainerDialogue: string[]) => void;
  onInteract: (characterId: string, messages: string[]) => void;
  onItemPickup: (itemId: string, pos: { x: number, y: number }) => void;
  onCloseDialogue: () => void;
  onTransition: (destMap: string, destX: number, destY: number) => void;
  onOpenMenu: () => void;
}

const OverworldMapScreen: React.FC<OverworldMapScreenProps> = (props) => {
  const { player, itemsOnMap, dialogue, onUpdatePlayer, onStartWildBattle, onStartTrainerBattle, onInteract, onItemPickup, onCloseDialogue, onTransition, onOpenMenu } = props;
  
  const [playerDirection, setPlayerDirection] = useState<Direction>('down');
  const [followerPosition, setFollowerPosition] = useState(player.position);
  const [isMoving, setIsMoving] = useState(false);
  
  const moveTimeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  const mapLayout = ALL_MAPS[player.currentMapId];
  const trainersOnMap = ALL_TRAINERS[player.currentMapId] || {};
  const npcsOnMap = ALL_NPCS[player.currentMapId] || {};
  
  // Filter out the blocker NPC if the rival is defeated
  const activeNpcs = Object.values(npcsOnMap).filter(npc => {
    if (npc.id === 'blocker' && player.defeatedTrainers.includes('blue')) {
        return false;
    }
    if (npc.id === 'gym_sign' && player.defeatedTrainers.includes('gym_leader_1')) {
        return false; // Optionally hide sign after gym is beaten
    }
    return true;
  });

  const allCharacters: (Trainer | NPC)[] = [ ...Object.values(trainersOnMap), ...activeNpcs ];
  const playerLeadMonData = player.team[0] ? MATHMONS[player.team[0].mathmonKey] : null;
  const playerLeadMon = playerLeadMonData ? playerLeadMonData.evolutions[player.team[0].evolutionStage] : null;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(() => {
        setViewportSize({ width: container.offsetWidth, height: container.offsetHeight });
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const getCharacterAt = useCallback((x: number, y: number): Trainer | NPC | undefined => {
    return allCharacters.find(c => c.position.x === x && c.position.y === y);
  }, [allCharacters]);
  
  const move = useCallback((dx: number, dy: number) => {
    if (moveTimeoutRef.current || dialogue || isMoving) return;

    let newDirection: Direction = playerDirection;
    if (dy < 0) newDirection = 'up';
    if (dy > 0) newDirection = 'down';
    if (dx < 0) newDirection = 'left';
    if (dx > 0) newDirection = 'right';
    
    setPlayerDirection(newDirection);
    setFollowerPosition(player.position);

    const newX = player.position.x + dx;
    const newY = player.position.y + dy;

    if ( newY < 0 || newY >= mapLayout.length || newX < 0 || newX >= mapLayout[newY].length) return;
    
    const targetTileStr = mapLayout[newY][newX];
    const characterOnTile = getCharacterAt(newX, newY);
    
    const [tileType] = targetTileStr.split(':');

    if (tileType === TileType.TREE || tileType === TileType.WALL || tileType === TileType.ROOF || characterOnTile?.isBlocking) return;
    
    setIsMoving(true);
    onUpdatePlayer({ position: { x: newX, y: newY } });

    moveTimeoutRef.current = window.setTimeout(() => {
        setIsMoving(false);
        moveTimeoutRef.current = null;

        const posKey = `${newX},${newY}`;
        if (itemsOnMap[posKey]) {
            onItemPickup(itemsOnMap[posKey], {x: newX, y: newY});
        }

        if (tileType === TileType.DOOR) {
            const gymLeader = Object.values(trainersOnMap).find(t => t.id === 'gym_leader_1');
            if (gymLeader && !player.defeatedTrainers.includes(gymLeader.id)) onStartTrainerBattle(gymLeader.id, gymLeader.dialogue);
            else if (gymLeader) onInteract(gymLeader.id, gymLeader.defeatDialogue);
        }
        
        if (tileType === TileType.EXIT) {
            const [, destMap, destCoords] = targetTileStr.split(':');
            const [destX, destY] = destCoords.split(',').map(Number);
            onTransition(destMap, destX, destY);
        }

        if (tileType === TileType.TALL_GRASS && Math.random() < ENCOUNTER_CHANCE) {
            onStartWildBattle('W');
        }
    }, 200);
  }, [player.position, player.defeatedTrainers, playerDirection, dialogue, isMoving, onUpdatePlayer, itemsOnMap, onItemPickup, onStartWildBattle, onStartTrainerBattle, onTransition, onInteract, mapLayout, trainersOnMap, getCharacterAt]);

  useEffect(() => {
    if (moveTimeoutRef.current || dialogue || isMoving) return;
    for (const trainer of Object.values(trainersOnMap)) {
        if (player.defeatedTrainers.includes(trainer.id)) continue;

        let inSight = false;
        let pathIsClear = true;
        if (trainer.direction === 'down' && player.position.x === trainer.position.x && player.position.y > trainer.position.y && player.position.y <= trainer.position.y + trainer.sightRange) {
            inSight = true;
            for(let i = trainer.position.y + 1; i < player.position.y; i++) {
                if(mapLayout[i][trainer.position.x] === TileType.TREE || getCharacterAt(trainer.position.x, i)) pathIsClear = false;
            }
        }
        // Add similar checks for other directions with path clearing
        
        if (inSight && pathIsClear) {
            onStartTrainerBattle(trainer.id, trainer.dialogue);
            break; 
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.position, dialogue, isMoving]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if(dialogue){
          if(e.key === 'Enter' || e.key === ' ') onCloseDialogue();
          return;
      }
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp': case 'w': move(0, -1); break;
        case 'ArrowDown': case 's': move(0, 1); break;
        case 'ArrowLeft': case 'a': move(-1, 0); break;
        case 'ArrowRight': case 'd': move(1, 0); break;
        case 'Enter': case ' ': 
            let dx = 0, dy = 0;
            if (playerDirection === 'up') dy = -1; if (playerDirection === 'down') dy = 1;
            if (playerDirection === 'left') dx = -1; if (playerDirection === 'right') dx = 1;
            const charInFront = getCharacterAt(player.position.x + dx, player.position.y + dy);
            if (charInFront) {
                const messages = player.defeatedTrainers.includes(charInFront.id) && 'defeatDialogue' in charInFront
                    ? (charInFront as Trainer).defeatDialogue
                    : charInFront.dialogue;
                onInteract(charInFront.id, messages);
            }
            break;
        case 'Escape': case 'm': onOpenMenu(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, onOpenMenu, dialogue, onCloseDialogue, onInteract, playerDirection, player.position, player.defeatedTrainers, getCharacterAt]);
  
  const mapWidth = mapLayout[0].length * TILE_SIZE;
  const mapHeight = mapLayout.length * TILE_SIZE;
  
  const idealCameraX = (player.position.x * TILE_SIZE) + (TILE_SIZE / 2) - (viewportSize.width / 2);
  const idealCameraY = (player.position.y * TILE_SIZE) + (TILE_SIZE / 2) - (viewportSize.height / 2);
  
  const cameraX = Math.max(0, Math.min(idealCameraX, mapWidth - viewportSize.width));
  const cameraY = Math.max(0, Math.min(idealCameraY, mapHeight - viewportSize.height));

  const worldStyle = {
    position: 'absolute' as const,
    width: mapWidth,
    height: mapHeight,
    transform: `translate(-${cameraX}px, -${cameraY}px)`,
    transition: 'transform 0.2s linear',
  };

  return (
    <div className="game-container bg-gray-800 rounded-2xl p-2 text-white overflow-hidden">
        <div ref={containerRef} className="map-container w-full aspect-square">
            { viewportSize.width > 0 && (
            <div className="relative w-full h-full">
                <div className="world" style={worldStyle}>
                    <div className="map-grid" style={{ gridTemplateColumns: `repeat(${mapLayout[0].length}, ${TILE_SIZE}px)` }}>
                        {mapLayout.map((row, y) => row.map((tile, x) => (
                            <div key={`${x}-${y}`} className={`tile tile-${getTileClass(tile.split(':')[0] as TileType)}`} />
                        )))}
                    </div>
                    
                    {Object.entries(itemsOnMap).map(([posKey, itemId]) => {
                        const [x, y] = posKey.split(',').map(Number);
                        const item = ITEMS[itemId];
                        return <img key={posKey} src={item.spriteUrl} alt={item.name} className="map-sprite item-sprite" style={{ left: x * TILE_SIZE, top: y * TILE_SIZE }} />;
                    })}

                    {player.followerType === 'pokemon' && playerLeadMon?.followerSpriteUrl && (
                      <img src={playerLeadMon.followerSpriteUrl} alt={`${playerLeadMon.name} follower`} className="follower-sprite" style={{
                        left: followerPosition.x * TILE_SIZE,
                        top: followerPosition.y * TILE_SIZE,
                      }} />
                    )}
                    
                    {allCharacters.map(char => (
                        <img key={char.id} 
                             src={char.spriteUrl} 
                             alt={char.id}
                             className={`map-sprite ${(char.direction === 'left') ? 'mirrored' : ''}`} style={{
                            left: char.position.x * TILE_SIZE,
                            top: char.position.y * TILE_SIZE - (TILE_SIZE / 2),
                            height: `${TILE_SIZE * 1.5}px`,
                        }} />
                    ))}

                    <img src={PLAYER_SPRITE_URL} alt="player" className={`map-sprite ${(playerDirection === 'left') ? 'mirrored' : ''}`} style={{
                        left: player.position.x * TILE_SIZE,
                        top: player.position.y * TILE_SIZE - (TILE_SIZE / 2),
                        height: `${TILE_SIZE * 1.5}px`,
                    }} />
                </div>
            </div>
            )}
        </div>
        <button onClick={onOpenMenu} className="absolute top-4 right-4 bg-yellow-400 text-black font-pixel p-2 rounded-lg border-2 border-yellow-600 text-xs z-20">Menu</button>
        {dialogue && <DialogueBox messages={dialogue.messages} onClose={onCloseDialogue} />}
    </div>
  );
};

const getTileClass = (tile: TileType | string) => {
    switch(tile) {
        case TileType.GRASS: return 'grass'; case TileType.PATH: return 'path';
        case TileType.TREE: return 'tree'; case TileType.TALL_GRASS: return 'tall-grass';
        case TileType.WALL: return 'wall'; case TileType.ROOF: return 'roof';
        case TileType.DOOR: return 'door'; case TileType.EXIT: return 'exit';
        default: return 'grass';
    }
}

export default OverworldMapScreen;