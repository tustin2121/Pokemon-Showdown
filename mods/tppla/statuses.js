"use strict";

exports.BattleStatuses = {
	confusion: {
		inherit: true,
		onStart: function (target, source, sourceEffect) {
			if (target.volatiles['sconfusion']) return false;
			if (sourceEffect && sourceEffect.id === 'lockedmove') {
				this.add('-start', target, 'confusion', '[fatigue]');
			} else {
				this.add('-start', target, 'confusion');
			}
			this.effectData.time = this.random(2, 6);
		},
	},
	sconfusion: {
		// sohippy's short switch-in confusion. 70% chance to hit self. doesn't stack with original confusion
		onStart: function (target, source, sourceEffect) {
			let result = !target.volatiles['confusion'] && this.runEvent('TryConfusion', target, source, sourceEffect);
			if (!result) return result;
			this.add('-start', target, 'confusion');
			this.effectData.time = 2;
		},
		onEnd: function (target) {
			this.add('-end', target, 'confusion');
		},
		onBeforeMovePriority: 3,
		onBeforeMove: function (pokemon) {
			pokemon.volatiles.sconfusion.time--;
			if (!pokemon.volatiles.sconfusion.time) {
				pokemon.removeVolatile('sconfusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (this.random(10) < 3) {
				return;
			}
			this.damage(this.getDamage(pokemon, pokemon, 40), pokemon, pokemon, {
				id: 'confused',
				effectType: 'Move',
				type: '???',
			});
			return false;
		},
	},
	scrubterrain: {
		effectType: 'Weather',
		duration: 0,
		onAccuracy: function (accuracy, target, source, move) {
			if (source.hasAbility('keeneye')) return;
			return this.chainModify(0.6);
		},
		onStart: function () {
			this.add('-weather', 'ScrubTerrain');
		},
		onResidualOrder: 1,
		onResidual: function () {
			this.add('-weather', 'ScrubTerrain', '[upkeep]');
			this.eachEvent('Weather');
		},
		onEnd: function () {
			this.add('-weather', 'none');
		},
	},
};
