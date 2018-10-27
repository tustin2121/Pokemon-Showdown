'use strict';

exports.BattleMovedex = {
	///////////////////////////////////////
	// Move Changes
	///////////////////////////////////////
	"bounce": {
		num: 340,
		accuracy: 85,
		basePower: 85,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Gust, Hurricane, Sky Uppercut, Smack Down, Soar, T-Gust, Thousand Arrows, Thunder, and Twister. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Bounces turn 1. Hits turn 2. 30% paralyze.",
		id: "bounce",
		name: "Bounce",
		pp: 5,
		priority: 0,
		flags: {contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1},
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		effect: {
			duration: 2,
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister' || move.id === 'tgust') {
					return;
				}
				if (move.id === 'skyuppercut' || move.id === 'thunder' || move.id === 'hurricane' || move.id === 'smackdown' || move.id === 'thousandarrows' || move.id === 'helpinghand' || move.id === 'soar') {
					return;
				}
				if (source.hasAbility('noguard') || target.hasAbility('noguard')) {
					return;
				}
				if (source.volatiles['lockon'] && target === source.volatiles['lockon'].source) return;
				return 0;
			},
			onSourceBasePower: function (basePower, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister' || move.id === 'tgust') {
					return this.chainModify(2);
				}
			},
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "any",
		type: "Flying",
		zMovePower: 160,
		contestType: "Cute",
	},
	"fly": {
		num: 19,
		accuracy: 95,
		basePower: 90,
		category: "Physical",
		desc: "This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Gust, Hurricane, Sky Uppercut, Smack Down, Soar, T-Gust, Thousand Arrows, Thunder, and Twister. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Flies up on first turn, then strikes the next turn.",
		id: "fly",
		name: "Fly",
		pp: 15,
		priority: 0,
		flags: {contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1},
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		effect: {
			duration: 2,
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister' || move.id === 'tgust') {
					return;
				}
				if (move.id === 'skyuppercut' || move.id === 'thunder' || move.id === 'hurricane' || move.id === 'smackdown' || move.id === 'thousandarrows' || move.id === 'helpinghand' || move.id === 'soar') {
					return;
				}
				if (source.hasAbility('noguard') || target.hasAbility('noguard')) {
					return;
				}
				if (source.volatiles['lockon'] && target === source.volatiles['lockon'].source) return;
				return 0;
			},
			onSourceModifyDamage: function (damage, source, target, move) {
				if (move.id === 'gust' || move.id === 'twister' || move.id === 'tgust') {
					return this.chainModify(2);
				}
			},
		},
		secondary: false,
		target: "any",
		type: "Flying",
		zMovePower: 175,
		contestType: "Clever",
	},
	"skydrop": { // can we ban this move already?
		num: 507,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "This attack takes the target into the air with the user on the first turn and executes on the second. Pokemon weighing 200kg or more cannot be lifted. On the first turn, the user and the target avoid all attacks other than Gust, Hurricane, Sky Uppercut, Smack Down, Soar, T-Gust, Thousand Arrows, Thunder, and Twister. The user and the target cannot make a move between turns, but the target can select a move to use. This move cannot damage Flying-type Pokemon. Fails on the first turn if the target is an ally or if the target has a substitute.",
		shortDesc: "User and foe fly up turn 1. Damages on turn 2.",
		id: "skydrop",
		name: "Sky Drop",
		pp: 10,
		priority: 0,
		flags: {contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1},
		onModifyMove: function (move, source) {
			if (!source.volatiles['skydrop']) {
				move.accuracy = true;
			}
		},
		onMoveFail: function (target, source) {
			if (source.volatiles['twoturnmove'] && source.volatiles['twoturnmove'].duration === 1) {
				source.removeVolatile('skydrop');
				source.removeVolatile('twoturnmove');
				this.add('-end', target, 'Sky Drop', '[interrupt]');
			}
		},
		onTryHit: function (target, source, move) {
			if (target.fainted) return false;
			if (source.removeVolatile(move.id)) {
				if (target !== source.volatiles['twoturnmove'].source) return false;

				if (target.hasType('Flying')) {
					this.add('-immune', target, '[msg]');
					this.add('-end', target, 'Sky Drop');
					return null;
				}
			} else {
				if (target.volatiles['substitute'] || target.side === source.side) {
					return false;
				}
				if (target.getWeight() >= 200) {
					this.add('-fail', target, 'move: Sky Drop', '[heavy]');
					return null;
				}

				this.add('-prepare', source, move.name, target);
				source.addVolatile('twoturnmove', target);
				return null;
			}
		},
		onHit: function (target, source) {
			this.add('-end', target, 'Sky Drop');
		},
		effect: {
			duration: 2,
			onStart: function () {
				this.effectData.source.removeVolatile('followme');
				this.effectData.source.removeVolatile('ragepowder');
			},
			onAnyDragOut: function (pokemon) {
				if (pokemon === this.effectData.target || pokemon === this.effectData.source) return false;
			},
			onFoeTrapPokemonPriority: -15,
			onFoeTrapPokemon: function (defender) {
				if (defender !== this.effectData.source) return;
				defender.trapped = true;
			},
			onFoeBeforeMovePriority: 12,
			onFoeBeforeMove: function (attacker, defender, move) {
				if (attacker === this.effectData.source) {
					this.debug('Sky drop nullifying.');
					return null;
				}
			},
			onRedirectTargetPriority: 99,
			onRedirectTarget: function (target, source, source2) {
				if (source !== this.effectData.target) return;
				if (this.effectData.source.fainted) return;
				return this.effectData.source;
			},
			onAnyAccuracy: function (accuracy, target, source, move) {
				if (target !== this.effectData.target && target !== this.effectData.source) {
					return;
				}
				if (source === this.effectData.target && target === this.effectData.source) {
					return;
				}
				if (move.id === 'gust' || move.id === 'twister' || move.id === 'tgust') {
					return;
				}
				if (move.id === 'skyuppercut' || move.id === 'thunder' || move.id === 'hurricane' || move.id === 'smackdown' || move.id === 'thousandarrows' || move.id === 'helpinghand' || move.id === 'soar') {
					return;
				}
				if (source.hasAbility('noguard') || target.hasAbility('noguard')) {
					return;
				}
				if (source.volatiles['lockon'] && target === source.volatiles['lockon'].source) return;
				return 0;
			},
			onAnyBasePower: function (basePower, target, source, move) {
				if (target !== this.effectData.target && target !== this.effectData.source) {
					return;
				}
				if (source === this.effectData.target && target === this.effectData.source) {
					return;
				}
				if (move.id === 'gust' || move.id === 'twister' || move.id === 'tgust') {
					return this.chainModify(2);
				}
			},
			onFaint: function (target) {
				if (target.volatiles['skydrop'] && target.volatiles['twoturnmove'].source) {
					this.add('-end', target.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
				}
			},
		},
		secondary: false,
		target: "any",
		type: "Flying",
		zMovePower: 120,
		contestType: "Tough",
	},
	"minimize": {
		num: 107,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's evasiveness by 2 stages. Whether or not the user's evasiveness was changed, Body Slam, Dragon Rush, Flying Press, Heat Crash, Heavy Slam, Phantom Force, Shadow Force, Steamroller, Stomp, T-Body Slam, T-Stomp and Shadow Dive will not check accuracy and have their damage doubled if used against the user while it is active.",
		shortDesc: "Raises the user's evasiveness by 2.",
		id: "minimize",
		name: "Minimize",
		pp: 10,
		priority: 0,
		flags: {snatch: 1},
		volatileStatus: 'minimize',
		effect: {
			noCopy: true,
			onSourceModifyDamage: function (damage, source, target, move) {
				if (move.id in {'stomp':1, 'steamroller':1, 'bodyslam':1, 'flyingpress':1, 'dragonrush':1, 'phantomforce':1, 'heatcrash':1, 'shadowforce':1, 'heavyslam':1, 'tbodyslam':1, 'tstomp':1, 'shadowdive':1}) {
					return this.chainModify(2);
				}
			},
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id in {'stomp':1, 'steamroller':1, 'bodyslam':1, 'flyingpress':1, 'dragonrush':1, 'phantomforce':1, 'heatcrash':1, 'shadowforce':1, 'heavyslam':1, 'tbodyslam':1, 'tstomp':1}) {
					return true;
				}
				return accuracy;
			},
		},
		boosts: {
			evasion: 2,
		},
		secondary: false,
		target: "self",
		type: "Normal",
		zMoveEffect: 'clearnegativeboost',
		contestType: "Cute",
	},

	///////////////////////////////////////
	// Gen 1 Glitch Moves (num = (-1000)~(-1255))
	///////////////////////////////////////
	"superglitch00": {
		num: -1000,
		accuracy: 31,
		basePower: 102,
		category: "Physical",
		desc: "Executes code from address F928 if the opponent doesn't faint. Not really codeable here, so I'll just give you an opcode error. :/",
		shortDesc: "Crashes the game (sorta).",
		id: "superglitch00",
		ignoreImmunity: true,
		isNonstandard: true,
		name: "Super Glitch 00",
		pp: 13,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Fissure');
		},
		onHit: function (target) {
			this.add('-message', "Unknown opcode fc at " + (63784 + this.random(150)).toString(16));
		},
		secondary: false,
		target: "normal",
		type: "Cooltrainer♀",
	},
	"superglitcha7": {
		num: -1167,
		accuracy: 33,
		basePower: 45,
		category: "Physical",
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		id: "superglitcha7",
		ignoreImmunity: true,
		isNonstandard: true,
		name: "Super Glitch A7",
		pp: 0,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		drain: [1, 2],
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Vine Whip');
		},
		secondary: false,
		target: "normal",
		type: "Type 64",
	},
	"tm05": {
		num: -1205,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's evasiveness by 2 stages.",
		shortDesc: "Raises the user's evasiveness by 2.",
		id: "tm05",
		ignoreImmunity: true,
		isNonstandard: true,
		name: "TM05",
		pp: 33,
		priority: 0,
		flags: {snatch: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove("[still]");
		},
		boosts: {
			evasion: 2,
		},
		secondary: false,
		target: "self",
		type: "Type 81",
	},
	"tm07": {
		num: -1207,
		accuracy: 20,
		basePower: 131,
		category: "Physical",
		desc: "Simply crashes the game. What a nice move.",
		shortDesc: "rst 38h",
		id: "tm07",
		isNonstandard: true,
		name: "TM07",
		pp: 0,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Cut');
		},
		secondary: false,
		target: "normal",
		type: "Ghost",
	},
	"tm09": {
		num: -1209,
		accuracy: 20,
		basePower: 255,
		category: "Physical",
		desc: "The user faints after using this move, even if this move fails for having no target. This move is prevented from executing if any active Pokemon has the Ability Damp.",
		shortDesc: "The user faints.",
		id: "tm09",
		ignoreImmunity: true,
		isNonstandard: true,
		name: "TM09",
		pp: 16,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Fire Punch');
		},
		onMoveFail: function (target, source, move) {
			this.faint(source);
		},
		selfdestruct: "always",
		secondary: false,
		target: "normal",
		type: "Type 53",
	},
	"tm29": {
		num: -1229,
		accuracy: 0,
		basePower: 0,
		category: "Status",
		desc: "Simply crashes the game. What a nice move.",
		shortDesc: "rst 38h",
		id: "tm29",
		isNonstandard: true,
		name: "TM29",
		pp: 0,
		priority: 0,
		flags: {},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove("[still]");
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	"tm34": {
		num: -1234,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Does absolutely nothing.",
		shortDesc: "Does nothing.",
		id: "tm34",
		isNonstandard: true,
		name: "TM34",
		pp: 3,
		priority: 0,
		flags: {},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	"tm45": {
		num: -1245,
		accuracy: 31,
		basePower: 18,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "tm45",
		ignoreImmunity: true,
		isNonstandard: true,
		name: "TM45",
		pp: 16,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Scratch');
		},
		secondary: false,
		target: "normal",
		type: "Type 83",
	},
	"tm50": {
		num: -1250,
		accuracy: 28,
		basePower: 56,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "tm50",
		ignoreImmunity: true,
		isNonstandard: true,
		name: "TM50",
		pp: 25,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1},
		multihit: [2, 5],
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Fly');
		},
		secondary: false,
		target: "normal",
		type: "Type 35",
	},
	
	///////////////////////////////////////
	// Touhoumon-exclusive Moves (num = 20000+)
	///////////////////////////////////////
	"tgust": {
		num: 20001,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Damage doubles if the target is using Bounce, Fly, or Sky Drop.",
		shortDesc: "Power doubles during Fly, Bounce, and Sky Drop.",
		id: "tgust",
		name: "T-Gust",
		pp: 35,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Gust');
		},
		secondary: false,
		target: "normal",
		type: "Electric",
		zMovePower: 100,
		contestType: "Clever",
	},
	"decision": {
		num: 20002,
		accuracy: true,
		basePower: 60,
		category: "Special",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "decision",
		name: "Decision",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Judgment');
		},
		secondary: false,
		target: "normal",
		type: "Dragon",
		zMovePower: 120,
		contestType: "Cool",
	},
	"trazorwind": {
		num: 20003,
		accuracy: true,
		basePower: 60,
		category: "Special",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "trazorwind",
		name: "T-Razor Wind",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, distance: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Razor Wind');
		},
		secondary: false,
		target: "any",
		type: "Flying",
		zMovePower: 120,
		contestType: "Cool",
	},
	"tbodyslam": {
		num: 20004,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "30% chance to paralyze the target.",
		id: "tbodyslam",
		isViable: true,
		name: "T-Body Slam",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Body Slam');
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Bug",
		zMovePower: 160,
		contestType: "Tough",
	},
	"tforcepalm": {
		num: 20005,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target.",
		shortDesc: "30% chance to paralyze the target.",
		id: "tforcepalm",
		isViable: true,
		name: "T-Force Palm",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Force Palm');
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Dragon",
		zMovePower: 160,
		contestType: "Cool",
	},
	"textrasensory": {
		num: 20006,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "Has a 20% chance to flinch the target.",
		shortDesc: "20% chance to flinch the target.",
		id: "textrasensory",
		isViable: true,
		name: "T-Extrasensory",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Extrasensory');
		},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Dragon",
		zMovePower: 160,
		contestType: "Cool",
	},
	"ttwister": {
		num: 20007,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "If this move is successful and the user has not fainted, the effects of Leech Seed and partial-trapping moves end for the user, and all hazards are removed from the user's side of the field.",
		shortDesc: "Frees user from hazards/partial trap/Leech Seed.",
		id: "ttwister",
		isViable: true,
		name: "T-Twister",
		pp: 30,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Twister');
		},
		self: {
			onHit: function (pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: T-Twister', '[of] ' + pokemon);
				}
				let sideConditions = {spikes:1, toxicspikes:1, stealthrock:1, stickyweb:1};
				for (let i in sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(i)) {
						this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: T-Twister', '[of] ' + pokemon);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Electric",
		zMovePower: 100,
		contestType: "Cool",
	},
	"taeroblast": {
		num: 20008,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "taeroblast",
		isViable: true,
		name: "T-Aeroblast",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		critRatio: 2,
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Aeroblast');
		},
		secondary: false,
		target: "normal",
		type: "Electric",
		zMovePower: 175,
		contestType: "Cool",
	},
	"tsilverwind": {
		num: 20009,
		accuracy: 80,
		basePower: 110,
		category: "Special",
		desc: "Has a 30% chance to lower the target's Speed by 1 stage.",
		shortDesc: "30% chance to lower the target's Speed by 1.",
		id: "tsilverwind",
		isViable: true,
		name: "T-Silver Wind",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Silver Wind');
		},
		secondary: {
			chance: 30,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Dragon",
		zMovePower: 190,
		contestType: "Cool",
	},
	"tflash": {
		num: 20010,
		accuracy: 90,
		basePower: 65,
		category: "Special",
		desc: "Has a 30% chance to lower the target's Accuracy by 1 stage.",
		shortDesc: "30% chance to lower the target's Accuracy by 1.",
		id: "tflash",
		name: "T-Flash",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Flash');
		},
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Dragon",
		zMovePower: 120,
		contestType: "Beautiful",
	},
	"tmeteormash": {
		num: 20011,
		accuracy: 80,
		basePower: 120,
		category: "Physical",
		desc: "Has a 30% chance to lower the target's Speed by 1 stage.",
		shortDesc: "30% chance to lower the target's Speed by 1.",
		id: "tmeteormash",
		isViable: true,
		name: "T-Meteor Mash",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Meteor Mash');
		},
		secondary: {
			chance: 30,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Steel",
		zMovePower: 190,
		contestType: "Cool",
	},
	"steelfist": {
		num: 20012,
		accuracy: 80,
		basePower: 100,
		category: "Physical",
		desc: "Has a 30% chance to lower the target's Defense by 1 stage.",
		shortDesc: "30% chance to lower the target's Defense by 1.",
		id: "steelfist",
		isViable: true,
		name: "Steel Fist",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Meteor Mash');
		},
		secondary: {
			chance: 30,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Steel",
		zMovePower: 180,
		contestType: "Tough",
	},
	"tstrength": {
		num: 20013,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Has a 10% chance to raise the user's Attack by 1 stage.",
		shortDesc: "10% chance to raise the user's Attack by 1.",
		id: "tstrength",
		isViable: true,
		name: "T-Strength",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Strength');
		},
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Fighting",
		zMovePower: 160,
		contestType: "Tough",
	},
	"tscratch": {
		num: 20014,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "tscratch",
		name: "T-Scratch",
		pp: 40,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Scratch');
		},
		secondary: false,
		target: "normal",
		type: "Steel",
		zMovePower: 100,
		contestType: "Tough",
	},
	"tbite": {
		num: 20015,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "tbite",
		name: "T-Bite",
		pp: 25,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Bite');
		},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Rock",
		zMovePower: 120,
		contestType: "Tough",
	},
	"trage": {
		num: 20016,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 70% chance to burn the user.",
		shortDesc: "70% chance to burn the user.",
		id: "trage",
		name: "T-Rage",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Rage');
		},
		secondary: {
			chance: 70,
			self: {
				status: 'brn',
			},
		},
		target: "normal",
		type: "Dark",
		zMovePower: 120,
		contestType: "Tough",
	},
	"tcut": {
		num: 20017,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		desc: "This move does not check accuracy.",
		shortDesc: "This move does not check accuracy.",
		id: "tcut",
		name: "T-Cut",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Cut');
		},
		secondary: false,
		target: "normal",
		type: "Steel",
		zMovePower: 120,
		contestType: "Cool",
	},
	"tcrunch": {
		num: 20018,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "Has a 20% chance to lower the target's Defense by 1 stage.",
		shortDesc: "20% chance to lower the target's Defense by 1.",
		id: "tcrunch",
		isViable: true,
		name: "T-Crunch",
		pp: 15,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Crunch');
		},
		secondary: {
			chance: 20,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Rock",
		zMovePower: 160,
		contestType: "Tough",
	},
	"tfurycutter": {
		num: 20019,
		accuracy: 90,
		basePower: 40,
		basePowerCallback: function (pokemon, target, move) {
			let bp = move.basePower;
			if (pokemon.volatiles.rollout && pokemon.volatiles.rollout.hitCount) {
				bp *= Math.pow(2, pokemon.volatiles.rollout.hitCount);
			}
			pokemon.addVolatile('tfurycutter');
			if (pokemon.volatiles.defensecurl) {
				bp *= 2;
			}
			this.debug("T-Fury Cutter bp: " + bp);
			return bp;
		},
		category: "Physical",
		desc: "If this move is successful, the user is locked into this move and cannot make another move until it misses, 5 turns have passed, or the attack cannot be used. Power doubles with each successful hit of this move and doubles again if Defense Curl was used previously by the user. If this move is called by Sleep Talk, the move is used for one turn.",
		shortDesc: "Power doubles with each hit. Repeats for 5 turns.",
		id: "tfurycutter",
		name: "T-Fury Cutter",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Fury Cutter');
		},
		effect: {
			duration: 2,
			onLockMove: 'tfurycutter',
			onStart: function () {
				this.effectData.hitCount = 1;
			},
			onRestart: function () {
				this.effectData.hitCount++;
				if (this.effectData.hitCount < 5) {
					this.effectData.duration = 2;
				}
			},
			onResidual: function (target) {
				if (target.lastMove === 'struggle') {
					// don't lock
					delete target.volatiles['tfurycutter'];
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Steel",
		zMovePower: 100,
		contestType: "Cool",
	},
	"killingbite": {
		num: 20020,
		accuracy: 80,
		basePower: 100,
		category: "Physical",
		desc: "Has a 20% chance to flinch the target.",
		shortDesc: "20% chance to flinch the target.",
		id: "killingbite",
		isViable: true,
		name: "Killing Bite",
		pp: 10,
		priority: 0,
		flags: {bite: 1, contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Hyper Fang');
		},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Rock",
		zMovePower: 180,
		contestType: "Tough",
	},
	"braver": {
		num: 20021,
		accuracy: 80,
		basePower: 120,
		category: "Physical",
		desc: "Has a 20% chance to lower the target's Defense by 1 stage.",
		shortDesc: "20% chance to lower the target's Defense by 1.",
		id: "braver",
		isViable: true,
		name: "Braver",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Slash');
		},
		secondary: {
			chance: 20,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Steel",
		zMovePower: 190,
		contestType: "Cool",
	},
	"heatclaw": {
		num: 20022,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
			let targetWeight = target.getWeight();
			if (targetWeight >= 200) {
				return 120;
			}
			if (targetWeight >= 100) {
				return 100;
			}
			if (targetWeight >= 50) {
				return 80;
			}
			if (targetWeight >= 25) {
				return 60;
			}
			if (targetWeight >= 10) {
				return 40;
			}
			return 20;
		},
		category: "Physical",
		desc: "Deals damage to the target based on its weight. Power is 20 if less than 10kg, 40 if less than 25kg, 60 if less than 50kg, 80 if less than 100kg, 100 if less than 200kg, and 120 if greater than or equal to 200kg.",
		shortDesc: "More power the heavier the target.",
		id: "heatclaw",
		isViable: true,
		name: "Heat Claw",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-animcustom', source, target, 'crushclaw', '{delay}300', '{status:tt}brn');
		},
		secondary: false,
		target: "normal",
		type: "Rock",
		zMovePower: 160,
		contestType: "Cool",
	},
	"tfuryswipes": {
		num: 20023,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn.",
		id: "tfuryswipes",
		name: "T-Fury Swipes",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Fury Swipes');
		},
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Rock",
		zMovePower: 100,
		contestType: "Tough",
	},
	"tcrushclaw": {
		num: 20024,
		accuracy: 95,
		basePower: 75,
		category: "Physical",
		desc: "Has a 50% chance to lower the target's Defense by 1 stage.",
		shortDesc: "50% chance to lower the target's Defense by 1.",
		id: "tcrushclaw",
		name: "T-Crush Claw",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Crush Claw');
		},
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Rock",
		zMovePower: 140,
		contestType: "Cool",
	},
	"bladeflash": {
		num: 20025,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		id: "bladeflash",
		isViable: true,
		name: "Blade Flash",
		pp: 30,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-animcustom', source, target, 'quickattack', '{delay}180', 'psychocut');
		},
		secondary: false,
		target: "normal",
		type: "Steel",
		zMovePower: 100,
		contestType: "Cool",
	},
	"tquickattack": {
		num: 20026,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		id: "tquickattack",
		isViable: true,
		name: "T-Quick Attack",
		pp: 30,
		priority: 1,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Quick Attack');
		},
		secondary: false,
		target: "any",
		type: "Flying",
		zMovePower: 100,
		contestType: "Cool",
	},
	"tstomp": {
		num: 20027,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 30% chance to paralyze the target. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "30% chance to paralyze the target.",
		id: "tstomp",
		name: "T-Stomp",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, nonsky: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Stomp');
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Rock",
		zMovePower: 120,
		contestType: "Tough",
	},
	"twingattack": {
		num: 20028,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "twingattack",
		name: "T-Wing Attack",
		pp: 25,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Wing Attack');
		},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "any",
		type: "Flying",
		zMovePower: 120,
		contestType: "Cool",
	},
	"heartbreak": {
		num: 20029,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "No additional effect.",
		id: "heartbreak",
		isViable: true,
		name: "Heart Break",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-animcustom', source, target, 'shadowpunch', '{delay}350', '{status:tt}flinch');
		},
		secondary: false,
		target: "normal",
		type: "Dark",
		zMovePower: 120,
		contestType: "Clever",
	},
	"mindbomb": {
		num: 20030,
		accuracy: 100,
		basePower: 0,
		basePowerCallback: function (pokemon, target) {
			let targetWeight = target.getWeight();
			if (targetWeight >= 200) {
				return 120;
			}
			if (targetWeight >= 100) {
				return 100;
			}
			if (targetWeight >= 50) {
				return 80;
			}
			if (targetWeight >= 25) {
				return 60;
			}
			if (targetWeight >= 10) {
				return 40;
			}
			return 20;
		},
		category: "Physical",
		desc: "Deals damage to the target based on its weight. Power is 20 if less than 10kg, 40 if less than 25kg, 60 if less than 50kg, 80 if less than 100kg, 100 if less than 200kg, and 120 if greater than or equal to 200kg.",
		shortDesc: "More power the heavier the target.",
		id: "mindbomb",
		isViable: true,
		name: "Mind Bomb",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-animcustom', source, target, "magnetbomb", "{delay}300", "{status:tt}confused");
		},
		secondary: false,
		target: "normal",
		type: "Bug",
		zMovePower: 160,
		contestType: "Cool",
	},
	"tfakeout": {
		num: 20031,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "Has a 100% chance to flinch the target. Fails unless it is the user's first turn on the field.",
		shortDesc: "Hits first. First turn out only. 100% flinch chance.",
		id: "tfakeout",
		isViable: true,
		name: "T-Fake Out",
		pp: 10,
		priority: 3,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Fake Out');
		},
		onTry: function (pokemon, target) {
			if (pokemon.activeTurns > 1) {
				this.add('-fail', pokemon);
				this.add('-hint', "T-Fake Out only works on your first turn out.");
				return null;
			}
		},
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Bug",
		zMovePower: 100,
		contestType: "Cute",
	},
	"tancientpower": {
		num: 20032,
		accuracy: 80,
		basePower: 110,
		category: "Special",
		desc: "Has a 20% chance to raise the user's Defense by 1 stage.",
		shortDesc: "20% chance to raise the user's Defense by 1.",
		id: "tancientpower",
		isViable: true,
		name: "T-Ancient Power",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Earth Power');
		},
		secondary: {
			chance: 20,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
		target: "normal",
		type: "Ground",
		zMovePower: 190,
		contestType: "Tough",
	},
	"soar": {
		num: 20033,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "This move can hit a target using Bounce, Fly, or Sky Drop.",
		shortDesc: "Can hit Pokemon using Bounce, Fly, or Sky Drop.",
		id: "soar",
		isViable: true,
		name: "Soar",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1, distance: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Fly');
		},
		secondary: false,
		target: "any",
		type: "Flying",
		zMovePower: 175,
		contestType: "Cool",
	},
	"tslash": { // Brendan T. Slash's signature move Kappa
		num: 20034,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Has a higher chance for a critical hit.",
		shortDesc: "High critical hit ratio.",
		id: "tslash",
		isViable: true,
		name: "T-Slash",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Slash');
		},
		secondary: false,
		target: "normal",
		type: "Rock",
		zMovePower: 195,
		contestType: "Cool",
	},
	"tmirrorshot": {
		num: 20035,
		accuracy: 90,
		basePower: 65,
		category: "Special",
		desc: "Has a 30% chance to lower the target's accuracy by 1 stage.",
		shortDesc: "30% chance to lower the target's accuracy by 1.",
		id: "tmirrorshot",
		name: "T-Mirror Shot",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Mirror Shot');
		},
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Bug",
		zMovePower: 120,
		contestType: "Beautiful",
	},
	"tsignalbeam": {
		num: 20036,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 10% chance to confuse the target.",
		shortDesc: "10% chance to confuse the target.",
		id: "tsignalbeam",
		isViable: true,
		name: "T-Signal Beam",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Signal Beam');
		},
		secondary: {
			chance: 10,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Bug",
		zMovePower: 175,
		contestType: "Beautiful",
	},
	"jamming": {
		num: 20037,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Prevents the target from switching out. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. If the target leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field.",
		shortDesc: "The target cannot switch out.",
		id: "jamming",
		name: "Jamming",
		pp: 5,
		priority: 0,
		flags: {reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit: function (target, source, move) { // epic animation that isn't really being played because no one uses this move
			this.attrLastMove('[still]');
			this.add('-animcustom', source, target, "boomburst", "thunderwave", "discharge", "chatter", "uproar");
		},
		onHit: function (target, source, move) {
			if (!target.addVolatile('trapped', source, move, 'trapper')) {
				this.add('-fail', target);
			}
		},
		secondary: false,
		target: "normal",
		type: "Bug",
		zMoveBoost: {spd: 1},
		contestType: "Cute",
	},
	"tmistball": {
		num: 20038,
		accuracy: 80,
		basePower: 110,
		category: "Special",
		desc: "Has a 30% chance to lower the target's accuracy by 1 stage.",
		shortDesc: "30% chance to lower the target's accuracy by 1.",
		id: "tmistball",
		isViable: true,
		name: "T-Mist Ball",
		pp: 5,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Mist Ball');
		},
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Bug",
		zMovePower: 190,
		contestType: "Clever",
	},
	"tlusterpurge": {
		num: 20039,
		accuracy: 80,
		basePower: 110,
		category: "Special",
		desc: "Has a 20% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "20% chance to lower the target's Sp. Def by 1.",
		id: "tlusterpurge",
		isViable: true,
		name: "T-Luster Purge",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Luster Purge');
		},
		secondary: {
			chance: 20,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Psychic",
		zMovePower: 190,
		contestType: "Clever",
	},
	"tdoubleedge": {
		num: 20040,
		accuracy: 90,
		basePower: 120,
		category: "Physical",
		desc: "If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Has 33% recoil.",
		id: "tdoubleedge",
		isViable: true,
		name: "T-Double-Edge",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		recoil: [33, 100],
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Double-Edge');
		},
		secondary: false,
		target: "normal",
		type: "Rock",
		zMovePower: 190,
		contestType: "Tough",
	},
	"tskullbash": {
		num: 20041,
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		desc: "This attack charges on the first turn and executes on the second. Raises the user's Defense by 1 stage on the first turn. If the user is holding a Power Herb, the move completes in one turn.",
		shortDesc: "Raises user's Defense by 1 on turn 1. Hits turn 2.",
		id: "tskullbash",
		name: "T-Skull Bash",
		pp: 10,
		priority: 0,
		flags: {contact: 1, charge: 1, protect: 1, mirror: 1},
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			this.boost({def:1}, attacker, attacker, this.getMove('tskullbash'));
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				attacker.removeVolatile(move.id);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Skull Bash');
		},
		secondary: false,
		target: "normal",
		type: "Steel",
		zMovePower: 195,
		contestType: "Tough",
	},
	"ticeball": {
		num: 20042,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		desc: "Has a 10% chance to lower the target's Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Defense by 1.",
		id: "ticeball",
		isViable: true,
		name: "T-Ice Ball",
		pp: 10,
		priority: 0,
		flags: {bullet: 1, contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Ice Ball');
		},
		secondary: {
			chance: 20,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Ice",
		zMovePower: 175,
		contestType: "Beautiful",
	},
	"tastonish": {
		num: 20043,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		desc: "Has a 30% chance to flinch the target.",
		shortDesc: "30% chance to flinch the target.",
		id: "tastonish",
		name: "T-Astonish",
		pp: 25,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Astonish');
		},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Ghost",
		zMovePower: 100,
		contestType: "Cute",
	},
	"tshadowball": {
		num: 20044,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 10% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Def by 1.",
		id: "tshadowball",
		isViable: true,
		name: "T-Shadow Ball",
		pp: 15,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Shadow Ball');
		},
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Ghost",
		zMovePower: 175,
		contestType: "Clever",
	},
	"psyshot": {
		num: 20045,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "Has a 10% chance to confuse the target.",
		shortDesc: "10% chance to confuse the target.",
		id: "psyshot",
		name: "Psyshot",
		pp: 25,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Psybeam');
		},
		secondary: {
			chance: 10,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Psychic",
		zMovePower: 100,
		contestType: "Clever",
	},
	"blackripple": {
		num: 20046,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		desc: "Has a 20% chance to paralyze the target.",
		shortDesc: "20% chance to paralyze the target.",
		id: "blackripple",
		name: "Black Ripple",
		pp: 25,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Black Hole Eclipse');
		},
		secondary: {
			chance: 20,
			status: 'par',
		},
		target: "normal",
		type: "Dark",
		zMovePower: 120,
		contestType: "Cool",
	},
	"thyperbeam": {
		num: 20047,
		accuracy: 80,
		basePower: 120,
		category: "Special",
		desc: "Has a 20% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "20% chance to lower the target's Sp. Def by 1.",
		id: "thyperbeam",
		isViable: true,
		name: "T-Hyper Beam",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Hyper Beam');
		},
		secondary: {
			chance: 20,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Dark",
		zMovePower: 190,
		contestType: "Cool",
	},
	"shadowdive": {
		num: 20048,
		accuracy: 100,
		basePower: 140,
		category: "Physical",
		desc: "If this move is successful, it breaks through the target's Baneful Bunker, Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks. If the user is holding a Power Herb, the move completes in one turn. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "Disappears turn 1. Hits turn 2. Breaks protection.",
		id: "shadowdive",
		isViable: true,
		name: "Shadow Dive",
		pp: 5,
		priority: 0,
		flags: {contact: 1, charge: 1, mirror: 1},
		breaksProtect: true,
		onTry: function (attacker, defender, move) {
			this.attrLastMove('[still]');
			if (attacker.removeVolatile(move.id)) {
				this.add('-animcustom', attacker, defender, 'dive', '{delay}300', '{status:tt}focuspunch');
				return;
			}
			this.add('-animcustom', attacker, defender, '{prepare}phantomforce', '{prepare}dive');
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-animcustom', attacker, defender, 'dive', '{delay}300', '{status:tt}focuspunch');
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		effect: {
			duration: 2,
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'helpinghand') {
					return;
				}
				if (source.hasAbility('noguard') || target.hasAbility('noguard')) {
					return;
				}
				if (source.volatiles['lockon'] && target === source.volatiles['lockon'].source) return;
				return 0;
			},
		},
		secondary: false,
		target: "normal",
		type: "Ghost",
		zMovePower: 200,
		contestType: "Cool",
	},
	"gale": {
		num: 20049,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		id: "gale",
		isViable: true,
		name: "Gale",
		pp: 30,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Gust');
		},
		secondary: null,
		target: "any",
		type: "Flying",
		zMovePower: 100,
		contestType: "Cool",
	},
	"batterycharge": {
		num: 20050,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Special Attack by 1 stage.",
		shortDesc: "Raises the user's Sp. Atk by 1.",
		id: "batterycharge",
		name: "Battery Charge",
		pp: 40,
		priority: 0,
		flags: {snatch: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Charge');
		},
		boosts: {
			spa: 1,
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMoveBoost: {spa: 1},
		contestType: "Clever",
	},
	"twhirlpool": {
		num: 20051,
		accuracy: 90,
		basePower: 60,
		category: "Special",
		desc: "Prevents the target from switching for four or five turns (seven turns if the user is holding Grip Claw). Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin or Substitute successfully. This effect is not stackable or reset by using this or another binding move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "twhirlpool",
		name: "T-Whirlpool",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Whirlpool');
		},
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Water",
		zMovePower: 120,
		contestType: "Beautiful",
	},
	"trapidspin": {
		num: 20052,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "If this move is successful and the user has not fainted, the effects of Leech Seed and binding moves end for the user, and all hazards are removed from the user's side of the field.",
		shortDesc: "Frees user from hazards, binding, Leech Seed.",
		id: "trapidspin",
		isViable: true,
		name: "T-Rapid Spin",
		pp: 30,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Rapid Spin');
		},
		self: {
			onHit: function (pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: T-Rapid Spin', '[of] ' + pokemon);
				}
				let sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.getEffect(condition).name, '[from] move: T-Rapid Spin', '[of] ' + pokemon);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Poison",
		zMovePower: 100,
		contestType: "Cool",
	},
	"thydrocannon": {
		num: 20053,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		desc: "Lowers the user's Special Attack by 2 stages.",
		shortDesc: "Lowers the user's Sp. Atk by 2.",
		id: "thydrocannon",
		isViable: true,
		name: "T-Hydro Cannon",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Hydro Cannon');
		},
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: null,
		target: "normal",
		type: "Water",
		zMovePower: 195,
		contestType: "Beautiful",
	},
	"tneedlearm": {
		num: 20054,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Has a 20% chance to flinch the target.",
		shortDesc: "20% chance to flinch the target.",
		id: "tneedlearm",
		isViable: true,
		name: "T-Needle Arm",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Grass",
		zMovePower: 140,
		contestType: "Clever",
	},
	"wanting": {
		num: 20055,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		desc: "If this attack was successful and the user has not fainted, it steals the target's held item if the user is not holding one. The target's item is not stolen if it is a Mail or Z-Crystal, or if the target is a Kyogre holding a Blue Orb, a Groudon holding a Red Orb, a Giratina holding a Griseous Orb, an Arceus holding a Plate, a Genesect holding a Drive, a Silvally holding a Memory, or a Pokemon that can Mega Evolve holding the Mega Stone for its species. Items lost to this move cannot be regained with Recycle or the Harvest Ability.",
		shortDesc: "If the user has no item, it steals the target's.",
		id: "wanting",
		name: "Wanting",
		pp: 25,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onAfterHit: function (target, source, move) {
			if (source.item || source.volatiles['gem']) {
				return;
			}
			let yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (!this.singleEvent('TakeItem', yourItem, target.itemData, source, target, move, yourItem) || !source.setItem(yourItem)) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-item', source, yourItem, '[from] move: Wanting', '[of] ' + target);
		},
		secondary: null,
		target: "normal",
		type: "Bug",
		zMovePower: 120,
		contestType: "Cute",
	},
	"tcharge": {
		num: 20056,
		accuracy: 90,
		basePower: 50,
		category: "Special",
		desc: "Has a 70% chance to raise the user's Special Attack by 1 stage.",
		shortDesc: "70% chance to raise the user's Sp. Atk by 1.",
		id: "tcharge",
		name: "T-Charge",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Parabolic Charge');
		},
		secondary: {
			chance: 70,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Bug",
		zMovePower: 100,
		contestType: "Beautiful",
	},
	"tfaketears": {
		num: 20057,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Lowers the target's Special Attack by 2 stages.",
		shortDesc: "Lowers the target's Sp. Atk by 2.",
		id: "tfaketears",
		name: "T-Fake Tears",
		pp: 20,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, mystery: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Fake Tears');
		},
		boosts: {
			spa: -2,
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		zMoveBoost: {spd: 1},
		contestType: "Cute",
	},
	"splashing": {
		num: 20058,
		accuracy: 100,
		basePower: 60,
		basePowerCallback: function (pokemon, target, move) {
			let hurtByTarget = pokemon.hurtBy.some(p =>
				p.source === target && p.damage > 0 && p.thisTurn
			);
			if (hurtByTarget) {
				this.debug('Boosted for getting hit by ' + target);
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		desc: "Power doubles if the user was hit by the target this turn.",
		shortDesc: "Power doubles if user is damaged by the target.",
		id: "splashing",
		name: "Splashing",
		pp: 10,
		priority: -4,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[anim] Splash');
		},
		secondary: null,
		target: "normal",
		type: "Water",
		zMovePower: 120,
		contestType: "Cute",
	},
	"twrap": {
		num: 20059,
		accuracy: 90,
		basePower: 60,
		category: "Physical",
		desc: "Prevents the target from switching for four or five turns (seven turns if the user is holding Grip Claw). Causes damage to the target equal to 1/8 of its maximum HP (1/6 if the user is holding Binding Band), rounded down, at the end of each turn during effect. The target can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field, or if the target uses Rapid Spin or Substitute successfully. This effect is not stackable or reset by using this or another binding move.",
		shortDesc: "Traps and damages the target for 4-5 turns.",
		id: "twrap",
		name: "T-Wrap",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Grass",
		zMovePower: 120,
		contestType: "Tough",
	},
	"burnpowder": {
		num: 20060,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		desc: "Burns the target.",
		shortDesc: "Burns the target.",
		id: "burnpowder",
		isViable: true,
		name: "Burn Powder",
		pp: 15,
		priority: 0,
		flags: {powder: 1, protect: 1, reflectable: 1, mirror: 1},
		status: 'brn',
		secondary: null,
		target: "normal",
		type: "Grass",
		zMoveBoost: {atk: 1},
		contestType: "Clever",
	},
};
