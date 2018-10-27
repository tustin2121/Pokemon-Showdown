"use strict";

exports.BattleMovedex = {
	"auroraveil": {
		inherit: true,
		onTryHitSide: function () {
			if (this.suppressingWeather()) return false;
		},
	},
	"blizzard": {
		inherit: true,
		onModifyMove: function (move) {
			if (!this.suppressingWeather()) move.accuracy = true;
		},
	},
	"growth": {
		inherit: true,
		onModifyMove: function (move) {
			if (!this.suppressingWeather()) move.boosts = { atk: 2, spa: 2 };
		},
	},
	"hail": {
		inherit: true,
		weather: "primordialsea",
	},
	"moonlight": {
		inherit: true,
		onHit: function (pokemon) {
			this.heal(pokemon.maxhp / (this.suppressingWeather() ? 2 : 12));
		},
	},
	"morningsun": {
		inherit: true,
		onHit: function (pokemon) {
			this.heal(pokemon.maxhp / (this.suppressingWeather() ? 2 : 12));
		},
	},
	"sandstorm": {
		inherit: true,
		weather: "primordialsea",
	},
	"shoreup": {
		inherit: true,
		onHit: function (pokemon) {
			this.heal(this.suppressingWeather() ? (pokemon.maxhp / 2) : (pokemon.maxhp * 2 / 3));
		},
	},
	"solarbeam": {
		inherit: true,
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) return;
			this.add('-prepare', attacker, move.name, defender);
			if (this.suppressingWeather() && this.runEvent('ChargeMove', attacker, defender, move)) {
				attacker.addVolatile('twoturnmove', defender);
				return null;
			}
			this.add('-anim', attacker, move.name, defender);
		},
		onBasePower: function (basePOwer, pokemon, target) {
			if (!this.suppressingWeather()) this.chainModify(0.125);
		},
	},
	"solarblade": {
		inherit: true,
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) return;
			this.add('-prepare', attacker, move.name, defender);
			if (this.suppressingWeather() && this.runEvent('ChargeMove', attacker, defender, move)) {
				attacker.addVolatile('twoturnmove', defender);
				return null;
			}
			this.add('-anim', attacker, move.name, defender);
		},
		onBasePower: function (basePOwer, pokemon, target) {
			if (!this.suppressingWeather()) this.chainModify(0.125);
		},
	},
	"sunnyday": {
		inherit: true,
		weaather: "primordialsea",
	},
	"synthesis": {
		inherit: true,
		onHit: function (pokemon) {
			this.heal(pokemon.maxhp / (this.suppressingWeather() ? 2 : 12));
		},
	},
	"thunder": {
		inherit: true,
		onModifyMove: function (move) {
			if (!this.suppressingWeather()) move.accuracy = true;
		},
	},
	"weatherball": {
		inherit: true,
		basePowerCallback: function() {
			return this.suppressingWeather() ? 50 : 800;
		},
		onModifyMove: function (move) {
			if (!this.suppressingWeather()) move.type = 'Ice';
		},
	},
};