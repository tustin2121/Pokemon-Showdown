'use strict';

const Dex = require('./../../sim/dex');

const RandomTeams = require('../../data/random-teams');

class Random24Teams extends RandomTeams {
	/**
	 * @param {Format | string} format
	 * @param {?PRNG | [number, number, number, number]} [prng]
	 */
	constructor(format, prng) {
		super(format, prng);
	}
	
	randomTeam() {
		let pokemon = [];

		const excludedTiers = ['NFE', 'LC Uber', 'LC'];
		const allowedNFE = [
			'Bronzor', 'Chansey', 'Clefairy', 'Combusken', 'Doublade', 'Gligar', 'Golbat', 'Gurdurr', 'Haunter', 'Kadabra', 'Machoke', 'Mareanie', 'Monferno', 'Pawniard',
			'Piloswine', 'Porygon2', 'Rhydon', 'Roselia', 'Scyther', 'Sneasel', 'Tangela', 'Togetic', 'Type: Null',
		];

		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			let template = this.getTemplate(id);
			if (template.gen <= this.gen && !excludedTiers.includes(template.tier) && !template.isMega && !template.isPrimal && !template.isNonstandard && template.randomBattleMoves) {
				pokemonPool.push(id);
			}
		}

		/**@type {{[k: string]: number}} */
		let baseFormes = {};
		/**@type {{[k: string]: number}} */
		let tierCount = {};
		/**@type {{[k: string]: number}} */
		let typeCount = {};
		/**@type {{[k: string]: number}} */
		let typeComboCount = {};
		/**@type {RandomTeamsTypes["TeamDetails"]} */
		let teamDetails = {};

		while (pokemonPool.length && pokemon.length < 24) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;

			// Only certain NFE Pokemon are allowed
			if (template.evos.length && !allowedNFE.includes(template.species)) continue;

			// Adjust rate for species with multiple formes
			switch (template.baseSpecies) {
			case 'Arceus': case 'Silvally':
				if (this.randomChance(17, 18)) continue;
				break;
			case 'Castform': case 'Gourgeist': case 'Oricorio':
				if (this.randomChance(3, 4)) continue;
				break;
			case 'Necrozma':
				if (this.randomChance(2, 3)) continue;
				break;
			case 'Basculin': case 'Cherrim': case 'Greninja': case 'Hoopa': case 'Meloetta': case 'Meowstic':
				if (this.randomChance(1, 2)) continue;
				break;
			}
			
			// Limit FIVE Pokemon per tier
			let tier = toId(template.tier);
			switch (tier) {
			case 'uubl':
				tier = 'ou';
				break;
			case 'rubl':
				tier = 'uu';
				break;
			case 'nubl':
				tier = 'ru';
				break;
			case 'publ':
				tier = 'nu';
				break;
			case 'zubl':
				tier = 'pu';
				break;
			}
			if (!tierCount[tier]) {
				tierCount[tier] = 1;
			} else if (tierCount[tier] > 4) {
				continue;
			}

			let types = template.types;

			// Limit 4 of any type
			let skip = false;
			for (const type of types) {
				if (typeCount[type] > 3 && this.randomChance(4, 5)) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			let set = this.randomSet(template, pokemon.length, teamDetails, this.format.gameType !== 'singles');

			// Illusion shouldn't be the last Pokemon of the team
			if (set.ability === 'Illusion' && pokemon.length > 22) continue;

			// Pokemon shouldn't have Physical and Special setup on the same set
			let incompatibleMoves = ['bellydrum', 'swordsdance', 'calmmind', 'nastyplot'];
			let intersectMoves = set.moves.filter(move => incompatibleMoves.includes(move));
			if (intersectMoves.length > 1) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle' || set.ability === 'Sand Stream') {
				// Drought, Drizzle and Sand Stream don't count towards the type combo limit
				typeCombo = set.ability;
				if (typeCombo in typeComboCount) continue;
			} else {
				if (typeComboCount[typeCombo] >= 1) continue;
			}
			
			// Added by azum4roll: different level scale
			let levelScale = {
				ZU: 87,
				ZUBL: 85,
				PU: 84,
				PUBL: 82,
				NU: 81,
				NUBL: 79,
				RU: 78,
				RUBL: 76,
				UU: 75,
				UUBL: 73,
				OU: 72,
				Unreleased: 72,
				Uber: 70,
			};
			/** @type {{[species: string]: number}} */
			let customScale = {
				// Banned Abilities
				Dugtrio: 75, Gothitelle: 75, Pelipper: 78, Politoed: 78, Wobbuffet: 75,

				// Holistic judgement
				'Castform-Rainy': 100, 'Castform-Snowy': 100, 'Castform-Sunny': 100, Unown: 100,
			};
			
			let item = this.getItem(set.item);
			
			if (item.megaStone) {
				switch (set.item) {
				case 'Charizardite X':
					template = this.getTemplate('Charizard-Mega-X');
					break;
				case 'Charizardite Y':
					template = this.getTemplate('Charizard-Mega-Y');
					break;
				case 'Mewtwonite X':
					template = this.getTemplate('Mewtwo-Mega-X');
					break;
				case 'Mewtwonite Y':
					template = this.getTemplate('Mewtwo-Mega-Y');
					break;					
				default:
					template = this.getTemplate(set.name + '-Mega');
					break;
				}
			} else {
				template = this.getTemplate(set.species);
			}
			
			tier = template.tier;
			if (tier.charAt(0) === '(') {
				tier = tier.slice(1, -1);
			}
			let level = levelScale[tier] || 87;
			if (customScale[template.name]) level = customScale[template.name];

			// Custom level based on moveset
			if (set.ability === 'Power Construct') level = 70;
			if (set.item === 'Kommonium Z') level = 75;
			
			set.level = level;

			// Limit 1 Z-Move per team
			if (teamDetails['zMove'] && item.zMove) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			if (pokemon.length === 24) {
				// Set Zoroark's level to be the same as the last Pokemon
				let illusion = teamDetails['illusion'];
				if (illusion) pokemon[illusion - 1].level = pokemon[23].level;
				break;
			}

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;
			tierCount[tier]++;

			// Increment type counters
			for (const type of types) {
				if (type in typeCount) {
					typeCount[type]++;
				} else {
					typeCount[type] = 1;
				}
			}
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Team has Mega/weather/hazards
			// Added by azum4roll: alternate Mega Stone counter - limit Mega Stones to 4
			if (item.megaStone) {
				if (!teamDetails['megaStones']) {
					teamDetails['megaStones'] = 1;
				} else {
					teamDetails['megaStones']++;
				}
			}
			if (teamDetails['megaStones'] >= 4) teamDetails['megaStone'] = 1;
			if (item.zMove) teamDetails['zMove'] = 1;
			if (set.ability === 'Snow Warning' || set.moves.includes('hail')) teamDetails['hail'] = 1;
			if (set.moves.includes('raindance') || set.ability === 'Drizzle' && !item.onPrimal) teamDetails['rain'] = 1;
			if (set.ability === 'Sand Stream') teamDetails['sand'] = 1;
			if (set.moves.includes('sunnyday') || set.ability === 'Drought' && !item.onPrimal) teamDetails['sun'] = 1;
			if (set.moves.includes('stealthrock')) teamDetails['stealthRock'] = 1;
			if (set.moves.includes('toxicspikes')) teamDetails['toxicSpikes'] = 1;
			if (set.moves.includes('defog') || set.moves.includes('rapidspin')) teamDetails['hazardClear'] = 1;

			// For setting Zoroark's level
			if (set.ability === 'Illusion') teamDetails['illusion'] = pokemon.length;
		}
		return pokemon;
	}
};

module.exports = Random24Teams;