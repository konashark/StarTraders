var st = {				// Generic global variables
	canvas: null,
	WIDTH: 1024,
	HEIGHT: 600,
	TWOPI: Math.PI*2,
	RADUNIT: (Math.PI*2)/360,
	clock: new THREE.Clock(),
	controls: null,
	systems: [],
	curSystem: null,
	curSystemIndex: 0,
	SYS_WIDTH: 20000,
	LRS_WIDTH: 500,
    LRS_HEIGHT: 500,
	SRS_WIDTH: 180,
	SRS_HEIGHT: 200,
    COMPUTER_WIDTH: 500,
    COMPUTER_HEIGHT: 500
};

var flight = {			// Globals for Flight mode
	scene: null,
	camera: null,
	renderer: null,
	skybox: null,
	srScanner: {
		img: null,
		canvas:null,
		ctx:null,
		texture:null,
		sprite:null
	},
	pulses: {
		pulse: [],
		throttle: 0,
		pulseMaterial: null
	}
};

var tPulse = {
	mesh: null,
	distance: 0,
	active: false
};

var tSystem = {			// Describes a System
	obj: [],			// Objects in system (array)
	planet: false,
	moon: false,
	starbase: false,
	derelict: false,
    asteroids: 0,
	police: 0,
	pirates: 0
};

var WEALTH = {
    POOR: 0,
    NORMAL: 1,
    RICH: 2
};

var ECONOMY = {
    AGRICULTURE: 0,
    TECHNOLOGY: 1,
    INDUSTRY: 2,
    MINING: 3
};

var AGGRESSION = {
    PEACEFUL: 0,
    NORMAL: 1,
    AGGRESSIVE: 2
};

var tPlanet = {
	animFunc: null,
	material: null,
	mesh: null,
	rotY: 0,
	rotYv: 0,
    sector: { x: 0, y:0 },
    name: "unknown",
    wealth: 0,
    economy: 0,
    aggression: 0,
    commodities: []
};

var STATUS = {
    OK: 0,
    OFFMARKET: 1,
    OUTLAWED: 2
};

var tCommodities = [];

tCommodities['Food'] = {
    name: "Food",
    weight: 3,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    status: STATUS.OK
};
tCommodities['Textiles'] = {
    name: "Textiles",
    weight: 3,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    status: STATUS.OK
};
tCommodities['Machinery'] = {
    name: "Machinery",
    weight: 30,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    status: STATUS.OK
};
tCommodities['Energy'] = {
    name: "Energy",
    weight: 20,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    status: STATUS.OK
};
tCommodities['Luxuries'] = {
    name: "Luxuries",
    weight: 3,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    status: STATUS.OK
};
tCommodities['Medicine'] = {
    name: "Medicine",
    weight: 4,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    status: STATUS.OK
};
tCommodities['Computers'] = {
    name: "Computers",
    weight: 20,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    status: STATUS.OK
};
tCommodities['Metals'] = {
    name: "Metals",
    weight: 1000,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    status: STATUS.OK
};
tCommodities['Gems'] = {
    name: "Gems",
    weight: 1,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    status: STATUS.OK
};
tCommodities['Livestock'] = {
    name: "Livestock",
    weight: 500,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    status: STATUS.OK
};
tCommodities['Robots'] = {
    name: "Robots",
    weight: 200,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    status: STATUS.OK
};
tCommodities['Contraband'] = {
    name: "Contraband",
    weight: 15,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    status: STATUS.OUTLAWED
};
tCommodities['Weapons'] = {
    name: "Weapons",
    weight: 20,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    status: STATUS.OUTLAWED
};
tCommodities['Classified Data'] = {
    name: "Classified Data",
    weight: 2,
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
    status: STATUS.OUTLAWED
};


// Starbase
//      General Repairs: 100 credits per percentage unit
//      Energy Recharge: 1 credit per 10 units
//      Upgrades
var tUpgrades = [
    {
        name: "Stardrive II",
        desc: "Increase maximum impulse speed from 6 to 9.",
        price: 35000
    },
    {
        name: "Jumpdrive II",
        desc: "Increase hyperjump range from 4 to 8 sectors.",
        price: 25000
    },
    {
        name: "Long Range Scanner II",
        desc: "Increased scan data from surrounding sectors.",
        price: 17500
    },
    {
        name: "Probe",
        desc: "Provides detailed data about surrounding star systems.",
        price: 2000
    },
    {
        name: "Nav Computer",
        desc: "More accurate hyperjumps, auto-docking.",
        price: 17500
    },
    {
        name: "Homing Torpedo",
        desc: "Provides more destructive force than pulse weapons.",
        price: 1250
    },
    {
        name: "Torpedo Bay",
        desc: "Increase torpedo complement from 8 to 16.",
        price: 12500
    },
    {
        name: "Pulse Capacitor",
        desc: "Decrease pulse weapon recycle time.",
        price: 10000
    },
    {
        name: "Enhanced Hull Plating",
        desc: "Doubles hull strength.",
        price: 7500
    },
    {
        name: "High Capacity Shields",
        desc: "Doubles shield strength.",
        price: 22500
    },
    {
        name: "Cargo Module I",
        desc: "Increases cargo capacity from 1500 to 2500.",
        price: 20000
    },
    {
        name: "Cargo Module II",
        desc: "Increases cargo capacity from 2500 to 3500.",
        price: 30000
    }
];

var tShip = {
	animFunc: null,
	material: null,
	mesh: null,

    shipName: "Seeker",
    captainName: "Harrison",

    energy: 9999,
    shields: 100,
    hull: 100,
    damage: 0,
    probes: 1,
    torpedoes: 2,
    cargo: 0,
    reputation: 0,  // -10 -> +10

    // Upgrades
    hasStardrive: false,
    hasLRS: false,
    hasNavComputer: false,
    maxTorpedoes: 8,
    cargoCapacity: 1500,
    hasExtendedJump: false,
    hasShields: false,
    hasHullPlating: false,
    hasPulseCapacitor: false
};

var tMoon = {
    animFunc: null,
    material: null,
    mesh: null,
    planet: null,
    x: 0,
    y: 0,
    z: 0,
    orbitDist: 0,
    orbitRad: 0,
    orbitVel: 0
};

var tStarbase = {
	animFunc: null,
	material: null,
	mesh: null,
    commodities: []
};

var tDerelict = {
    animFunc: null,
    material: null,
    mesh: null,
    commodities: []
};

var planetNames = [
    "Achilles",
    "Adleron",
    "Agroba",
    "Alexandra",
    "Alpha Centauri",
    "Altair",
    "Ambrosia",
    "Amphibia",
    "Andora",
    "Angelica",
    "Apollo",
    "Aqualine",
    "Archimedes",
    "Archon",
    "Arcturus",
    "Arial",
    "Aries",
    "Asimov",
    "Aspiration",
    "Astra",
    "Athena",
    "Atlantia",
    "Atreides",
    "Aurora",
    "Australius",
    "Avalon",
    "Barnaby's Outpost",
    "Barracuda",
    "Bartholemew",
    "Bella",
    "Bocceli",
    "Bootes",
    "Borealis",
    "Borrega",
    "Borrellis",
    "Bower's Station",
    "Cabella",
    "Caldera",
    "Caledonia",
    "Camaro",
    "Camden's Outpost",
    "Canton",
    "Cantooine",
    "Cantor",
    "Caron",
    "Carson",
    "Cassiopeia",
    "Centaur",
    "Cepheus",
    "Ceti",
    "Cetus",
    "Challenge",
    "Charm",
    "Christon",
    "Clarke",
    "Copernicus",
    "Cora",
    "Cordelon",
    "Corona",
    "Coronado",
    "Coronation",
    "Correllis",
    "Correlon",
    "Corrinda",
    "Corsica",
    "Cortez",
    "Corvette",
    "Corvus",
    "Cozeron",
    "Cristobol",
    "Cromium",
    "Cronus",
    "Cruces",
    "Crystal",
    "Curie",
    "Curtiz",
    "Cygnus",
    "Daphne",
    "Darwin",
    "Dawson",
    "Daystrom",
    "Debogan",
    "Debt",
    "Delacruz",
    "Delaney",
    "Delta",
    "Descartes",
    "Destiny",
    "Dhalia",
    "Diana",
    "Diemos",
    "Disappointment",
    "Domicile",
    "Dorado",
    "Dorella",
    "Dorian",
    "Dorie",
    "Draco",
    "Dragon",
    "Ducal",
    "Dulan",
    "Durango",
    "Eccentricita",
    "Ecclestone",
    "Eclipse",
    "Edison",
    "El Dorado",
    "Elan",
    "Eloria",
    "Emata",
    "Ephron",
    "Epsilon",
    "Eridani",
    "Eros",
    "Escape",
    "Estrella",
    "Eureka",
    "Expedition",
    "Farnhold's Outpost",
    "Faust",
    "Felicity",
    "Ferris",
    "Fidelity",
    "FIero",
    "Folley",
    "Forrestia",
    "Futility",
    "Galileo",
    "Gallifray",
    "Gardner's World",
    "Garelick's Outpost",
    "Garner's",
    "Garotte",
    "Gemini",
    "Genova",
    "Germania",
    "Grace",
    "Gravitas",
    "Greysons",
    "Grimsby",
    "Gypsy",
    "Habit",
    "Habitat",
    "Hades",
    "Hadron",
    "Hakone",
    "Halo",
    "Hammerhead",
    "Hana",
    "Harm",
    "Harmony",
    "Harper's Planet",
    "Hath",
    "Haven",
    "Hawking",
    "Helene",
    "Hellsgate",
    "Hollandia",
    "Home",
    "Hoopla",
    "Hope",
    "Horizon",
    "Hubris",
    "Hydra",
    "Hydrus",
    "Icarus",
    "Inferno",
    "Infinion",
    "Inspiration",
    "Intent",
    "Isbon",
    "Island",
    "Ivanova",
    "Jackobi",
    "Jade",
    "Jamieson",
    "Janus",
    "Jayne",
    "Jesper",
    "Jonah",
    "Jovia",
    "Jubilee",
    "Judah",
    "Jules",
    "Jynx",
    "Kara",
    "Kiln",
    "Knightley",
    "Krell",
    "Lamarche",
    "Lantern",
    "Lathe",
    "Lennit",
    "Lepus",
    "Libra",
    "Lindsay",
    "Lucinda",
    "Lusitania",
    "Lynx",
    "Lyra",
    "Madison",
    "Mako",
    "Maltan",
    "Mandela",
    "Marcus",
    "Marina",
    "Marion",
    "Mariposa",
    "Marius",
    "Maurier",
    "McKenna's World",
    "Media",
    "Melody",
    "Merrick",
    "Millenium",
    "Mimic",
    "Minearo",
    "Minotaur",
    "Minuet",
    "Mira",
    "Miranda",
    "Misery",
    "Moffat's World",
    "Mondial",
    "Monoceros",
    "Monotony",
    "Monsoon",
    "Montague",
    "Montalvo",
    "Mournful",
    "Muse",
    "Mystery",
    "Mythos",
    "Namesake",
    "Narada",
    "Nellis",
    "New California",
    "New Cardiff",
    "New Essex",
    "New Sydney",
    "Newton",
    "Nigel",
    "Night",
    "Nikola",
    "Nirvana",
    "Noctura",
    "Nordams",
    "Nova",
    "Nuance",
    "Oasis",
    "Occupation",
    "Oceana",
    "Omega",
    "Omen",
    "Omicron",
    "Onjero",
    "Oracle",
    "Orion",
    "Ouanda",
    "Pacifica",
    "Pangea",
    "Panthea",
    "Paradise",
    "Pearson",
    "Pegasus",
    "Perkins World",
    "Perseus",
    "Phaeton",
    "Phantom",
    "Pharaoh",
    "Phobos",
    "Phoenix",
    "Pike",
    "Pinnacle",
    "Piper",
    "Planitia",
    "Pride",
    "Primus",
    "Prometheus",
    "Promise",
    "Prospect",
    "Prosperity",
    "Province",
    "Quake",
    "Quatros",
    "Quinlan",
    "Quintalla",
    "Raleigh",
    "Regulus",
    "Remus",
    "Rendezvous",
    "Reward",
    "Rieza",
    "Rigel",
    "Romanov",
    "Romulus",
    "Rose",
    "Rubicon",
    "Sabrosa",
    "Sacrament",
    "Sagan",
    "Sahara",
    "Saltana",
    "Santiago",
    "Saren",
    "Sarnoff's Planet",
    "Savage",
    "Savanna",
    "Scarlet",
    "Scorpio",
    "Second Guess",
    "Sedonia",
    "Sepulcher",
    "Serenity",
    "Shepherd",
    "Sherman's Outpost",
    "Shockley",
    "Sienna",
    "Sirius",
    "Slate",
    "Smithson",
    "Solara",
    "Solomon",
    "Solon",
    "Sondra",
    "Sonia",
    "Sparta",
    "Spirit",
    "Splendid Deliverance",
    "Sprague’s Station",
    "Star's End",
    "Summer",
    "Sunderland",
    "Sunzeri",
    "Sure Thing",
    "Talos",
    "Tantor",
    "Taurus",
    "Tennant Station",
    "Terminus",
    "Terra Nova",
    "Tescanus",
    "Tesla",
    "Testament",
    "Titan",
    "Tjong",
    "Tobin's Planet",
    "Torch",
    "Tork",
    "Tornado",
    "Tortuga",
    "Trelaine",
    "Tribute",
    "Trinity",
    "Trio",
    "Triton",
    "Turmoil",
    "Unada",
    "Vampire",
    "Vega",
    "Venture",
    "Verity",
    "Vermilion",
    "Virgo",
    "Vulcan",
    "Walden",
    "Walker's Roundabout",
    "Wastelandia",
    "Wegner's World",
    "Wick",
    "Wiggin",
    "Wilder",
    "Yamata",
    "Zeff",
    "Zenith",
    "Zeus",
    "Zion II"
];
var planetCreated = [];



