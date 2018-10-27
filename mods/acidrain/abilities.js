"use strict";

exports.BattleAbilities = {
	"chlorophyll": {
		inherit: true,
		onModifySpe: function (spe, pokemon) {
			if (!this.suppressingWeather()) {
				return this.chainModify(2);
			}
		},
	},
	"desolateland": {
		inherit: true,
		onStart: function (source) {
		},
		onEnd: function (pokemon) {
		},
	},
	"drought": {
		inherit: true,
		onStart: function (source) {
		},
	},
	"dryskin": {
		inherit: true,
		onWeather: function (target, source, effect) {
		},
	},
	"flowergift": {
		inherit: true,
		onUpdate: function (pokemon) {
			if (!pokemon.isActive || pokemon.baseTemplate.baseSpecies !== 'Cherrim' || pokemon.transformed) return;
			if (!this.suppressingWeather()) {
				if (pokemon.template.speciesid !== 'cherrimsunshine') {
					pokemon.formeChange('Cherrim-Sunshine', this.effect, false, '[msg]');
				}
			} else {
				if (pokemon.template.speciesid === 'cherrimsunshine') {
					pokemon.formeChange('Cherrim', this.effect, false, '[msg]');
				}
			}
		},
		onAllyModifyAtk: function (atk) {
			if (this.effectData.target.baseTemplate.baseSpecies !== 'Cherrim') return;
			return this.chainModify(1.5);
		},
		onAllyModifySpD: function (spd) {
			if (this.effectData.target.baseTemplate.baseSpecies !== 'Cherrim') return;
			return this.chainModify(1.5);
		},
	},
	"harvest": {
		inherit: true,
		onResidual: function (pokemon) {
			if (pokemon.hp && !pokemon.item && this.getItem(pokemon.lastItem).isBerry && (!this.suppressingWeather() || this.random(2))) {
				pokemon.setItem(pokemon.lastItem);
				this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
			}
		},
	},
	"icebody": {
		inherit: true,
		onWeather: function (target, source, effect) {
			if (!this.suppressingWeather()) this.heal(target.maxhp / 16);
		},
	},
	"leafguard": {
		inherit: true,
		onSetStatus: function (pokemon) {
			if (!this.suppressingWeather()) return false;
		},
		onTryHit: function (target, source, move) {
			if (move && move.id === 'yawn' && !this.suppressingWeather()) return false;
		},
	},
	"primordialsea": {
		inherit: true,
		onEnd: function (pokemon) {
		},
	},
	"sandforce": {
		inherit: true,
		onBasePower: function (basePower, attacker, defender, move) {
			if ((move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') && !this.suppressingWeather()) return this.chainModify([0x14CD, 0x1000]);
		},
	},
	"sandrush": {
		inherit: true,
		onModifySpe: function (spe, pokemon) {
			if (!this.suppressingWeather()) return this.chainModify(2);
		},
	},
	"sandstream": {
		inherit: true,
		onStart: function (source) {
		},
	},
	"sandveil": {
		inherit: true,
		onAccuracy: function (accuracy) {
			if (typeof accuracy === "number" && !this.suppressingWeather()) return accuracy * 0.8;
		},
	},
	"slushrush": {
		inherit: true,
		onModifySpe: function (spe, pokemon) {
			if (!this.suppressingWeather()) return this.chainModify(2);
		},
	},
	"snowcloak": {
		inherit: true,
		onAccuracy: function (accuracy) {
			if (typeof accuracy === "number" && !this.suppressingWeather()) return accuracy * 0.8;
		},
	},
	"snowwarning": {
		inherit: true,
		onStart: function (source) {
		},
	},
	"solarpower": {
		inherit: true,
		onModifySpA: function (spa, pokemon) {
			if (!this.suppressingWeather()) return this.chainModify(1.5);
		},
		onWeather: function (target, source, effect) {
			this.damage(target.maxhp / 8);
		},
	},
};