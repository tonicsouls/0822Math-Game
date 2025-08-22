export enum GameMode {
  ADVENTURE = 'adventure',
  LEGENDARY = 'legendary',
}

export enum Screen {
  MODE_SELECT,
  CHARACTER_SELECT,
  MAIN_MENU,
  BATTLE,
  READING_QUEST,
  MATHDEX,
  WORLD_MAP,
  WORLD_SELECT,
  NICKNAME,
}

export type MoveType = 'add' | 'sub' | 'mul' | 'div';

export interface Move {
  name: string;
  type: MoveType;
}

export interface Ability {
  name: string;
  description: string;
}

export interface Evolution {
  id: number;
  name: string;
  hp: number;
  evolutionWins: number | null;
  types: MoveType[];
  ability: string;
  followerSpriteUrl?: string;
}

export interface MathMonData {
  id: number;
  name: string;
  evolutions: Evolution[];
  moveset: string[];
}

export interface LegendaryData {
    id: number;
    name: string;
    hp: number;
    types: MoveType[];
    ability: string;
}

export interface PlayerMathMon {
  uid: string;
  mathmonKey: string;
  nickname: string | null;
  evolutionStage: number;
  battleWins: number;
}

export interface PlayerState {
  team: PlayerMathMon[];
  wins: number;
  trainingBoost: number;
  mathdex: number[];
  position: { x: number, y: number };
  inventory: { [itemId: string]: number };
  defeatedTrainers: string[];
  currentMapId: string;
  unlockedMaps: string[];
  followerType: 'none' | 'pokemon';
  currentStreak?: number;
  bestStreak?: number;
}

export interface Enemy {
    id: number;
    name: string;
    hp: number;
    currentHp: number;
    types: MoveType[];
    ability: string;
    wasAtFullHp: boolean; // For abilities like Sturdy
}

export interface Problem {
    text: string;
    answer: number;
    choices: number[];
    difficulty: number;
    moveType: MoveType;
}

export interface BattleResult {
    playerWon: boolean;
    capturedMathmon?: { key: string; id: number; };
    evolutionOccurred?: { from: Evolution, to: Evolution };
}

export interface ReadingQuest {
    s: string[];
    a: string;
    o: string[];
}

export interface ReadingGuide {
    name: string;
    id: number;
    hp: number;
}

export interface ReadingStageData {
    guide: ReadingGuide;
    quests: ReadingQuest[];
}

export interface SavedGameState {
    player: PlayerState;
    gameMode: GameMode;
    itemsOnMap: { [mapId: string]: { [position: string]: string } };
}

export interface WorldMapData {
    id: string;
    name: string;
}

// Overworld Map Types
export enum TileType {
    PATH = 'P',
    GRASS = 'G',
    TALL_GRASS = 'W',
    TREE = 'T',
    WALL = 'X',
    ROOF = 'R',
    DOOR = 'D',
    EXIT = 'E',
}

export type MapLayout = string[][];

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface NPC {
    id: string;
    spriteUrl: string;
    position: { x: number, y: number };
    dialogue: string[];
    direction?: Direction;
    isBlocking?: boolean;
}

export interface Trainer extends NPC {
    team: { key: string, level: number }[]; // Keys of MATHMONS
    sightRange: number;
    direction: Direction;
    defeatDialogue: string[];
}

export interface Item {
    id: string;
    name: string;
    description: string;
    spriteUrl: string;
}