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
		signatureMoves: ['fakeout', 'partingvoltturn'], // moves this pokemon will always have
		evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
		megaability: 'darkaura', //Including this will ensure mega evolutions will have this ability
		onSwitchIn: function(pokemon) {}, //A function to run when switched in
		onSwitchOut: function(pokemon) {}, //A function to run when switched out
		forceMega: false, //A mega pokemon to always force as able to mega evolve into, or false to block all mega evolving.
		attract: {F:1}, //An override on how attract affects this pokemon. M = Male, F = Female, U = Genderless
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
		signatureMoves: ['darkfire'],
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
			FirstTime: "What? I'm just a normal Azumarill.",
			SwitchIn: "What? I'm still a normal Azu̴maͅrill.",
			Faint: "This game doesn't have enough glitches!",
			Victory: "metronome op",
			"Move-bellydrum": "G R TriHard TriHard D",
		},
		species: "Azumarill", ability: "Glitchiate", item: "Metronome", gender: 'M',
		moves: ['rollout', 'batonpass', 'swordsdance', 'bellydrum', 'extremespeed', 'playrough', 'thunderwave'],
		signatureMove: 'tm56',
		evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
	},
	"Lass zeowx": { // STPPLB+ only
		leagues: ["lb+", "b"],
		quotes: {
			FirstTime: "Oh, a new challenger?",
			SwitchIn: "I'm determined!",
			Faint: "When can I beat TPPLA BibleThump",
			Victory: "I win! Oh wait this isn't TPPLA DansGame",
			"Move-partingvoltturn": "I'm getting outta here! Byeeeee~",
		},
		species: 'Liepard', ability: 'Protean', item: 'Focus Sash', gender: 'F',
		moves: ['suckerpunch', 'shadowsneak', 'bulletpunch', 'playrough', 'spikes', 'acrobatics'],
		signatureMoves: ['fakeout', 'partingvoltturn'],
		evs: {atk:252, spa:8, spe:248}, nature: 'Hasty',
	},
	'Iwamiger': { 
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "good old human road blocks",
			Faint: "such is life",
		},
		species: "Gengar", ability: 'Serene Grace Plus', item: "Life Orb", gender: 'M',
		moves: ['shadowball', 'flamethrower', 'icebeam', 'crunch'],
		signatureMove: 'hexattack',
		evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
	},
	'TieSoul': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "PLACEHOLDER MESSAGE PLEASE CONTACT TIESOUL",
			Faint: "literally unusable",
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
			FirstTime: "I'm a ghost. Boogidy Boo!",
			SwitchIn: "Just Soma Ghost passing thr-oh crap, wrong line!",
			SwitchOut: "I bet you switched your spoopy ghost out first, you TriHard.",
			Faint: "You do know you can't kill ghosts, right? I just lowered my HP because I didn't want to be rude.",
			CriticalHit: "RNG did a thing. Nice.",
			Victory: "Shadow Rush GG",
		},
		species: 'Herdier', ability: 'Spoopify', item: 'Eviolite', gender: 'M',
		moves: ['playrough', 'swordsdance', 'substitute', 'return', 'crunch', 'superpower', 'pursuit'],
		signatureMove: 'shadowrush',
		evs: {atk:252, def:4, spe:252}, nature: 'Adamant',
		onSwitchIn: function(pokemon) {
			if (!pokemon.illusion) {
				this.add('-start', pokemon, 'typechange', 'Normal/Ghost', '[silent]');
				pokemon.types = ['Normal', 'Ghost'];
			}
		}
	},
	"Some Goats": { // STPPLB+ only
		leagues: ["lb+", "b"],
		quotes: {
			FirstTime: "Nothing to see here. Just Some Goats passing through.",
			SwitchIn: "On my way to get your goat!",
			SwitchOut: "Gotta Gogoat Fast!",
			Faint: "BAHHHD GAME!",
			CriticalHit: "One of them had to eventually.",
			Victory: "Tell Rolf I said hi.",
		},
		species: 'Gogoat', ability: 'Summon Goats', item: 'Goat of Arms', gender: 'M',
		moves: ['earthquake', 'rockslide', 'aerialace', 'brickbreak', 'zenheadbutt', 'irontail', 'bulldoze', 'bulkup', 'milkdrink'],
		signatureMoves: ['gigahornbreak', 'goatflu'],
		evs: {hp:252, spd:216, spe:40}, nature: 'Careful',
		// https://www.reddit.com/r/TPPLeague/comments/4tvc1r/submit_newold_stpplb_mons_here/d72bs8j/
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
		signatureMoves: ['eternalstruggle'],
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
		signatureMoves: ['projectilespam'],
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
	},
	'Pokson': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "You won't be able to beat me!",
			Faint: "Ech, fine, you Beat Me...",
		},
		species: 'Sharpedo', ability: 'Beat Misty', item: 'Misty Water', gender: 'M',
		moves: ['agility', 'aquajet', 'waterfall', 'crunch', 'icefang', 'raindance', 'brine', 'hydrocannon', 'bide', 'rage', 'endure'],
		signatureMoves: ['beatingmist'],
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
			Faint: ["GGioz", "GGCtrl27", "GGoats"],
		},
		species: "Scyther", shiny: true, ability: "Dictator", item: 'Eviolite', gender: 'M',
		moves: ['bravebird', 'aerialace', 'swordsdance', 'roost', 'xscissor', 'knockoff', 'earthquake'],
		signatureMoves: ['nofun'],
		evs: {hp: 216, atk: 40, spe: 252}, nature: 'Jolly',
	},
	'NoFunMantis':{ // STPPLB+ only
		leagues: ["lb+", "b"],
		quotes: {
			SwitchIn: "No fun allowed!",
			Faint: ["GGioz", "GGCtrl27", "GGoats"],
		},
		species: "Scyther", ability: "No Fun Allowed", item: 'Eviolite', gender: 'M',
		moves: ['knockoff', 'brickbreak', 'aerialace', 'swordsdance', 'agility', 'batonpass', 'roost'],
		signatureMoves: ['xscissor'],
		evs: {atk: 252, def: 4, spe: 252}, nature: 'Adamant',
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
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant',
		megaability: 'Technicality',
	},
	'MegaCharizard': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "o/",
			Faint: "rip the dream",
		},
		species: 'Charizard', ability: 'Truant', item: 'Charizardite Y', gender: 'M',
		moves: ['airslash', 'earthpower', 'roost', 'slackoff', 'flamethrower'],
		signatureMove: 'afk',
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Timid',
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
		evs: {hp: 252, atk: 84, spa: 84, spe: 88}, nature: 'Hardy', // TriHard
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
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
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
			"Move-explosion": "KAPOW",
			"Move-selfdestruct": "KAPOW",
		},
		species: 'Pikachu', ability: 'Pika Power', item: 'Light Ball', gender: 'M',
		moves: ['thunder', 'thunderbolt', 'quickattack', 'voltswitch', 'irontail'],
		signatureMove: 'toucan',
		evs: {spa: 252, spd: 4, spe: 252}, nature: 'Hasty',
		onSwitchIn: function(pokemon) {
			this.boost({def: 1, spd: 1}, pokemon);
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
		signatureMoves: ['thousandalts'],
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
			SwitchIn: "New Meta",
			Faint: "Bulkymence DansGame",
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
			"Move-ganonssword": "Don't get too hasty, boy! TriHard",
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
			"Move-loratory": [
				"There's a chance that OLDEN is still alive, though weakened.",
				"My headcanon is that Bill saving Abe in Anniversary Red...",
				"OLDEN fled from Evan and Paul because it didn't trust them.",
				"I'm not saying I believe it is or not; that's something I'm not ready to make a personal headcanon decision on yet.",
				"My current headcanon is that MoonFlash...",
				"On that note: what do you think his full name is? Because 'KKK' can't be his 'true' name.",
				"Some people are saying that we've 'forced lore,' but my take on it...",
			],
			"Move-drama": [
				"I'm just saying that we don't need to spend multiple posts repeating the same statement to each other.",
				"You seem to have misinterpreted some of what I was trying to communicate.",
				"And, quite frankly, it's quite tiring for me to even talk to you. I am not exaggerating. I am literally feeling physically drained from this conversation.",
				"As far as I'm concerned, your sour attitude is only hurting your case.",
				"I think it's quite clearly a matter of personal taste.",
				"I would rather not have this argument with you on account that I have no desire to argue on the matter. We have different viewpoints on this; let's just accept that and move on. Okay?",
			],
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
			"Move-locknload": "Say hello to Becky and Betsy!",
			"Move-assassinate": "Bye!",
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
			"Move-abstartselect": "ANARCHY, BITCH!",
			"Move-wait4baba": "The time for democracy's rise is here, motherf***er!",
			"Move-balancedstrike": "Time to untip the scales!",
			"Move-texttospeech": "I shall smite thee with potatoes of doom! WHEEEEEE",
			"Move-holyducttapeofclaw": "...",
			"Move-warecho": "As the great Sun Tzu once said, every battle is won before it is fought!",
			"Move-skullsmash": "Do you feel lucky, punk?",
			"Move-danceriot": "Are you not entertained?",
			"Move-bluescreenofdeath": "They call me the goddess of Death for a reason!",
			"Move-portaltospaaaaaaace": "The laws of space are mine to command and they WILL OBEY ME!",
			"Move-doubleascent": "I see a humiliating defeat in your future!",
		},
		species: 'Relicanth', ability: 'Invocation', item: 'Leftovers', gender: 'M',
		moves: ['stealthrock', 'stoneedge', 'toxic', 'earthpower', 'ancientpower'],
		signatureMoves: ['godswrath'],
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
		signatureMoves: ['quicksketch'],
		evs: {hp: 252, spd: 240, spe: 16}, nature: 'Calm',
		ivs: {atk: 0},
	},
	'Lyca': {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			FirstTime: "Lets see for how long I can greed.",
			SwitchIn: "Another chance to greed?",
			SwitchOut: "Nope.",
			Faint: "Story of my life ;-;",
			"Move-quityourbullshit": "Seriously.",
		},
		species: 'Absol', ability: 'Jack(y) of All Trades', item: 'Scope Lens', gender: 'F',
		moves: ['nightslash', 'slash', 'psychocut', 'shadowclaw', 'playrough', 'knockoff'],
		signatureMoves: ['quityourbullshit', 'keepcalmandfocus'],
		evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant',
		megaability: 'jackyofalltrades',
	},
	"Coryn216": {
		leagues: ["lb", "lb+", "b"],
		quotes: {
			SwitchIn: "o/",
			Faint: "o7",
		},
		species: "Lapras", ability: "Slick Ice", item: "Leftovers", gender: "M",
		moves: ['dragonpulse', 'recover', 'icebeam', 'surf', 'muddywater', 'dragonbreath', 'slackoff'],
		signatureMoves: ['freezedry', 'absolutezero'],
		evs: {hp: 216, def: 252, spa: 40}, nature: "Bold",
		// https://www.reddit.com/r/TPPLeague/comments/4tvc1r/submit_newold_stpplb_mons_here/d5podgs/
	},
	"MasterLeoZangetsu": { // First Mon
		leagues: ['lb', 'lb+', 'b'], 
		quotes: {
			SwitchIn: "Sup o/, free to proctor?",
			Faint: "gg no re",
		},
		species: 'Charizard-Mega-X', ability: 'SpeedRunner', item: 'Z-Sash', gender: 'M',
		moves: ['extremespeed', 'bulldoze', 'dragonrush', 'roost', 'dualchop', 'swordsdance', 'dragondance', 'honeclaws', 'bite'],
		signatureMoves: ['huntingforproctors', 'poweraboose'],
		evs: {hp: 12, atk: 252, spe: 244}, nature: 'Adamant',
		// http://pastebin.com/ZLgNhMR9
	},
	"Redwings1340": { // First Mon
		leagues: ['lb', 'lb+', 'b'],
		quotes: {
			SwitchIn: "Quick pokemon battle before rp?",
			Faint: "That was fun. I'm going to rp now.",
		},
		species: "Articuno", ability: 'Mediator', item: 'Leftovers', gender: 'M',
		moves: ['freezedry', 'blizzard', 'hurricane', 'substitute', 'roost', 'protect'],
		signatureMoves: ['dramareduction'],
		evs: {hp: 252, def: 4, spd: 252}, nature: 'Calm',
		// https://www.reddit.com/r/TPPLeague/comments/4tvc1r/submit_newold_stpplb_mons_here/d5tckcz/
	},
	
	'BEST': { // STPPB only
		leagues: ["b"],
		quotes: {
			SwitchIn: "raw|<big>GO AWAY</big>",
			Faint: "raw|<big>BEST? FALLED</big>",
		},
		species: 'Typhlosion', ability: 'Technician', item: 'Life Orb', gender: 'M',
		moves: ['waterpulse', 'hiddenpowerice', 'shockwave'],
		ivs: {atk: 30, def: 30}, // in order for HP Ice to be a thing.
		signatureMoves: ['bestfcar'],
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Modest',
	},
	'Bird Jesus': { //STPPB only
		leagues: ["b"],
		quotes: {
			SwitchIn: "PraiseIt Praise Helix! PraiseIt",
			Faint: "Should have used pocket sand...",
		},
		species: 'Pidgeot', ability: 'Messiah', item: 'Flying Gem', gender: 'M',
		moves: ['judgment', 'focusblast', 'roost', 'fireblast'],
		signatureMoves: ['godbird'],
		evs: {def: 4, spa: 252, spe: 252}, nature: 'Timid',
	},
	
	////////////////////////////////////////////////////////////////////////////
	// Pending Submission Queue - https://redd.it/4tvc1r
	//--------------------------------------------------------------------------
	// Take from the top, work your way down. SeemsGood
	// These Pokemon are incomplete, and thus participate in no leagues.
	// They must have a "leagues" property to not crash things, but it is empty, 
	// so they are not selected.
	// When a pokemon is complete, fill in the leagues and move it to where 
	// appropriate above.
	
	"Mozilla Fennekin": {
		leagues: [],
		quotes: {
			SwitchIn: "Tuturu!",
			Faint: `|raw|<img src="https://i.imgur.com/blKyr6E.png" style="width: 200px;" />`, // "<-To-be-continued--",
		},
		// https://www.reddit.com/r/TPPLeague/comments/4tvc1r/submit_newold_stpplb_mons_here/d98zyne/
	},
	"Gilbert": {
		leagues: [],
		quotes: {
			SwitchIn: "Hello, world!",
			Faint: "I was finally learning to love...",
		},
		// https://www.reddit.com/r/TPPLeague/comments/4tvc1r/submit_newold_stpplb_mons_here/d9bjst9/
	},
	"Burrito": {
		leagues: [],
		quotes: {
			SwitchIn: "Hello there... <3",
			Attract: "Oh, you are so cute! <3 VoHiYo",
			CriticalHit: "Ow! What was that for?! BibleThump",
			Faint: "All I wanted to do was spread the love... BibleThump",
			"Move-operationlovebomb": "<3 VoHiYo <3 Go out and spread the love! <3 VoHiYo <3"
		},
		species: 'Espeon', ability: 'No Love Lost', item: 'Full Heal', gender: 'M',
		moves: ['morningsun', 'flash', 'psychic', 'dazzlinggleam', 'shadowball'],
		signatureMoves: ['operationlovebomb'],
		evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
		attract: {M:1, F:1, U:1}, // pan, also allowing all Attract through to trigger No Love Lost
	},
	"tustin2121": { // First Mon
		leagues: [],
		quotes: {
			// Put quotes to the limit \o/
			FirstTime: "I'm not very good at this whole competitive thing...",
			SwitchIn: "Alright, time to try again.",
			Victory: "Holy crap, that actually worked!",
			Faint: ["I need to get back to work anyway.", "Told you I suck at this..."],
			"Move-afk-1": "brb",
			"Move-afk-2": "b",
			"Move-bluescreenofdeath": "Ctrl+Alt+DELETE!!",
			"Move-operationlovebomb": "<3 Quilava! <3",
			"Move-coderefactor": [
				"showdown's code is so fucking dense that it's impossible to decipher half the time", 
				"does this hunk of junk not have any crash protection?! SwiftRage", 
				"it wouldn't be complicated, rather it would touch a lot of code",
				"BrokeBack, maybe we shouldn't have so many FUCKING FILES CALLED CONFIG! SwiftRage", 
				"we need to trim back the server's branches. There no need to have so many",
				`Smogon: "CONSISTENCY?! WHAT IS THAT?! BrokeBack"`
			],
			"Ability-cheatcode": [
				"Time to exploit that.", 
				"I have no skill in this, so I need to cheat to win.", 
				"Don't mind me, just doing stuff!"
			],
		},
		
		species: 'Typhlosion', ability: 'Cheat Code', item: 'Reinforced Glass', gender: 'M',
		moves: ['fusionflare', 'energyball', 'eruption'],
		signatureMoves: ['coderefactor'],
		attract: {M:1}, forceMega: false, // Never Mega Evolve (usually as a result of using a signiture move)
		evs: {atk:252, def:4, spe:252}, nature: 'Timid', ivs: {atk:0},
		onBegin : function(pkmn) {
			pkmn.details = "Quilava, M";
		},
		// baseStats: {hp: 78, atk: 84, def: 78, spa: 109, spd: 85, spe: 100}, //Typhlosion stats
		// Quilava (with base power of a Typhlosion)
		// Item: Reinforced Glass | If the holder is hit with a super effective move, that move is nullified, and this item breaks. Single Use.
		// Ability:
		// Cheat Code | Upon switch in, and at the end of every turn, this pokemon aquires two new signiture moves, appended onto its movepool. One of the moves is from the opponent's set of signiture moves, and the other is a random "god" move. Upon using one of these moves, this pokemon loses the move. This ability cannot add more than four extra moves.
		// When the ability activates, the move prints out something random in a fake /evalbattle call response (though the information is real). It can print out the opponent's types, the opponent's ability (which will then be revealed to the client), the current hp of the opponent, the last move in the moveset (which is basically always the signiture move). The quote then comes after it.
		// >>> this.p1.active[0].types
		// <<< [Fire,Flying]
		// tustin2121: Time to exploit that.
		//
		// Signiture Moves:
		// Code Refactor | Special | Fire-Type | Power: 15 | Accuracy: 100% | PP: 15 | Hits 2-5 times | each hit doubles the power of the next hit. 10% chance to raise accuracy by 1 each hit. Says quotes about how horrible code is.
		
		
	}
	
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
	
	sayQuote: function(pokemon, event, opts) {
		opts = opts || {};
		if (typeof opts == "string") opts = {"default":opts};
		
		let name = pokemon.illusion ? pokemon.illusion.name : pokemon.name;
		if (!pokemon.set.quotes) {
			this.add(`error|Invalid Pokemon definition! ${name} has no quotes object!`);
			pokemon.set.quotes = {}; //Temporarily fix the problem.
		}
		
		let quote = pokemon.set.quotes[event];
		if (event == "SwitchIn" && pokemon.set.quotes["FirstTime"]) {
			quote = pokemon.set.quotes["FirstTime"];
			pokemon.set.quotes["FirstTime"] = null;
		}
		if (!quote) {
			// Only the SwitchIn and Faint messages are required
			// 0 is used as an exemption.
			if ((event == "SwitchIn" || event === "Faint") && quote !== 0 && !opts.default)
				this.add(`bchat|${name}|[PLACEHOLDER MESSAGE]`);
			if (!opts.default) return;
			quote = opts.default;
		}
		if (Array.isArray(quote)) {
			quote = quote[this.random(quote.length)];
		}
		if (typeof quote == "function") {
			quote = quote.call(this, opts);
		}
		if (!quote) return; // No quote or empty quote, send nothing
		if (quote.includes('|')) {
			return this.add(quote);
		} else {
			return this.add(`bchat|${name}|${quote}`);
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
	
	// pokemon : {
	// 	getDetails : function(side) {
	// 		if (this.illusion) return this.illusion.details + '|' + this.getHealth(side);
	// 		if (this.name == "tustin2121") return "Quilava, M|" + this.getHealth(side);
	// 		return this.details + '|' + this.getHealth(side);
	// 	},
	// },
	
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
			// // Reinitialize the RNG seed to create random teams.
			this.seed = this.generateSeed();
			this.startingSeed = this.startingSeed.concat(this.seed);
			team = this[teamGenerator || 'randomTeam'](side);
			// Restore the default seed
			this.seed = this.startingSeed.slice(0, 4);
			return team;
		}
	},

	// Mix and Mega override stuff
	canMegaEvo: function (pokemon) {		
 		if (pokemon.template.isMega || pokemon.template.isPrimal) return false;		
 		if (pokemon.set.forceMega !== undefined) return pokemon.set.forceMega;		
 		
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

	
};

// Import the Mix and Mega scripts
require("../mixandmega/scripts").inject(exports);
