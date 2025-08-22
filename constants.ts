import { MathMonData, Move, LegendaryData, ReadingStageData, MoveType, Ability, MapLayout, TileType, Trainer, NPC, Item, WorldMapData } from './types';

export const ALL_MOVES: { [key: string]: Move } = {
    'add-leaf': { name: 'Leaf Blade Addition', type: 'add' }, 'sub-quick': { name: 'Quick Subtraction', type: 'sub' }, 'mul-solar': { name: 'Solar Multiplication', type: 'mul' }, 'div-synthesis': { name: 'Synthesis Division', type: 'div' },
    'add-ember': { name: 'Ember Addition', type: 'add' }, 'sub-blaze': { name: 'Blaze Kick Subtraction', type: 'sub' }, 'mul-fire': { name: 'Fire Spin Multiply', type: 'mul' }, 'div-flare': { name: 'Flare Blitz Division', type: 'div' },
    'add-water': { name: 'Aqua Sum', type: 'add' }, 'sub-hydro': { name: 'Hydro Pump Subtraction', type: 'sub' }, 'mul-surf': { name: 'Surf Multiplication', type: 'mul' }, 'div-dive': { name: 'Dive Division', type: 'div' },
    'add-dragon': { name: 'Dragon Rage Add', type: 'add' }, 'sub-sand': { name: 'Sand Tomb Subtract', type: 'sub' }, 'mul-outrage': { name: 'Outrage Multiply', type: 'mul' }, 'div-earthquake': { name: 'Earthquake Division', type: 'div' },
    'add-shadow': { name: 'Shadow Ball Add', type: 'add' }, 'sub-hex': { name: 'Hex Subtraction', type: 'sub' }, 'mul-inferno': { name: 'Inferno Multiply', type: 'mul' }, 'div-dream': { name: 'Dream Eater Division', type: 'div' },
    'add-aura': { name: 'Aura Sphere Add', type: 'add' }, 'sub-force': { name: 'Force Palm Subtract', type: 'sub'}, 'mul-bone': { name: 'Bone Rush Multiply', type: 'mul'}, 'div-close': { name: 'Close Combat Division', type: 'div'},
    'add-splash': { name: 'Aqua Jet Add', type: 'add' }, 'sub-peck': { name: 'Peck Away Subtract', type: 'sub'}, 'mul-hydro': { name: 'Hydro Pump Multiply', type: 'mul'}, 'div-steel': { name: 'Steel Wing Division', type: 'div'},
    'add-razor': { name: 'Razor Leaf Add', type: 'add' }, 'sub-pluck': { name: 'Pluck Subtraction', type: 'sub'}, 'mul-arrow': { name: 'Spirit Shackle Multiply', type: 'mul'}, 'div-brave': { name: 'Brave Bird Division', type: 'div'},
    'add-tackle': { name: 'Tackle Add', type: 'add' }, 'sub-double': { name: 'Double Kick Subtract', type: 'sub'}, 'mul-pyro': { name: 'Pyro Ball Multiply', type: 'mul'}, 'div-bounce': { name: 'Bounce Division', type: 'div'},
    'add-slash': { name: 'Slash Add', type: 'add' }, 'sub-crunch': { name: 'Crunch Subtraction', type: 'sub'}, 'mul-dragon': { name: 'Dragon Claw Multiply', type: 'mul'}, 'div-guillotine': { name: 'Guillotine Division', type: 'div'},
    'add-iron': { name: 'Iron Head Add', type: 'add' }, 'sub-shadow': { name: 'Shadow Sneak Subtract', type: 'sub'}, 'mul-sacred': { name: 'Sacred Sword Multiply', type: 'mul'}, 'div-kings': { name: 'King\'s Shield Division', type: 'div'},
    'add-absorb': { name: 'Absorb Add', type: 'add' }, 'sub-dragon': { name: 'Dragon Breath Subtract', type: 'sub'}, 'mul-pulse': { name: 'Dragon Pulse Multiply', type: 'mul'}, 'div-power': { name: 'Power Whip Division', type: 'div'},
    'add-vine-whip': { name: 'Vine Whip Addition', type: 'add' },
    'sub-poison-powder': { name: 'Poison Powder Subtraction', type: 'sub' },
    'mul-flamethrower': { name: 'Flamethrower Multiply', type: 'mul' },
    'div-water-gun': { name: 'Water Gun Division', type: 'div' },
    'div-hydro-pump': { name: 'Hydro Pump Division', type: 'div' },
    'mul-ember': { name: 'Ember Multiply', type: 'mul' },
    'div-thundershock': { name: 'Thundershock Division', type: 'div' },
};

export const ALL_ABILITIES: { [key: string]: Ability } = {
    'overgrow': { name: 'Overgrow', description: 'Powers up Add-type moves when HP is low.' },
    'blaze': { name: 'Blaze', description: 'Powers up Mul-type moves when HP is low.' },
    'torrent': { name: 'Torrent', description: 'Powers up Div-type moves when HP is low.' },
    'shed-skin': { name: 'Shed Skin', description: 'May heal from status conditions.' },
    'guts': { name: 'Guts', description: 'Boosts Attack if there is a status condition.' },
    'levitate': { name: 'Levitate', description: 'Gives full immunity to Sub-type moves.' },
    'steadfast': { name: 'Steadfast', description: 'Boosts Speed each time the MathMon flinches.' },
    'sturdy': { name: 'Sturdy', description: 'It cannot be knocked out with one hit.' },
    'static': { name: 'Static', description: 'Contact with the MathMon may cause paralysis.' },
};

export const TYPE_CHART: { [key in MoveType]: { superEffective: MoveType, notEffective: MoveType } } = {
    mul: { superEffective: 'add', notEffective: 'div' },
    add: { superEffective: 'sub', notEffective: 'mul' },
    sub: { superEffective: 'div', notEffective: 'add' },
    div: { superEffective: 'mul', notEffective: 'sub' },
};

export const getSpriteUrl = (id: number): string => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
const getFollowerSpriteUrl = (id: number): string => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;


export const MATHMONS: { [key: string]: MathMonData } = {
    bulbasaur: { id: 1, name: 'Bulbasaur', evolutions: [ { id: 1, name: 'Bulbasaur', hp: 110, evolutionWins: 5, types: ['add', 'sub'], ability: 'overgrow', followerSpriteUrl: getFollowerSpriteUrl(1) }, { id: 2, name: 'Ivysaur', hp: 160, evolutionWins: 12, types: ['add', 'sub'], ability: 'overgrow', followerSpriteUrl: getFollowerSpriteUrl(2) }, { id: 3, name: 'Venusaur', hp: 210, evolutionWins: null, types: ['add', 'sub'], ability: 'overgrow', followerSpriteUrl: getFollowerSpriteUrl(3) } ], moveset: ['add-vine-whip', 'sub-poison-powder', 'add-tackle', 'div-synthesis'] },
    charmander: { id: 4, name: 'Charmander', evolutions: [ { id: 4, name: 'Charmander', hp: 100, evolutionWins: 5, types: ['mul'], ability: 'blaze', followerSpriteUrl: getFollowerSpriteUrl(4) }, { id: 5, name: 'Charmeleon', hp: 150, evolutionWins: 12, types: ['mul'], ability: 'blaze', followerSpriteUrl: getFollowerSpriteUrl(5) }, { id: 6, name: 'Charizard', hp: 200, evolutionWins: null, types: ['mul', 'div'], ability: 'blaze', followerSpriteUrl: getFollowerSpriteUrl(6) } ], moveset: ['mul-ember', 'add-slash', 'mul-flamethrower', 'div-flare'] },
    squirtle: { id: 7, name: 'Squirtle', evolutions: [ { id: 7, name: 'Squirtle', hp: 120, evolutionWins: 5, types: ['div'], ability: 'torrent', followerSpriteUrl: getFollowerSpriteUrl(7) }, { id: 8, name: 'Wartortle', hp: 170, evolutionWins: 12, types: ['div'], ability: 'torrent', followerSpriteUrl: getFollowerSpriteUrl(8) }, { id: 9, name: 'Blastoise', hp: 220, evolutionWins: null, types: ['div'], ability: 'torrent', followerSpriteUrl: getFollowerSpriteUrl(9) } ], moveset: ['div-water-gun', 'add-tackle', 'sub-hydro', 'div-hydro-pump'] },
    mareep: { id: 179, name: 'Mareep', evolutions: [ { id: 179, name: 'Mareep', hp: 115, evolutionWins: 5, types: ['div'], ability: 'static', followerSpriteUrl: getFollowerSpriteUrl(179) }, { id: 180, name: 'Flaaffy', hp: 165, evolutionWins: 12, types: ['div'], ability: 'static', followerSpriteUrl: getFollowerSpriteUrl(180) }, { id: 181, name: 'Ampharos', hp: 215, evolutionWins: null, types: ['div', 'add'], ability: 'static', followerSpriteUrl: getFollowerSpriteUrl(181) } ], moveset: ['div-thundershock', 'add-tackle', 'add-absorb', 'div-synthesis'] },
    treecko: { id: 252, name: 'Treecko', evolutions: [ { id: 252, name: 'Treecko', hp: 100, evolutionWins: 5, types: ['add'], ability: 'overgrow', followerSpriteUrl: getFollowerSpriteUrl(252) }, { id: 253, name: 'Grovyle', hp: 150, evolutionWins: 12, types: ['add'], ability: 'overgrow', followerSpriteUrl: getFollowerSpriteUrl(253) }, { id: 254, name: 'Sceptile', hp: 200, evolutionWins: null, types: ['add'], ability: 'overgrow', followerSpriteUrl: getFollowerSpriteUrl(254) } ], moveset: ['add-leaf', 'sub-quick', 'mul-solar', 'div-synthesis'] },
    torchic: { id: 255, name: 'Torchic', evolutions: [ { id: 255, name: 'Torchic', hp: 110, evolutionWins: 5, types: ['mul'], ability: 'blaze', followerSpriteUrl: getFollowerSpriteUrl(255) }, { id: 256, name: 'Combusken', hp: 160, evolutionWins: 12, types: ['mul', 'sub'], ability: 'blaze', followerSpriteUrl: getFollowerSpriteUrl(256) }, { id: 257, name: 'Blaziken', hp: 210, evolutionWins: null, types: ['mul', 'sub'], ability: 'blaze', followerSpriteUrl: getFollowerSpriteUrl(257) } ], moveset: ['mul-ember', 'sub-blaze', 'mul-fire', 'div-flare'] },
    mudkip: { id: 258, name: 'Mudkip', evolutions: [ { id: 258, name: 'Mudkip', hp: 120, evolutionWins: 5, types: ['div'], ability: 'torrent', followerSpriteUrl: getFollowerSpriteUrl(258) }, { id: 259, name: 'Marshtomp', hp: 170, evolutionWins: 12, types: ['div', 'sub'], ability: 'torrent', followerSpriteUrl: getFollowerSpriteUrl(259) }, { id: 260, name: 'Swampert', hp: 220, evolutionWins: null, types: ['div', 'sub'], ability: 'torrent', followerSpriteUrl: getFollowerSpriteUrl(260) } ], moveset: ['add-water', 'sub-hydro', 'mul-surf', 'div-dive'] },
    gible: { id: 443, name: 'Gible', evolutions: [ { id: 443, name: 'Gible', hp: 100, evolutionWins: 6, types: ['sub', 'add'], ability: 'shed-skin', followerSpriteUrl: getFollowerSpriteUrl(443) }, { id: 444, name: 'Gabite', hp: 150, evolutionWins: 14, types: ['sub', 'add'], ability: 'shed-skin', followerSpriteUrl: getFollowerSpriteUrl(444) }, { id: 445, name: 'Garchomp', hp: 230, evolutionWins: null, types: ['sub', 'add'], ability: 'shed-skin', followerSpriteUrl: getFollowerSpriteUrl(445) } ], moveset: ['add-dragon', 'sub-sand', 'mul-outrage', 'div-earthquake'] },
    litwick: { id: 607, name: 'Litwick', evolutions: [ { id: 607, name: 'Litwick', hp: 95, evolutionWins: 5, types: ['mul', 'add'], ability: 'levitate', followerSpriteUrl: getFollowerSpriteUrl(607) }, { id: 608, name: 'Lampent', hp: 145, evolutionWins: 12, types: ['mul', 'add'], ability: 'levitate', followerSpriteUrl: getFollowerSpriteUrl(608) }, { id: 609, name: 'Chandelure', hp: 195, evolutionWins: null, types: ['mul', 'add'], ability: 'levitate', followerSpriteUrl: getFollowerSpriteUrl(609) } ], moveset: ['add-shadow', 'sub-hex', 'mul-inferno', 'div-dream'] },
    riolur: { id: 447, name: 'Riolu', evolutions: [ { id: 447, name: 'Riolu', hp: 100, evolutionWins: 8, types: ['sub'], ability: 'steadfast', followerSpriteUrl: getFollowerSpriteUrl(447) }, { id: 448, name: 'Lucario', hp: 200, evolutionWins: null, types: ['sub', 'mul'], ability: 'steadfast', followerSpriteUrl: getFollowerSpriteUrl(448)} ], moveset: ['add-aura', 'sub-force', 'mul-bone', 'div-close'] },
    piplup: { id: 393, name: 'Piplup', evolutions: [ { id: 393, name: 'Piplup', hp: 115, evolutionWins: 5, types: ['div'], ability: 'torrent', followerSpriteUrl: getFollowerSpriteUrl(393) }, { id: 394, name: 'Prinplup', hp: 165, evolutionWins: 12, types: ['div'], ability: 'torrent', followerSpriteUrl: getFollowerSpriteUrl(394) }, { id: 395, name: 'Empoleon', hp: 215, evolutionWins: null, types: ['div', 'mul'], ability: 'torrent', followerSpriteUrl: getFollowerSpriteUrl(395) } ], moveset: ['add-splash', 'sub-peck', 'mul-hydro', 'div-steel'] },
    rowlet: { id: 722, name: 'Rowlet', evolutions: [ { id: 722, name: 'Rowlet', hp: 105, evolutionWins: 5, types: ['add', 'div'], ability: 'overgrow', followerSpriteUrl: getFollowerSpriteUrl(722) }, { id: 723, name: 'Dartrix', hp: 155, evolutionWins: 12, types: ['add', 'div'], ability: 'overgrow', followerSpriteUrl: getFollowerSpriteUrl(723) }, { id: 724, name: 'Decidueye', hp: 205, evolutionWins: null, types: ['add', 'sub'], ability: 'overgrow', followerSpriteUrl: getFollowerSpriteUrl(724) } ], moveset: ['add-razor', 'sub-pluck', 'mul-arrow', 'div-brave'] },
    scorbunny: { id: 813, name: 'Scorbunny', evolutions: [ { id: 813, name: 'Scorbunny', hp: 100, evolutionWins: 5, types: ['mul'], ability: 'blaze', followerSpriteUrl: getFollowerSpriteUrl(813) }, { id: 814, name: 'Raboot', hp: 150, evolutionWins: 12, types: ['mul'], ability: 'blaze', followerSpriteUrl: getFollowerSpriteUrl(814) }, { id: 815, name: 'Cinderace', hp: 200, evolutionWins: null, types: ['mul'], ability: 'blaze', followerSpriteUrl: getFollowerSpriteUrl(815) } ], moveset: ['add-tackle', 'sub-double', 'mul-pyro', 'div-bounce'] },
    axew: { id: 610, name: 'Axew', evolutions: [ { id: 610, name: 'Axew', hp: 100, evolutionWins: 6, types: ['sub'], ability: 'guts', followerSpriteUrl: getFollowerSpriteUrl(610) }, { id: 611, name: 'Fraxure', hp: 160, evolutionWins: 14, types: ['sub'], ability: 'guts', followerSpriteUrl: getFollowerSpriteUrl(611) }, { id: 612, name: 'Haxorus', hp: 240, evolutionWins: null, types: ['sub'], ability: 'guts', followerSpriteUrl: getFollowerSpriteUrl(612) } ], moveset: ['add-slash', 'sub-crunch', 'mul-dragon', 'div-guillotine'] },
    honedge: { id: 679, name: 'Honedge', evolutions: [ { id: 679, name: 'Honedge', hp: 95, evolutionWins: 6, types: ['mul', 'add'], ability: 'sturdy', followerSpriteUrl: getFollowerSpriteUrl(679) }, { id: 680, name: 'Doublade', hp: 145, evolutionWins: 14, types: ['mul', 'add'], ability: 'sturdy', followerSpriteUrl: getFollowerSpriteUrl(680) }, { id: 681, 'name': 'Aegislash', hp: 195, evolutionWins: null, types: ['mul', 'add'], ability: 'sturdy', followerSpriteUrl: getFollowerSpriteUrl(681) } ], moveset: ['add-iron', 'sub-shadow', 'mul-sacred', 'div-kings'] },
    goomy: { id: 704, name: 'Goomy', evolutions: [ { id: 704, name: 'Goomy', hp: 125, evolutionWins: 6, types: ['add'], ability: 'shed-skin', followerSpriteUrl: getFollowerSpriteUrl(704) }, { id: 705, name: 'Sliggoo', hp: 175, evolutionWins: 14, types: ['add'], ability: 'shed-skin', followerSpriteUrl: getFollowerSpriteUrl(705) }, { id: 706, 'name': 'Goodra', hp: 225, evolutionWins: null, types: ['add'], ability: 'shed-skin', followerSpriteUrl: getFollowerSpriteUrl(706) } ], moveset: ['add-absorb', 'sub-dragon', 'mul-pulse', 'div-power'] }
};

export const LEGENDARIES: { [key: string]: LegendaryData } = {
    mewtwo: { id: 150, name: 'Mewtwo', hp: 250, types: ['mul'], ability: 'steadfast' }, 
    lugia: { id: 249, name: 'Lugia', hp: 260, types: ['div', 'add'], ability: 'steadfast' }, 
    rayquaza: { id: 384, name: 'Rayquaza', hp: 270, types: ['mul', 'div'], ability: 'steadfast' },
    groudon: { id: 383, name: 'Groudon', hp: 250, types: ['sub'], ability: 'sturdy' }, 
    kyogre: { id: 382, name: 'Kyogre', hp: 250, types: ['div'], ability: 'sturdy' }, 
    dialga: { id: 483, name: 'Dialga', hp: 260, types: ['mul', 'sub'], ability: 'sturdy' },
    palkia: { id: 484, name: 'Palkia', hp: 260, types: ['div', 'sub'], ability: 'sturdy' }, 
    giratina: { id: 487, name: 'Giratina', hp: 270, types: ['sub', 'add'], ability: 'levitate' }, 
    mew: { id: 151, name: 'Mew', hp: 300, types: ['add'], ability: 'steadfast' },
    arceus: { id: 493, name: 'Arceus', hp: 350, types: ['add'], ability: 'sturdy' }
};

export const ITEMS: { [id: string]: Item } = {
    'potion': { id: 'potion', name: 'Potion', description: 'Restores 50 HP.', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png' },
    'pokeball': { id: 'pokeball', name: 'Poké Ball', description: 'Used to capture wild MathMons.', spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
};

export const PLAYER_SPRITE_URL = 'https://raw.githubusercontent.com/msikma/pokesprite/master/graphics/sprites/trainers/red/firered-leafgreen/0.png';

export const ALL_TRAINERS: { [mapId: string]: { [trainerId: string]: Trainer } } = {
    'town': {
        'blue': {
            id: 'blue',
            spriteUrl: 'https://raw.githubusercontent.com/msikma/pokesprite/master/graphics/sprites/trainers/blue/firered-leafgreen/0.png',
            position: { x: 10, y: 4 },
            direction: 'down',
            sightRange: 4,
            dialogue: ["Hey! I'm Blue! I'm here to become the greatest MathMon trainer ever!"],
            defeatDialogue: ["Hmph! You're not half bad. But I'll be back stronger than ever!"],
            team: [{key: 'squirtle', level: 0}],
        },
        'gym_leader_1': {
            id: 'gym_leader_1',
            spriteUrl: 'https://raw.githubusercontent.com/msikma/pokesprite/master/graphics/sprites/trainers/brock/firered-leafgreen/0.png',
            position: { x: 4, y: 4 }, // This position is inside the gym, won't be seen on overworld
            direction: 'down',
            sightRange: 5,
            dialogue: ["Welcome to the Addition Arena! I'm Brock! Let's see if your skills add up!"],
            defeatDialogue: ["Wow, you're rock solid! Here, take the Boulder Badge!"],
            team: [{key: 'gible', level: 1}],
        }
    }
};

export const ALL_NPCS: { [mapId: string]: { [npcId: string]: NPC } } = {
    'town': {
        'blocker': {
            id: 'blocker',
            spriteUrl: 'https://raw.githubusercontent.com/msikma/pokesprite/master/graphics/sprites/trainers/officer-jenny/firered-leafgreen/0.png',
            position: { x: 17, y: 4 },
            direction: 'left',
            isBlocking: true,
            dialogue: ["The road ahead is for strong trainers only! Prove yourself by defeating the rival trainer, Blue, who is hanging out near the Gym."],
        },
        'gym_sign': {
            id: 'gym_sign',
            spriteUrl: 'https://raw.githubusercontent.com/msikma/pokesprite/master/graphics/sprites/trainers/gentleman/firered-leafgreen/0.png',
            position: { x: 8, y: 5 },
            direction: 'right',
            dialogue: ["This is the Addition Arena. Trainers enter through the door below."],
        },
        'isaac': {
            id: 'isaac',
            spriteUrl: 'https://i.imgur.com/nJAb0i2.png',
            position: { x: 4, y: 2 },
            direction: 'down',
            dialogue: ["Hi, I'm Isaac! It's cool exploring here!"],
        }
    },
    'route1': {}
};

export const READING_ADVENTURE: ReadingStageData[] = [
    { guide: { name: 'Jigglypuff', id: 39, hp: 30 }, quests: [{ s: ["A frog can ", " very high."], a: "jump", o: ["run", "jump", "fly"] }, { s: ["The sun is very ", " and yellow."], a: "bright", o: ["dark", "cold", "bright"] }, { s: ["You use a pencil to ", "."], a: "write", o: ["eat", "write", "sleep"] }] },
    { guide: { name: 'Clefairy', id: 35, hp: 30 }, quests: [{ s: ["A kitten is a baby ", "."], a: "cat", o: ["dog", "fish", "cat"] }, { s: ["The opposite of hot is ", "."], a: "cold", o: ["warm", "cold", "big"] }, { s: ["You sleep in a ", " at night."], a: "bed", o: ["car", "bed", "tree"] }] },
];

export const TRAINER_TITLES = [
    { wins: 0, title: "New Trainer" }, { wins: 3, title: "Rising Star" }, { wins: 7, title: "Math Challenger" },
    { wins: 12, title: "Elite Trainer" }, { wins: 15, title: "Math Champion" }
];

export const TILE_SIZE = 40;
export const ENCOUNTER_CHANCE = 0.15;

export const WORLD_MAPS_DATA: { [id: string]: WorldMapData } = {
    'town': { id: 'town', name: 'Starting Town' },
    'route1': { id: 'route1', name: 'Route 1' },
};

export const ALL_MAPS: { [id: string]: MapLayout } = {
    'town': [
        ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'P', 'P', 'P', 'W', 'W', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'T'],
        ['T', 'P', 'W', 'W', 'W', 'W', 'P', 'T', 'X', 'R', 'R', 'X', 'T', 'P', 'W', 'W', 'P', 'P', 'P', 'T'],
        ['T', 'P', 'P', 'P', 'W', 'W', 'P', 'T', 'X', 'R', 'R', 'X', 'T', 'P', 'W', 'W', 'P', 'P', 'P', 'T'],
        ['T', 'P', 'T', 'P', 'P', 'P', 'P', 'T', 'X', 'D', 'D', 'X', 'T', 'P', 'P', 'P', 'P', 'T', 'T', 'T'],
        ['T', 'P', 'T', 'T', 'T', 'P', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'P', 'T', 'T', 'P', 'P', 'P', 'E:route1:1,5'],
        ['T', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'T', 'T', 'T'],
        ['T', 'P', 'W', 'W', 'W', 'P', 'P', 'W', 'W', 'P', 'T', 'T', 'T', 'P', 'W', 'W', 'P', 'T', 'T', 'T'],
        ['T', 'P', 'W', 'W', 'W', 'P', 'P', 'W', 'W', 'P', 'T', 'P', 'P', 'P', 'W', 'W', 'P', 'T', 'T', 'T'],
        ['T', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'T', 'P', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],
    ],
    'route1': [
        ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],
        ['T', 'W', 'W', 'P', 'P', 'P', 'P', 'P', 'P', 'W', 'W', 'W', 'W', 'P', 'P', 'P', 'W', 'W', 'W', 'T'],
        ['T', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'W', 'T'],
        ['T', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'P', 'P', 'P', 'P', 'P', 'P', 'W', 'W', 'P', 'P', 'P', 'T'],
        ['T', 'P', 'P', 'P', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'P', 'W', 'W', 'T'],
        ['E:town:18,5', 'P', 'W', 'W', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'P', 'P', 'P', 'P', 'W', 'W', 'T'],
        ['T', 'P', 'P', 'P', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'P', 'W', 'W', 'T'],
        ['T', 'W', 'W', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'W', 'W', 'P', 'P', 'P', 'T'],
        ['T', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'W', 'T'],
        ['T', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'W', 'T'],
        ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T'],
    ],
};

export const ALL_ITEMS_ON_MAPS: { [mapId: string]: { [pos: string]: string } } = {
    'town': {
        '15,2': 'pokeball'
    },
    'route1': {
        '18,3': 'potion'
    }
};

export const ENCOUNTER_ZONES: { [mapId: string]: { [tileType: string]: { background: string, enemyPool: string[] } } } = {
    'town': {
        'W': { background: 'bg-grass', enemyPool: ['mareep', 'torchic'] },
    },
    'route1': {
        'W': { background: 'bg-cave', enemyPool: ['gible', 'rowlet', 'goomy'] }
    }
};