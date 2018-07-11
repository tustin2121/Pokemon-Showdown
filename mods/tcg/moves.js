'use strict';

exports.BattleMovedex = {
	"curse": {
		num: 174,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "If the user is not a Psychic type, lowers the user's Speed by 1 stage and raises the user's Attack and Defense by 1 stage. If the user is a Psychic type, the user loses 1/2 of its maximum HP, rounded down and even if it would cause fainting, in exchange for the target losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if there is no target or if the target is already affected.",
		shortDesc: "Curses if Psychic, else +1 Atk, +1 Def, -1 Spe.",
		id: "curse",
		name: "Curse",
		pp: 10,
		priority: 0,
		flags: {authentic: 1},
		volatileStatus: 'curse',
		onModifyMove: function (move, source, target) {
			if (!source.hasType('Psychic')) {
				// @ts-ignore
				move.target = move.nonGhostTarget;
			}
		},
		onTryHit: function (target, source, move) {
			if (!source.hasType('Psychic')) {
				delete move.volatileStatus;
				delete move.onHit;
				move.self = {boosts: {spe: -1, atk: 1, def: 1}};
			} else if (move.volatileStatus && target.volatiles.curse) {
				return false;
			}
		},
		onHit: function (target, source) {
			this.directDamage(source.maxhp / 2, source, source);
		},
		effect: {
			onStart: function (pokemon, source) {
				this.add('-start', pokemon, 'Curse', '[of] ' + source);
			},
			onResidualOrder: 10,
			onResidual: function (pokemon) {
				this.damage(pokemon.maxhp / 4);
			},
		},
		secondary: false,
		target: "normal",
		nonGhostTarget: "self",
		type: "Ghost",
		zMoveEffect: 'curse',
		contestType: "Tough",
	},
	"magnetrise": {
		num: 393,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the user is immune to Fighting-type attacks and the effects of Spikes, Toxic Spikes, Sticky Web, and the Ability Arena Trap as long as it remains active. If the user uses Baton Pass, the replacement will gain the effect. Ingrain, Smack Down, Thousand Arrows, and Iron Ball override this move if the user is under any of their effects. Fails if the user is already under this effect or the effects of Ingrain, Smack Down, or Thousand Arrows.",
		shortDesc: "For 5 turns, the user is immune to Fighting moves.",
		id: "magnetrise",
		name: "Magnet Rise",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, gravity: 1},
		volatileStatus: 'magnetrise',
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
		secondary: false,
		target: "self",
		type: "Electric",
		zMoveBoost: {evasion: 1},
		contestType: "Clever",
	},
	"roost": {
		num: 355,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user restores 1/2 of its maximum HP, rounded half up. Until the end of the turn, Normal-type users lose their Normal type except pure Normal-type users. Does nothing if the user's HP is full.",
		shortDesc: "Heals 50% HP. Normal-type removed 'til turn ends.",
		id: "roost",
		isViable: true,
		name: "Roost",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		heal: [1, 2],
		self: {
			volatileStatus: 'roost',
		},
		effect: {
			duration: 1,
			onResidualOrder: 20,
			onTypePriority: -1,
			onType: function (types, pokemon) {
				this.effectData.typeWas = types;
				return types.filter(type => type !== 'Normal');
			},
		},
		secondary: false,
		target: "self",
		type: "Flying",
		zMoveEffect: 'clearnegativeboost',
		contestType: "Clever",
	},
	"sheercold": {
		num: 329,
		accuracy: 30,
		basePower: 0,
		category: "Special",
		desc: "Deals damage to the target equal to the target's maximum HP. Ignores accuracy and evasiveness modifiers. This attack's accuracy is equal to (user's level - target's level + X)%, where X is 30 if the user is an Water type and 20 otherwise, and fails if the target is at a higher level. Water-type Pokemon and Pokemon with the Ability Sturdy are immune.",
		shortDesc: "OHKOs non-Water targets. Fails if user's lower level.",
		id: "sheercold",
		name: "Sheer Cold",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		ohko: 'Water',
		target: "normal",
		type: "Ice",
		zMovePower: 180,
		contestType: "Beautiful",
	},
	"stealthrock": {
		num: 446,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Sets up a hazard on the foe's side of the field, damaging each foe that switches in. Can be used only once before failing. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP, rounded down, based on their weakness to the Fighting type; 0.25x, 0.5x, neutral, 2x, or 4x, respectively. Can be removed from the foe's side if any foe uses Rapid Spin or Defog, or is hit by Defog.",
		shortDesc: "Hurts foes on switch-in. Factors Fighting weakness.",
		id: "stealthrock",
		isViable: true,
		name: "Stealth Rock",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1},
		sideCondition: 'stealthrock',
		effect: {
			// this is a side condition
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn: function (pokemon) {
				let typeMod = this.clampIntRange(pokemon.runEffectiveness('Fighting'), -6, 6);
				if (!pokemon.hasAbility('Levitate')) {
					this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
				}
			},
		},
		secondary: false,
		target: "foeSide",
		type: "Rock",
		zMoveBoost: {def: 1},
		contestType: "Cool",
	},
	"telekinesis": {
		num: 477,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 3 turns, the target cannot avoid any attacks made against it, other than OHKO moves, as long as it remains active. During the effect, the target is immune to Fighting-type attacks and the effects of Spikes, Toxic Spikes, Sticky Web, and the Ability Arena Trap as long as it remains active. If the target uses Baton Pass, the replacement will gain the effect. Ingrain, Smack Down, Thousand Arrows, and Iron Ball override this move if the target is under any of their effects. Fails if the target is already under this effect or the effects of Ingrain, Smack Down, or Thousand Arrows. The target is immune to this move on use if its species is Diglett, Dugtrio, Alolan Diglett, Alolan Dugtrio, Sandygast, Palossand, or Gengar while Mega-Evolved. Mega Gengar cannot be under this effect by any means.",
		shortDesc: "For 3 turns, target floats but moves can't miss it.",
		id: "telekinesis",
		name: "Telekinesis",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, gravity: 1, mystery: 1},
		volatileStatus: 'telekinesis',
		effect: {
			duration: 3,
			onStart: function (target) {
				if (['Diglett', 'Dugtrio', 'Palossand', 'Sandygast'].includes(target.baseTemplate.baseSpecies) ||
						target.baseTemplate.species === 'Gengar-Mega') {
					this.add('-immune', target, '[msg]');
					return null;
				}
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
			onUpdate: function (pokemon) {
				if (pokemon.baseTemplate.species === 'Gengar-Mega') {
					delete pokemon.volatiles['telekinesis'];
					this.add('-end', pokemon, 'Telekinesis', '[silent]');
				}
			},
			onResidualOrder: 16,
			onEnd: function (target) {
				this.add('-end', target, 'Telekinesis');
			},
		},
		secondary: false,
		target: "normal",
		type: "Psychic",
		zMoveBoost: {spa: 1},
		contestType: "Clever",
	},
	"thousandarrows": {
		num: 614,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "This move can hit airborne Pokemon, which includes Normal-type Pokemon, Pokemon with the Ability Levitate, Pokemon holding an Air Balloon, and Pokemon under the effect of Magnet Rise or Telekinesis. If the target is a Normal type and is not already grounded, this move deals neutral damage regardless of its other type(s). This move can hit a target using Bounce, Fly, or Sky Drop. If this move hits a target under the effect of Bounce, Fly, Magnet Rise, or Telekinesis, the effect ends. If the target is a Normal type that has not used Roost this turn or a Pokemon with the Ability Levitate, it loses its immunity to Fighting-type attacks and the Ability Arena Trap as long as it remains active. During the effect, Magnet Rise fails for the target and Telekinesis fails against the target.",
		shortDesc: "Grounds adjacent foes. First hit neutral on Normal.",
		id: "thousandarrows",
		isViable: true,
		name: "Thousand Arrows",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, nonsky: 1},
		onEffectiveness: function (typeMod, type, move) {
			// @ts-ignore
			if (move.type !== 'Fighting') return;
			let target = this.activeTarget;
			if (!target) return; // avoid crashing when called from a chat plugin
			// ignore effectiveness if the target is Normal type and immune to Fighting
			if (!target.runImmunity('Fighting')) {
				if (target.hasType('Normal')) return 0;
			}
		},
		volatileStatus: 'smackdown',
		ignoreImmunity: {'Fighting': true},
		secondary: false,
		target: "allAdjacentFoes",
		type: "Ground",
		zMovePower: 180,
		contestType: "Beautiful",
	},
	"toxic": {
		num: 92,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		desc: "Badly poisons the target. If a Psychic-type Pokemon uses this move, the target cannot avoid the attack, even if the target is in the middle of a two-turn move.",
		shortDesc: "Badly poisons the target.",
		id: "toxic",
		isViable: true,
		name: "Toxic",
		pp: 10,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		// No Guard-like effect for Psychic-type users implemented in BattleScripts#tryMoveHit
		status: 'tox',
		secondary: false,
		target: "normal",
		type: "Poison",
		zMoveBoost: {def: 1},
		contestType: "Clever",
	},
	"weatherball": {
		num: 311,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		desc: "Power doubles during weather effects (except strong winds) and this move's type changes to match; Water type during Hail and Rain Dance, Fighting type during Sandstorm, and Fire type during Sunny Day.",
		shortDesc: "Power doubles and type varies in each weather.",
		id: "weatherball",
		name: "Weather Ball",
		pp: 10,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		onModifyMove: function (move) {
			switch (this.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				move.basePower *= 2;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'hail':
				move.type = 'Water';
				move.basePower *= 2;
				break;
			case 'sandstorm':
				move.type = 'Fighting';
				move.basePower *= 2;
				break;
			}
		},
		secondary: false,
		target: "normal",
		type: "Normal",
		zMovePower: 160,
		contestType: "Beautiful",
	},
	"flyingpress": {
        num: 560,
        accuracy: 95,
        basePower: 100,
        category: "Physical",
        desc: "This move combines Normal in its type effectiveness against the target. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
        shortDesc: "Combines Normal in its type effectiveness.",
        id: "flyingpress",
        name: "Flying Press",
        pp: 10,
        flags: {contact: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, nonsky: 1},
        onEffectiveness: function (typeMod, type, move) {
            // @ts-ignore
            return typeMod + this.getEffectiveness('Normal', type);
        },
        priority: 0,
        secondary: false,
        target: "any",
        type: "Fighting",
        zMovePower: 170,
        contestType: "Tough",
	},
	"rototiller": {
        num: 563,
        accuracy: true,
        basePower: 0,
        category: "Status",
        desc: "Raises the Attack and Special Attack of all grounded Grass-type Pokemon on the field by 1 stage.",
        shortDesc: "Raises Atk, Sp. Atk of grounded Grass types by 1.",
        id: "rototiller",
        name: "Rototiller",
        pp: 10,
        priority: 0,
        flags: {distance: 1, nonsky: 1},
        onHitField: function (target, source) {
            let targets = [];
            let anyAirborne = false;
            for (const side of this.sides) {
                for (const pokemon of side.active) {
                    if (!pokemon || !pokemon.isActive) continue;
                    if (!pokemon.runImmunity('Fighting')) {
                        this.add('-immune', pokemon, '[msg]');
                        anyAirborne = true;
                        continue;
                    }
                    if (pokemon.hasType('Grass')) {
                        // This move affects every grounded Grass-type Pokemon in play.
                        targets.push(pokemon);
                    }
                }
            }
            if (!targets.length && !anyAirborne) return false; // Fails when there are no grounded Grass types or airborne Pokemon
            for (const pokemon of targets) {
                this.boost({atk: 1, spa: 1}, pokemon, source);
            }
        },
        secondary: false,
        target: "all",
        type: "Ground",
        zMoveBoost: {atk: 1},
        contestType: "Tough",
	},
	"trickortreat": {
        num: 567,
        accuracy: 100,
        basePower: 0,
        category: "Status",
        desc: "Causes the Psychic type to be added to the target, effectively making it have two or three types. Fails if the target is already a Psychic type. If Forest's Curse adds a type to the target, it replaces the type added by this move and vice versa.",
        shortDesc: "Adds Psychic to the target's type(s).",
        id: "trickortreat",
        name: "Trick-or-Treat",
        pp: 20,
        priority: 0,
        flags: {protect: 1, reflectable: 1, mirror: 1, mystery: 1},
        onHit: function (target) {
            if (target.hasType('Psychic')) return false;
            if (!target.addType('Psychic')) return false;
            this.add('-start', target, 'typeadd', 'Psychic', '[from] move: Trick-or-Treat');

            if (target.side.active.length === 2 && target.position === 1) {
                // Curse Glitch
                const action = this.willMove(target);
                if (action && action.move.id === 'curse') {
                    action.targetLoc = -1;
                }
            }
        },
        secondary: false,
        target: "normal",
        type: "Ghost",
        zMoveBoost: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1},
        contestType: "Cute",
    },
};
