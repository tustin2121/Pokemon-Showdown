"use strict";

exports.BattleStatuses = {
	primordialsea: {
		effectType: 'Weather',
		duration: 0,
		onImmunity: function (type) {
			if (type == 'frz') return false;
		},
		onModifySpDPriority: 10,
		onModifySpD: function (spd, pokemon) {
			if (pokemon.hasType('Rock')) return this.modify(spd, 1.5);
		},
		onWeatherModifyDamage: function (damage, attacker, defender, move) {
			if (move.type === 'Water' || move.type == 'Fire') return this.chainModify(0.75);
		},
		onResidualOrder: 1,
		onResidual: function () {
			this.add('-weather', 'PrimordialSea', '[upkeep]');
			this.eachEvent('Weather');
		},
		onStart: function (battle, source, effect) {
			this.add('-weather', 'PrimordialSea');
		},
		onWeather: function (target) {
			this.damage(target.maxhp / 16, target, null, "sandstorm");
			this.damage(target.maxhp / 16, target, null, "hail");
		},
	},
};