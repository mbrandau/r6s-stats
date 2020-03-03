const generalOperatorStatistics = [
    "operatorpvp_roundlost",
    "operatorpvp_death",
    "operatorpvp_roundwon",
    "operatorpvp_kills",
    "operatorpvp_death",
    "operatorpvp_timeplayed"
];
const generalStatistics = [
    'generalpvp_timeplayed',
    'generalpvp_matchplayed',
    'generalpvp_killassists',
    'generalpvp_revive',
    'generalpvp_headshot',
    'generalpvp_penetrationkills',
    'generalpvp_meleekills',
    'generalpvp_matchwon',
    'generalpvp_matchlost',
    'generalpvp_kills',
    'generalpvp_death',
    'generalpvp_bullethit',
    'generalpvp_bulletfired'];
const secureAreaStatistics = [
    'secureareapvp_matchwon',
    'secureareapvp_matchlost',
    'secureareapvp_matchplayed',
    'secureareapvp_bestscore'];
const rescueHostageStatistics = [
    'rescuehostagepvp_matchwon',
    'rescuehostagepvp_matchlost',
    'rescuehostagepvp_matchplayed',
    'rescuehostagepvp_bestscore'];
const plantBombStatistics = [
    'plantbombpvp_matchwon',
    'plantbombpvp_matchlost',
    'plantbombpvp_matchplayed',
    'plantbombpvp_bestscore'];
const casualStatistics = [
    'casualpvp_timeplayed',
    'casualpvp_matchwon',
    'casualpvp_matchlost',
    'casualpvp_matchplayed',
    'casualpvp_kills',
    'casualpvp_death'];
const rankedStatistics = [
    'rankedpvp_matchwon',
    'rankedpvp_matchlost',
    'rankedpvp_timeplayed',
    'rankedpvp_matchplayed',
    'rankedpvp_kills',
    'rankedpvp_death'];

const allStatistics = [
    ...generalOperatorStatistics,
    ...generalStatistics,
    ...secureAreaStatistics,
    ...rescueHostageStatistics,
    ...plantBombStatistics,
    ...casualStatistics,
    ...rankedStatistics
];

const operatorOrganisations = {
    "zofia": {name: "Zofia", organisation: "GROM"},
    "castle": {name: "Castle", organisation: "FBI SWAT"},
    "jager": {name: "Jäger", organisation: "GSG 9"},
    "vigil": {name: "Vigil", organisation: "SMB"},
    "sledge": {name: "Sledge", organisation: "SAS"},
    "echo": {name: "Echo", organisation: "SAT"},
    "fuze": {name: "Fuze", organisation: "Spetnaz"},
    "thermite": {name: "Thermite", organisation: "FBI SWAT"},
    "blackbeard": {name: "Blackbeard", organisation: "Navy Seal"},
    "buck": {name: "Buck", organisation: "JTF2"},
    "frost": {name: "Frost", organisation: "JTF2"},
    "caveira": {name: "Caveira", organisation: "Bope"},
    "ela": {name: "Ela", organisation: "GROM"},
    "capitao": {name: "Capitão", organisation: "BOPE"},
    "hibana": {name: "Hibana", organisation: "SAT"},
    "thatcher": {name: "Thatcher", organisation: "SAS"},
    "tachanka": {name: "Tachanka", organisation: "Spetnaz"},
    "kapkan": {name: "Kapkan", organisation: "Spetnaz"},
    "twitch": {name: "Twitch", organisation: "GIGN"},
    "bandit": {name: "Bandit", organisation: "GSG 9"},
    "dokkaebi": {name: "Dokkaebi", organisation: "SMB"},
    "smoke": {name: "Smoke", organisation: "SAS"},
    "iq": {name: "IQ", organisation: "GSG 9"},
    "mute": {name: "Mute", organisation: "SAS"},
    "alibi": {name: "Alibi", organisation: "GIS"},
    "rook": {name: "Rook", organisation: "GIGN"},
    "jackal": {name: "Jackal", organisation: "GEO"},
    "lion": {name: "Lion", organisation: "CBRN"},
    "glaz": {name: "Glaz", organisation: "Spetnaz"},
    "finka": {name: "Finka", organisation: "CBRN"},
    "valkyrie": {name: "Valkyrie", organisation: "Navy Seal"},
    "ying": {name: "Ying", organisation: "SDU"},
    "blitz": {name: "Blitz", organisation: "GSG 9"},
    "ash": {name: "Ash", organisation: "FBI SWAT"},
    "mira": {name: "Mira", organisation: "GEO"},
    "pulse": {name: "Pulse", organisation: "FBI SWAT"},
    "doc": {name: "Doc", organisation: "GIGN"},
    "montagne": {name: "Montagne", organisation: "GIGN"},
    "maestro": {name: "Maestro", organisation: "GIS"},
    "lesion": {name: "Lesion", organisation: "SDU"},
    "maverick": {name: "Maverick", organisation: "GSUTR"},
    "clash": {name: "Clash", organisation: "GSUTR"},
    "nomad": {name: "Nomad", organisation: "GIGR"},
    "kaid": {name: "Kaid", organisation: "GIGR"},
    "mozzie": {name: "Mozzie", organisation: "SASR"},
    "gridlock": {name: "Gridlock", organisation: "SASR"},
    "nokk": {name: "NØKK", organisation: "JGK"},
    "nakk": {name: "NØKK", organisation: "JGK"},
    "warden": {name: "Warden", organisation: "USSS"},
    "goyo": {name: "Goyo", organisation: "FES"},
    "amaru": {name: "Amaru", organisation: "APCA"},
    "kali": {name: "Kali", organisation: "NIGHTHAVEN"},
    "wamai": {name: "Wamai", organisation: "NIGHTHAVEN"},
    "oryx": {name: "Oryx", organisation: "UNAFFILIATED"},
    "iana": {name: "Iana", organisation: "REU"}
};

module.exports = {
    generalOperatorStatistics,
    generalStatistics,
    secureAreaStatistics,
    rescueHostageStatistics,
    plantBombStatistics,
    casualStatistics,
    rankedStatistics,
    allStatistics,
    operatorOrganisations,
};