'use strict';

exports.BattleMovedex = {
	"magnetrise": {
		inherit: true,
		desc: "For 5 turns, the user is immune to Fighting-type attacks and the effects of Spikes, Toxic Spikes, Sticky Web, and the Ability Arena Trap as long as it remains active. If the user uses Baton Pass, the replacement will gain the effect. Ingrain, Smack Down, Thousand Arrows, and Iron Ball override this move if the user is under any of their effects. Fails if the user is already under this effect or the effects of Ingrain, Smack Down, or Thousand Arrows.",
		shortDesc: "For 5 turns, the user is immune to Fighting moves.",
		effect: {
			duration: 5,
			onStart: function (target) {
				if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;
				this.add('-start', target, 'Magnet Rise');
			},
			onImmunity: function (type) {
				if (type === 'Fighting') return false;
			},
			onResidualOrder: 15,
			onEnd: function (target) {
				this.add('-end', target, 'Magnet Rise');
			},
		},
	},
	"stealthrock": {
		inherit: true,
		desc: "Sets up a hazard on the foe's side of the field, damaging each foe that switches in. Can be used only once before failing. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP, rounded down, based on their weakness to the Fighting type; 0.25x, 0.5x, neutral, 2x, or 4x, respectively. Can be removed from the foe's side if any foe uses Rapid Spin or Defog, or is hit by Defog.",
		shortDesc: "Hurts foes on switch-in. Factors Fighting weakness.",
		effect: {
			// this is a side condition
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn: function (pokemon) {
				let typeMod = this.clampIntRange(pokemon.runEffectiveness('Fighting'), -6, 6);
				this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
			},
		},
	},
	"telekinesis": {
		inherit: true,
		desc: "For 3 turns, the target cannot avoid any attacks made against it, other than OHKO moves, as long as it remains active. During the effect, the target is immune to Fighting-type attacks and the effects of Spikes, Toxic Spikes, Sticky Web, and the Ability Arena Trap as long as it remains active. If the target uses Baton Pass, the replacement will gain the effect. Ingrain, Smack Down, Thousand Arrows, and Iron Ball override this move if the target is under any of their effects. Fails if the target is already under this effect or the effects of Ingrain, Smack Down, or Thousand Arrows.",
		effect: {
			duration: 3,
			onStart: function (target) {
				if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;
				this.add('-start', target, 'Telekinesis');
			},
			onAccuracyPriority: -1,
			onAccuracy: function (accuracy, target, source, move) {
				if (move && !move.ohko) return true;
			},
			onImmunity: function (type) {
				if (type === 'Fighting') return false;
			},
			onResidualOrder: 16,
			onEnd: function (target) {
				this.add('-end', target, 'Telekinesis');
			},
		},
	},
	"weatherball": {
		inherit: true,
		desc: "Power doubles during weather effects and this move's type changes to match; Water type during Hail or Rain Dance, Fighting type during Sandstorm, and Fire type during Sunny Day.",
		onModifyMove: function (move) {
			switch (this.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
			case 'hail':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Fighting';
				break;
			}
		},
	},
};