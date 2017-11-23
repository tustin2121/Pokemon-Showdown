'use strict';

exports.BattleAbilities = {
	"swarming": {
		desc: "On switch-in, if this Pokemon is a Unown that is level 20 or above and has more than 1/4 of its maximum HP left, it changes to Swarm Form. If it is in Swarm Form and its HP drops to 1/4 of its maximum HP or less, it changes to Solo Form at the end of the turn. If it is in Solo Form and its HP is greater than 1/4 its maximum HP at the end of the turn, it changes to Swarm Form.",
		shortDesc: "If user is Unown, changes to Swarm Form if it has > 1/4 max HP, else Solo Form.",
		onStart: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Unown' || pokemon.level < 20 || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.template.speciesid !== 'unownswarm') {
					// this.effectData.prevForm = pokemon.template.speciesid;
					pokemon.formeChange('Unown-Swarm');
					this.add('-formechange', pokemon, 'Unown-Swarm', '[from] ability: Swarming');
				}
			} else {
				if (pokemon.template.speciesid === 'unownswarm') {
					let letter = pokemon.baseTemplate.otherForms;
					letter = letter[Math.floor(Math.random() *letter.length)];
					// letter = this.effectData.prevForm || letter;
					pokemon.formeChange(letter);
					this.add('-formechange', pokemon, letter, '[from] ability: Swarming');
				}
			}
		},
		onResidualOrder: 27,
		onResidual: function (pokemon) {
			if (pokemon.baseTemplate.baseSpecies !== 'Unown' || pokemon.level < 20 || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.template.speciesid !== 'unownswarm') {
					// this.effectData.prevForm = pokemon.template.speciesid;
					pokemon.formeChange('Unown-Swarm');
					this.add('-formechange', pokemon, 'Unown-Swarm', '[from] ability: Swarming');
				}
			} else {
				if (pokemon.template.speciesid === 'unownswarm') {
					let letter = pokemon.baseTemplate.otherForms;
					letter = letter[Math.floor(Math.random() *letter.length)];
					// letter = this.effectData.prevForm || letter;
					pokemon.formeChange(letter);
					this.add('-formechange', pokemon, letter, '[from] ability: Swarming');
				}
			}
		},
		id: "swarming",
		name: "Swarming",
		rating: 2.5,
		num: -208,
	},
	
	"psychicswarm": {
		desc: "This Beast is a living ball of swarming Unown. It is immune to Psychic-type moves and gains stages of Special Attack when hit by a Psychic-type move. All Physical attacks to this pokemon are reduced to chip damage. If it ever reaches +6 SpA, it explodes spectacularly. If it ever reaches -6 SpA, it faints at the end of the turn.",
		shortDesc: "Absorbs and controls Psychic Energy.",
		onSourceModifyDamage: function (basePower, attacker, defender, move) {
			if (move.category === 'Physical') {
				return 1;
			}
		},
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Psychic') {
				//TODO determine from basepower: <=80 => +1, <=160 => +2, >160 >= +3 
				this.boost({spa:1});
				if (!this.heal(target.maxhp / 4)) { //TODO raise stage, or explode if can't
					this.add('-immune', target, '[msg]', '[from] ability: Psychic Swarm');
				}
				return null;
			}
		},
		onAfterBoost: function(target, source) {
			//TODO explode/faint?
		},
		onResidualOrder: 27,
		onResidual: function (pokemon) {
			//TODO explode/faint
		},
		id: "psychicswarm",
		name: "Psychic Swarm",
		rating: 2.5,
		num: -209,
	},
};