// https://github.com/urkerab/Pokemon-Showdown/blob/rom.psim.us/mods/mixandmega/random-teams.js
'use strict';

const RandomTeams = require('../../data/random-teams');

class RandomMixAndMegaTeams extends RandomTeams {
	randomTeam(side) {
		let megaStones = ['Red Orb', 'Blue Orb'];
		for (let id in this.data.Items) {
			if (/*id !== 'gengarite' && */this.data.Items[id].megaStone && !this.data.Items[id].isNonstandard) megaStones.push(this.data.Items[id].name);
		}
		let pokemonLeft = 0;
		let pokemon = [];

		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			let template = this.getTemplate(id);
			if (!template.evos.length && !template.isMega && !template.isPrimal && !template.isNonstandard && template.randomBattleMoves) {
				pokemonPool.push(id);
			}
		}

		// PotD stuff
		let potd;
		if (Config.potd && 'Rule:potd' in this.getBanlistTable(this.getFormat())) {
			potd = this.getTemplate(Config.potd);
		}

		let typeCount = {};
		let typeComboCount = {};
		let baseFormes = {};
		let uberCount = 0;
		let puCount = 0;
		let teamDetails = {};

		while (pokemonPool.length && pokemonLeft < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;

			// Useless in Random Battle without greatly lowering the levels of everything else
			if (template.species === 'Unown') continue;

			let tier = template.tier;
			switch (tier) {
			case 'Uber':
				// Ubers are limited to 2 but have a 20% chance of being added anyway.
				if (uberCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'PU':
				// PUs are limited to 2 but have a 20% chance of being added anyway.
				if (puCount > 1 && this.random(5) >= 1) continue;
				break;
			case 'Unreleased':
				// Unreleased Pokémon have 20% the normal rate
				if (this.random(5) >= 1) continue;
				break;
			case 'CAP':
				// CAPs have 20% the normal rate
				if (this.random(5) >= 1) continue;
			}

			// Adjust rate for species with multiple formes
			switch (template.baseSpecies) {
			case 'Arceus':
				if (this.random(18) >= 1) continue;
				break;
			case 'Basculin':
				if (this.random(2) >= 1) continue;
				break;
			case 'Castform':
				if (this.random(2) >= 1) continue;
				break;
			case 'Cherrim':
				if (this.random(2) >= 1) continue;
				break;
			case 'Genesect':
				if (this.random(5) >= 1) continue;
				break;
			case 'Gourgeist':
				if (this.random(4) >= 1) continue;
				break;
			case 'Hoopa':
				if (this.random(2) >= 1) continue;
				break;
			case 'Meloetta':
				if (this.random(2) >= 1) continue;
				break;
			}

			// Limit 2 of any type
			let types = template.types;
			let skip = false;
			for (let t = 0; t < types.length; t++) {
				if (typeCount[types[t]] > 1 && this.random(5) >= 1) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			if (potd && potd.exists) {
				// The Pokemon of the Day belongs in slot 2
				if (pokemon.length === 1) {
					template = potd;
					if (template.species === 'Magikarp') {
						template.randomBattleMoves = ['bounce', 'flail', 'splash', 'magikarpsrevenge'];
					} else if (template.species === 'Delibird') {
						template.randomBattleMoves = ['present', 'bestow'];
					}
				} else if (template.species === potd.species) {
					continue; // No, thanks, I've already got one
				}
			}

			// Remove switcheroo, trick.
			if (template.randomBattleMoves) {
				let index = template.randomBattleMoves.indexOf('switcheroo');
				if (index < 0) index = template.randomBattleMoves.indexOf('trick');
				if (index >= 0) {
					template = Object.assign({}, template);
					template.randomBattleMoves = template.randomBattleMoves.slice();
					template.randomBattleMoves.splice(index, 1);
				}
			} else {
				if (template.learnset.switcheroo || template.learnset.trick) {
					template = Object.assign({}, template);
					template.learnset = Object.assign({}, template.learnset);
					delete template.learnset.switcheroo;
					delete template.learnset.trick;
				}
			}
			let set = this.randomSet(template, pokemon.length, teamDetails, this.format.gameType !== 'singles');
			if (!template.requiredItem && !template.tier.endsWith('Uber') && !template.evos.length && set.item !== 'Thick Club' && set.item !== 'Stick') {
				let stone = this.sampleNoReplace(megaStones);
				/*if (template.species === "Shuckle" && ['Aggronite', 'Audinite', 'Charizarditex', 'Charizarditey', 'Galladeite', 'Gyaradosite', 'Houndoominite', 'Latiasite', 'Salamencite', 'Scizorite', 'Sharpedonite', 'Tyranitarite', 'Venusaurite'].indexOf(stone) >= 0) {
					stone = '';
				} else */switch (stone) {
				case 'Beedrillite':
					if (template.species !== 'Beedrill') stone = '';
					break;
				case 'Gengarite':
					if (template.species !== 'Gengar') stone = '';
					break;
				case 'Kangaskhanite':
					if (template.species !== 'Kangaskhan') stone = '';
					break;
				//case 'Blazikenite':
					//if (set.ability != 'Speed Boost') stone = '';
					//break;
				case 'Mawilite': case 'Medichamite':
					if (set.ability != 'Huge Power' && set.ability != 'Pure Power') stone = '';
					break;
				//case 'Slowbronite':
					//if (template.baseStats.def > 185) stone = '';
					//break;
				//case 'Mewtwonitey':
					//if (template.baseStats.def <= 20) stone = '';
					//break;
				//case 'Diancite':
					//if (template.baseStats.def <= 40 || template.baseStats.spd <= 40) stone = '';
					//break;
				//case 'Ampharosite': case 'Garchompite': case 'Heracronite':
					//if (template.baseStats.spe <= 10) stone = '';
					//break;
				//case 'Cameruptite':
					//if (template.baseStats.spe <= 20) stone = '';
					//break;
				//case 'Abomasite': case 'Sablenite':
					//if (template.baseStats.spe <= 30) stone = '';
					//break;
				}
				if (stone) {
					set.item = stone;

					let index = set.moves.indexOf('facade');
					if (index >= 0) set.moves[index] = 'return';

					let mega = stone === 'Blue Orb' ? 'kyogreprimal' : stone == 'Red Orb' ? 'groudonprimal' : toId(this.getItem(stone).megaStone);
					index = pokemonPool.indexOf(mega);
					if (index >= 0) {
						pokemonPool[index] = pokemonPool[pokemonPool.length - 1];
						pokemonPool.pop();
					}
				}
			} else {
				let index = megaStones.indexOf(set.item);
				if (index >= 0) {
					megaStones[index] = megaStones[megaStones.length - 1];
					megaStones.pop();
				}
			}

			// Illusion shouldn't be the last Pokemon of the team
			if (set.ability === 'Illusion' && pokemonLeft > 4) continue;

			// Limit 1 of any type combination
			let typeCombo = types.join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle' || set.ability === 'Sand Stream') {
				// Drought, Drizzle and Sand Stream don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in typeComboCount) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;
			pokemonLeft++;

			// Increment type counters
			for (let t = 0; t < types.length; t++) {
				if (types[t] in typeCount) {
					typeCount[types[t]]++;
				} else {
					typeCount[types[t]] = 1;
				}
			}
			typeComboCount[typeCombo] = 1;

			// Increment Uber/NU counters
			if (tier.endsWith('Uber')) {
				uberCount++;
			} else if (tier === 'PU') {
				puCount++;
			}

			// Team has weather/hazards
			if (set.ability === 'Snow Warning') teamDetails['hail'] = 1;
			if (set.ability === 'Drizzle' || set.moves.indexOf('raindance') >= 0) teamDetails['rain'] = 1;
			if (set.ability === 'Sand Stream') teamDetails['sand'] = 1;
			if (set.moves.indexOf('stealthrock') >= 0) teamDetails['stealthRock'] = 1;
			if (set.moves.indexOf('toxicspikes') >= 0) teamDetails['toxicSpikes'] = 1;
			if (set.moves.indexOf('defog') >= 0 || set.moves.indexOf('rapidspin') >= 0) teamDetails['hazardClear'] = 1;
		}
		return pokemon;
	}
}

module.exports = RandomMixAndMegaTeams;