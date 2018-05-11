'use strict';

const Side = require('../../sim/side');

exports.BattleScripts = {
	init: function () {
		for (let id in this.data.Items) {
			if (!this.data.Items[id].megaStone) continue;
			this.modData('Items', id).onTakeItem = false;
		}
	},
	canMegaEvo: function (pokemon) {
		if (pokemon.template.isMega || pokemon.template.isPrimal || pokemon.baseTemplate.forme === 'Ultra') return false;

		const item = pokemon.getItem();
		if (item.megaStone) {
			if (item.megaStone === pokemon.species) return false;
			return item.megaStone;
		} else if (pokemon.baseMoves.includes('dragonascent')) {
			return 'Rayquaza-Mega';
		} else {
			return false;
		}
	},
	runMegaEvo: function (pokemon) {
		if (pokemon.template.isMega || pokemon.template.isPrimal) return false;

		const isUltraBurst = !pokemon.canMegaEvo;
		let species = pokemon.template.baseSpecies == pokemon.originalSpecies ? pokemon.template.species : pokemon.originalSpecies;
		const template = this.getMixedTemplate(species, pokemon.canMegaEvo || pokemon.canUltraBurst);
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot Mega Evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		pokemon.formeChange(template);
		pokemon.baseTemplate = template; // Mega Evolution is permanent

		// Do we have a proper sprite for it?
		if (this.getTemplate(pokemon.canMegaEvo).baseSpecies === pokemon.originalSpecies || isUltraBurst) {
			pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
			this.add((isUltraBurst ? '-burst' : '-mega'), pokemon, template.baseSpecies, template.requiredItem);
			this.add('detailschange', pokemon, pokemon.details);
		} else {
			let oTemplate = this.getTemplate(species);
			let oMegaTemplate = this.getTemplate(pokemon.canMegaEvo);
			this.add('-mega', pokemon, pokemon.originalSpecies, oMegaTemplate.requiredItem);
			this.add('-formechange', pokemon, species, template.requiredItem);
			this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			if (oTemplate.types.length !== pokemon.template.types.length || oTemplate.types[1] !== pokemon.template.types[1]) {
				this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
			}
		}

		pokemon.setAbility(template.abilities['0'], null, true);
		pokemon.baseAbility = pokemon.ability;
		pokemon.canMegaEvo = false;
		if (isUltraBurst) pokemon.canUltraBurst = false;
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
		if (deltas.isMega) {
			template.isMega = true;
			template.species += '-' + deltas.isMega;
		} else if (deltas.isPrimal) {
			template.isPrimal = true;
			template.species += '-Primal';
		}
		delete template.onSwitchInPriority;
		delete template.onSwitchIn;
		return template;
	},
	side: {
		chooseMove: function (moveText, targetLoc, megaOrZ) {
			this.choice.mega = false; //????????? --tustin
			return Side.prototype.chooseMove.call(this, moveText, targetLoc, megaOrZ);
		},
	},
};

// Call this method to inject all of the above scripts into another mod's BattleScripts.
// This method will not override any function that is already present.
exports.inject = function(mod){
	if (mod.BattleScripts) { mod = mod.BattleScripts; }
	if (!mod["init"]) mod["init"] = exports.BattleScripts["init"];
	if (!mod["canMegaEvo"]) mod["canMegaEvo"] = exports.BattleScripts["canMegaEvo"];
	if (!mod["runMegaEvo"]) mod["runMegaEvo"] = exports.BattleScripts["runMegaEvo"];
	if (!mod["getMixedTemplate"]) mod["getMixedTemplate"] = exports.BattleScripts["getMixedTemplate"];
	if (!mod["getMegaDeltas"]) mod["getMegaDeltas"] = exports.BattleScripts["getMegaDeltas"];
	if (!mod["doGetMixedTemplate"]) mod["doGetMixedTemplate"] = exports.BattleScripts["doGetMixedTemplate"];
	if (!mod["side"]) mod["side"] = {};
	if (!mod.side["chooseMove"]) mod.side["chooseMove"] = exports.BattleScripts.side["chooseMove"];
};
