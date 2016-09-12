'use strict';

var toId = require("../../tools.js").getId;

exports.BattleScripts = {
	init: function () {
		var megas = [];
		
		// Modify base pokemon forms
		for (let i in this.data.Pokedex) {
			let template = this.getTemplate(i);
			if (template.forme === "Mega") {
				megas.push(i);
				continue;
			}
			let newStats = {};
			let stats = [];
			for (let j in template.baseStats) {
				stats.push(template.baseStats[j]);
			}
			let bestStatVal = Math.max.apply(Math, stats);
			let worstStatVal = Math.min.apply(Math, stats);
			for (let j in template.baseStats) {
				newStats[j] = template.baseStats[j];
				if (template.baseStats[j] === bestStatVal) {
					newStats[j] = worstStatVal;
				}
				if (template.baseStats[j] === worstStatVal) {
					newStats[j] = bestStatVal;
				}
			}
			this.modData('Pokedex', i).baseStats = newStats;
		}
		
		// Modify megas by inheriting HP and not switching the HP stat
		for (let i = 0; i < megas.length; i++) {
			let template = this.getTemplate(megas[i]);
			let newStats = {};
			let stats = [];
			for (let j in template.baseStats) {
				if (j == "hp") continue; //skip hp
				stats.push(template.baseStats[j]);
			}
			let bestStatVal = Math.max.apply(Math, stats);
			let worstStatVal = Math.min.apply(Math, stats);
			for (let j in template.baseStats) {
				if (j == "hp") continue; //skip hp
				newStats[j] = template.baseStats[j];
				if (template.baseStats[j] === bestStatVal) {
					newStats[j] = worstStatVal;
				}
				if (template.baseStats[j] === worstStatVal) {
					newStats[j] = bestStatVal;
				}
			}
			let baseTemplate = this.getTemplate(toId(template.baseSpecies));
			newStats["hp"] = baseTemplate.baseStats["hp"];
			this.modData('Pokedex', megas[i]).baseStats = newStats;
		}
	},
};
