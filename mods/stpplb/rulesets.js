'use strict';

exports.BattleFormats = {
	
	switchingrule: {
		effectType: 'Rule',
		name: 'Switching Rule',
		onStart: function () {
			this.add('rule', 'Switching Rule: Cannot switch. Except if you used Imprison, then you must switch.');
		},
		// Called on NextTurn, before a move is requested from the player
		onTrapPokemonPriority: -100, //Run after all other effects
		onTrapPokemon: function(pokemon) {
			if (!pokemon.volatiles['imprison']) {
				pokemon.trapped = true; //Forced the trapped status
			} else {
				pokemon.trapped = false;
				pokemon.switchFlag = true; //Force the user to switch
			}
		}
	},
	
	recyclerule: {
		effectType: 'Rule',
		name: 'Recycle Rule',
		onStart: function () {
			this.add('rule', 'Recycle Rule: You cannot use Recycle when you can use Super Glitch, unless your Leppa Berry has been consumed.');
		},
		// Called on NextTurn, before a move is requested from the player
		onDisableMovePriority: -100, // after everyone else
		onDisableMove: function(pokemon){
			let shouldEnable = false; // assume we're disabling it
			// If you cannot use Super Glitch, enable
			for (let move of pokemon.moveset) {
				if (move.id === 'superglitch') {
					shouldEnable = move.disabled;
				}
			}
			// If you can recycle a Leppa Berry, enable
			if (!pokemon.item && pokemon.lastItem === 'leppaberry') {
				shouldEnable = true;
			}
			if (!shouldEnable) {
				pokemon.disableMove('recycle');
			}
		}
	},

	bstlimitrule: {
		effectType: 'ValidatorRule',
		name: 'BST Limit Rule',
		onStart: function() {
			this.add('rule', 'BST Limit Rule: Cannot use a Pokemon with a BST higher than 600.');
		},
		onValidateSet: function (set){
			let template = Dex.getTemplate(set.species);
			let totalBST = 0;
			for (let k in template.baseStats) {
				totalBST += template.baseStats[k];
			}
			if (totalBST > 600) {
				return [(set.name || set.species) + " has more than 600 BST (BST Limit Rule)."];
			}
			return [];
		},
	},
	
	duplicateabilityrule: {
		effectType: 'ValidatorRule',
		name: 'Duplicate Ability Rule',
		onStart: function() {
			this.add('rule', 'Duplicate Ability Rule: Cannot have two pokemon with the same ability.');
		},
		onValidateSet: function (set, format, setHas, teamHas){
			if (teamHas[toId(set.ability)] > 1) {
				return ["You may not have the same ability on two or more pokemon by the Duplicate Ability Rule.", `(You have more than one ${this.getAbility(set.ability).name})`];
			}
		},
	},

};
