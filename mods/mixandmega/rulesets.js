// https://github.com/urkerab/Pokemon-Showdown/blob/rom.psim.us/mods/mixandmega/rulesets.js
'use strict';

exports.BattleFormats = {
	sametypeclause: {
		effectType: 'ValidatorRule',
		name: 'Same Type Clause',
		desc: ["Forces all Pok&eacute;mon on a team to share a type with each other"],
		onStart: function () {
			this.add('rule', 'Same Type Clause: Pokémon in a team must share a type');
		},
		onValidateTeam: function (team) {
			let typeTable;
			for (let i = 0; i < team.length; i++) {
				let template = this.getTemplate(team[i].species);
				let types = template.types;
				if (!types) return ["Your team must share a type."];
				let item = this.getItem(team[i].item);
				if (item.megaStone) {
					let megaTemplate = this.getTemplate(item.megaStone);
					if (megaTemplate.types[1] !== this.getTemplate(item.megaEvolves).types[1] && types[1] !== (megaTemplate.types[1] || megaTemplate.types[0])) types = [types[0]];
				}
				if (i === 0) {
					typeTable = types;
				} else {
					typeTable = typeTable.filter(type => types.includes(type));
				}
				if (!typeTable.length) return ["Your team must share a type."];
			}
		},
	},
};