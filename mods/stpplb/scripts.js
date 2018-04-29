"use strict";

const PRNG = require('../../sim/prng');

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
	
	
	
	// pokemon : {
	// 	getDetails : function(side) {
	// 		if (this.illusion) return this.illusion.details + '|' + this.getHealth(side);
	// 		if (this.name == "tustin2121") return "Quilava, M|" + this.getHealth(side);
	// 		return this.details + '|' + this.getHealth(side);
	// 	},
	// },
	
	// Copied from /data/scripts.js, and modified
	// getTeam: function (side, team) {
	// 	const format = this.getFormat();
	// 	if (!format.team && team) {
	// 		if (!this.teamGenerator) this.teamGenerator = this.getTeamGenerator(format);
	// 		return this.teamGenerator.prepExistingTeam(team);
	// 	}
		
	// 	if (!this.teamGenerator) {
	// 		this.teamGenerator = this.getTeamGenerator(format);
	// 	} else {
	// 		this.teamGenerator.prng = new PRNG();
	// 	}
		
	// 	team = this.teamGenerator.generateTeam();
	// 	this.prngSeed.push(...this.teamGenerator.prng.startingSeed);

	// 	return team;
		
	// 	/*
	// 	const format = this.getFormat();
	// 	const teamGenerator = typeof format.team === 'string' && format.team.startsWith('random') ? format.team + 'Team' : '';
	// 	if (!teamGenerator && team) { //CHANGES START HERE
	// 		// If we have a team already, we can replace the team based on name matching
	// 		for (let i = 0; i < team.length; i++) {
	// 			let name = team[i].name;
	// 			if (leaguemon[name]) { //If we have a mon by that name, replace
	// 				this.debug(`Found matching TPP mon by the name ${name}! Replacing with set!`);
	// 				// Copied from chooseTeamFor
	// 				let set = clone(leaguemon[name]);
	// 				set.name = name;
	// 				this.prepareTPPMonSet(set);
	// 				team[i] = set;
	// 			}
	// 		}
	// 		return team; //CHANGES END HERE
	// 	} else {
	// 		// Teams are generated each one with a shiny new PRNG to prevent
	// 		// information leaks that would empower brute-force attacks.
	// 		const originalPrng = this.prng;
	// 		this.prng = new PRNG();
	// 		this.prngSeed.push(...this.prng.startingSeed);
	// 		team = this[teamGenerator || 'randomTeam'](side);
	// 		this.prng = originalPrng;
	// 		return team;
	// 	}
	// 	*/
	// },

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
