export const GBA_ATLAS={
  "GRASS": "assets/gba_plus_pack_v2/grass.png",
  "GRASS_F": "assets/gba_plus_pack_v2/grass_f.png",
  "W_TALL": "assets/gba_plus_pack_v2/w_tall.png",
  "DIRT": "assets/gba_plus_pack_v2/dirt.png",
  "DIRT_N": "assets/gba_plus_pack_v2/dirt_n.png",
  "DIRT_S": "assets/gba_plus_pack_v2/dirt_s.png",
  "DIRT_W": "assets/gba_plus_pack_v2/dirt_w.png",
  "DIRT_E": "assets/gba_plus_pack_v2/dirt_e.png",
  "WATER_0": "assets/gba_plus_pack_v2/water_0.png",
  "WATER_1": "assets/gba_plus_pack_v2/water_1.png",
  "WATER_2": "assets/gba_plus_pack_v2/water_2.png",
  "SHORE_N": "assets/gba_plus_pack_v2/shore_n.png",
  "SHORE_S": "assets/gba_plus_pack_v2/shore_s.png",
  "SHORE_W": "assets/gba_plus_pack_v2/shore_w.png",
  "SHORE_E": "assets/gba_plus_pack_v2/shore_e.png",
  "SHORE_OUT_UL": "assets/gba_plus_pack_v2/shore_out_ul.png",
  "SHORE_OUT_UR": "assets/gba_plus_pack_v2/shore_out_ur.png",
  "SHORE_OUT_DL": "assets/gba_plus_pack_v2/shore_out_dl.png",
  "SHORE_OUT_DR": "assets/gba_plus_pack_v2/shore_out_dr.png",
  "SHORE_IN_UL": "assets/gba_plus_pack_v2/shore_in_ul.png",
  "SHORE_IN_UR": "assets/gba_plus_pack_v2/shore_in_ur.png",
  "SHORE_IN_DL": "assets/gba_plus_pack_v2/shore_in_dl.png",
  "SHORE_IN_DR": "assets/gba_plus_pack_v2/shore_in_dr.png",
  "CLIFF_TOP": "assets/gba_plus_pack_v2/cliff_top.png",
  "CLIFF_FACE": "assets/gba_plus_pack_v2/cliff_face.png",
  "CLIFF_W": "assets/gba_plus_pack_v2/cliff_w.png",
  "CLIFF_E": "assets/gba_plus_pack_v2/cliff_e.png",
  "CLIFF_N": "assets/gba_plus_pack_v2/cliff_n.png",
  "CLIFF_S": "assets/gba_plus_pack_v2/cliff_s.png",
  "CLIFF_OUT_UL": "assets/gba_plus_pack_v2/cliff_out_ul.png",
  "CLIFF_OUT_UR": "assets/gba_plus_pack_v2/cliff_out_ur.png",
  "CLIFF_OUT_DL": "assets/gba_plus_pack_v2/cliff_out_dl.png",
  "CLIFF_OUT_DR": "assets/gba_plus_pack_v2/cliff_out_dr.png",
  "CLIFF_IN_UL": "assets/gba_plus_pack_v2/cliff_in_ul.png",
  "CLIFF_IN_UR": "assets/gba_plus_pack_v2/cliff_in_ur.png",
  "CLIFF_IN_DL": "assets/gba_plus_pack_v2/cliff_in_dl.png",
  "CLIFF_IN_DR": "assets/gba_plus_pack_v2/cliff_in_dr.png",
  "TREE_ROUND": "assets/gba_plus_pack_v2/tree_round.png",
  "BUSH": "assets/gba_plus_pack_v2/bush.png",
  "ROCK": "assets/gba_plus_pack_v2/rock.png",
  "BRIDGE": "assets/gba_plus_pack_v2/bridge.png",
  "WALL_PLAIN": "assets/gba_plus_pack_v2/wall_plain.png",
  "WALL_PINK": "assets/gba_plus_pack_v2/wall_pink.png",
  "ROOF_RED": "assets/gba_plus_pack_v2/roof_red.png",
  "ROOF_BLUE": "assets/gba_plus_pack_v2/roof_blue.png",
  "WINDOW": "assets/gba_plus_pack_v2/window.png",
  "DOOR": "assets/gba_plus_pack_v2/door.png",
  "SIGN_GYM": "assets/gba_plus_pack_v2/sign_gym.png",
  "SIGN_POK": "assets/gba_plus_pack_v2/sign_pok.png",
  "SIGN_MART": "assets/gba_plus_pack_v2/sign_mart.png"
} as const;
export const GBA_BLOCKING=new Set<string>(["TREE_ROUND", "BUSH", "ROCK", "WALL_PLAIN", "WALL_PINK", "CLIFF_FACE", "CLIFF_W", "CLIFF_E", "CLIFF_N", "CLIFF_S", "CLIFF_OUT_UL", "CLIFF_OUT_UR", "CLIFF_OUT_DL", "CLIFF_OUT_DR"]);
export const GBA_AUTOTILE={
  "water": {
    "frames": [
      "WATER_0",
      "WATER_1",
      "WATER_2"
    ],
    "edges": [
      "SHORE_N",
      "SHORE_S",
      "SHORE_W",
      "SHORE_E"
    ],
    "corners_out": [
      "SHORE_OUT_UL",
      "SHORE_OUT_UR",
      "SHORE_OUT_DL",
      "SHORE_OUT_DR"
    ],
    "corners_in": [
      "SHORE_IN_UL",
      "SHORE_IN_UR",
      "SHORE_IN_DL",
      "SHORE_IN_DR"
    ]
  },
  "cliff": {
    "tops": [
      "CLIFF_TOP"
    ],
    "edges": [
      "CLIFF_N",
      "CLIFF_S",
      "CLIFF_W",
      "CLIFF_E"
    ],
    "corners_out": [
      "CLIFF_OUT_UL",
      "CLIFF_OUT_UR",
      "CLIFF_OUT_DL",
      "CLIFF_OUT_DR"
    ],
    "corners_in": [
      "CLIFF_IN_UL",
      "CLIFF_IN_UR",
      "CLIFF_IN_DL",
      "CLIFF_IN_DR"
    ]
  },
  "dirt_path": {
    "base": "DIRT",
    "edges": [
      "DIRT_N",
      "DIRT_S",
      "DIRT_W",
      "DIRT_E"
    ]
  }
} as const;
export const GBA_DEFAULT_MAP={'GRASS':'GRASS','GRASS_F':'GRASS_F','W':'W_TALL','PATH_B':'DIRT','PATH_ET':'DIRT_N','PATH_EB':'DIRT_S','PATH_EL':'DIRT_W','PATH_ER':'DIRT_E','~':'WATER_0','CLIFF':'CLIFF_FACE','FENCE':'BUSH','SP':'SIGN_GYM','BLDG_W':'WALL_PINK','BLDG_R':'ROOF_RED','BLDG_WD':'WINDOW','BLDG_D':'DOOR','B':'BRIDGE'} as const;