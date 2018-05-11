'use strict';

exports.BattleMovedex = {
	"corruptedstrike": {
		accuracy: 90,
		basePower: 60,
		category: "Physical",
		desc: "Hits the opponent with 100% recoil.",
		shortDesc: "100% recoil.",
		id: "corruptedstrike",
		isNonstandard: true,
		name: "Corrupted Strike",
		pp: 5,
		priority: 0,
		flags: {contact: 1, protect: 1},
		target: "normal",
		type: "Poison",
		recoil: [1, 1],
	},
	"disappointment": {
		num: 622,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user faints and the Pokemon brought out to replace it has its HP fully restored along with having any major status condition cured and getting a boost in all stats. Fails if the user is the last unfainted Pokemon in its party.",
		shortDesc: "User faints. Replacement is fully healed with boosts.",
		id: "disappointment",
		isViable: true,
		name: "Disappointment",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onTryHit: function (pokemon, target, move) {
			if (!this.canSwitch(pokemon.side)) {
				delete move.selfdestruct;
				return false;
			}
		},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Lunar Dance', source);
		},
		selfdestruct: true,
		sideCondition: 'disappointment',
		effect: {
			duration: 2,
			onStart: function (side, source) {
				this.debug('Disappointment started on ' + side.name);
				this.effectData.positions = [];
				for (let i = 0; i < side.active.length; i++) {
					this.effectData.positions[i] = false;
				}
				this.effectData.positions[source.position] = true;
			},
			onRestart: function (side, source) {
				this.effectData.positions[source.position] = true;
			},
			onSwitchInPriority: 1,
			onSwitchIn: function (target) {
				if (!this.effectData.positions[target.position]) {
					return;
				}
				if (!target.fainted) {
					target.heal(target.maxhp);
					target.setStatus('');
					this.boost({atk:1, def:1, spa:1, spd:1, spe:1}, target);
					this.add('-heal', target, target.getHealth, '[from] move: Disappointment');
					this.effectData.positions[target.position] = false;
				}
				if (!this.effectData.positions.some(affected => affected === true)) {
					target.side.removeSideCondition('disappointment');
				}
			},
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	'darkfire': {
		num: 623,
		name: 'Darkfire',
		id: 'darkfire',
		basePower: 90,
		accuracy: 100,
		category: 'Special',
		target: 'any',
		flags: {protect: 1, mirror: 1},
		onEffectiveness: function (typeMod, type, move) {
			return typeMod + this.getEffectiveness('Fire', type); // includes Fire in its effectiveness.
		},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Flamethrower', target);
		},
		self: {
			onHit: function (pokemon) { // Mega evolves dfg
				let temp = pokemon.item;
				pokemon.item = 'houndoominite'; // in order to make it mega evolvable, add a Houndoomite temporarily.
				pokemon.canMegaEvo = this.canMegaEvo(pokemon);
				if (pokemon.canMegaEvo) this.runMegaEvo(pokemon);
				pokemon.item = temp; // give its normal item back.
			},
		},
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		priority: 0,
		pp: 15,
		type: 'Dark',
	},
	'superglitch': {
		num: 624,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "A random move is selected for use, other than After You, Assist, Belch, Bestow, Celebrate, Chatter, Copycat, Counter, Covet, Crafty Shield, Destiny Bond, Detect, Diamond Storm, Endure, Feint, Focus Punch, Follow Me, Freeze Shock, Happy Hour, Helping Hand, Hold Hands, Hyperspace Hole, Ice Burn, King's Shield, Light of Ruin, Mat Block, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Quash, Quick Guard, Rage Powder, Relic Song, Secret Sword, Sketch, Sleep Talk, Snarl, Snatch, Snore, Spiky Shield, Steam Eruption, Struggle, Switcheroo, Techno Blast, Thief, Thousand Arrows, Thousand Waves, Transform, Trick, V-create, or Wide Guard.",
		shortDesc: "Picks a random move.",
		id: "superglitch",
		name: "(Super Glitch)",
		pp: 10,
		priority: 0,
		multihit: [2, 5],
		flags: {},
		onHit: function (target) {
			let moves = [];
			for (let i in exports.BattleMovedex) {
				let move = exports.BattleMovedex[i];
				if (i !== move.id) continue;
				if (move.isNonstandard) continue;
				let noMetronome = {
					afteryou:1, assist:1, belch:1, bestow:1, celebrate:1, chatter:1, copycat:1, counter:1, covet:1, craftyshield:1, destinybond:1, detect:1, diamondstorm:1, dragonascent:1, endure:1, feint:1, focuspunch:1, followme:1, freezeshock:1, happyhour:1, helpinghand:1, holdhands:1, hyperspacefury:1, hyperspacehole:1, iceburn:1, kingsshield:1, lightofruin:1, matblock:1, mefirst:1, metronome:1, mimic:1, mirrorcoat:1, mirrormove:1, naturepower:1, originpulse:1, precipiceblades:1, protect:1, quash:1, quickguard:1, ragepowder:1, relicsong:1, secretsword:1, sketch:1, sleeptalk:1, snarl:1, snatch:1, snore:1, spikyshield:1, steameruption:1, struggle:1, switcheroo:1, technoblast:1, thief:1, thousandarrows:1, thousandwaves:1, transform:1, trick:1, vcreate:1, wideguard:1,
				};
				if (!noMetronome[move.id]) {
					moves.push(move);
				}
			}
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = moves[this.random(moves.length)].id;
			}
			if (!randomMove) {
				return false;
			}
			this.useMove(randomMove, target);
		},
		onTryHit: function (target, source) { // can cause TMTRAINER effect randomly
			if (!source.isActive) return null;
			if (this.random(777) !== 42) return; // 1/777 chance to cause TMTRAINER effect
			let opponent = target;
			opponent.setStatus('brn');
			let possibleStatuses = ['confusion', 'flinch', 'attract', 'focusenergy', 'foresight', 'healblock'];
			for (let i = 0; i < possibleStatuses.length; i++) {
				if (this.random(3) === 1) {
					opponent.addVolatile(possibleStatuses[i]);
				}
			}

			function generateNoise() { // make some random glitchy text.
				let noise = '';
				let random = this.random(40, 81);
				for (let i = 0; i < random; i++) {
					if (this.random(4) !== 0) {
						// Non-breaking space
						noise += '\u00A0';
					} else {
						noise += String.fromCharCode(this.random(0xA0, 0x3040));
					}
				}
				return noise;
			}
			// weird effects.
			this.add('-message', "(Enemy " + generateNoise.call(this) + " TMTRAINER " + opponent.name + " is frozen solid?)");
			this.add('-message', "(Enemy " + generateNoise.call(this) + " TMTRAINER " + opponent.name + " is hurt by its burn!)");
			this.damage(opponent.maxhp * this.random(42, 96) * 0.01, opponent, opponent);
			let exclamation = source.status === 'brn' ? '!' : '?';
			this.add('-message', "(Enemy " + generateNoise.call(this) + " TMTRAINER " + source.name + " is hurt by its burn" + exclamation + ")");
			this.damage(source.maxhp * this.random(24, 48) * 0.01, source, source);
			return null;
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	'tm56': {
		num: 625,
		name: 'TM56',
		id: 'tm56',
		type: '???',
		basePower: 205,
		accuracy: 37,
		pp: 15,
		drain: [1, 2],
		category: 'Physical',
		flags: {pulse: 1, bullet: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) { // Turns user into ???-type.
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Wish', source);
			if (!source.hasType('???')) { // turn user into ???-type and spout glitchy nonsense.
				this.add("c|" + source.name + "|9̜͉̲͇̱̘̼ͬ̈́̒͌̑̓̓7ͩ͊̚5ͨ̆͐͏̪̦6̗͎ͬ̿̍̍̉ͧ͢4̯̠ͤ͛͐̄͒͡2͐ͬ̀d̺͉̜̈ͯ̓x̩̖̥̦̥͛́ͥ͑̈́ͩ͊͠║̛̥̜̱̝͍͒̌ͣ̀͌͌̒'̣͎̗̬̯r̸̗͍ͫ̓͆ͣ̎͊ ̜̻̈D͓̰̳̝̥̙͙͋̀E͉͔̥͇̫͓͍̔ͬͣ͂̓̽x̰̗̬̖͊̏̄̑̒̿͊s̜̪̏́f̧̯̼̦̓͌̇̒o̱̾̓ͩ̆̓̀F̟̰͓̩̂̆͛ͤ▓̣̩̝̙̇̓͒͋̈͡1̡̹̹͓̬͖͐̑̉̔̏xͥ̀'̻͖͍̠̉͡v̫̼̹̳̤̱͉▓̄̏͂ͤͭ̋ͫ͏̠̦̝▓̟͉͇̣̠̦̓̄ͫͥ̐̍̂▓͔̦̫̦̜̖́▓͍ͯ͗̾͆▓̮̗̠̜͙̹̟͊̎ͤ̔̽ͬ̃▓̩̟̏ͪ̇̂̂̒▓̖̼̤͉ͤ̾̋ͥͣͬ͒▓̈́̿͂̌̓▓͇̞̗̽̔̂͊̌ͣ͐▓ͬ́ͥ̔͒͒̎▓̰̪̫̩͇̲̇̔̿͢ͅ▓̞̬͎▓̖͍̖̫ͪ͐̆̅̍̂ͨͅ▓̡̭̠̗̳̬̜̝▓̤͙̥̆̌ͨͪ̆͌▓̴͉̩̈́▓ͩ̌̌̂̿̑̐▓ͨ҉͕̠͍▓̹̌̅̂ͨ͋̃͑▓̯̰̣̝̯ͭͦ̂͋̇̾͠▓̸̺̣̜̯̙̂͋̈ͨ̎̾ͧ▓͢▓͔̚▓̭͎͖̟̼̄̈̃̎́▓̧̌ͧ▓̼̹͈͗̄̆");
				source.setType('Bird');
				this.add('-start', source, 'typechange', '???');
			}
		},
		onHit: function (target, source) { // Turns target into ???-type.
			if (target.hasType('???')) return true;
			target.setType('???');
			this.add('-start', target, 'typechange', '???');
		},
		onMoveFail: function (target, source, move) {
			this.boost({accuracy:1, evasion:1}, source);
		},
	},
	'hexattack': {
		num: 626,
		name: 'Hex Attack',
		id: 'hexattack',
		type: 'Ghost',
		category: 'Special',
		basePower: 100,
		accuracy: 90,
		pp: 5,
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Tri Attack', target);
		},
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 25,
			onHit: function (target, source) { // random status.
				let result = this.random(6);
				if (result === 0) {
					target.trySetStatus('brn', source);
				} else if (result === 1) {
					target.trySetStatus('par', source);
				} else if (result === 2) {
					target.trySetStatus('frz', source);
				} else if (result === 3) {
					target.addVolatile('confusion');
				} else if (result === 4) {
					target.addVolatile('attract');
				} else {
					target.trySetStatus('slp', source);
				}
			},
		},
	},
	'projectilespam': {
		num: 627,
		name: 'Projectile Spam',
		id: 'projectilespam',
		type: 'Fighting',
		category: 'Physical',
		pp: 20,
		basePower: 12,
		multihit: [8, 11],
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Bullet Punch', target);
		},
		self: {
			volatileStatus: 'lockedmove',
		},
		onAfterMove: function (pokemon) {
			if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
				pokemon.removeVolatile('lockedmove');
			}
		},
		flags: {protect: 1, mirror: 1},
	},
	'bulk': {
		num: 628,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Raises the user's Attack and Defense by 2 stages.",
		shortDesc: "Raises the user's Attack and Defense by 2.",
		id: "bulk",
		isViable: true,
		name: "BULK!!",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		boosts: {
			atk: 2,
			def: 2,
		},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Bulk Up', source);
		},
		secondary: false,
		target: "self",
		type: "Fighting",
	},
	'shadowrush': {
		num: 629,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		id: "shadowrush",
		name: "Shadow Rush",
		pp: 5,
		priority: 2,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Ghost",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Shadow Sneak', target);
		},
	},
	'partingvoltturn': {
		num: 630,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Uses Parting Shot, Volt Switch and U-Turn in the same turn.",
		shortDesc: "Gets the fuck out of here.", // hue
		id: "partingvoltturn",
		name: "Parting Volt Turn",
		pp: 10,
		priority: 0,
		flags: {},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add("c|" + source.name + "|I'm getting outta here! Byeeeee~");
		},
		onHit: function (target) {
			this.useMove('partingshot', target);
			this.useMove('voltswitch', target);
			this.useMove('uturn', target);
		},
		secondary: false,
		target: "self",
		type: "Normal",
	},
	'evolutionbeam': {
		num: 631,
		accuracy: 100,
		basePower: 10,
		category: "Special",
		desc: "Hits once for every eeveelution.",
		shortDesc: "Hits once for every eeveelution.",
		id: "evolutionbeam",
		name: "Evolution Beam",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation depending on type.
			this.attrLastMove('[still]');
			if (move.type === 'Normal') {
				this.add('-anim', source, "Swift", target);
			} else if (move.type === 'Fire') {
				this.add('-anim', source, "Flamethrower", target);
			} else if (move.type === 'Water') {
				this.add('-anim', source, "Hydro Pump", target);
			} else if (move.type === 'Electric') {
				this.add('-anim', source, "Zap Cannon", target);
			} else if (move.type === 'Psychic') {
				this.add('-anim', source, "Psybeam", target);
			} else if (move.type === 'Dark') {
				this.add('-anim', source, "Shadow Ball", target);
			} else if (move.type === 'Ice') {
				this.add('-anim', source, "Ice Beam", target);
			} else if (move.type === 'Grass') {
				this.add('-anim', source, 'Solar Beam', target);
			} else if (move.type === 'Fairy') {
				this.add('-anim', source, 'Dazzling Gleam', target);
			}
		},
		onTryHit: function (target, pokemon, move) {
			if (move.type === 'Normal') {
				let t = move.eeveelutiontypes.slice(0);
				move.accuracy = true; // What's this line for?
				for (let i = 0; i < move.eeveelutiontypes.length; i++) { // hit for all eeveelution types in random order.
					let r = this.random(t.length);
					move.type = t[r];
					t.splice(r, 1);
					this.useMove(move, pokemon, target);
				}
				move.type = 'Normal';
				move.accuracy = 100;
			}
		},
		eeveelutiontypes: ['Fire', 'Water', 'Electric', 'Psychic', 'Dark', 'Grass', 'Ice', 'Fairy'],
		secondary: false,
		target: "normal",
		type: "Normal",
	},
	'hyperwahahahahaha': {
		num: 632,
		name: 'Hyper WAHAHAHAHAHA',
		id: 'hyperwahahahahaha',
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 20% chance to paralyze the target and a 20% chance to confuse it.",
		shortDesc: "20% chance to paralyze. 20% chance to confuse.",
		isViable: true,
		pp: 15,
		priority: 0,
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Boomburst', target);
		},
		secondaries: [{chance: 20, status: 'par'}, {chance: 20, volatileStatus: 'confusion'}],
		target: "normal",
		type: "Electric",
	},
	'broadside': {
		num: 633,
		name: 'Broadside',
		id: 'broadside',
		accuracy: 100,
		basePower: 18,
		multihit: 5,
		category: "Special",
		desc: "Hits 5 times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits.",
		shortDesc: "Hits 5 times in one turn.",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, bullet: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Spike Cannon', target);
		},
		secondary: false,
		target: "allAdjacent",
		type: "Water",
	},
	'bestfcar': {
		num: 634,
		name: 'BEST F-CAR',
		id: 'bestfcar',
		basePower: 60,
		secondaries: [{chance: 20, status: 'brn'}, {chance: 100, self: {boosts: {spa: 1}}}],
		accuracy: 100,
		category: "Special",
		desc: "Has a 20% chance to burn the target. Raises the user's Special Attack by 1 stage.",
		shortDesc: "20% chance to burn the target. Raises Sp.Atk by 1.",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1, contact: 1, defrost: 1},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Sacred Fire', target);
		},
		target: "normal",
		type: "Fire",
	},
	'eternalstruggle': {
		num: 635,
		name: 'Eternal Struggle',
		id: 'eternalstruggle',
		category: 'Special',
		type: 'Electric',
		desc: "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded half up, but not less than 1 HP. Lowers the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage.",
		shortDesc: "Lowers all stats by 1 (not acc/eva). Has 1/2 recoil.",
		pp: 5,
		priority: 0,
		basePower: 180,
		accuracy: 100,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Volt Tackle', target);
		},
		recoil: [1, 2],
		onHit: function (target, source, move) {
			this.boost({atk:-1, def:-1, spa:-1, spd:-1, spe:-1}, source);
		},
	},
	'nofun': {
		num: 636,
		name: 'No Fun',
		id: 'nofun',
		category: 'Physical',
		priority: 1,
		basePower: 40,
		accuracy: true,
		type: 'Bug',
		pp: 20,
		flags: {protect: 1, mirror: 1},
		onHit: function (target) {
			target.clearBoosts();
			this.add('-clearboost', target);
		},
		secondary: false,
		target: "normal",
	},
	'ironfist': {
		num: 637,
		name: 'Iron Fist',
		id: 'ironfist',
		category: 'Physical',
		basePower: 90,
		accuracy: 100,
		pp: 10,
		type: 'Steel',
		flags: {contact:1, protect:1, mirror:1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Hammer Arm', target);
		},
		onHit: function (target) {
			let bannedAbilities = {multitype:1, defeatist:1, stancechange:1, truant:1};
			if (!bannedAbilities[target.ability]) {
				let oldAbility = target.setAbility('defeatist');
				if (oldAbility) {
					this.add('-endability', target, oldAbility, '[from] move: Iron Fist');
					this.add('-ability', target, 'Defeatist', '[from] move: Iron Fist');
					return;
				}
			}
		},
		self: {
			onHit: function (pokemon) {
				let temp = pokemon.item;
				pokemon.item = 'Scizorite';
				if (!pokemon.template.isMega) pokemon.canMegaEvo = this.canMegaEvo(pokemon); // don't mega evolve if it's already mega
				if (pokemon.canMegaEvo) this.runMegaEvo(pokemon);
				pokemon.item = temp; // give its normal item back.
			},
		},
	},
	'afk': {
		num: 638,
		name: 'AFK',
		id: 'afk',
		category: 'Special',
		type: 'Fire',
		basePower: 120,
		accuracy: 100,
		pp: 5,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1},
		desc: "This attack charges on the first and second turns and executes on the third, and shows how AFK the user can be. On the first and second turns, the user avoids all attacks.",
		shortDesc: "Disappears turns 1 and 2. Hits turn 3.",
		onTry: function (attacker, defender, move) {
			this.attrLastMove('[still]');
			if (attacker.volatiles[move.id] && attacker.volatiles[move.id].duration === 1) {
				this.add('-anim', attacker, 'Flare Blitz', defender);
				this.add('c|' + attacker.name + '|back');
				attacker.removeVolatile(move.id);
				return;
			}
			if (!attacker.volatiles[move.id]) {
				this.add('c|' + attacker.name + '|afk');
				this.add('-prepare', attacker, 'Shadow Force', defender);
			} else {
				this.add('raw|' + attacker.name + ' is still gone!');
			}
			attacker.addVolatile('afk', defender);
			return null;
		},
		effect: {
			duration: 3,
			onLockMove: 'afk',
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
		secondaries: [{chance: 20, volatileStatus: 'confusion'}, {chance: 10, status: 'slp'}],
		target: 'normal',
	},
	"godbird": {
		num: 638,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks. If the user is holding a Power Herb, the move completes in one turn. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "Soars in the sky turn 1. Hits turn 2. Breaks protection.",
		id: "godbird",
		name: "God Bird",
		pp: 15,
		priority: 0,
		flags: {contact: 1, charge: 1, mirror: 1, gravity: 1, distance: 1},
		breaksProtect: true,
		self: {
			onHit: function (pokemon) {
				let temp = pokemon.item;
				pokemon.item = 'pidgeotite';
				if (!pokemon.template.isMega) pokemon.canMegaEvo = this.canMegaEvo(pokemon);
				if (pokemon.canMegaEvo) this.runMegaEvo(pokemon);
				pokemon.item = temp;
			},
		},
		onTry: function (attacker, defender, move) {
			this.attrLastMove('[still]');
			if (attacker.removeVolatile(move.id)) {
				this.add('-anim', attacker, 'Sky Attack', defender);
				return;
			}
			this.add('-prepare', attacker, 'Fly', defender);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, 'Fly', defender);
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
		target: "any",
		type: "Flying",
	},
	'reroll': {
		num: 639,
		accuracy: true,
		basePower: 0,
		category: 'Status',
		flags: {},
		pp: 10,
		priority: 0,
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Dragon Dance', source);
		},
		onHit: function (target) {
			if (!target.template.isMega) {
				let moves = [];
				for (let i = 0; i < target.moveSlots.length; i++) {
					let move = target.moveSlots[i].id;
					if (move.id !== 'reroll') moves.push(move);
				}
				let randomMove = '';
				if (moves.length) randomMove = moves[this.random(moves.length)];
				if (randomMove) {
					this.useMove(randomMove, target);
				}
				let megaStoneList = [
					'Abomasite',
					'Absolite',
					'Aerodactylite',
					'Aggronite',
					'Alakazite',
					'Altarianite',
					'Ampharosite',
					'Audinite',
					'Banettite',
					'Beedrillite',
					'Blastoisinite',
					'Blazikenite',
					'Cameruptite',
					'Charizardite X',
					'Charizardite Y',
					'Diancite',
					'Galladite',
					'Garchompite',
					'Gardevoirite',
					'Gengarite',
					'Glalitite',
					'Gyaradosite',
					'Heracronite',
					'Houndoominite',
					'Kangaskhanite',
					'Latiasite',
					'Latiosite',
					'Lopunnite',
					'Lucarionite',
					'Manectite',
					'Mawilite',
					'Medichamite',
					'Metagrossite',
					'Mewtwonite X',
					'Mewtwonite Y',
					'Pidgeotite',
					'Pinsirite',
					'Sablenite',
					'Salamencite',
					'Sceptilite',
					'Scizorite',
					'Sharpedonite',
					'Slowbronite',
					'Steelixite',
					'Swampertite',
					'Tyranitarite',
					'Venusaurite',
					'Red Orb',
					'Blue Orb',
				];
				target.item = megaStoneList[this.random(megaStoneList.length)];
				this.add('-item', target, target.getItem(), '[from] move: Re-Roll');
				target.canMegaEvo = this.canMegaEvo(target);
				let pokemon = target;
				let item = pokemon.getItem();
				if (pokemon.isActive && !pokemon.template.isMega && !pokemon.template.isPrimal && (item.id === 'redorb' || item.id === 'blueorb') && pokemon.baseTemplate.tier !== 'Uber' && !pokemon.template.evos.length) {
					// Primal Reversion
					let bannedMons = {'Kyurem-Black':1, 'Slaking':1, 'Regigigas':1, 'Cresselia':1, 'Shuckle':1};
					if (!(pokemon.baseTemplate.baseSpecies in bannedMons)) {
						let template = this.getMixedTemplate(pokemon.originalSpecies, item.id === 'redorb' ? 'Groudon-Primal' : 'Kyogre-Primal');
						pokemon.formeChange(template);
						pokemon.baseTemplate = template;

						// Do we have a proper sprite for it?
						if (pokemon.originalSpecies === (item.id === 'redorb' ? 'Groudon' : 'Kyogre')) {
							pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
							this.add('detailschange', pokemon, pokemon.details);
						} else {
							let oTemplate = this.getTemplate(pokemon.originalSpecies);
							this.add('-formechange', pokemon, oTemplate.species, template.requiredItem);
							this.add('-start', pokemon, this.getTemplate(template.originalMega).requiredItem, '[silent]');
							if (oTemplate.types.length !== pokemon.template.types.length || oTemplate.types[1] !== pokemon.template.types[1]) {
								this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
							}
						}
						this.add('message', pokemon.name + "'s " + pokemon.getItem().name + " activated!");
						this.add('message', pokemon.name + "'s Primal Reversion! It reverted to its primal form!");
						pokemon.setAbility(template.abilities['0']);
						pokemon.baseAbility = pokemon.ability;
						pokemon.canMegaEvo = false;
					}
				}
			}
		},
		name: 'Re-Roll',
		id: 'reroll',
		secondary: false,
		target: 'self',
		type: 'Normal',
	},
	'shadowsphere': {
		num: 640,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "Has a 20% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "20% chance to lower the target's Sp. Def by 1.",
		id: "shadowsphere",
		name: "Shadow Sphere",
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Shadow Ball', target);
		},
		pp: 15,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			boosts: {spd: -1},
		},
		target: "normal",
		type: "Ghost",
	},
	'drainforce': {
		num: 641,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Giga Drain', target);
		},
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. Has a 20% chance to lower the target's Attack and Speed by 1 stage, and raises the user's Special Attack and Speed by 1 stage.",
		shortDesc: "User recovers 50% of the damage dealt. 20% chance to steal some stats.",
		id: "drainforce",
		name: "Drain Force",
		pp: 10,
		priority: 0,
		drain: [1, 2],
		flags: {protect: 1, mirror: 1},
		secondary: {
			chance: 20,
			boosts: {atk: -1, spe: -1},
			self: {boosts: {spa: 1, spe: 1}},
		},
		target: "normal",
		type: "Fighting",
	},
	'sneakyspook': {
		num: 642, // blaze it + 222
		accuracy: 100,
		basePower: 40,
		category: "Special",
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Shadow Sneak', target);
		},
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		id: "sneakyspook",
		isViable: true,
		name: "Sneaky Spook",
		pp: 30,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Ghost",
	},
	'thousandalts': {
		num: 643,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "If the target lost HP, the user takes recoil damage equal to 50% the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Adds Dark to the user's type(s) before attacking. Has 50% recoil. 20% chance to confuse.",
		id: "thousandalts",
		isViable: true,
		name: "Thousand Alts",
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, pokemon) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, 'Head Smash', target);
			if (pokemon.hasType('Dark')) return;
			if (!pokemon.addType('Dark')) return;
			this.add('-start', pokemon, 'typeadd', 'Dark', '[from] move: Thousand Alts');
		},
		recoil: [1, 2],
		secondary: {chance: 20,	volatileStatus: 'confusion'},
		target: "normal",
		type: "Dark",
	},
	'bawk': {
		num: 644,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user becomes flying type and restores 1/2 of its maximum HP, rounded half up.",
		shortDesc: "Heals the user by 50% of its max HP. User becomes flying type.",
		id: "bawk",
		isViable: true,
		name: "BAWK!",
		pp: 10,
		priority: 0,
		flags: {snatch: 1, heal: 1},
		onPrepareHit: function (target, pokemon) {
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, 'Roost', pokemon);
			if (pokemon.hasType('Flying')) return;
			if (!pokemon.addType('Flying')) return;
			this.add('-start', pokemon, 'typeadd', 'Flying', '[from] move: BAWK!');
		},
		heal: [1, 2],
		secondary: false,
		target: "self",
		type: "Flying",
	},
	'yiffyiff': {
		num: 645,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Causes the user's Ability to become Fur Coat. Randomly executes a move based on the user's type.",
		shortDesc: "The user's Ability becomes Fur Coat. Executes a random move.",
		id: "yiffyiff",
		name: "Yiff Yiff",
		pp: 10,
		priority: 0,
		flags: {},
		onPrepareHit: function (target, pokemon, move) {
			let bannedAbilities = {furcoat:1, multitype:1, stancechange:1, truant:1};
			if (bannedAbilities[pokemon.ability]) {
				return;
			}
			let oldAbility = pokemon.setAbility('furcoat');
			if (oldAbility) {
				this.add('-endability', pokemon, oldAbility, '[from] move: Yiff Yiff');
				this.add('-ability', pokemon, 'Fur Coat', '[from] move: Yiff Yiff');
			}
			return;
		},
		onHit: function (target, source, move) {
			let bawked = this.random(source.hasType('Flying') ? 4 : 3);
			if (bawked === 0) this.useMove('earthquake', target);
			if (bawked === 1) this.useMove('iciclecrash', target);
			if (bawked === 2) this.useMove('stoneedge', target);
			if (bawked === 3) this.useMove('bravebird', target);
		},
		secondary: {chance: 10,	self: {boosts: {atk: 1, spd: 1, spe: 1, accuracy: 1}}},
		target: "self",
		type: "Normal",
	},
	"arcticslash": {
		num: 656,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn. High crit ratio.",
		id: "arcticslash",
		name: "Arctic Slash",
		pp: 30,
		priority: 0,
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', target, 'Icicle Crash', target);
			this.add('-anim', source, 'Slash', target);
		},
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2, //nerf imo
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Ice",
	},
	"ganonssword": {
		num: 657,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		desc: "The user's defenses increase by two stages at the beginning of the turn. The user attacks last. The user's defenses drop by two stages at the end of the turn.",
		shortDesc: "Sharply increases def. and sp. def. at the start of the turn. Attacks last and harshly lowers def. and sp. def.",
		id: "ganonssword",
		name: "Ganon's Sword",
		pp: 10,
		priority: -3,
		flags: {contact: 1, protect: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Sacred Sword', target);
		},
		beforeTurnCallback: function (pokemon) {
			pokemon.addVolatile('ganonssword');
			this.boost({def:2, spd:2}, pokemon);
		},
		beforeMoveCallback: function (pokemon) {
			if (!pokemon.removeVolatile('ganonssword')) {
				return;
			}
		},
		effect: {
			duration: 1,
			onStart: function (pokemon) {
				this.add('-message', pokemon.name + " is preparing to strike!");
			},
			onBeforeMovePriority: 100,
			onBeforeMove: function (pokemon) {
				this.boost({def:-2, spd:-2}, pokemon, pokemon, this.getMove("Ganon's Sword")); // dunno if this works
			},
		},
		target: "normal",
		type: "Dark",
	},
	'toucan': {
		num: 658,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Chatter', target);
		},
		onTryHit: function (target, source, move) {
			let targetName = toId(target.name);
			let sourceName = toId(source.name);
			this.add('c|' + sourceName + '|Wow ' + targetName + ' OneHand');
		},
		onHit: function (target) {
			let hazards = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
			target.side.addSideCondition(hazards[this.random(4)]);
		},
		volatileStatus: 'confusion',
		secondary: false,
		desc: 'Confuses the target.',
		shortdesc: 'Wow Description OneHand',
		id: 'toucan',
		isViable: true,
		pp: 25,
		priority: 0,
		name: "Toucan",
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1, reflectable: 1},
		target: "normal",
		type: "Flying",
	},
	'rainbowspray': {
		id: 'rainbowspray',
		name:"Rainbow Spray",
		num: 659,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "This move combines Fairy in its type effectiveness against the target. Has a chance to confuse or paralyze target.",
		shortDesc: "Combines Fairy in its type effectiveness. 45% chance to confuse. 35% chance to paralyze.",
		pp: 10,
		flags: {protect: 1, mirror: 1, distance: 1},
		onEffectiveness: function (typeMod, type, move) {
			return typeMod + this.getEffectiveness('Fairy', type);
		},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Tri Attack', target);
		},
		priority: 0,
		secondaries: [
			{chance: 45, volatileStatus: 'confusion'},
			{chance: 35, status: 'par'}],
		target: "any",
		type: "Water",
	},
	"spindash": {
		num: 660,
		accuracy: 90,
		basePower: 50,
		basePowerCallback: function (pokemon, target) {
			let bp = 50;
			let bpTable = [50, 100, 200, 400, 800];
			if (pokemon.volatiles.spindash && pokemon.volatiles.spindash.hitCount) {
				bp = (bpTable[pokemon.volatiles.spindash.hitCount] || 800);
			}
			pokemon.addVolatile('spindash');
			if (pokemon.volatiles.defensecurl) {
				bp *= 2;
			}
			this.debug("spindash bp: " + bp);
			return bp;
		},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Rollout', target);
		},
		category: "Physical",
		desc: "If this move is successful, the user is locked into this move and cannot make another move until it misses, 5 turns have passed, or the attack cannot be used. Power doubles with each successful hit of this move and doubles again if Defense Curl was used previously by the user. If this move is called by Sleep Talk, the move is used for one turn.",
		shortDesc: "Power doubles with each hit. Repeats for 5 turns.",
		id: "spindash",
		name: "Spindash",
		pp: 20,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		effect: {
			duration: 2,
			onLockMove: 'spindash',
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
					delete target.volatiles['spindash'];
				}
			},
		},
		secondary: false,
		target: "normal",
		type: "Normal",
	},
	"boost": {
		num: 661,
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		desc: "No additional effect.",
		shortDesc: "Hits first.",
		id: "boost",
		isViable: true,
		name: "Boost",
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Extreme Speed', target);
		},
		pp: 5,
		priority: 3,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Normal",
	},
	'setmine': {
		num: 662,
		accuracy: true,
		basePower: 0,
		category: 'Status',
		desc: 'Lays a mine.',
		shortDesc: 'Lays a mine.',
		id: 'setmine',
		name: 'Set Mine',
		pp: 5,
		priority: 0,
		flags: {reflectable: 1, mirror: 1},
		secondary: false,
		sideCondition: 'setmine',
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
		},
		effect: {
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Set Mine');
				this.add('c|' + this.effectData.source.name + '|Tick tick boom!');
				this.effectData.moveData = {
					id: 'mine',
					name: 'Mine',
					accuracy: true, // it can't miss
					basePower: 160,
					category: 'Special',
					flags: {authentic: 1}, // bypasses substitute
					ignoreImmunity: true, // hits through flash fire
					willCrit: false, // this makes it always not crit right?
					effectType: 'Move',
					type: 'Fire',
					onPrepareHit: function (target, source, move) { // animation
						this.attrLastMove('[still]');
						this.add('-anim', target, 'Explosion', target);
						this.add('-anim', target, 'Sky Drop', target);
					},
				};
				this.effectData.moveSource = this.effectData.source;
			},
			onSwitchIn: function (pokemon) {
				if (!pokemon.isGrounded()) return;
				this.add('raw|' + pokemon.name + ' took a Mine to their face!');
				this.tryMoveHit(pokemon, this.effectData.moveSource, this.effectData.moveData);
				pokemon.side.removeSideCondition('setmine');
			},
		},
		target: 'foeSide',
		type: 'Fire',
	},
	'locknload': {
		num: 664,
		accuracy: true,
		basePower: 0,
		category: 'Status',
		target: 'normal',
		id: 'locknload',
		name: 'Lock \'n\' Load',
		type: 'Steel',
		flage: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Mean Look', target);
		},
		onTryHit: function (target, source) {
			if (source.volatiles['lockon']) source.removeVolatile('lockon');
			source.addVolatile('focusenergy');
		},
		onHit: function (target, source) {
			source.addVolatile('lockon', target);
			this.add('-activate', source, 'move: Lock \'n\' Load', '[of] ' + target);
			this.add('c|' + source.name + '|Say hello to Becky and Betsy!');
		},
		pp: 20,
	},
	'assassinate': {
		num: 665,
		accuracy: 0, // ohko moves' accuracy is defined elsewhere
		basePower: 0,
		category: 'Physical',
		desc: 'Deals damage to the target equal to the target\'s maximum HP. Ignores accuracy and evasiveness modifiers.',
		shortDesc: "OHKOs the target. Fails if user is a lower level.",
		id: 'assassinate',
		name: 'Assassinate',
		pp: 5,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		ohko: true,
		secondary: false,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Flash Cannon', target);
		},
		onTryHit: function (target, source) {
			if (target.volatiles['lockon'] && source === target.volatiles['lockon'].source) return true;
			if (source.hasAbility('noguard') || target.hasAbility('noguard')) return true;
			return false;
		},
		onHit: function (target, source) {
			this.add('c|' + source.name + '|Bye!');
		},
		target: 'normal',
		type: 'Steel',
	},
	'quicksketch': {
		num: 666, // hue
		accuracy: true,
		basePower: 0,
		category: 'Status',
		id: 'quicksketch',
		name: 'Quick Sketch',
		pp: 5,
		priority: 0,
		flags: {protect: 1, authentic: 1},
		onHit: function (target, source) {
			let disallowedMoves = {copycat:1, focuspunch:1, mimic: 1, quicksketch: 1, sketch:1, sleeptalk:1, snatch:1, struggle:1, transform:1};
			if (!this.lastMove || disallowedMoves[this.lastMove] || source.hasMove(this.lastMove)) return false;
			let move = this.getMove(this.lastMove);
			let sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
			};
			if (source.moveSlots.length < 8) {
				source.moveSlots.push(sketchedMove);
				source.baseMoveSlots.push(sketchedMove);
			} else {
				let r = this.random(8);
				source.moveSlots[r] = sketchedMove;
				source.baseMoveSlots[r] = sketchedMove;
			}
			this.add('message', source.name + ' acquired ' + move.name + ' using its Quick Sketch!');
			this.useMove(move, target);
		},
		secondary: false,
		target: 'self',
		type: 'Normal',
	},
	'keepcalmandfocus': {
		id: 'keepcalmandfocus',
		name: 'Keep Calm and Focus!',
		pp: 5,
		priority: 0,
		category: 'Status',
		basePower: 0,
		accuracy: true,
		flags: {snatch: 1, heal: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Calm Mind', source);
		},
		onHit: function (pokemon) {
			if (this.random(10) === 0) {
				this.heal(this.modify(pokemon.maxhp, 0.25));
				this.boost({atk: 2}, pokemon);
			} else {
				this.heal(this.modify(pokemon.maxhp, 0.5));
				this.boost({def: 1, spd: 1}, pokemon);
			}
			pokemon.cureStatus();
			let temp = pokemon.item;
			pokemon.item = 'absolite';
			pokemon.canMegaEvo = this.canMegaEvo(pokemon);
			if (pokemon.canMegaEvo) this.runMegaEvo(pokemon);
			pokemon.item = temp;
		},
		type: 'Normal',
		target: 'self',
		num: 667,
	},
	'quityourbullshit': {
		id: 'quityourbullshit',
		name: 'Quit your Bullshit',
		pp: 10,
		priority: 0,
		category: 'Physical',
		basePower: 80,
		accuracy: true,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Close Combat', target);
		},
		onHit: function (target) {
			target.clearBoosts();
			target.cureStatus();
			this.add('-clearboost', target);
		},
		num: 668,
		type: 'Fighting',
		target: 'normal',
	},
	'typeroulette': {
		id: 'typeroulette',
		name: 'Type Roulette',
		pp: 10,
		priority: 0,
		category: 'Physical',
		type: 'Normal',
		typeList: ['Normal', 'Fire', 'Fighting', 'Water', 'Flying', 'Grass', 'Poison', 'Electric', 'Ground', 'Psychic', 'Rock', 'Ice', 'Bug', 'Dragon', 'Ghost', 'Dark', 'Steel', 'Fairy'],
		target: 'normal',
		basePower: 120,
		accuracy: 100,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHitPriority: 100,
		onPrepareHit: function (target, source, move) {
			move.type = move.typeList[this.random(move.typeList.length)];
			this.attrLastMove('[still]');
			let anim;
			switch (move.type) {
			case 'Normal':
				anim = 'Mega Punch';
				break;
			case 'Fire':
				anim = 'Fire Punch';
				break;
			case 'Fighting':
				anim = 'Close Combat';
				break;
			case 'Water':
				anim = 'Waterfall';
				break;
			case 'Flying':
				anim = 'Wing Attack';
				break;
			case 'Grass':
				anim = 'Leaf Blade';
				break;
			case 'Poison':
				anim = 'Poison Jab';
				break;
			case 'Electric':
				anim = 'Thunder Punch';
				break;
			case 'Ground':
				anim = 'Drill Run';
				break;
			case 'Psychic':
				anim = 'Zen Headbutt';
				break;
			case 'Rock':
				anim = 'Head Smash';
				break;
			case 'Ice':
				anim = 'Ice Punch';
				break;
			case 'Bug':
				anim = 'X-Scissor';
				break;
			case 'Dragon':
				anim = 'Outrage';
				break;
			case 'Ghost':
				anim = 'Shadow Punch';
				break;
			case 'Dark':
				anim = 'Night Slash';
				break;
			case 'Steel':
				anim = 'Heavy Slam';
				break;
			case 'Fairy':
				anim = 'Play Rough';
				break;
			}
			this.add('-anim', source, anim, target);
		},
		num: 669,
	},
	'godswrath': {
		id: 'godswrath',
		name: "God's Wrath",
		pp: 20,
		priority: 0,
		category: 'Physical',
		type: 'Rock',
		target: 'normal',
		basePower: 0,
		accuracy: true,
		flags: {},
		onTryHit: function (target, pokemon) {
			let move = 'ancientpower';
			switch (pokemon.template.speciesid) {
			case 'omastar':
				move = 'abstartselect';
				break;
			case 'kabutops':
				move = 'wait4baba';
				break;
			case 'aerodactyl':
				move = 'balancedstrike';
				break;
			case 'cradily':
				move = 'texttospeech';
				break;
			case 'armaldo':
				move = 'holyducttapeofclaw';
				break;
			case 'bastiodon':
				move = 'warecho';
				break;
			case 'rampardos':
				move = 'skullsmash';
				break;
			case 'carracosta':
				move = 'danceriot';
				break;
			case 'archeops':
				move = 'bluescreenofdeath';
				break;
			case 'aurorus':
				move = 'portaltospaaaaaaace';
				break;
			case 'tyrantrum':
				move = 'doubleascent';
				break;
			}
			this.useMove(move, pokemon, target);
			return null;
		},
		num: 670,
	},
	'abstartselect': {
		id: 'abstartselect',
		name: "A+B+Start+Select",
		pp: 10,
		priority: 0,
		category: 'Special',
		type: 'Water',
		target: 'normal',
		basePower: 120,
		accuracy: 90,
		flags: {protect: 1, mirror: 1},
		secondary: {chance: 20, volatileStatus: 'confusion'},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Confuse Ray', target);
		},
		onHit: function (target, source) {
			this.add("c|" + source.name + "|ANARCHY, BITCH!");
			target.clearBoosts();
			this.add('-clearboost', target);
		},
		num: 671,
	},
	'wait4baba': {
		id: 'wait4baba',
		name: 'Wait4baba',
		pp: 10,
		priority: 0,
		category: 'Physical',
		type: 'Water',
		target: 'normal',
		basePower: 100,
		accuracy: 100,
		flags: {protect: 1, mirror: 1},
		secondaries: [{chance: 100, boosts: {spe: -1}}, {chance: 20, volatileStatus: 'flinch'}],
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Close Combat', target);
		},
		onHit: function (target, source) {
			this.add("c|" + source.name + "|The time for democracy's rise is here, motherf***er!");
		},
		num: 672,
	},
	'balancedstrike': {
		id: 'balancedstrike',
		name: 'Balanced Strike',
		pp: 10,
		priority: 0,
		category: 'Physical',
		type: 'Flying',
		target: 'normal',
		basePower: 100,
		accuracy: true,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Power Split', target);
			let stats = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'];
			let boostSource = {atk:0, def:0, spa:0, spd:0, spe:0, accuracy:0, evasion:0};
			let boostTarget = {atk:0, def:0, spa:0, spd:0, spe:0, accuracy:0, evasion:0};
			for (let i = 0; i < stats.length; i++) {
				let stat = stats[i];
				let targetBoost = target.boosts[stat];
				let sourceBoost = source.boosts[stat];
				let average = Math.floor((targetBoost + sourceBoost) / 2);
				boostSource[stat] = average;
				if (average !== sourceBoost) this.add('-setboost', source, stat, average, '[from] move: Balanced Strike');
				boostTarget[stat] = average;
				if (average !== targetBoost) this.add('-setboost', target, stat, average, '[from] move: Balanced Strike');
			}
			source.setBoost(boostSource);
			target.setBoost(boostTarget);
			this.add('-anim', source, 'Sky Attack', target);
		},
		onHit: function (target, source) {
			this.add("c|" + source.name + "|Time to untip the scales!");
		},
		num: 673,
	},
	'texttospeech': {
		id: 'texttospeech',
		name: 'Text to Speech',
		pp: 10,
		priority: 0,
		category: 'Status',
		type: 'Grass',
		target: 'normal',
		basePower: 0,
		accuracy: 85,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Hyper Voice', target);
		},
		onHit: function (target, source) {
			this.add("c|" + source.name + "|I shall smite thee with potatoes of doom! WHEEEEEE");
			let bannedAbilities = {insomnia:1, multitype:1, stancechange:1, truant:1};
			if (!bannedAbilities[target.ability]) {
				let oldAbility = target.setAbility('insomnia');
				if (oldAbility) {
					this.add('-endability', target, oldAbility, '[from] move: Text to Speech');
					this.add('-ability', target, 'Insomnia', '[from] move: Text to Speech');
					if (target.status === 'slp') {
						target.cureStatus();
					}
				}
			}
			target.addVolatile('taunt');
			target.addVolatile('torment');
			target.addVolatile('leechseed');
			target.addVolatile('confusion');
		},
		num: 674,
	},
	'holyducttapeofclaw': {
		id: 'holyducttapeofclaw',
		name: 'Holy Duct Tape of Claw',
		pp: 10,
		priority: 0,
		category: 'Physical',
		type: 'Bug',
		target: 'normal',
		basePower: 60,
		accuracy: 90,
		flags: {protect: 1, mirror: 1},
		volatileStatus: 'partiallytrapped',
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', target, 'Giga Drain', target);
		},
		onHit: function (target, source) {
			this.add("c|" + source.name + "|...");
			target.addVolatile('taunt');
		},
		num: 675,
	},
	'warecho': {
		id: 'warecho',
		name: 'War Echo',
		pp: 10,
		priority: 0,
		category: 'Status',
		type: 'Steel',
		target: 'self',
		basePower: 0,
		accuracy: true,
		flags: {mirror: 1},
		boosts: {atk: 2},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Uproar', source);
			this.add("c|" + source.name + "|As the great Sun Tzu once said, every battle is won before it is fought!");
		},
		sideCondition: 'warecho',
		effect: {
			duration: 3,
			onResidualOrder: 4,
			onEnd: function (side) {
				let target = side.active[this.effectData.sourcePosition];
				if (target && !target.fainted) {
					this.boost({atk: 2}, target);
				}
			},
		},
		num: 676,
	},
	'skullsmash': {
		id: 'skullsmash',
		name: 'Skull Smash',
		pp: 10,
		priority: 0,
		category: 'Physical',
		type: 'Rock',
		target: 'normal',
		basePower: 150,
		accuracy: 80,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Head Smash', target);
		},
		onHit: function (target, source) {
			this.add("c|" + source.name + "|Do you feel lucky, punk?");
		},
		recoil: [1, 8],
		num: 677,
	},
	'danceriot': {
		id: 'danceriot',
		name: 'Dance Riot',
		pp: 10,
		priority: -6,
		category: 'Physical',
		type: 'Water',
		target: 'normal',
		basePower: 120,
		accuracy: 100,
		flags: {protect: 1, mirror: 1},
		self: {
			volatileStatus: 'lockedmove',
		},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Quiver Dance', target);
		},
		onAfterMove: function (pokemon) {
			if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
				pokemon.removeVolatile('lockedmove');
				pokemon.removeVolatile('confusion');
			}
		},
		onHit: function (target, source) {
			this.add("c|" + source.name + "|Are you not entertained?");
			if (this.random(2) === 1) {
				target.forceSwitchFlag = 1;
			}
		},
		num: 678,
	},
	'bluescreenofdeath': {
		id: 'bluescreenofdeath',
		name: 'Blue Screen of Death',
		pp: 10,
		priority: 3,
		category: 'Physical',
		type: 'Flying',
		target: 'normal',
		basePower: 40,
		accuracy: 100,
		flags: {mirror: 1, authentic: 1},
		onTry: function (pokemon, target) {
			if (pokemon.activeTurns > 1) {
				this.add('-fail', pokemon);
				this.add('-hint', "BSoD only works on your first turn out.");
				return null;
			}
		},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Psychic', target);
		},
		onHit: function (target, source) {
			this.add("c|" + source.name + "|They call me the goddess of Death for a reason!");
		},
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
		num: 679,
	},
	'portaltospaaaaaaace': {
		id: 'portaltospaaaaaaace',
		name: 'Portal to SPAAAAAAACE',
		pp: 10,
		priority: 0,
		category: 'Special',
		type: 'Ice',
		target: 'normal',
		basePower: 70,
		accuracy: 95,
		flags: {protect: 1, mirror: 1},
		onEffectiveness: function (typeMod, type) {
			if (type === 'Water' || type === 'Ice' || type === 'Steel' || type === 'Fire') return 1;
		},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Shadow Ball', source);
		},
		onHit: function (target, source) {
			this.add("c|" + source.name + "|The laws of space are mine to command and they WILL OBEY ME!");
		},
		secondary: {chance: 10, status: 'frz'},
		num: 680,
	},
	'doubleascent': {
		id: 'doubleascent',
		name: 'Double Ascent',
		pp: 10,
		priority: 0,
		category: 'Physical',
		type: 'Dragon',
		target: 'normal',
		basePower: 80,
		accuracy: 95,
		flags: {contact: 1, charge: 1, protect: 1, mirror: 1},
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-anim', attacker, 'Fly', defender);
			this.add('-prepare', attacker, 'Fly', defender);
			this.add("c|" + attacker.name + "|I see a humiliating defeat in your future!");
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, 'Fly', defender);
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
		},
		effect: {
			duration: 2,
			onAccuracy: function (accuracy, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return;
				}
				if (move.id === 'skyuppercut' || move.id === 'thunder' || move.id === 'hurricane' || move.id === 'smackdown' || move.id === 'thousandarrows' || move.id === 'helpinghand') {
					return;
				}
				if (source.hasAbility('noguard') || target.hasAbility('noguard')) {
					return;
				}
				if (source.volatiles['lockon'] && target === source.volatiles['lockon'].source) return;
				return 0;
			},
			onSourceModifyDamage: function (damage, source, target, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return this.chainModify(2);
				}
			},
		},
		num: 681,
	},
	'drama': {
		id: 'drama',
		name: 'Drama',
		pp: 10,
		priority: 0,
		category: 'Status',
		type: 'Normal',
		target: 'normal',
		basePower: 0,
		accuracy: true,
		flags: {mirror: 1},
		status: 'tox',
		self: {status: 'tox'},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Taunt', source);
		},
		onHit: function (target, source, move) {
			target.addVolatile('trapped', source, move, 'trapper');
			source.addVolatile('trapped', target, move, 'trapper');
		},
		num: 682,
	},
	'loratory': {
		id: 'loratory',
		name: 'Loratory',
		pp: 10,
		priority: 0,
		category: 'Status',
		type: 'Normal',
		target: 'normal',
		basePower: 0,
		accuracy: 80,
		flags: {mirror: 1, reflectable: 1},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Hypnosis', source);
		},
		onHit: function (target, source, move) {
			if (Math.random() < 0.5) {
				target.addVolatile('confusion');
			} else {
				target.trySetStatus('slp', source);
			}
		},
		num: 683,
	},
	"beatingmist": {
		num: 684,
		accuracy: 100,
		basePower: 25,
		category: "Special",
		desc: "Hits one to six times, with each hit having a 10% chance to lower the target's Special Attack by 1 stage. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit six times. Mega Evolves the user via Sharpedonite afterwards.",
		shortDesc: "Hits 1-6 times. Each hit has 10% chance to lower SpA by 1. Mega Evolves user via Sharpedonite.",
		id: "beatingmist",
		name: "Beating Mist",
		pp: 5,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		multihit: [1, 6],
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Water Shuriken', target);
		},
		secondary: {
			chance: 10,
			boosts: {
				spa: -1,
			},
		},
		self: {
			onHit: function (pokemon) {
				let temp = pokemon.item;
				pokemon.item = 'Sharpedonite';
				if (!pokemon.template.isMega) pokemon.canMegaEvo = this.canMegaEvo(pokemon); // don't mega evolve if it's already mega
				if (pokemon.canMegaEvo) this.runMegaEvo(pokemon);
				pokemon.item = temp; // give its normal item back.
			},
		},
		target: "normal",
		type: "Water",
	},
	"wailofthebanshee": {
		num: 685, // boomburst is 586
		accuracy: 100,
		basePower: 140,
		category: "Special",
		desc: "No additional effect.",
		shortDesc: "No additional effect. Hits adjacent Pokemon.",
		id: "wailofthebanshee",
		name: "Wail of the Banshee",
		pp: 10,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Boomburst', target);
		},
		secondary: false,
		target: "allAdjacent",
		type: "Fairy",
	},
	"witchscurse": {
		num: 686,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		desc: "The target loses 1/4 of its maximum HP, rounded down, at the end of this turn. If the target uses Baton Pass, the replacement will continue to be affected.",
		shortDesc: "Target loses 1/4 of its max HP for 1 turn.",
		id: "witchscurse",
		name: "Witch's Curse",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Boomburst', target);
		},
		volatileStatus: 'witchscurse',
		effect: {
			duration: 1,
			onStart: function (pokemon, source) {
				this.add('-start', pokemon, "Witch's Curse", '[of] ' + source);
			},
			onResidualOrder: 10,
			onResidual: function (pokemon) {
				this.damage(pokemon.maxhp / 4);
			},
		},
		target: "normal",
		type: "Ghost",
	},
	"foxfire": {
		num: 687,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		desc: "Burns the target. Lowers the target's accuracy by 1 stage.",
		shortDesc: "Burns the target. Lowers the target's accuracy by 1.",
		id: "foxfire",
		name: "Foxfire",
		pp: 15,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Will-O-Wisp', target);
		},
		status: 'brn',
		boosts: {
			accuracy: -1,
		},
		target: "normal",
		type: "Fairy",
	},
	"spectralincantation": {
		num: 688,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "The user loses 1/2 of its maximum HP, rounded down, in exchange for raising the user's Special Attack and Special Defense by 2 stages.",
		shortDesc: "User loses 1/2 its max HP. Raises the user's Sp. Atk and Sp. Def by 2.",
		id: "spectralincantation",
		name: "Spectral Incantation",
		pp: 20,
		priority: 0,
		flags: {snatch: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Curse', source);
		},
		onHit: function (target) {
			if (target.hp <= target.maxhp / 2 || (target.boosts.spd >= 6 && target.boosts.spa >= 6) || target.maxhp === 1) { // Shedinja clause
				return false;
			}
			this.directDamage(target.maxhp / 2);
			this.boost({spa: 2, spd: 2}, target);
		},
		secondary: false,
		target: "self",
		type: "Ghost",
	},
};