"use strict";
const clone = require("clone");

let leaguemon = { 
	// This is where all movesets are defined. Add new mons here.
	// Please define primary and alt mons together, with primaries first.
	// Please define non-user mons at the very bottom.
	
	/******* Template ******
	'Player Name': {
		leagues: ["lb", "lb+", "b"], //Leagues they can participate in.
		quotes: {  //Quote block is required
			SwitchIn: "I say this when I switch in!", //Required
			Faint: "raw|this prints raw to the battle output when I faint!", //Required
			SwitchOut: "Something to say when switching out.", //Optional
			// If a required quote is assigned a 0, a default message will not print for it.
		},
		species: "Houndoom", ability: "Dark Aura", item: "Dark Gem", gender: "M",
		moves: ['moonblast', 'hyperbeam', 'fireblast'], //Random moves that will be filled in
		signatureMove: 'darkfire', //Single move that this pokemon will alway have
		signatureMoves: ['fakeout', 'partingvoltturn'], //OR multiple moves this pokemon will always have
		evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
		megaability: 'darkaura', //Including this will ensure mega evolutions will have this ability
		onSwitchIn: function(pokemon) {}, //A function to run when switched in
		onSwitchOut: function(pokemon) {}, //A function to run when switched out
	},
	 */
	'darkfiregamer': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: "Houndoom", ability: "Dark Aura", item: "Dark Gem", gender: "M",
		moves: ['moonblast', 'hyperbeam', 'fireblast'],
		signatureMove: 'darkfire',
		evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
		megaability: 'darkaura',
	},
	'xfix': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "YayBot will be updated soon, okay?",
			Faint: "I'm not going to update YayBot if you defeat me like that...",
		},
		species: 'Xatu', ability: 'Mirror Guard', item: 'Focus Sash', gender: 'M',
		moves: ['thunderwave', 'substitute', 'roost'],
		signatureMove: 'superglitch',
		evs: {hp:252, spd:252, def:4}, nature: 'Calm',
	},
	'azum4roll': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "What? I'm just a normal Azumarill.",
			Faint: "This game doesn't have enough glitches!",
		},
		species: "Azumarill", ability: "Glitchiate", item: "Metronome", gender: 'M',
		moves: ['rollout', 'batonpass', 'swordsdance', 'bellydrum', 'extremespeed', 'playrough', 'thunderwave'],
		signatureMove: 'tm56',
		evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
	},
	"Lass zeowx": { // STPPLB+ only
		leagues: ["lb+", "b"],
		quotes: {
			SwitchIn: "Oh, a new challenger?",
			Faint: "When can I beat TPPLA BibleThump",
		},
		species: 'Liepard', ability: 'Protean', item: 'Focus Sash', gender: 'F',
		moves: ['suckerpunch', 'shadowsneak', 'bulletpunch', 'playrough', 'spikes', 'acrobatics'],
		signatureMoves: ['fakeout', 'partingvoltturn'],
		evs: {atk:252, spa:12, spe:244}, nature: 'Hasty',
	},
	'Iwamiger': { 
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: "Gengar", ability: 'Serene Grace Plus', item: "Life Orb", gender: 'M',
		moves: ['shadowball', 'flamethrower', 'icebeam', 'crunch'],
		signatureMove: 'hexattack',
		evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
	},
	'TieSoul': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: 'Aggron', ability: 'Super Protean', item: 'Membrane', gender: 'M',
		moves: ['playrough', 'firepunch', 'icepunch', 'thunderpunch', 'waterfall', 'heavyslam', 'stoneedge', 'nightslash', 'shadowclaw', 'earthquake', 'psychocut', 'dragonclaw', 'drillpeck', 'xscissor', 'poisonjab', 'brickbreak', 'leafblade', 'bodyslam'],
		signatureMove: 'typeroulette',
		evs: {hp:252, atk:252, spe:4}, nature: 'Adamant',
	},
	'BulkSoul': { // STPPLB+ only
		leagues: ["lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: 'Rhyperior', ability: 'Rock Head', item: 'Focus Sash', gender: 'M',
		moves: ['headsmash', 'autotomize', 'earthquake'],
		signatureMove: 'bulk',
		evs: {hp:252, def:252, spe:4}, nature: 'Impish',
	},
	"Soma Ghost": {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: 'Herdier', ability: 'Spoopify', item: 'Eviolite', gender: 'M',
		moves: ['playrough', 'swordsdance', 'substitute', 'return', 'crunch', 'superpower', 'pursuit'],
		signatureMove: 'shadowrush',
		evs: {atk:252, def:4, spe:252}, nature: 'Adamant',
		onSwitchIn: function(pokemon) {
			if (!pokemon.illusion) {
				this.add('-start', pokemon, 'typechange', 'Normal/Ghost');
				pokemon.types = ['Normal', 'Ghost'];
			}
		}
	},
	"Eeveelutionlvr": {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: 'Eevee', ability: 'Proteon', item: 'Eviolite', gender: 'M',
		moves: ['hydropump', 'flareblitz', 'thunderbolt', 'batonpass', 'nastyplot', 'dazzlinggleam', 'energyball', 'leechseed', 'blizzard', 'nightslash', 'psychic', 'hyperbeam'], // azum stop nagging about this moveset.
		signatureMove: 'evolutionbeam',
		evs: {spa:252, spe:252, hp:4}, nature: 'Timid',
	},
	'sohippy': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "Here I come WAHAHAHAHAHAHAHAHAHAHA! KAPOW",
			Faint: "The WAHAHA never dies! KAPOW",
		},
		species: 'Rotom-Wash', ability: 'Swahahahahaggers', item: 'Leftovers', gender: 'M',
		moves: ['scald', 'painsplit', 'destinybond', 'swagger', 'taunt', 'foulplay', 'hex', 'hydropump', 'electricterrain'],
		signatureMove: 'hyperwahahahahaha',
		evs: {hp:252, spa:252, spd:4}, nature: 'Modest',
	},
	'Kooma9': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "ello",
			Faint: "Most Disappointing Player 2015",
		},
		species: 'Blastoise-Mega', ability: 'Psychologist', item: 'Focus Sash', gender: 'M',
		moves: ['scald', 'roar', 'toxic'],
		signatureMove: 'disappointment',
		evs: {hp:252, def:252, spa:4}, nature: 'Bold',
	},
	"Kap'n Kooma": { // STPPLB+ only
		leagues: ["lb+", "b"],
		quotes: {
			SwitchIn: "Hoist the black flag lads!",
			Faint: "Avast! I be needing a pint of grog after this.",
		},
		species: 'Kingdra', ability: 'Sea and Sky', item: 'Choice Specs', gender: 'M',
		moves: ['scald', 'dracometeor', 'thunder'],
		signatureMove: 'broadside',
		evs: {hp:4, spa:252, spe:252}, nature: 'Modest',
	},
	'Poomph':{
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "I'm sure I'll win this time!",
			Faint: "0/4 again. DansGame",
		},
		species: "Ampharosmega", ability: "Little Engine", item: 'Life Orb', gender: 'M',
		moves: ['surf', 'powergem', 'detect', 'wish', 'nastyplot'],
		signatureMove: 'eternalstruggle',
		happiness: 0,
		evs: {hp:252, spa:252, def:4}, nature: 'Modest',
	},
	'Poomphcario': { // STPPLB+ only
		leagues: ["lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: "Lucario", ability: "Scrappy", item: 'Assault Vest', gender: 'M',
		moves: ['rockwrecker', 'megahorn', 'bulletpunch'],
		signatureMove: 'projectilespam',
		evs: {hp:4, atk:252, spe:252}, nature: 'Jolly',
	},
	'Pokson': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "You won't be able to beat me!",
			Faint: "Ech, fine, you Beat Me...",
		},
		species: 'Sharpedo', ability: 'Beat Misty', item: 'Misty Water', gender: 'M',
		moves: ['agility', 'aquajet', 'waterfall', 'crunch', 'icefang', 'raindance', 'brine', 'hydrocannon', 'bide', 'rage', 'endure'],
		signatureMove: 'beatingmist',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Hasty',
		megaability: 'beatmisty',
	},
	'Speedy Pokson': { // STPPLB+ only
		leagues: ["lb+", "b"],
		quotes: {
			SwitchIn: "YOU'RE TOO SLOW!",
			Faint: "C'MON, STEP IT UP!",
		},
		species: 'Deoxys-Speed', ability: 'Gotta Go Fast', item: 'Speed Shoes', gender: 'M',
		moves: ['flyingpress', 'leafblade', 'watershuriken', 'mysticalfire', 'aurasphere', 'spikyshield', 'rapidspin'],
		signatureMoves: ['spindash', 'boost'],
		evs: {spe: 252, atk: 252, hp: 4}, nature: 'Hasty',
	},
	'BigFatMantis': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "gldhf",
			Faint: ["GGioz", "GGCtrl27"],
		},
		species: "Scyther", shiny: true, ability: "Dictator", item: 'Eviolite', gender: 'M',
		moves: ['bravebird', 'aerialace', 'swordsdance', 'roost', 'xscissor', 'knockoff', 'earthquake'],
		signatureMove: 'nofun',
		evs: {hp:216, atk:40, spe:252}, nature: 'Jolly',
	},
	'NoFunMantis':{ // STPPLB+ only
		leagues: ["lb+", "b"],
		quotes: {
			SwitchIn: "gldhf",
			Faint: ["GGioz", "GGCtrl27"],
		},
		species: "Scyther", ability: "No Fun Allowed", item: 'Eviolite', gender: 'M',
		moves: ['knockoff', 'brickbreak', 'aerialace', 'swordsdance', 'agility', 'batonpass', 'roost'],
		signatureMove: 'xscissor',
		evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
	},
	'DictatorMantis': { // STPPLB+ only
		leagues: ["lb+", "b"],
		quotes: {
			SwitchIn: "Do you even have enough yays to be battling?",
			Faint: "bg DansGame",
		},
		species: 'Scizor', ability: 'Technicality', item: 'Occa Berry', gender: 'M',
		moves: ['barrier', 'craftyshield', 'trick', 'block', 'disable', 'stickyweb', 'embargo', 'quash', 'taunt', 'knockoff', 'bulletpunch'],
		signatureMove: 'ironfist',
		evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
		megaability: 'Technicality',
	},
	'MegaCharizard': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: 'Charizard', ability: 'Truant', item: 'Charizardite Y', gender: 'M',
		moves: ['airslash', 'earthpower', 'roost', 'slackoff', 'flamethrower'],
		signatureMove: 'afk',
		evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
	},
	'Natsugan': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "Flygonite when",
			Faint: "hax imo",
		},
		species: 'Flygon', ability: 'Mega Plunder', gender: 'M',
		item: randomMegaStone,
		moves: ['earthquake', 'earthpower', 'uturn', 'dragonclaw', 'fireblast', 'boomburst', 'dragonpulse', 'return', 'stoneedge', 'crunch', 'ironhead', 'dragondance', 'quiverdance'],
		signatureMove: 'reroll',
		evs: {hp:88, atk: 84, def: 84, spa: 84, spd: 84, spe: 84}, nature: 'Serious',
	},
	'GroundCtrl27': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: 'Meloetta', ability: 'Scrappy', item: 'Assault Vest', gender: 'M',
		moves: ['hypervoice', 'psyshock', 'sneakyspook'],
		signatureMoves: ['shadowsphere', 'drainforce'],
		evs: {hp: 248, spa: 252, spe: 8}, nature: 'Modest',
	},
	'Whatevs4': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: 'Sneasel', ability: 'Technician', item: 'Dark Gem', gender: 'F',
		moves: ['aerialace', 'stormthrow', 'thief'],
		signatureMove: 'arcticslash',
		evs: {atk: 252, hp: 4, spe: 252}, nature: 'Jolly',
	},
	'WhatevsFur': { // STPPLB+ only
		leagues: ["lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: 'Ursaring', ability: 'Furrier Coat', item: 'Leftovers', gender: 'F',
		moves: ['earthquake', 'drainpunch'],
		signatureMoves: ['wish', 'aromatherapy', 'bulkup'],
		evs: {hp: 252, def: 168, spd: 88}, nature: 'Calm',
	},
	'PikalaxALT': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "ヽ༼ຈل͜ຈ༽ﾉ RIOT ヽ༼ຈل͜ຈ༽ﾉ",
			Faint: "Wow Deku OneHand",
		},
		species: 'Pikachu', ability: 'Pika Power', item: 'Light Ball', gender: 'M',
		moves: ['thunder', 'thunderbolt', 'quickattack', 'voltswitch', 'irontail'],
		signatureMove: 'toucan',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Hasty',
		onSwitchIn: function(pokemon) {
			this.boost({def:1, spd:1}, pokemon);
		}
	},
	'Tadpole_0f_Doom': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "I'm not racist. I own Pokemon Black. TriHard",
			Faint: "You'll never take me alive!",
		},
		species: 'Poliwrath', ability: 'Ban Evade', item: 'BrightPowder', gender: 'M',
		moves: ['closecombat', 'waterfall', 'icepunch', 'endure', 'bellydrum'],
		signatureMove: 'thousandalts',
		evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant',
	},
	'MihiraTheTiger': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: 'Mamoswine', ability: 'Technician', item: 'Leftovers', gender: 'M',
		moves: ['iceshard', 'stealthrock'],
		signatureMoves: ['yiffyiff', 'bawk'],
		evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
	},
	'HazorEx': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: 'Alakazam', ability: 'Physicalakazam', item: 'Alakazite', gender: 'M',
		moves: ['firepunch', 'thunderpunch', 'icepunch', 'drainpunch', 'megapunch', 'endure'],
		signatureMove: 'psychocut',
		evs: {atk: 252, spe: 252, hp: 4}, nature: 'Adamant',
		megaability: 'physicalakazam',
	},
	'Leonys': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: 'Flareon', ability: 'Incinerate', item: 'Choice Band', gender: 'M',
		moves: ['volttackle', 'drillrun', 'irontail', 'revenge', 'pursuit', 'zenheadbutt'],
		signatureMoves: ['quickattack', 'doubleedge'],
		evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
	},
	'Xinc': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "Iwa took Gengar. DansGame",
			Faint: "Bruh",
		},
		species: 'Bisharp', ability: 'Defiant Plus', item: 'Leftovers', gender: 'M',
		moves: ['knockoff', 'drainpunch', 'ironhead', 'suckerpunch', 'bulletpunch'],
		signatureMove: 'ganonssword',
		evs: {hp: 200, atk: 252, spe: 56}, nature: 'Adamant',
	},
	'Abyll': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: 'Milotic', ability: 'Silver Scale', item: 'Lunchabylls', gender: 'M',
		moves: ['dragontail', 'mirrorcoat', 'icebeam', 'recover'],
		signatureMoves: ['rainbowspray'],
		evs: {hp: 252, def: 252, spdef: 4}, nature: 'Sassy',
	},
	'Trollkitten': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "Have time to listen to my lore?",
			Faint: "I need time away from the sub to clear my head after this.",
		},
		species: 'Mew', ability: 'No Guard', item: 'Eject Button', gender: 'M',
		moves: ['recover', 'echoedvoice'],
		signatureMoves: ['drama', 'loratory'],
		evs: {hp: 252, def: 128, spd: 128}, nature: 'Modest',
	},
	'Cerebral_Harlot': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "Yo.",
			SwitchOut: "See ya.",
			Faint: 0, //Exempted, uses a SwitchOut message
		},
		species: 'Mismagius', ability: 'Herald of Death', item: 'Murky Incense', gender: 'M',
		moves: [],
		signatureMoves: ['wailofthebanshee', 'witchscurse', 'foxfire', 'spectralincantation'],
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Timid',
		onSwitchIn: function(pokemon) {
			if (!pokemon.illusion) {
				this.add('-start', pokemon, 'typechange', 'Ghost/Fairy');
				pokemon.types = ['Ghost', 'Fairy'];
			}
		}
	},
	'ColeWalski': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "Allons-y and GERONIMOOO!",
			Faint: "Dced again",
		},
		species: 'Empoleon', ability: 'Sniper', item: 'Scope Lens', gender: 'M',
		moves: ['hydropump', 'flashcannon'],
		signatureMoves: ['setmine', 'locknload', 'assassinate'],
		evs: {hp: 252, spa: 252, spe: 4}, nature: 'Modest',
		ivs: {atk: 0},
	},
	'Lorewriter Cole': { // STPPLB+ only
		leagues: ["lb+", "b"],
		quotes: {
			SwitchIn: "I fight this battle in the name of the gods of TPP!",
			Faint: "Dammit, mental block, I have no idea how to continue this story...",
		},
		species: 'Relicanth', ability: 'Invocation', item: 'Leftovers', gender: 'M',
		moves: ['stealthrock', 'stoneedge', 'toxic', 'earthpower', 'ancientpower'],
		signatureMove: 'godswrath',
		evs: {hp: 252, atk: 84, spa: 84, spe: 88}, nature: 'Serious',
	},
	'Liria_10': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "let's draw all night!",
			Faint: "why is art so difficult ;_;",
		},
		species: 'Roserade', ability: 'Drawing Request', item: 'Black Sludge', gender: 'F',
		moves: ['gigadrain', 'leechseed', 'sleeppowder', 'sludgebomb', 'spikes', 'toxicspikes', 'aromatherapy', 'synthesis'],
		signatureMove: 'quicksketch',
		evs: {hp: 252, spd: 240, spe: 16}, nature: 'Calm',
		ivs: {atk: 0},
	},
	'Lyca': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: 'Absol', ability: 'Jack(y) of All Trades', item: 'Scope Lens', gender: 'F',
		moves: ['nightslash', 'slash', 'psychocut', 'shadowclaw', 'playrough', 'knockoff'],
		signatureMoves: ['quityourbullshit', 'keepcalmandfocus'],
		evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant',
		megaability: 'jackyofalltrades',
	},
	"masterleozangetsu": {
		leagues: [], //This pokemon is missing and not valid, and thus participates in no leagues
		quotes: {
			SwitchIn: "Sup o/",
			Faint: "I didn't want to win anyways, was gonna forfeit",
		},
		// Pokemon specs needed
	},
	
	'BEST': { // STPPB only
		leagues: ["b"],
		quotes: {
			SwitchIn: "raw|<big>GO AWAY</big>",
			Faint: "raw|<big>BEST? FALLED</big>",
		},
		species: 'Typhlosion', ability: 'Technician', item: 'Life Orb', gender: 'M',
		moves: ['waterpulse', 'hiddenpowerice', 'shockwave'],
		ivs: {atk:30, def:30}, // in order for HP Ice to be a thing.
		signatureMove: 'bestfcar',
		evs: {spa:252, def:4, spe:252}, nature: 'Modest',
	},
	'Bird Jesus': { //STPPB only
		leagues: ["b"],
		quotes: {
			SwitchIn: undefined,
			Faint: undefined,
		},
		species: 'Pidgeot', ability: 'Messiah', item: 'Flying Gem', gender: 'M',
		moves: ['judgment', 'focusblast', 'roost', 'fireblast'],
		signatureMove: 'godbird',
		evs: {spa:252, def:4, spe:252}, nature: 'Timid',
	},
};

// Mon definition Support functions
function randomMegaStone() {
	let megaStoneList = ['Abomasite', 'Absolite', 'Aerodactylite', 'Aggronite',
		'Alakazite','Altarianite','Ampharosite','Audinite','Banettite','Beedrillite',
		'Blastoisinite','Blazikenite','Cameruptite','Charizardite X','Charizardite Y',
		'Diancite','Galladite','Garchompite','Gardevoirite','Gengarite','Glalitite',
		'Gyaradosite','Heracronite','Houndoominite','Kangaskhanite','Latiasite',
		'Latiosite','Lopunnite','Lucarionite','Manectite','Mawilite','Medichamite',
		'Metagrossite','Mewtwonite X','Mewtwonite Y','Pidgeotite','Pinsirite',
		'Sablenite','Salamencite','Sceptilite','Scizorite','Sharpedonite',
		'Slowbronite','Steelixite','Swampertite','Tyranitarite','Venusaurite',
		'Red Orb','Blue Orb',
	];
	return megaStoneList[this.random(megaStoneList.length)];
}


exports.BattleScripts = {
	fastPop: function(list, index) {
		// If an array doesn't need to be in order, replacing the
		// element at the given index with the removed element
		// is much, much faster than using list.splice(index, 1).
		let length = list.length;
		let element = list[index];
		list[index] = list[length - 1];
		list.pop();
		return element;
	},
	sampleNoReplace: function(list) {
		// The cute code to sample no replace is:
		//   return list.splice(this.random(length), 1)[0];
		// However manually removing the element is twice as fast.
		// In fact, we don't even need to keep the array in order, so
		// we just replace the removed element with the last element.
		let length = list.length;
		let index = this.random(length);
		return this.fastPop(list, index);
	},
	chooseTeamFor: function(league) {
		let team = [];
		
		let pool = Object.keys(leaguemon);
		for (let i = 0; i < 6; i++) {
			let name = this.sampleNoReplace(pool);
			let set = clone(leaguemon[name]);
			set.name = name;
			if (!set.leagues.includes(league)) { i--; continue; } //try again
			this.prepareTPPMonSet(set);
			team.push(set);
		}
		return team;
	},
	prepareTPPMonSet: function(set) {
		set.level = 100;
		if (typeof set.item == "function") set.item = set.item.call(this);
		if (!set.ivs) {
			set.ivs = {hp:31, atk:31, def:31, spa:31, spd:31, spe:31};
		} else {
			for (let iv in {hp:31, atk:31, def:31, spa:31, spd:31, spe:31}) {
				set.ivs[iv] = iv in set.ivs ? set.ivs[iv] : 31;
			}
		}
		// Assuming the hardcoded set evs are all legal.
		if (!set.evs) set.evs = {hp:84, atk:84, def:84, spa:84, spd:84, spe:84};
		if (set.signatureMove) set.signatureMoves = [set.signatureMove];
		let len = set.signatureMoves.length;
		let moves = set.signatureMoves;
		for (let j = 0; j < 4 - len; j++) {
			moves = [this.sampleNoReplace(set.moves)].concat(moves);
		}
		set.moves = moves;
	},
	
	sayQuote: function(pokemon, event, defQuote) {
		let name = pokemon.illusion ? pokemon.illusion.name : pokemon.name;
		if (!pokemon.set.quotes) {
			this.add(`raw|<div class="chat message-error">Invalid Pokemon definition! ${name} has no quotes object!</div>`);
		} else {
			let quote = pokemon.set.quotes[event];
			if (!quote) {
				// Only the SwitchIn and Faint messages are required
				// 0 is used as an exemption.
				if ((event == "SwitchIn" || event === "Faint") && quote !== 0)
					this.add(`c|${name}|[PLACEHOLDER MESSAGE]`);
				if (!defQuote) return;
				quote = defQuote;
			}
			if (Array.isArray(quote)) {
				quote = quote[this.random(quote.length)];
			}
			
			if (quote.includes('|')) {
				return this.add(quote);
			} else {
				return this.add(`c|${name}|${quote}`);
			}
		}
	},
	
	randomtpplbTeam: function (side) {
		return this.chooseTeamFor("lb");
	},
	randomtpplbpTeam: function (side) {
		return this.chooseTeamFor("lb+");
	},
	randomtppbTeam: function (side) {
		return this.chooseTeamFor("b");
	},
	
	// Copied from /data/scripts.js, and modified
	getTeam: function (side, team) {
		const format = this.getFormat();
		const teamGenerator = typeof format.team === 'string' && format.team.startsWith('random') ? format.team + 'Team' : '';
		if (!teamGenerator && team) { //CHANGES START HERE
			// If we have a team already, we can replace the team based on name matching
			for (let i = 0; i < team.length; i++) {
				let name = team[i].name;
				if (leaguemon[name]) { //If we have a mon by that name, replace
					this.debug(`Found matching TPP mon by the name ${name}! Replacing with set!`);
					// Copied from chooseTeamFor
					let set = clone(leaguemon[name]);
					set.name = name;
					this.prepareTPPMonSet(set);
					team[i] = set;
				}
			}
			return team; //CHANGES END HERE
		} else {
			// Reinitialize the RNG seed to create random teams.
			this.startingSeed = this.startingSeed.concat(this.generateSeed());
			team = this[teamGenerator || 'randomTeam'](side);
			// Restore the default seed
			this.seed = this.startingSeed.slice(0, 4);
			return team;
		}
	},

	// Mix and Mega stuff
	init: function () {
		let onTakeMegaStone = function (item) {
			return false;
		};
		for (let id in this.data.Items) {
			if (!this.data.Items[id].megaStone) continue;
			this.modData('Items', id).onTakeItem = onTakeMegaStone;
		}
	},
	canMegaEvo: function (pokemon) {
		if (pokemon.template.isMega || pokemon.template.isPrimal) return false;

		let item = pokemon.getItem();
		if (item.megaStone) {
			if (item.megaStone === pokemon.species) return false;
			return item.megaStone;
		} else if (pokemon.set.moves.indexOf('dragonascent') >= 0) {
			return 'Rayquaza-Mega';
		} else {
			return false;
		}
	},
	runMegaEvo: function (pokemon) {
		if (pokemon.template.isMega || pokemon.template.isPrimal) return false;
		let template = this.getMixedTemplate(pokemon.originalSpecies, pokemon.canMegaEvo);
		let side = pokemon.side;

		// Pokémon affected by Sky Drop cannot Mega Evolve. Enforce it here for now.
		let foeActive = side.foe.active;
		for (let i = 0; i < foeActive.length; i++) {
			if (foeActive[i].volatiles['skydrop'] && foeActive[i].volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		pokemon.formeChange(template);
		pokemon.baseTemplate = template; // Mega Evolution is permanent

		// Do we have a proper sprite for it?
		if (this.getTemplate(pokemon.canMegaEvo).baseSpecies === pokemon.originalSpecies) {
			pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
			this.add('detailschange', pokemon, pokemon.details);
			this.add('-mega', pokemon, template.baseSpecies, template.requiredItem);
		} else {
			let oTemplate = this.getTemplate(pokemon.originalSpecies);
			let oMegaTemplate = this.getTemplate(template.originalMega);
			if (template.originalMega === 'Rayquaza-Mega') {
				this.add('message', "" + pokemon.side.name + "'s fervent wish has reached " + pokemon.species + "!");
			} else {
				this.add('message', "" + pokemon.species + "'s " + pokemon.getItem().name + " is reacting to " + pokemon.side.name + "'s Mega Bracelet!");
			}
			this.add('-formechange', pokemon, oTemplate.species, template.requiredItem);
			this.add('message', template.baseSpecies + " has Mega Evolved into Mega " + template.baseSpecies + "!");
			this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			if (oTemplate.types.length !== pokemon.template.types.length || oTemplate.types[1] !== pokemon.template.types[1]) {
				this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
			}
		}
		
		let newAbility = ((pokemon.set) ? pokemon.set.megaability : undefined) || template.abilities['0'];
		if (newAbility !== pokemon.getAbility().id) {
			pokemon.setAbility(newAbility);
			pokemon.baseAbility = pokemon.ability;
		}
		this.add('-ability', pokemon, this.getAbility(newAbility), '[from] shutup client', '[silent]');
		pokemon.canMegaEvo = false;
		return true;
	},
	getMixedTemplate: function (originalSpecies, megaSpecies) {
		let originalTemplate = this.getTemplate(originalSpecies);
		let megaTemplate = this.getTemplate(megaSpecies);
		if (originalTemplate.baseSpecies === megaTemplate.baseSpecies) return megaTemplate;
		let deltas = this.getMegaDeltas(megaTemplate);
		let template = this.doGetMixedTemplate(originalTemplate, deltas);
		return template;
	},
	getMegaDeltas: function (megaTemplate) {
		let baseTemplate = this.getTemplate(megaTemplate.baseSpecies);
		let deltas = {
			ability: megaTemplate.abilities['0'],
			baseStats: {},
			weightkg: megaTemplate.weightkg - baseTemplate.weightkg,
			originalMega: megaTemplate.species,
			requiredItem: megaTemplate.requiredItem,
		};
		for (let statId in megaTemplate.baseStats) {
			deltas.baseStats[statId] = megaTemplate.baseStats[statId] - baseTemplate.baseStats[statId];
		}
		if (megaTemplate.types.length > baseTemplate.types.length) {
			deltas.type = megaTemplate.types[1];
		} else if (megaTemplate.types.length < baseTemplate.types.length) {
			deltas.type = baseTemplate.types[0];
		} else if (megaTemplate.types[1] !== baseTemplate.types[1]) {
			deltas.type = megaTemplate.types[1];
		}
		if (megaTemplate.isMega) deltas.isMega = true;
		if (megaTemplate.isPrimal) deltas.isPrimal = true;
		return deltas;
	},
	doGetMixedTemplate: function (template, deltas) {
		if (!deltas) throw new TypeError("Must specify deltas!");
		if (!template || typeof template === 'string') template = this.getTemplate(template);
		template = Object.assign({}, template);
		template.abilities = {'0': deltas.ability};
		if (template.types[0] === deltas.type) {
			template.types = [deltas.type];
		} else if (deltas.type) {
			template.types = [template.types[0], deltas.type];
		}
		let baseStats = template.baseStats;
		template.baseStats = {};
		for (let statName in baseStats) {
			template.baseStats[statName] = this.clampIntRange(baseStats[statName] + deltas.baseStats[statName], 1, 255);
		}
		template.weightkg = Math.max(0.1, template.weightkg + deltas.weightkg);
		template.originalMega = deltas.originalMega;
		template.requiredItem = deltas.requiredItem;
		if (deltas.isMega) template.isMega = true;
		if (deltas.isPrimal) template.isPrimal = true;
		return template;
	},
	
};
