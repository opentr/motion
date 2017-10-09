export const SOCIAL_STREAM = [
  "Facebook",
  "Twitter",
  "Instagram",
  "Twitch",
  "Youtube",
  "Smashcast"
];

//TODO this is hardcoded
// either move to database this options or leave like this
export const GAMES_LIST = [
  {
    id: 6,
    name: "Clash Royale",
    logo: "/images/games/logos/logo-clashroyale.png",
    cover: "/images/games/cards/clash-royale-popup-cover.jpg",
    miniCover: "/images/games/cards/clash-royale-mini-cover.jpg",
    oneStep: true
  },
  {
    id: 2,
    name: "DOTA2",
    logo: "/images/games/logos/logo-dota.png",
    cover: "/images/games/cards/dota2-popup-cover.jpg",
    miniCover: "/images/games/cards/dota2-mini-cover.jpg",
    steam: true
  },
  {
    id: 5,
    name: "FIFA",
    logo: "/images/games/logos/logo-fifa.png",
    cover: "/images/games/cards/fifa-popup-cover.jpg",
    miniCover: "/images/games/cards/fifa-mini-cover.jpg",
    oneStep: true
  },
  {
    id: 4,
    name: "Hearthstone",
    logo: "/images/games/logos/logo-hearthstone.png",
    cover: "/images/games/cards/hearthstone-popup-cover.jpg",
    miniCover: "/images/games/cards/hearthstone-mini-cover.jpg",
    oneStep: true
  },
  {
    id: 1,
    name: "League of Legends",
    logo: "/images/games/logos/logo-lol.png",
    cover: "/images/games/cards/league-of-legends-popup-cover.jpg",
    miniCover: "/images/games/cards/league-of-legends-mini-cover.jpg"
  },
  {
    id: 3,
    name: "Overwatch",
    logo: "/images/games/logos/logo-overwatch.png",
    cover: "/images/games/cards/overwatch-popup-cover.jpg",
    miniCover: "/images/games/cards/overwatch-mini-cover.jpg",
    oneStep: true
  }
];

export const BLACK_IMG_B64 =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";

// export const MATCH_STATUS = [
//   "CANNOT_START",
//   "CAN_CHECK_IN",
//   "STARTED",
//   "FINISHED"
// ];

//Input validation
export const SERVER_CODES = {
  V001: { code: "V001", message: "JSON validation failed" },

  //Database
  D001: { code: "D001", message: "database error" },
  D002: { code: "D002", message: "query failed" },
  D003: { code: "D003", message: "stored procedure failed" },
  D004: { code: "D004", message: "stored procedure has no result" },
  D005: { code: "D005", message: "query with unexpected return" },

  //Tournaments
  T001: { code: "T001", message: "tournament type unrecognized" },
  T002: { code: "T002", message: "tournament matches are created" },
  T003: { code: "T003", message: "tournament application not available" },
  T004: { code: "T004", message: "tournament full" },
  T005: { code: "T005", message: "not enough points for entry" },
  T006: { code: "T006", message: "wrong password" },
  T007: { code: "T007", message: "successfully joined" },
  T008: { code: "T008", message: "already joined" },
  T009: { code: "T009", message: "tournament does not exist" },
  T010: {
    code: "T010",
    message: "tournament status is invalid for this action"
  },
  T011: { code: "T011", message: "match winner confirmed" },
  T012: {
    code: "T012",
    message: "not enough participants to start tournament"
  },
  T013: {
    code: "T013",
    message: "cannot delete tournament when participants joined"
  },
  T014: { code: "T014", message: "tournament deleted" },
  T015: { code: "T015", message: "participant left tournament" },
  T016: { code: "T016", message: "organizer cannot join" },

  //Profiles

  P001: { code: "P010", message: "no profile found" },
  P010: { code: "P010", message: "no game account" },
  P011: { code: "P011", message: "league of legends account not verified" },
  P012: { code: "P012", message: "request to Riot API failed" },
  P013: { code: "P013", message: "did not find verification code" },

  //General
  G001: { code: "G001", message: "no results" }
};
