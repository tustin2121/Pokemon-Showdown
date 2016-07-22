"use strict";


let megaStoneList = [
	'Abomasite',
	'Absolite',
	'Aerodactylite',
	'Aggronite',
	'Alakazite',
	'Altarianite',
	'Ampharosite',
	'Audinite',
	'Banettite',
	'Beedrillite',
	'Blastoisinite',
	'Blazikenite',
	'Cameruptite',
	'Charizardite X',
	'Charizardite Y',
	'Diancite',
	'Galladite',
	'Garchompite',
	'Gardevoirite',
	'Gengarite',
	'Glalitite',
	'Gyaradosite',
	'Heracronite',
	'Houndoominite',
	'Kangaskhanite',
	'Latiasite',
	'Latiosite',
	'Lopunnite',
	'Lucarionite',
	'Manectite',
	'Mawilite',
	'Medichamite',
	'Metagrossite',
	'Mewtwonite X',
	'Mewtwonite Y',
	'Pidgeotite',
	'Pinsirite',
	'Sablenite',
	'Salamencite',
	'Sceptilite',
	'Scizorite',
	'Sharpedonite',
	'Slowbronite',
	'Steelixite',
	'Swampertite',
	'Tyranitarite',
	'Venusaurite',
	'Red Orb',
	'Blue Orb',
];
exports.BattleScripts = {
	fastPop: function (list, index) {
		// If an array doesn't need to be in order, replacing the
		// element at the given index with the removed element
		// is much, much faster than using list.splice(index, 1).
		let length = list.length;
		let element = list[index];
		list[index] = list[length - 1];
		list.pop();
		return element;
	},
	sampleNoReplace: function (list) {
		// The cute code to sample no replace is:
		//   return list.splice(this.random(length), 1)[0];
		// However manually removing the element is twice as fast.
		// In fact, we don't even need to keep the array in order, so
		// we just replace the removed element with the last element.
		let length = list.length;
		let index = this.random(length);
		return this.fastPop(list, index);
	},
	randomtpplbTeam: function (side) {
		let team = [];
		let sets = { // this is where all the movesets are defined. Add new mons here.
			'darkfiregamer': {
				species: "Houndoom", ability: "Dark Aura", item: "Dark Gem", gender: "M",
				moves: ['moonblast', 'hyperbeam', 'fireblast'],
				signatureMove: 'darkfire',
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
			},
			'xfix': {
				species: 'Xatu', ability: 'Mirror Guard', item: 'Focus Sash', gender: 'M',
				moves: ['thunderwave', 'substitute', 'roost'],
				signatureMove: 'superglitch',
				evs: {hp:252, spd:252, def:4}, nature: 'Calm',
			},
			'azum4roll': {
				species: "Azumarill", ability: "Glitchiate", item: "Metronome", gender: 'M',
				moves: ['rollout', 'batonpass', 'swordsdance', 'bellydrum', 'extremespeed', 'playrough', 'thunderwave'],
				signatureMove: 'tm56',
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
			},
			'Iwamiger': {
				species: "Gengar", ability: 'Serene Grace Plus', item: "Life Orb", gender: 'M',
				moves: ['shadowball', 'flamethrower', 'icebeam', 'crunch'],
				signatureMove: 'hexattack',
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
			},
			/*'Poomphcario': { // STPPLB+ only
				species: "Lucario", ability: "Scrappy", item: 'Assault Vest', gender: 'M',
				moves: ['rockwrecker', 'megahorn', 'bulletpunch'],
				signatureMove: 'projectilespam',
				evs: {hp:4, atk:252, spe:252}, nature: 'Jolly',
			},*/
			/*'BulkSoul': { // STPPLB+ only
				species: 'Rhyperior', ability: 'Rock Head', item: 'Focus Sash', gender: 'M',
				moves: ['headsmash', 'autotomize', 'earthquake'],
				signatureMove: 'bulk',
				evs: {hp:252, def:252, spe:4}, nature: 'Impish',
			},*/
			'TieSoul': {
				species: 'Aggron', ability: 'Super Protean', item: 'Membrane', gender: 'M',
				moves: ['playrough', 'firepunch', 'icepunch', 'thunderpunch', 'waterfall', 'heavyslam', 'stoneedge', 'nightslash', 'shadowclaw', 'earthquake', 'psychocut', 'dragonclaw', 'drillpeck', 'xscissor', 'poisonjab', 'brickbreak', 'leafblade', 'bodyslam'],
				signatureMove: 'typeroulette',
				evs: {hp:252, atk:252, spe:4}, nature: 'Adamant',
			},
			"Soma Ghost": {
				species: 'Herdier', ability: 'Spoopify', item: 'Leftovers', gender: 'M',
				moves: ['playrough', 'swordsdance', 'substitute'],
				signatureMove: 'shadowrush',
				evs: {atk:252, def:4, spe:252}, nature: 'Jolly',
			},
			/*"Lass zeowx": { // STPPLB+ only
				species: 'Liepard', ability: 'Protean', item: 'Focus Sash', gender: 'F',
				moves: ['suckerpunch', 'shadowsneak', 'bulletpunch', 'playrough', 'spikes', 'acrobatics'],
				signatureMoves: ['fakeout', 'partingvoltturn'],
				evs: {atk:252, spa:12, spe:244}, nature: 'Hasty',
			},*/
			"Eeveelutionlvr": {
				species: 'Eevee', ability: 'Proteon', item: 'Eviolite', gender: 'M',
				moves: ['hydropump', 'flareblitz', 'thunderbolt', 'batonpass', 'nastyplot', 'dazzlinggleam', 'energyball', 'leechseed', 'blizzard', 'nightslash', 'psychic', 'hyperbeam'], // azum stop nagging about this moveset.
				signatureMove: 'evolutionbeam',
				evs: {spa:252, spe:252, hp:4}, nature: 'Timid',
			},
			'sohippy': {
				species: 'Rotom-Wash', ability: 'Swahahahahaggers', item: 'Leftovers', gender: 'M',
				moves: ['scald', 'painsplit', 'destinybond', 'voltswitch', 'swagger', 'taunt', 'foulplay', 'hex', 'hydropump', 'electricterrain'],
				signatureMove: 'hyperwahahahahaha',
				evs: {hp:252, spa:252, spd:4}, nature: 'Modest',
			},
			'Kooma9': {
				species: 'Blastoise-Mega', ability: 'Psychologist', item: 'Focus Sash', gender: 'M',
				moves: ['scald', 'roar', 'toxic'],
				signatureMove: 'disappointment',
				evs: {hp:252, def:252, spa:4}, nature: 'Bold',
			},
			/*"Kap'n Kooma": { // STPPLB+ only
				species: 'Kingdra', ability: 'Sea and Sky', item: 'Choice Specs', gender: 'M',
				moves: ['scald', 'dracometeor', 'thunder'],
				signatureMove: 'broadside',
				evs: {hp:4, spa:252, spe:252}, nature: 'Modest',
			},*/
			/*'BEST': { // STPPB only
				species: 'Typhlosion', ability: 'Technician', item: 'Life Orb', gender: 'M',
				moves: ['waterpulse', 'hiddenpowerice', 'shockwave'],
				ivs: {atk:30, def:30}, // in order for HP Ice to be a thing.
				signatureMove: 'bestfcar',
				evs: {spa:252, def:4, spe:252}, nature: 'Modest',
			},*/
			'Poomph':{
				species: "Ampharosmega", ability: "Little Engine", item: 'Life Orb', gender: 'M',
				moves: ['surf', 'powergem', 'detect', 'wish', 'nastyplot'],
				signatureMove: 'eternalstruggle',
				happiness: 0,
				evs: {hp:252, spa:252, def:4}, nature: 'Modest',
			},
			/*'NoFunMantis':{ // STPPLB+ only
				species: "Scyther", ability: "No Fun Allowed", item: 'Eviolite', gender: 'M',
				moves: ['knockoff', 'brickbreak', 'aerialace', 'swordsdance', 'agility', 'batonpass', 'roost'],
				signatureMove: 'xscissor',
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
			},*/
			'BigFatMantis': {
				species: "Scyther", shiny: true, ability: "Dictator", item: 'Eviolite', gender: 'M',
				moves: ['bravebird', 'aerialace', 'swordsdance', 'roost', 'uturn', 'xscissor', 'knockoff', 'earthquake'],
				signatureMove: 'nofun',
				evs: {hp:216, atk:40, spe:252}, nature: 'Jolly',
			},
			/*'DictatorMantis': { // STPPLB+ only
				species: 'Scizor', ability: 'Technicality', item: 'Occa Berry', gender: 'M',
				moves: ['barrier', 'craftyshield', 'trick', 'block', 'disable', 'stickyweb', 'embargo', 'quash', 'taunt', 'knockoff', 'bulletpunch'],
				signatureMove: 'ironfist',
				evs: {hp:4,atk:252,spe:252}, nature: 'Adamant',
			},*/
			'MegaCharizard': {
				species: 'Charizard', ability: 'Truant', item: 'Charizardite Y', gender: 'M',
				moves: ['airslash', 'earthpower', 'roost', 'slackoff', 'flamethrower'],
				signatureMove: 'afk',
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
			},
			'Natsugan': {
				species: 'Flygon', ability: 'Mega Plunder', item: megaStoneList[this.random(megaStoneList.length)], gender: 'M',
				moves: ['earthquake', 'earthpower', 'uturn', 'dragonclaw', 'fireblast', 'boomburst', 'dragonpulse', 'return', 'stoneedge', 'crunch', 'ironhead', 'dragondance', 'quiverdance'],
				signatureMove: 'reroll',
				evs: {hp:88, atk: 84, def: 84, spa: 84, spd: 84, spe: 84}, nature: 'Serious',
			},
			'GroundCtrl27': {
				species: 'Meloetta', ability: 'Scrappy', item: 'Assault Vest', gender: 'M',
				moves: ['hypervoice', 'psyshock', 'sneakyspook'],
				signatureMoves: ['shadowsphere', 'drainforce'],
				evs: {hp: 248, spa: 252, spe: 8}, nature: 'Modest',
			},
			'PikalaxALT': {
				species: 'Pikachu', ability: 'Pika Power', item: 'Light Ball', gender: 'M',
				moves: ['thunder', 'thunderbolt', 'quickattack', 'voltswitch', 'irontail'],
				signatureMove: 'toucan',
				evs: {spa: 252, spd: 4, spe: 252}, nature: 'Hasty',
			},
			'Tadpole_0f_Doom': {
				species: 'Poliwrath', ability: 'Ban Evade', item: 'BrightPowder', gender: 'M',
				moves: ['closecombat', 'waterfall', 'icepunch', 'endure', 'bellydrum'],
				signatureMove: 'thousandalts',
				evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant',
			},
			'Whatevs4': {
				species: 'Sneasel', ability: 'Technician', item: 'Dark Gem', gender: 'F',
				moves: ['aerialace', 'stormthrow', 'thief'],
				signatureMove: 'arcticslash',
				evs: {atk: 252, hp: 4, spe: 252}, nature: 'Jolly',
			},
			'MihiraTheTiger': {
				species: 'Mamoswine', ability: 'Technician', item: 'Leftovers', gender: 'M',
				moves: ['iceshard', 'stealthrock'],
				signatureMoves: ['yiffyiff', 'bawk'],
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
			},
			'HazorEx': {
				species: 'Alakazam', ability: 'Physicalakazam', item: 'Alakazite', gender: 'M',
				moves: ['firepunch', 'thunderpunch', 'icepunch', 'drainpunch', 'megapunch', 'endure'],
				signatureMove: 'psychocut',
				evs: {atk: 252, spe: 252, hp: 4}, nature: 'Adamant',
			},
			'Leonys': {
				species: 'Flareon', ability: 'Incinerate', item: 'Choice Band', gender: 'M',
				moves: ['volttackle', 'drillrun', 'irontail', 'revenge', 'pursuit', 'zenheadbutt'],
				signatureMoves: ['quickattack', 'doubleedge'],
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
			},
			'Xinc': {
				species: 'Bisharp', ability: 'Defiant Plus', item: 'Leftovers', gender: 'M',
				moves: ['knockoff', 'drainpunch', 'ironhead', 'suckerpunch', 'bulletpunch'],
				signatureMove: 'ganonssword',
				evs: {hp: 200, atk: 252, spe: 56}, nature: 'Adamant',
			},
			'Abyll': {
				species: 'Milotic', ability: 'Silver Scale', item: 'Lunchabylls', gender: 'M',
				moves: ['dragontail', 'mirrorcoat', 'icebeam', 'recover'],
				signatureMoves: ['rainbowspray'],
				evs: {hp: 252, def: 252, spdef: 4}, nature: 'Sassy',
			},
			/*'Speedy Pokson': {
				species: 'Deoxys-Speed', ability: 'Gotta Go Fast', item: 'Speed Shoes', gender: 'M',
				moves: ['flyingpress', 'leafblade', 'watershuriken', 'mysticalfire', 'aurasphere', 'spikyshield', 'rapidspin'],
				signatureMoves: ['spindash', 'boost'],
				evs: {spe: 252, atk: 252, hp: 4}, nature: 'Hasty',
			},*/
			'ColeWalski': {
				species: 'Empoleon', ability: 'Sniper', item: 'Scope Lens', gender: 'M',
				moves: ['hydropump', 'flashcannon'],
				signatureMoves: ['setmine', 'locknload', 'assassinate'],
				evs: {hp: 252, spa: 252, spe: 4}, nature: 'Modest',
				ivs: {atk: 0},
			},
			'Liria_10': {
				species: 'Roserade', ability: 'Drawing Request', item: 'Black Sludge', gender: 'F',
				moves: ['gigadrain', 'leechseed', 'sleeppowder', 'sludgebomb', 'spikes', 'toxicspikes', 'aromatherapy', 'synthesis'],
				signatureMove: 'quicksketch',
				evs: {hp: 252, spd: 240, spe: 16}, nature: 'Calm',
				ivs: {atk: 0},
			},
			'Lyca': {
				species: 'Absol', ability: 'Jack(y) of All Trades', item: 'Scope Lens', gender: 'F',
				moves: ['nightslash', 'slash', 'psychocut', 'shadowclaw', 'playrough', 'knockoff'],
				signatureMoves: ['quityourbullshit', 'keepcalmandfocus'],
				evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant',
			},
			'Trollkitten': {
				species: 'Mew', ability: 'No Guard', item: 'Eject Button', gender: 'M',
				moves: ['recover', 'echoedvoice'],
				signatureMoves: ['drama', 'loratory'],
				evs: {hp: 252, def: 128, spd: 128}, nature: 'Modest',
			},
		};
		let pool = Object.keys(sets);
		for (let i = 0; i < 6; i++) {
			let name = this.sampleNoReplace(pool);
			let set = sets[name];
			set.level = 100;
			set.name = name;
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
			team.push(set);
		}
		return team;
	},
	randomtpplbpTeam: function (side) {
		let team = [];
		let sets = { // this is where all the movesets are defined. Add new mons here.
			'darkfiregamer': {
				species: "Houndoom", ability: "Dark Aura", item: "Dark Gem", gender: "M",
				moves: ['moonblast', 'hyperbeam', 'fireblast'],
				signatureMove: 'darkfire',
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
			},
			'xfix': {
				species: 'Xatu', ability: 'Mirror Guard', item: 'Focus Sash', gender: 'M',
				moves: ['thunderwave', 'substitute', 'roost'],
				signatureMove: 'superglitch',
				evs: {hp:252, spd:252, def:4}, nature: 'Calm',
			},
			'azum4roll': {
				species: "Azumarill", ability: "Glitchiate", item: "Metronome", gender: 'M',
				moves: ['rollout', 'batonpass', 'swordsdance', 'bellydrum', 'extremespeed', 'playrough', 'thunderwave'],
				signatureMove: 'tm56',
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
			},
			'Iwamiger': {
				species: "Gengar", ability: 'Serene Grace Plus', item: "Life Orb", gender: 'M',
				moves: ['shadowball', 'flamethrower', 'icebeam', 'crunch'],
				signatureMove: 'hexattack',
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
			},
			'Poomphcario': {
				species: "Lucario", ability: "Scrappy", item: 'Assault Vest', gender: 'M',
				moves: ['rockwrecker', 'megahorn', 'bulletpunch'],
				signatureMove: 'projectilespam',
				evs: {hp:4, atk:252, spe:252}, nature: 'Jolly',
			},
			'BulkSoul': {
				species: 'Rhyperior', ability: 'Rock Head', item: 'Focus Sash', gender: 'M',
				moves: ['headsmash', 'autotomize', 'earthquake'],
				signatureMove: 'bulk',
				evs: {hp:252, def:252, spe:4}, nature: 'Impish',
			},
			'TieSoul': {
				species: 'Aggron', ability: 'Super Protean', item: 'Membrane', gender: 'M',
				moves: ['playrough', 'firepunch', 'icepunch', 'thunderpunch', 'waterfall', 'heavyslam', 'stoneedge', 'nightslash', 'shadowclaw', 'earthquake', 'psychocut', 'dragonclaw', 'drillpeck', 'xscissor', 'poisonjab', 'brickbreak', 'leafblade', 'bodyslam'],
				signatureMove: 'typeroulette',
				evs: {hp:252, atk:252, spe:4}, nature: 'Adamant',
			},
			"Soma Ghost": {
				species: 'Herdier', ability: 'Spoopify', item: 'Leftovers', gender: 'M',
				moves: ['playrough', 'swordsdance', 'substitute'],
				signatureMove: 'shadowrush',
				evs: {atk:252, def:4, spe:252}, nature: 'Jolly',
			},
			"Lass zeowx": { // STPPLB+ only
				species: 'Liepard', ability: 'Protean', item: 'Focus Sash', gender: 'F',
				moves: ['suckerpunch', 'shadowsneak', 'bulletpunch', 'playrough', 'spikes', 'acrobatics'],
				signatureMoves: ['fakeout', 'partingvoltturn'],
				evs: {atk:252, spa:12, spe:244}, nature: 'Hasty',
			},
			"Eeveelutionlvr": {
				species: 'Eevee', ability: 'Proteon', item: 'Eviolite', gender: 'M',
				moves: ['hydropump', 'flareblitz', 'thunderbolt', 'batonpass', 'nastyplot', 'dazzlinggleam', 'energyball', 'leechseed', 'blizzard', 'nightslash', 'psychic', 'hyperbeam'], // azum stop nagging about this moveset.
				signatureMove: 'evolutionbeam',
				evs: {spa:252, spe:252, hp:4}, nature: 'Timid',
			},
			'sohippy': {
				species: 'Rotom-Wash', ability: 'Swahahahahaggers', item: 'Leftovers', gender: 'M',
				moves: ['scald', 'painsplit', 'destinybond', 'voltswitch', 'swagger', 'taunt', 'foulplay', 'hex', 'hydropump', 'electricterrain'],
				signatureMove: 'hyperwahahahahaha',
				evs: {hp:252, spa:252, spd:4}, nature: 'Modest',
			},
			'Kooma9': {
				species: 'Blastoise-Mega', ability: 'Psychologist', item: 'Focus Sash', gender: 'M',
				moves: ['scald', 'roar', 'toxic'],
				signatureMove: 'disappointment',
				evs: {hp:252, def:252, spa:4}, nature: 'Bold',
			},
			"Kap'n Kooma": { // STPPLB+ only
				species: 'Kingdra', ability: 'Sea and Sky', item: 'Choice Specs', gender: 'M',
				moves: ['scald', 'dracometeor', 'thunder'],
				signatureMove: 'broadside',
				evs: {hp:4, spa:252, spe:252}, nature: 'Modest',
			},
			/*'BEST': { // STPPB only
				species: 'Typhlosion', ability: 'Technician', item: 'Life Orb', gender: 'M',
				moves: ['waterpulse', 'hiddenpowerice', 'shockwave'],
				ivs: {atk:30, def:30}, // in order for HP Ice to be a thing.
				signatureMove: 'bestfcar',
				evs: {spa:252, def:4, spe:252}, nature: 'Modest',
			},*/
			'Poomph':{
				species: "Ampharosmega", ability: "Little Engine", item: 'Life Orb', gender: 'M',
				moves: ['surf', 'powergem', 'detect', 'wish', 'nastyplot'],
				signatureMove: 'eternalstruggle',
				happiness: 0,
				evs: {hp:252, spa:252, def:4}, nature: 'Modest',
			},
			'NoFunMantis':{
				species: "Scyther", ability: "No Fun Allowed", item: 'Eviolite', gender: 'M',
				moves: ['knockoff', 'brickbreak', 'aerialace', 'swordsdance', 'agility', 'batonpass', 'roost'],
				signatureMove: 'xscissor',
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
			},
			'BigFatMantis': {
				species: "Scyther", shiny: true, ability: "Dictator", item: 'Eviolite', gender: 'M',
				moves: ['bravebird', 'aerialace', 'swordsdance', 'roost', 'uturn', 'xscissor', 'knockoff', 'earthquake'],
				signatureMove: 'nofun',
				evs: {hp:216, atk:40, spe:252}, nature: 'Jolly',
			},
			'DictatorMantis': {
				species: 'Scizor', ability: 'Technicality', item: 'Occa Berry', gender: 'M',
				moves: ['barrier', 'craftyshield', 'trick', 'block', 'disable', 'stickyweb', 'embargo', 'quash', 'taunt', 'knockoff', 'bulletpunch'],
				signatureMove: 'ironfist',
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
			},
			'MegaCharizard': {
				species: 'Charizard', ability: 'Truant', item: 'Charizardite Y', gender: 'M',
				moves: ['airslash', 'earthpower', 'roost', 'slackoff', 'flamethrower'],
				signatureMove: 'afk',
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
			},
			'Natsugan': {
				species: 'Flygon', ability: 'Mega Plunder', item: megaStoneList[this.random(megaStoneList.length)], gender: 'M',
				moves: ['earthquake', 'earthpower', 'uturn', 'dragonclaw', 'fireblast', 'boomburst', 'dragonpulse', 'return', 'stoneedge', 'crunch', 'ironhead', 'dragondance', 'quiverdance'],
				signatureMove: 'reroll',
				nature: 'Serious',
			},
			'GroundCtrl27': {
				species: 'Meloetta', ability: 'Scrappy', item: 'Assault Vest', gender: 'M',
				moves: ['hypervoice', 'psyshock', 'sneakyspook'],
				signatureMoves: ['shadowsphere', 'drainforce'],
				evs: {hp: 248, spa: 252, spe: 8}, nature: 'Modest',
			},
			'WhatevsFur': {
				species: 'Ursaring', ability: 'Furrier Coat', item: 'Leftovers', gender: 'F',
				moves: ['earthquake', 'drainpunch'],
				signatureMoves: ['wish', 'aromatherapy', 'bulkup'],
				evs: {hp: 252, def: 168, spd: 88}, nature: 'Calm',
			},
			'PikalaxALT': {
				species: 'Pikachu', ability: 'Pika Power', item: 'Light Ball', gender: 'M',
				moves: ['thunder', 'thunderbolt', 'quickattack', 'voltswitch', 'irontail'],
				signatureMove: 'toucan',
				evs: {spa: 252, spd: 4, spe: 252}, nature: 'Hasty',
			},
			'Tadpole_0f_Doom': {
				species: 'Poliwrath', ability: 'Ban Evade', item: 'BrightPowder', gender: 'M',
				moves: ['closecombat', 'waterfall', 'icepunch', 'endure', 'bellydrum'],
				signatureMove: 'thousandalts',
				evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant',
			},
			'Whatevs4': {
				species: 'Sneasel', ability: 'Technician', item: 'Dark Gem', gender: 'F',
				moves: ['aerialace', 'stormthrow', 'thief'],
				signatureMove: 'arcticslash',
				evs: {atk: 252, hp: 4, spe: 252}, nature: 'Jolly',
			},
			'MihiraTheTiger': {
				species: 'Mamoswine', ability: 'Technician', item: 'Leftovers', gender: 'M',
				moves: ['iceshard', 'stealthrock'],
				signatureMoves: ['yiffyiff', 'bawk'],
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
			},
			'HazorEx': {
				species: 'Alakazam', ability: 'Physicalakazam', item: 'Alakazite', gender: 'M',
				moves: ['firepunch', 'thunderpunch', 'icepunch', 'drainpunch', 'megapunch', 'endure'],
				signatureMove: 'psychocut',
				evs: {atk: 252, spe: 252, hp: 4}, nature: 'Adamant',
			},
			'Leonys': {
				species: 'Flareon', ability: 'Incinerate', item: 'Choice Band', gender: 'M',
				moves: ['volttackle', 'drillrun', 'irontail', 'revenge', 'pursuit', 'zenheadbutt'],
				signatureMoves: ['quickattack', 'doubleedge'],
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
			},
			'Xinc': {
				species: 'Bisharp', ability: 'Defiant Plus', item: 'Leftovers', gender: 'M',
				moves: ['knockoff', 'drainpunch', 'ironhead', 'suckerpunch', 'bulletpunch'],
				signatureMove: 'ganonssword',
				evs: {hp: 200, atk: 252, spe: 56}, nature: 'Adamant',
			},
			'Abyll': {
				species: 'Milotic', ability: 'Silver Scale', item: 'Lunchabylls', gender: 'M',
				moves: ['dragontail', 'mirrorcoat', 'icebeam', 'recover'],
				signatureMoves: ['rainbowspray'],
				evs: {hp: 252, def: 252, spdef: 4}, nature: 'Sassy',
			},
			'Speedy Pokson': {
				species: 'Deoxys-Speed', ability: 'Gotta Go Fast', item: 'Speed Shoes', gender: 'M',
				moves: ['flyingpress', 'leafblade', 'watershuriken', 'mysticalfire', 'aurasphere', 'spikyshield', 'rapidspin'],
				signatureMoves: ['spindash', 'boost'],
				evs: {spe: 252, atk: 252, hp: 4}, nature: 'Hasty',
			},
			'ColeWalski': {
				species: 'Empoleon', ability: 'Sniper', item: 'Scope Lens', gender: 'M',
				moves: ['hydropump', 'flashcannon'],
				signatureMoves: ['setmine', 'locknload', 'assassinate'],
				evs: {hp: 252, spa: 252, spe: 4}, nature: 'Modest',
				ivs: {atk: 0},
			},
			'Liria_10': {
				species: 'Roserade', ability: 'Drawing Request', item: 'Black Sludge', gender: 'F',
				moves: ['gigadrain', 'leechseed', 'sleeppowder', 'sludgebomb', 'spikes', 'toxicspikes', 'aromatherapy', 'synthesis'],
				signatureMove: 'quicksketch',
				evs: {hp: 252, spd: 240, spe: 16}, nature: 'Calm',
				ivs: {atk: 0},
			},
			'Lyca': {
				species: 'Absol', ability: 'Jack(y) of All Trades', item: 'Scope Lens', gender: 'F',
				moves: ['nightslash', 'slash', 'psychocut', 'shadowclaw', 'playrough', 'knockoff'],
				signatureMoves: ['quityourbullshit', 'keepcalmandfocus'],
				evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant',
			},
			'Lorewriter Cole': {
				species: 'Relicanth', ability: 'Invocation', item: 'Leftovers', gender: 'M',
				moves: ['stealthrock', 'stoneedge', 'toxic', 'earthpower', 'ancientpower'],
				signatureMove: 'godswrath',
				nature: 'Serious',
			},
			'Trollkitten': {
				species: 'Mew', ability: 'No Guard', item: 'Eject Button', gender: 'M',
				moves: ['recover', 'echoedvoice'],
				signatureMoves: ['drama', 'loratory'],
				evs: {hp: 252, def: 128, spd: 128}, nature: 'Modest',
			},
		};
		let pool = Object.keys(sets);
		for (let i = 0; i < 6; i++) {
			let name = this.sampleNoReplace(pool);
			let set = sets[name];
			set.level = 100;
			set.name = name;
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
			team.push(set);
		}
		return team;
	},
	randomtppbTeam: function (side) {
		let team = [];
		let sets = { // this is where all the movesets are defined. Add new mons here.
			'darkfiregamer': {
				species: "Houndoom", ability: "Dark Aura", item: "Dark Gem", gender: "M",
				moves: ['moonblast', 'hyperbeam', 'fireblast'],
				signatureMove: 'darkfire',
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
			},
			'xfix': {
				species: 'Xatu', ability: 'Mirror Guard', item: 'Focus Sash', gender: 'M',
				moves: ['thunderwave', 'substitute', 'roost'],
				signatureMove: 'superglitch',
				evs: {hp:252, spd:252, def:4}, nature: 'Calm',
			},
			'azum4roll': {
				species: "Azumarill", ability: "Glitchiate", item: "Metronome", gender: 'M',
				moves: ['rollout', 'batonpass', 'swordsdance', 'bellydrum', 'extremespeed', 'playrough', 'thunderwave'],
				signatureMove: 'tm56',
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
			},
			'Iwamiger': {
				species: "Gengar", ability: 'Serene Grace Plus', item: "Life Orb", gender: 'M',
				moves: ['shadowball', 'flamethrower', 'icebeam', 'crunch'],
				signatureMove: 'hexattack',
				evs: {hp:4, spa:252, spe:252}, nature: 'Timid',
			},
			'Poomphcario': {
				species: "Lucario", ability: "Scrappy", item: 'Assault Vest', gender: 'M',
				moves: ['rockwrecker', 'megahorn', 'bulletpunch'],
				signatureMove: 'projectilespam',
				evs: {hp:4, atk:252, spe:252}, nature: 'Jolly',
			},
			'BulkSoul': {
				species: 'Rhyperior', ability: 'Rock Head', item: 'Focus Sash', gender: 'M',
				moves: ['headsmash', 'autotomize', 'earthquake'],
				signatureMove: 'bulk',
				evs: {hp:252, def:252, spe:4}, nature: 'Impish',
			},
			'TieSoul': {
				species: 'Aggron', ability: 'Super Protean', item: 'Membrane', gender: 'M',
				moves: ['playrough', 'firepunch', 'icepunch', 'thunderpunch', 'waterfall', 'heavyslam', 'stoneedge', 'nightslash', 'shadowclaw', 'earthquake', 'psychocut', 'dragonclaw', 'drillpeck', 'xscissor', 'poisonjab', 'brickbreak', 'leafblade', 'bodyslam'],
				signatureMove: 'typeroulette',
				evs: {hp:252, atk:252, spe:4}, nature: 'Adamant',
			},
			"Soma Ghost": {
				species: 'Herdier', ability: 'Spoopify', item: 'Leftovers', gender: 'M',
				moves: ['playrough', 'swordsdance', 'substitute'],
				signatureMove: 'shadowrush',
				evs: {atk:252, def:4, spe:252}, nature: 'Jolly',
			},
			"Lass zeowx": { // STPPLB+ only
				species: 'Liepard', ability: 'Protean', item: 'Focus Sash', gender: 'F',
				moves: ['suckerpunch', 'shadowsneak', 'bulletpunch', 'playrough', 'spikes', 'acrobatics'],
				signatureMoves: ['fakeout', 'partingvoltturn'],
				evs: {atk:252, spa:12, spe:244}, nature: 'Hasty',
			},
			"Eeveelutionlvr": {
				species: 'Eevee', ability: 'Proteon', item: 'Eviolite', gender: 'M',
				moves: ['hydropump', 'flareblitz', 'thunderbolt', 'batonpass', 'nastyplot', 'dazzlinggleam', 'energyball', 'leechseed', 'blizzard', 'nightslash', 'psychic', 'hyperbeam'], // azum stop nagging about this moveset.
				signatureMove: 'evolutionbeam',
				evs: {spa:252, spe:252, hp:4}, nature: 'Timid',
			},
			'sohippy': {
				species: 'Rotom-Wash', ability: 'Swahahahahaggers', item: 'Leftovers', gender: 'M',
				moves: ['scald', 'painsplit', 'destinybond', 'voltswitch', 'swagger', 'taunt', 'foulplay', 'hex', 'hydropump', 'electricterrain'],
				signatureMove: 'hyperwahahahahaha',
				evs: {hp:252, spa:252, spd:4}, nature: 'Modest',
			},
			'Kooma9': {
				species: 'Blastoise-Mega', ability: 'Psychologist', item: 'Focus Sash', gender: 'M',
				moves: ['scald', 'roar', 'toxic'],
				signatureMove: 'disappointment',
				evs: {hp:252, def:252, spa:4}, nature: 'Bold',
			},
			"Kap'n Kooma": { // STPPLB+ only
				species: 'Kingdra', ability: 'Sea and Sky', item: 'Choice Specs', gender: 'M',
				moves: ['scald', 'dracometeor', 'thunder'],
				signatureMove: 'broadside',
				evs: {hp:4, spa:252, spe:252}, nature: 'Modest',
			},
			'BEST': { // STPPB only
				species: 'Typhlosion', ability: 'Technician', item: 'Life Orb', gender: 'M',
				moves: ['waterpulse', 'hiddenpowerice', 'shockwave'],
				ivs: {atk:30, def:30}, // in order for HP Ice to be a thing.
				signatureMove: 'bestfcar',
				evs: {spa:252, def:4, spe:252}, nature: 'Modest',
			},
			'Poomph':{
				species: "Ampharosmega", ability: "Little Engine", item: 'Life Orb', gender: 'M',
				moves: ['surf', 'powergem', 'detect', 'wish', 'nastyplot'],
				signatureMove: 'eternalstruggle',
				happiness: 0,
				evs: {hp:252, spa:252, def:4}, nature: 'Modest',
			},
			'NoFunMantis':{
				species: "Scyther", ability: "No Fun Allowed", item: 'Eviolite', gender: 'M',
				moves: ['knockoff', 'brickbreak', 'aerialace', 'swordsdance', 'agility', 'batonpass', 'roost'],
				signatureMove: 'xscissor',
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
			},
			'BigFatMantis': {
				species: "Scyther", shiny: true, ability: "Dictator", item: 'Eviolite', gender: 'M',
				moves: ['bravebird', 'aerialace', 'swordsdance', 'roost', 'uturn', 'xscissor', 'knockoff', 'earthquake'],
				signatureMove: 'nofun',
				evs: {hp:216, atk:40, spe:252}, nature: 'Jolly',
			},
			'DictatorMantis': {
				species: 'Scizor', ability: 'Technicality', item: 'Occa Berry', gender: 'M',
				moves: ['barrier', 'craftyshield', 'trick', 'block', 'disable', 'stickyweb', 'embargo', 'quash', 'taunt', 'knockoff', 'bulletpunch'],
				signatureMove: 'ironfist',
				evs: {hp:4, atk:252, spe:252}, nature: 'Adamant',
			},
			'MegaCharizard': {
				species: 'Charizard', ability: 'Truant', item: 'Charizardite Y', gender: 'M',
				moves: ['airslash', 'earthpower', 'roost', 'slackoff', 'flamethrower'],
				signatureMove: 'afk',
				evs: {hp: 4, spa: 252, spe: 252}, nature: 'Timid',
			},
			'Natsugan': {
				species: 'Flygon', ability: 'Mega Plunder', item: megaStoneList[this.random(megaStoneList.length)], gender: 'M',
				moves: ['earthquake', 'earthpower', 'uturn', 'dragonclaw', 'fireblast', 'boomburst', 'dragonpulse', 'return', 'stoneedge', 'crunch', 'ironhead', 'dragondance', 'quiverdance'],
				signatureMove: 'reroll',
				nature: 'Serious',
			},
			'Bird Jesus': { //STPPB only
				species: 'Pidgeot', ability: 'Messiah', item: 'Flying Gem', gender: 'M',
				moves: ['judgment', 'focusblast', 'roost', 'fireblast'],
				signatureMove: 'godbird',
				evs: {spa:252, def:4, spe:252}, nature: 'Timid',
			},
			'GroundCtrl27': {
				species: 'Meloetta', ability: 'Scrappy', item: 'Assault Vest', gender: 'M',
				moves: ['hypervoice', 'psyshock', 'sneakyspook'],
				signatureMoves: ['shadowsphere', 'drainforce'],
				evs: {hp: 248, spa: 252, spe: 8}, nature: 'Modest',
			},
			'WhatevsFur': {
				species: 'Ursaring', ability: 'Furrier Coat', item: 'Leftovers', gender: 'F',
				moves: ['earthquake', 'drainpunch'],
				signatureMoves: ['wish', 'aromatherapy', 'bulkup'],
				evs: {hp: 252, def: 168, spd: 88}, nature: 'Calm',
			},
			'PikalaxALT': {
				species: 'Pikachu', ability: 'Pika Power', item: 'Light Ball', gender: 'M',
				moves: ['thunder', 'thunderbolt', 'quickattack', 'voltswitch', 'irontail'],
				signatureMove: 'toucan',
				evs: {spa: 252, spd: 4, spe: 252}, nature: 'Hasty',
			},
			'Tadpole_0f_Doom': {
				species: 'Poliwrath', ability: 'Ban Evade', item: 'BrightPowder', gender: 'M',
				moves: ['closecombat', 'waterfall', 'icepunch', 'endure', 'bellydrum'],
				signatureMove: 'thousandalts',
				evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant',
			},
			'Whatevs4': {
				species: 'Sneasel', ability: 'Technician', item: 'Dark Gem', gender: 'F',
				moves: ['aerialace', 'stormthrow', 'thief'],
				signatureMove: 'arcticslash',
				evs: {atk: 252, hp: 4, spe: 252}, nature: 'Jolly',
			},
			'MihiraTheTiger': {
				species: 'Mamoswine', ability: 'Technician', item: 'Leftovers', gender: 'M',
				moves: ['iceshard', 'stealthrock'],
				signatureMoves: ['yiffyiff', 'bawk'],
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
			},
			'HazorEx': {
				species: 'Alakazam', ability: 'Physicalakazam', item: 'Alakazite', gender: 'M',
				moves: ['firepunch', 'thunderpunch', 'icepunch', 'drainpunch', 'megapunch', 'endure'],
				signatureMove: 'psychocut',
				evs: {atk: 252, spe: 252, hp: 4}, nature: 'Adamant',
			},
			'Leonys': {
				species: 'Flareon', ability: 'Incinerate', item: 'Choice Band', gender: 'M',
				moves: ['volttackle', 'drillrun', 'irontail', 'revenge', 'pursuit', 'zenheadbutt'],
				signatureMoves: ['quickattack', 'doubleedge'],
				evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
			},
			'Xinc': {
				species: 'Bisharp', ability: 'Defiant Plus', item: 'Leftovers', gender: 'M',
				moves: ['knockoff', 'drainpunch', 'ironhead', 'suckerpunch', 'bulletpunch'],
				signatureMove: 'ganonssword',
				evs: {hp: 200, atk: 252, spe: 56}, nature: 'Adamant',
			},
			'Abyll': {
				species: 'Milotic', ability: 'Silver Scale', item: 'Lunchabylls', gender: 'M',
				moves: ['dragontail', 'mirrorcoat', 'icebeam', 'recover'],
				signatureMoves: ['rainbowspray'],
				evs: {hp: 252, def: 252, spdef: 4}, nature: 'Sassy',
			},
			'Speedy Pokson': {
				species: 'Deoxys-Speed', ability: 'Gotta Go Fast', item: 'Speed Shoes', gender: 'M',
				moves: ['flyingpress', 'leafblade', 'watershuriken', 'mysticalfire', 'aurasphere', 'spikyshield', 'rapidspin'],
				signatureMoves: ['spindash', 'boost'],
				evs: {spe: 252, atk: 252, hp: 4}, nature: 'Hasty',
			},
			'ColeWalski': {
				species: 'Empoleon', ability: 'Sniper', item: 'Scope Lens', gender: 'M',
				moves: ['hydropump', 'flashcannon'],
				signatureMoves: ['setmine', 'locknload', 'assassinate'],
				evs: {hp: 252, spa: 252, spe: 4}, nature: 'Modest',
				ivs: {atk: 0},
			},
			'Liria_10': {
				species: 'Roserade', ability: 'Drawing Request', item: 'Black Sludge', gender: 'F',
				moves: ['gigadrain', 'leechseed', 'sleeppowder', 'sludgebomb', 'spikes', 'toxicspikes', 'aromatherapy', 'synthesis'],
				signatureMove: 'quicksketch',
				evs: {hp: 252, spd: 240, spe: 16}, nature: 'Calm',
				ivs: {atk: 0},
			},
			'Lyca': {
				species: 'Absol', ability: 'Jack(y) of All Trades', item: 'Scope Lens', gender: 'F',
				moves: ['nightslash', 'slash', 'psychocut', 'shadowclaw', 'playrough', 'knockoff'],
				signatureMoves: ['quityourbullshit', 'keepcalmandfocus'],
				evs: {hp: 252, atk: 252, spe: 4}, nature: 'Adamant',
			},
			'Lorewriter Cole': {
				species: 'Relicanth', ability: 'Invocation', item: 'Leftovers', gender: 'M',
				moves: ['stealthrock', 'stoneedge', 'toxic', 'earthpower', 'ancientpower'],
				signatureMove: 'godswrath',
				nature: 'Serious',
			},
			'Trollkitten': {
				species: 'Mew', ability: 'No Guard', item: 'Eject Button', gender: 'M',
				moves: ['recover', 'echoedvoice'],
				signatureMoves: ['drama', 'loratory'],
				evs: {hp: 252, def: 128, spd: 128}, nature: 'Modest',
			},
		};
		let pool = Object.keys(sets);
		for (let i = 0; i < 6; i++) {
			let name = this.sampleNoReplace(pool);
			let set = sets[name];
			set.level = 100;
			set.name = name;
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
			team.push(set);
		}
		return team;
	},
	// Mix and Mega mechanics just for Natsugon EleGiggle
	init: function () {
		let onTakeMegaStone = function (item, source) {
			return false;
		};
		for (let id in this.data.Items) {
			if (id !== 'redorb' && id !== 'blueorb' && !this.data.Items[id].megaStone) continue;
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

		// Pokémon affected by Sky Drop cannot mega evolve. Enforce it here for now.
		let foeActive = side.foe.active;
		for (let i = 0; i < foeActive.length; i++) {
			if (foeActive[i].volatiles['skydrop'] && foeActive[i].volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		pokemon.formeChange(template);
		pokemon.baseTemplate = template; // mega evolution is permanent

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

		pokemon.setAbility(template.abilities['0']);
		pokemon.baseAbility = pokemon.ability;
		pokemon.canMegaEvo = false;
		return true;
	},
	doGetMixedTemplate: function (template, deltas) {
		if (!deltas) throw new TypeError("Must specify deltas!");
		if (!template || typeof template === 'string') template = this.getTemplate(template);
		template = Object.assign({}, template);
		template.abilities = {'0': deltas.ability};
		template.types = Array.from(new Set(Object.assign(template.types.slice(), deltas.types).filter(type => type)));
		let baseStats = template.baseStats;
		template.baseStats = {};
		for (let statName in baseStats) template.baseStats[statName] = baseStats[statName] + deltas.baseStats[statName];
		template.weightkg = Math.max(0.1, template.weightkg + deltas.weightkg);
		template.originalMega = deltas.originalMega;
		template.requiredItem = deltas.requiredItem;
		if (deltas.isMega) template.isMega = true;
		if (deltas.isPrimal) template.isPrimal = true;
		return template;
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
			ability: megaTemplate.abilities['0'], baseStats: {}, weightkg: megaTemplate.weightkg - baseTemplate.weightkg, types: Array(baseTemplate.types.length),
			originalMega: megaTemplate.species, requiredItem: megaTemplate.requiredItem,
		};
		for (let statId in megaTemplate.baseStats) deltas.baseStats[statId] = megaTemplate.baseStats[statId] - baseTemplate.baseStats[statId];
		if (megaTemplate.types.length > baseTemplate.types.length) {
			deltas.types.push(megaTemplate.types[1]);
		} else if (megaTemplate.types.length < baseTemplate.types.length) {
			deltas.types[1] = baseTemplate.types[0];
		} else if (megaTemplate.types[1] !== baseTemplate.types[1]) {
			deltas.types[1] = megaTemplate.types[1];
		}
		if (megaTemplate.isMega) deltas.isMega = true;
		if (megaTemplate.isPrimal) deltas.isPrimal = true;
		return deltas;
	},
};
