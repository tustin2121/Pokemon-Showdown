'use strict';

// PLEASE organize your move so that the properties go in this order:
//  num, id, name, desc, shortDesc, <the rest>

exports.BattleMovedex = {
	////////////////////////////////////////////////////////////////////////////
	// Modified Moves
	"rapidspin": {
		inherit: true,
		self: {
			onHit: function (pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
				let sideConditions = {
					spikes:1, toxicspikes:1, stealthrock:1, stickyweb:1, //standard
					setmine:1, //nonstandard
				};
				for (let i in sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(i)) {
						if (i == "setmine") {
							this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: Rapid Spin', '[of] ' + pokemon, `[msg] The mine is blown away!`);
						} else {
							this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
						}
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			},
		},
	},
	"defog": {
		inherit: true,
		onHit: function (target, source, move) {
			if (!target.volatiles['substitute'] || move.infiltrates) this.boost({evasion:-1});
			let removeTarget = {
				reflect:1, lightscreen:1, safeguard:1, mist:1, spikes:1, toxicspikes:1, stealthrock:1, stickyweb:1, //standard
				setmine:1, //nonstandard
			};
			let removeAll = {
				spikes:1, toxicspikes:1, stealthrock:1, stickyweb:1, //standard
				setmine:1, //nonstandard
			};
			for (let targetCondition in removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll[targetCondition]) continue;
					this.add('-sideend', target.side, this.getEffect(targetCondition).name, '[from] move: Defog', '[of] ' + target);
				}
			}
			for (let sideCondition in removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.getEffect(sideCondition).name, '[from] move: Defog', '[of] ' + source);
				}
			}
		},
	},
	"mimic": {
		inherit: true,
		disallowedMoves : {
			chatter:1, mimic:1, sketch:1, struggle:1, transform:1, //standard
			mine:1, //nonstandard
		},
	},
	"sketch": {
		inherit: true,
		disallowedMoves: {
			chatter:1, sketch:1, struggle:1, //standard
			mine:1, //nonstandard
		},
	},
	"attract": {
		inherit: true,
		desc: "Causes the target to become infatuated, making it unable to attack 50% of the time. Fails if the user and the target are incompatible, or if the target is already infatuated. The effect ends when either the user or the target is no longer active. Pokemon with the Ability Oblivious or protected by the Ability Aroma Veil are immune.",
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function (pokemon, source, effect) {
				this.debug("Start attract: "+effect.id)
				if (effect.id !== "operationlove") { //skip this check if this is from operationlove
					if (pokemon.set.attract) { 
						this.debug("Testing clause attraction.")
						// If the target pokemon's set has an attract clause
						let gender = source.gender || "U"; //U == genderless
						if (!pokemon.set.attract[gender]) { //If the source's gender is not in the clause, fail
							this.debug("incompatable gender (clause check)");
							return false;
						}
					} else {
						this.debug("Testing normal attraction.")
						// Otherwise, follow normal rules
						if (!(pokemon.gender === 'M' && source.gender === 'F') && !(pokemon.gender === 'F' && source.gender === 'M')) {
							this.debug('incompatible gender');
							return false;
						}
					}
				}
				this.debug("Running attract event.")
				if (!this.runEvent('Attract', pokemon, source)) {
					this.debug('Attract event failed');
					return false;
				}
				
				this.debug("Completing attract event")
				if (effect.id === 'cutecharm') {
					this.add('-start', pokemon, 'Attract', '[from] ability: Cute Charm', '[of] ' + source);
				} else if (effect.id === 'destinyknot') {
					this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', '[of] ' + source);
				} else {
					this.add('-start', pokemon, 'Attract');
				}
			},
			onUpdate: function (pokemon) {
				if (this.effectData.source && !this.effectData.source.isActive && pokemon.volatiles['attract']) {
					this.debug('Removing Attract volatile on ' + pokemon);
					pokemon.removeVolatile('attract');
				}
			},
			onBeforeMovePriority: 2,
			onBeforeMove: function (pokemon, target, move) {
				this.add('-activate', pokemon, 'move: Attract', '[of] ' + this.effectData.source);
				if (this.random(2) === 0) {
					this.add('cant', pokemon, 'Attract');
					return false;
				}
			},
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'Attract', '[silent]');
			},
		},
	},
	"explosion": {
		inherit: true,
		onHit: function (target, source, move) {
			this.sayQuote(source, "Move-"+move.id, {target: target});
		},
	},
	"selfdestruct": {
		inherit: true,
		onHit: function (target, source, move) {
			this.sayQuote(source, "Move-"+move.id, {target: target});
		},
	},
	
	
	////////////////////////////////////////////////////////////////////////////
	// Custom Moves
	
	"disappointment": {
		num: 2000,
		id: "disappointment",
		name: "Disappointment",
		desc: "The user faints and the Pokemon brought out to replace it has its HP fully restored along with having any major status condition cured and getting a boost in all stats. Fails if the user is the last unfainted Pokemon in its party.",
		shortDesc: "User faints. Replacement is fully healed. Raises all stats of replacement by 1 (not acc/eva).",
		accuracy: true,
		basePower: 0,
		category: "Status",
		isViable: true,
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
		target: "self",
		type: "Normal",
	},
	'darkfire': {
		num: 2001,
		id: 'darkfire',
		name: 'Darkfire',
		desc: "20% chance to flinch the target. Mega Evolves user via Houndoomite.",
		shortDesc: "Combines Fire in its type effectiveness. 20% chance to flinch the target. Mega Evolves user via Houndoomite.",
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
		num: 2002,
		name: "(Super Glitch)",
		id: "superglitch",
		desc: "A random move is selected for use, other than After You, Assist, Belch, Bestow, Celebrate, Chatter, Copycat, Counter, Covet, Crafty Shield, Destiny Bond, Detect, Diamond Storm, Endure, Feint, Focus Punch, Follow Me, Freeze Shock, Happy Hour, Helping Hand, Hold Hands, Hyperspace Hole, Ice Burn, King's Shield, Light of Ruin, Mat Block, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Quash, Quick Guard, Rage Powder, Relic Song, Secret Sword, Sketch, Sleep Talk, Snarl, Snatch, Snore, Spiky Shield, Steam Eruption, Struggle, Switcheroo, Techno Blast, Thief, Thousand Arrows, Thousand Waves, Transform, Trick, V-create, or Wide Guard.",
		shortDesc: "Picks 2-5 random moves.",
		accuracy: true,
		basePower: 0,
		category: "Status",
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
				moves.sort((a, b) => a.num - b.num); //What purpose does this serve beyond slowing down the processing?
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
		target: "self",
		type: "Normal",
	},
	'tm56': {
		num: 2003,
		id: 'tm56',
		name: 'TM56',
		desc: "Changes user's type to ??? type before attacking. User recovers 50% of the damage dealt. Changes target's type to ??? type if it hits. Raises the user's Accuracy and Evasion by 1 if it misses.",
		shortDesc: "Changes user's type to ??? type before attacking. User recovers 50% of the damage dealt. Changes target's type to ??? type if it hits. Raises the user's Accuracy and Evasion by 1 if it misses.",
		type: '???',
		basePower: 205,
		accuracy: 37,
		pp: 15,
		drain: [1, 2],
		category: 'Physical',
		flags: {pulse: 1, bullet: 1, protect: 1, mirror: 1},
		secondary: false,
		onPrepareHit: function (target, source, move) { // Turns user into ???-type.
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Wish', source);
			if (!source.hasType('???')) { // turn user into ???-type and spout glitchy nonsense.
				this.sayQuote(source, "Move-"+move.id, {target:target, default: "9̜͉̲͇̱̘̼ͬ̈́̒͌̑̓̓7ͩ͊̚5ͨ̆͐͏̪̦6̗͎ͬ̿̍̍̉ͧ͢4̯̠ͤ͛͐̄͒͡2͐ͬ̀d̺͉̜̈ͯ̓x̩̖̥̦̥͛́ͥ͑̈́ͩ͊͠║̛̥̜̱̝͍͒̌ͣ̀͌͌̒'̣͎̗̬̯r̸̗͍ͫ̓͆ͣ̎͊ ̜̻̈D͓̰̳̝̥̙͙͋̀E͉͔̥͇̫͓͍̔ͬͣ͂̓̽x̰̗̬̖͊̏̄̑̒̿͊s̜̪̏́f̧̯̼̦̓͌̇̒o̱̾̓ͩ̆̓̀F̟̰͓̩̂̆͛ͤ▓̣̩̝̙̇̓͒͋̈͡1̡̹̹͓̬͖͐̑̉̔̏xͥ̀'̻͖͍̠̉͡v̫̼̹̳̤̱͉▓̄̏͂ͤͭ̋ͫ͏̠̦̝▓̟͉͇̣̠̦̓̄ͫͥ̐̍̂▓͔̦̫̦̜̖́▓͍ͯ͗̾͆▓̮̗̠̜͙̹̟͊̎ͤ̔̽ͬ̃▓̩̟̏ͪ̇̂̂̒▓̖̼̤͉ͤ̾̋ͥͣͬ͒▓̈́̿͂̌̓▓͇̞̗̽̔̂͊̌ͣ͐▓ͬ́ͥ̔͒͒̎▓̰̪̫̩͇̲̇̔̿͢ͅ▓̞̬͎▓̖͍̖̫ͪ͐̆̅̍̂ͨͅ▓̡̭̠̗̳̬̜̝▓̤͙̥̆̌ͨͪ̆͌▓̴͉̩̈́▓ͩ̌̌̂̿̑̐▓ͨ҉͕̠͍▓̹̌̅̂ͨ͋̃͑▓̯̰̣̝̯ͭͦ̂͋̇̾͠▓̸̺̣̜̯̙̂͋̈ͨ̎̾ͧ▓͢▓͔̚▓̭͎͖̟̼̄̈̃̎́▓̧̌ͧ▓̼̹͈͗̄̆"});
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
		num: 2004,
		id: 'hexattack',
		name: 'Hex Attack',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "25% chance to paralyze or burn or freeze or confuse or infatuate or sleep target.",
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
		num: 2005,
		id: 'projectilespam',
		name: 'Projectile Spam',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "Hits 8-11 times in one turn. Lasts 2-3 turns. Confuses the user afterwards.",
		type: 'Fighting',
		category: 'Physical',
		pp: 20,
		basePower: 12,
		multihit: [8, 11],
		flags: {protect: 1, mirror: 1},
		secondary: false,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Vacuum Wave', target);
		},
		self: {
			volatileStatus: 'lockedmove',
		},
		onAfterMove: function (pokemon) {
			if (pokemon.volatiles['lockedmove'] && pokemon.volatiles['lockedmove'].duration === 1) {
				pokemon.removeVolatile('lockedmove');
			}
		},
	},
	'bulk': {
		num: 2006,
		id: "bulk",
		name: "BULK!!",
		desc: "Raises the user's Attack and Defense by 2 stages.",
		shortDesc: "Raises the user's Attack and Defense by 2.",
		accuracy: true,
		basePower: 0,
		category: "Status",
		isViable: true,
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
		target: "self",
		type: "Fighting",
	},
	'shadowrush': {
		num: 2007,
		id: "shadowrush",
		name: "Shadow Rush",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		accuracy: 100,
		basePower: 80,
		category: "Physical",
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
		num: 2008,
		id: "partingvoltturn",
		name: "Parting Volt Turn",
		desc: "Gets the fuck out of here.", // hue
		shortDesc: "Executes Parting Shot, Volt Switch and U-turn.",
		accuracy: true,
		basePower: 0,
		category: "Status",
		pp: 10,
		priority: 0,
		flags: {},
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.sayQuote(source, "Move-"+move.id, {target:target});
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
		num: 2009,
		id: "evolutionbeam",
		name: "Evolution Beam",
		desc: "Hits once for every eeveelution.",
		shortDesc: "Hits 9 times in one turn, once for each Eeveelution type.",
		accuracy: 100,
		basePower: 10,
		category: "Special",
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
		num: 2010,
		id: 'hyperwahahahahaha',
		name: 'Hyper WAHAHAHAHAHA',
		desc: "Has a 20% chance to paralyze the target and a 20% chance to confuse it.",
		shortDesc: "20% chance to paralyze. 20% chance to confuse.",
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1},
		accuracy: 100,
		basePower: 90,
		category: "Special",
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
		num: 2011,
		id: 'broadside',
		name: 'Broadside',
		desc: "Hits 5 times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits.",
		shortDesc: "Hits adjacent foes 5 times in one turn.",
		accuracy: 100,
		basePower: 18,
		multihit: 5,
		category: "Special",
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
		num: 2012,
		id: 'bestfcar',
		name: 'BEST F-CAR',
		desc: "Has a 20% chance to burn the target. Raises the user's Special Attack by 1 stage.",
		shortDesc: "100% chance to raise the user's Sp. Atk by 1. 20% chance to burn the target. Thaws user.",
		basePower: 60,
		secondaries: [{chance: 20, status: 'brn'}, {chance: 100, self: {boosts: {spa: 1}}}],
		accuracy: 100,
		category: "Special",
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
		num: 2013,
		id: 'eternalstruggle',
		name: 'Eternal Struggle',
		desc: "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded half up, but not less than 1 HP. Lowers the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage.",
		shortDesc: "Lowers all stats by 1 (not acc/eva). Has 1/2 recoil.",
		category: 'Special',
		type: 'Electric',
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
		num: 2014,
		id: 'nofun',
		name: 'No Fun',
		desc: "Stat changes are fun. No stat changes allowed.",
		shortDesc: "Usually goes first. Eliminates the target's stat changes.",
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
		num: 2015,
		id: 'ironfist',
		name: 'Iron Fist',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "The target's Ability becomes Defeatist. Mega Evolves user via Scizorite.",
		category: 'Physical',
		basePower: 90,
		accuracy: 100,
		pp: 10,
		type: 'Steel',
		flags: {contact:1, protect:1, mirror:1},
		secondary: false,
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Hammer Arm', target);
		},
		onHit: function (target) {
			let bannedAbilities = {multitype:1, defeatist:1, stancechange:1, truant:1};
			if (!bannedAbilities[target.ability]) {
				let oldAbility = target.setAbility('defeatist');
				if (oldAbility) {
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
		num: 2016,
		id: 'afk',
		name: 'AFK',
		desc: "This attack charges on the first and second turns and executes on the third, and shows how AFK the user can be. On the first and second turns, the user avoids all attacks.",
		shortDesc: "Disappears turns 1 and 2. Hits turn 3. 20% chance to confuse. 10% chance to put the target to sleep.",
		category: 'Special',
		type: 'Fire',
		basePower: 120,
		accuracy: 100,
		pp: 5,
		priority: 0,
		flags: {charge: 1, protect: 1, mirror: 1},
		onTry: function (attacker, defender, move) {
			this.attrLastMove('[still]');
			if (attacker.volatiles[move.id] && attacker.volatiles[move.id].duration === 1) {
				this.add('-anim', attacker, 'Flare Blitz', defender);
				this.sayQuote(attacker, "Move-"+move.id+"-2", "back");
				attacker.removeVolatile(move.id);
				return;
			}
			if (!attacker.volatiles[move.id]) {
				this.sayQuote(attacker, "Move-"+move.id+"-1", "afk");
				this.add('-prepare', attacker, 'Shadow Force', defender);
			} else {
				this.sayQuote(attacker, "Move-"+move.id+"-w", `raw|${attacker.name} is still gone!`);
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
		num: 2017,
		id: "godbird",
		name: "God Bird",
		desc: "If this move is successful, it breaks through the target's Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks. If the user is holding a Power Herb, the move completes in one turn. Damage doubles and no accuracy check is done if the target has used Minimize while active.",
		shortDesc: "Soars in the sky turn 1. Hits turn 2. Breaks the target's protection for this turn. Mega Evolves the user via Pidgeotite.",
		accuracy: 100,
		basePower: 130,
		category: "Special",
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
		num: 2018,
		id: 'reroll',
		name: 'Re-Roll',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "Uses another known move. Replaces user's item with random Mega Stone.",
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
			if (target.template.isMega || target.template.isPrimal) {
				this.add('-fail', target);
				this.add('-hint', `Can't reroll a megastone when you've already mega evolved.`);
				return;
			}
			
			let moves = [];
			for (let i = 0; i < target.moveset.length; i++) {
				let move = target.moveset[i].id;
				if (move !== 'reroll') moves.push(move);
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
			target.canMegaEvo = this.canMegaEvo(target);
			this.add('-item', target, target.getItem(), '[from] move: Re-Roll');
			
			if (target.isActive && !target.template.isPrimal) {
				this.insertQueue({pokemon: target, choice: 'runPrimal'});
			}
		},
		secondary: false,
		target: 'self',
		type: 'Normal',
	},
	'shadowsphere': {
		num: 2019,
		id: "shadowsphere",
		name: "Shadow Sphere",
		desc: "Has a 20% chance to lower the target's Special Defense by 1 stage.",
		shortDesc: "20% chance to lower the target's Sp. Def by 1.",
		accuracy: 100,
		basePower: 90,
		category: "Special",
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
		num: 2020,
		id: "drainforce",
		name: "Drain Force",
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. Has a 20% chance to lower the target's Attack and Speed by 1 stage, and raises the user's Special Attack and Speed by 1 stage.",
		shortDesc: "User recovers 50% of the damage dealt. 20% chance to lower the target's Attack and Speed by 1 and raise the user's Sp. Atk and Speed by 1.",
		accuracy: 100,
		basePower: 75,
		category: "Special",
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Giga Drain', target);
		},
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
		num: 2021,
		id: "sneakyspook",
		name: "Sneaky Spook",
		desc: "No additional effect.",
		shortDesc: "Usually goes first.",
		accuracy: 100,
		basePower: 40,
		category: "Special",
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Shadow Sneak', target);
		},
		isViable: true,
		pp: 30,
		priority: 1,
		flags: {protect: 1, mirror: 1},
		secondary: false,
		target: "normal",
		type: "Ghost",
	},
	'thousandalts': {
		num: 2022,
		id: "thousandalts",
		name: "Thousand Alts",
		desc: "If the target lost HP, the user takes recoil damage equal to 50% the HP lost by the target, rounded half up, but not less than 1 HP.",
		shortDesc: "Adds Dark to the user's type(s) before attacking. Has 50% recoil. 20% chance to confuse.",
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		isViable: true,
		pp: 15,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, pokemon) {
			if (pokemon.hasType('Dark')) return;
			if (!pokemon.addType('Dark')) return;
			this.add('-start', pokemon, 'typeadd', 'Dark', '[from] move: Thousand Alts');
			this.attrLastMove('[still]');
			this.add('-anim', pokemon, 'Head Smash', target);
		},
		recoil: [1, 2],
		secondary: {chance: 20,	volatileStatus: 'confusion'},
		target: "normal",
		type: "Dark",
	},
	'bawk': {
		num: 2023,
		id: "bawk",
		name: "BAWK!",
		desc: "The user becomes flying type and restores 1/2 of its maximum HP, rounded half up.",
		shortDesc: "Heals the user by 50% of its max HP. Adds Flying to the user's type(s).",
		accuracy: true,
		basePower: 0,
		category: "Status",
		isViable: true,
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
		target: "self",
		type: "Flying",
	},
	'yiffyiff': {
		num: 2024,
		id: "yiffyiff",
		name: "Yiff Yiff",
		desc: "Causes the user's Ability to become Fur Coat. Randomly executes a move based on the user's type.",
		shortDesc: "The user's Ability becomes Fur Coat. Picks a random move from Earthquake, Icicle Crash, Stone Edge, plus Brave Bird if user has Flying type. 10% chance to raise the user's Attack, Sp. Def, Speed and Accuracy by 1.",
		accuracy: true,
		basePower: 0,
		category: "Status",
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
		num: 2025,
		id: "arcticslash",
		name: "Arctic Slash",
		desc: "Hits two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit five times.",
		shortDesc: "Hits 2-5 times in one turn. High crit ratio.",
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		pp: 30,
		priority: 0,
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', target, 'Icicle Crash', target);
			this.add('-anim', source, 'Slash', target);
		},
		flags: {contact: 1, protect: 1, mirror: 1},
		critRatio: 2,
		multihit: [2, 5],
		secondary: false,
		target: "normal",
		type: "Ice",
	},
	"ganonssword": {
		num: 2026,
		id: "ganonssword",
		name: "Ganon's Sword",
		desc: "The user's defenses increase by two stages at the beginning of the turn. The user attacks last. The user's defenses drop by two stages at the end of the turn.",
		shortDesc: "Temporarily raises the user's Defense and Sp. Def by 2 until attacking.",
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		pp: 10,
		priority: -3,
		flags: {contact: 1, protect: 1},
		secondary: false,
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
		num: 2027,
		id: 'toucan',
		name: "Toucan",
		desc: 'Confuses the target. Wow description OneHand',
		shortdesc: "Confuses the target. If successful, adds a random entry hazard to target's side.",
		accuracy: 85,
		basePower: 0,
		category: "Status",
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Chatter', target);
		},
		onTryHit: function (target, source, move) {
			this.sayQuote(source, "Move-"+move.id, { default: `Wow ${toId(target.name)} OneHand`, target: target });
		},
		onHit: function (target) {
			let hazards = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
			target.side.addSideCondition(hazards[this.random(4)]);
		},
		volatileStatus: 'confusion',
		isViable: true,
		pp: 25,
		priority: 0,
		flags: {protect: 1, mirror: 1, sound: 1, authentic: 1, reflectable: 1},
		target: "normal",
		type: "Flying",
	},
	'rainbowspray': {
		num: 2028,
		id: 'rainbowspray',
		name:"Rainbow Spray",
		desc: "This move combines Fairy in its type effectiveness against the target. Has a chance to confuse or paralyze target.",
		shortDesc: "Combines Fairy in its type effectiveness. 45% chance to confuse. 35% chance to paralyze.",
		accuracy: 100,
		basePower: 80,
		category: "Special",
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
		num: 2029,
		id: "spindash",
		name: "Spindash",
		desc: "If this move is successful, the user is locked into this move and cannot make another move until it misses, 5 turns have passed, or the attack cannot be used. Power doubles with each successful hit of this move and doubles again if Defense Curl was used previously by the user. If this move is called by Sleep Talk, the move is used for one turn.",
		shortDesc: "Power doubles with each hit. Repeats for 5 turns.",
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
		num: 2030,
		id: "boost",
		name: "Boost",
		desc: "No additional effect.",
		shortDesc: "Hits first.",
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		isViable: true,
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
		num: 2031,
		id: 'setmine',
		name: 'Set Mine',
		desc: 'Lays a mine which will explode with a base power of 160 when a new pokemon is switched in.',
		shortDesc: "Hurts grounded foes on switch-in. Only works once. Max 1 mine. Damage factors in the user's current stats.",
		accuracy: true,
		basePower: 0,
		category: 'Status',
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
				this.add('-sidestart', side, 'move: Set Mine', `[msg] ${this.effectData.source.name} set a mine near the feet of the opposing team!`);
				this.sayQuote(this.effectData.source, "Move-setmine", `Tick tick boom!`);
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
				this.add('raw|' + pokemon.name + ' took a Mine to the face!');
				this.tryMoveHit(pokemon, this.effectData.moveSource, this.effectData.moveData);
				pokemon.side.removeSideCondition('setmine');
			},
		},
		target: 'foeSide',
		type: 'Fire',
	},
	'locknload': {
		num: 2032,
		id: 'locknload',
		name: `Lock 'n' Load`,
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "Raises the user's critical hit ratio by 2. User's next move will not miss the target.",
		accuracy: true,
		basePower: 0,
		category: 'Status',
		target: 'normal',
		type: 'Steel',
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Mean Look', target);
		},
		onTryHit: function (target, source) {
			if (source.volatiles['lockon']) source.removeVolatile('lockon');
			source.addVolatile('focusenergy');
		},
		onHit: function (target, source, move) {
			source.addVolatile('lockon', target);
			this.add('-activate', source, 'move: Lock \'n\' Load', '[of] ' + target);
			this.sayQuote(source, "Move-"+move.id, {target:target});
		},
		pp: 20,
	},
	'assassinate': {
		num: 2033,
		id: 'assassinate',
		name: 'Assassinate',
		desc: 'Deals damage to the target equal to the target\'s maximum HP. Ignores accuracy and evasiveness modifiers.',
		shortDesc: "OHKOs the target. Fails if user is a lower level.",
		accuracy: 0,
		basePower: 0,
		category: 'Physical',
		pp: 5,
		priority: 0,
		flags: {bullet: 1, protect: 1, mirror: 1},
		secondary: false,
		damageCallback: function (pokemon, target) {
			return target.maxhp;
		},
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Flash Cannon', target);
		},
		onTryHit: function (target, source) {
			// this.debug("onTryHit: source.level < target.level ==> "+(source.level < target.level));
			if (source.level < target.level) {
				this.add('-immune', target, '[ohko]');
				return false;
			}

			if (target.hasAbility('sturdy')) {
				this.add('-immune', target, '[msg]', '[from] ability: Sturdy');
				return null;
			}

			/* Implied in Lock-On and No Guard code already */

			// this.debug("onTryHit: lockon present ==> "+(!!source.volatiles['lockon']));
			// if (source.volatiles['lockon']) this.debug("onTryHit: lockon source match ==> "+(target === source.volatiles['lockon'].source));

			// if (source.volatiles['lockon'] && target === source.volatiles['lockon'].source) return true;
			// this.debug("onTryHit: noguard test ==> "+(source.hasAbility('noguard') || target.hasAbility('noguard')));
			// if (source.hasAbility('noguard') || target.hasAbility('noguard')) return true;
		},
		onHit: function (target, source, move) {
			this.add('-ohko');
			this.sayQuote(source, "Move-"+move.id, {default:'rip', target:target});
		},
		target: 'normal',
		type: 'Steel',
	},
	'quicksketch': {
		num: 2034, // hue
		id: 'quicksketch',
		name: 'Quick Sketch',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "Permanently adds the last move used in the battle to the user's moveset, then executes that move. Replaces a random move from the first 8 moves instead if user has 8 or more moves. Fails if user already has the move.",
		accuracy: true,
		basePower: 0,
		category: 'Status',
		pp: 5,
		priority: 0,
		flags: {protect: 1, authentic: 1},
		disallowedMoves: {
			copycat:1, focuspunch:1, mimic: 1, quicksketch: 1, sketch:1, sleeptalk:1, snatch:1, struggle:1, transform:1,
			mine:1, // The result of Cole's Set Mine move
		},
		onHit: function (target, source, me) {
			if (!this.lastMove || me.disallowedMoves[this.lastMove] || source.hasMove(this.lastMove)) return false;
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
			if (source.moveset.length < 8) {
				source.moveset.push(sketchedMove);
				source.baseMoveset.push(sketchedMove);
				source.moves.push(toId(move.name));
			} else {
				let r = this.random(8);
				source.moveset[r] = sketchedMove;
				source.baseMoveset[r] = sketchedMove;
				source.moves[r] = toId(move.name);
			}
			this.add('message', source.name + ' acquired ' + move.name + ' using its Quick Sketch!');
			this.useMove(move, target);
		},
		secondary: false,
		target: 'self',
		type: 'Normal',
	},
	'keepcalmandfocus': {
		num: 2035,
		id: 'keepcalmandfocus',
		name: 'Keep Calm and Focus!',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "90% chance to heal the user by 50% of its max HP and raise the user's Defense and Sp. Def by 1. 10% chance to heal the user by 25% of its max HP and raise the user's Attack by 2. Mega Evolves user via Absolite.",
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
		onHit: function (pokemon, source, move) {
			this.sayQuote(pokemon, "Move-"+move.id);
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
	},
	'quityourbullshit': {
		num: 2036,
		id: 'quityourbullshit',
		name: 'Quit your Bullshit',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "Eliminates the target's stat changes and status conditions.",
		pp: 10,
		priority: 0,
		category: 'Physical',
		basePower: 80,
		accuracy: true,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Close Combat', target);
		},
		onHit: function (target, source, move) {
			this.sayQuote(source, "Move-"+move.id, {target: target});
			target.clearBoosts();
			target.cureStatus();
			this.add('-clearboost', target);
		},
		type: 'Fighting',
		target: 'normal',
	},
	'typeroulette': {
		num: 2037,
		id: 'typeroulette',
		name: 'Type Roulette',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "Uses a random type.",
		pp: 10,
		priority: 0,
		category: 'Physical',
		type: 'Normal',
		typeList: ['Normal', 'Fire', 'Fighting', 'Water', 'Flying', 'Grass', 'Poison', 'Electric', 'Ground', 'Psychic', 'Rock', 'Ice', 'Bug', 'Dragon', 'Ghost', 'Dark', 'Steel', 'Fairy'],
		target: 'normal',
		basePower: 120,
		accuracy: 100,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		onPrepareHitPriority: 100,
		onPrepareHit: function (target, source, move) {
			move.type = move.typeList[this.random(move.typeList.length)];
			this.attrLastMove('[still]');
			let anim;
			switch (move.type) {
				case 'Normal':		anim = 'Mega Punch';	break;
				case 'Fire':		anim = 'Fire Punch';	break;
				case 'Fighting':	anim = 'Close Combat';	break;
				case 'Water':		anim = 'Waterfall'; 	break;
				case 'Flying':		anim = 'Wing Attack';	break;
				case 'Grass':		anim = 'Leaf Blade';	break;
				case 'Poison':		anim = 'Poison Jab';	break;
				case 'Electric':	anim = 'Thunder Punch'; break;
				case 'Ground':		anim = 'Drill Run'; 	break;
				case 'Psychic':		anim = 'Zen Headbutt';	break;
				case 'Rock':		anim = 'Head Smash';	break;
				case 'Ice':		anim = 'Ice Punch'; 	break;
				case 'Bug':		anim = 'X-Scissor'; 	break;
				case 'Dragon':		anim = 'Outrage';	break;
				case 'Ghost':		anim = 'Shadow Punch';	break;
				case 'Dark':		anim = 'Night Slash';	break;
				case 'Steel':		anim = 'Heavy Slam';	break;
				case 'Fairy':		anim = 'Play Rough';	break;
			}
			this.add('-anim', source, anim, target);
		},
	},
	'godswrath': {
		num: 2038,
		id: 'godswrath',
		name: "God's Wrath",
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "Attack depends on forme (default Ancient Power). Changes to another move on switch-in if user's ability is Invocation.",
		pp: 20,
		priority: 0,
		category: 'Physical',
		type: 'Rock',
		target: 'normal',
		basePower: 0,
		accuracy: true,
		flags: {},
		secondary: false,
		onTryHit: function (target, pokemon) {
			let move = 'ancientpower';
			switch (pokemon.template.speciesid) {
			case 'omastar':		move = 'abstartselect';		break;
			case 'kabutops':	move = 'wait4baba';		break;
			case 'aerodactyl':	move = 'balancedstrike';	break;
			case 'cradily':		move = 'texttospeech';		break;
			case 'armaldo':		move = 'holyducttapeofclaw';	break;
			case 'bastiodon':	move = 'warecho';		break;
			case 'rampardos':	move = 'skullsmash';		break;
			case 'carracosta':	move = 'danceriot';		break;
			case 'archeops':	move = 'bluescreenofdeath';	break;
			case 'aurorus':		move = 'portaltospaaaaaaace';	break;
			case 'tyrantrum':	move = 'doubleascent';		break;
			}
			this.useMove(move, pokemon, target);
			return null;
		},
	},
	'abstartselect': {
		num: 2039,
		id: 'abstartselect',
		name: "A+B+Start+Select",
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "Eliminates the target's stat changes. 20% chance to confuse the target.",
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
		onHit: function (target, source, move) {
			this.sayQuote(source, "Move-"+move.id, {
				default:['a+b+start+select', 'y+a+y', 'b+up', 'down+b', 'left+right', 'b+a+start'], 
				target: target});
			target.clearBoosts();
			this.add('-clearboost', target);
		},
	},
	'wait4baba': {
		num: 2040,
		id: 'wait4baba',
		name: 'Wait4baba',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "100% chance to lower the target's Speed by 1. 30% chance to flinch the target.",
		pp: 10,
		priority: 0,
		category: 'Physical',
		type: 'Water',
		target: 'normal',
		basePower: 100,
		accuracy: 100,
		flags: {protect: 1, mirror: 1},
		secondaries: [{chance: 100, boosts: {spe: -1}}, {chance: 30, volatileStatus: 'flinch'}],
		onPrepareHit: function (target, source) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Close Combat', target);
		},
		onHit: function (target, source, move) {
			this.sayQuote(source, "Move-"+move.id, {
				default:['start9', 'selectbra', 'wait4baba', 'wait4abrightbastart', '5,3+x+b3x', 'b9', 'a9', 'upstartdown', 'select+b008,135', 'homerxbaba'],
				target: target});
		},
	},
	'balancedstrike': {
		num: 2041,
		id: 'balancedstrike',
		name: 'Balanced Strike',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "This move does not check accuracy. Averages all stat changes with target (including acc/eva) before hit. Removes hazards and screens from field.",
		pp: 10,
		priority: 0,
		category: 'Physical',
		type: 'Flying',
		target: 'normal',
		basePower: 100,
		accuracy: true,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
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
		onHit: function (target, source, move) {
			this.sayQuote(source, "Move-"+move.id, {default:['anarchy', 'democracy'], target: target});
		},
	},
	'texttospeech': {
		num: 2042,
		id: 'texttospeech',
		name: 'Text to Speech',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "The target's Ability becomes Insomnia. Inflicts Taunt, Torment, Leech Seed and Confused statuses on the target.",
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
		onHit: function (target, source, move) {
			this.sayQuote(source, "Move-"+move.id, {default:[
					'walnut walnut walnut walnut walnut walnut walnut walnut walnut walnut walnut walnut walnut walnut walnut walnut',
					'potato potato potato potato potato potato potato potato potato potato potato potato potato potato potato potato',
					'soisoisoisoisoisoisoisoisoisoisoisoisoisoisoisoisoisoisoisoisoisoisoisoi',
					'!potato!potato!potato!potato!potato!potato!potato!potato!potato!potato!potato',
					'Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em Em moist potato penetration.'], 
				target: target});
			let bannedAbilities = {insomnia:1, multitype:1, stancechange:1, truant:1};
			if (!bannedAbilities[target.ability]) {
				let oldAbility = target.setAbility('insomnia');
				if (oldAbility) {
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
	},
	'holyducttapeofclaw': {
		num: 2043,
		id: 'holyducttapeofclaw',
		name: 'Holy Duct Tape of Claw',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "For 3 turns, the target can't use status moves. Traps and damages the target for 4-5 turns.",
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
		onHit: function (target, source, move) {
			this.sayQuote(source, "Move-"+move.id, {default:"...", target: target});
			target.addVolatile('taunt');
		},
	},
	'warecho': {
		num: 2044,
		id: 'warecho',
		name: 'War Echo',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "Raises the user's Attack by 2. Raises the Attack of Pokemon on the user's field by 2 two turns after being used.",
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
			this.sayQuote(source, "Move-"+move.id, {target: target});
		},
		sideCondition: 'warecho',
		effect: {
			duration: 3,
			onResidualOrder: 4,
			onEnd: function (side) {
				this.add('raw|', this.effectData.source.name + "'s warcry echoes back!");
				let target = side.active[this.effectData.sourcePosition];
				if (target && !target.fainted) {
					this.boost({atk: 2}, target);
				}
			},
		},
	},
	'skullsmash': {
		num: 2045,
		id: 'skullsmash',
		name: 'Skull Smash',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "Has 1/8 recoil.",
		pp: 10,
		priority: 0,
		category: 'Physical',
		type: 'Rock',
		target: 'normal',
		basePower: 150,
		accuracy: 80,
		flags: {contact: 1, protect: 1, mirror: 1},
		secondary: false,
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Head Smash', target);
		},
		onHit: function (target, source, move) {
			this.sayQuote(source, "Move-"+move.id, {target: target});
		},
		recoil: [1, 8],
	},
	'danceriot': {
		num: 2046,
		id: 'danceriot',
		name: 'Dance Riot',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "Lasts 2-3 turns. 50% chance to force the target to switch to a random ally.",
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
		secondary: false,
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
		onHit: function (target, source, move) {
			this.sayQuote(source, "Move-"+move.id, {
				default: '♫ ┌༼ຈل͜ຈ༽┘ ♪ DANCE RIOT ♫ ┌༼ຈل͜ຈ༽┘ ♪', 
				target: target});
			if (this.random(2) === 1) {
				target.forceSwitchFlag = 1;
			}
		},
	},
	'bluescreenofdeath': {
		num: 2047,
		id: 'bluescreenofdeath',
		name: 'Blue Screen of Death',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "Hits first. First turn out only. 100% flinch chance.",
		pp: 10,
		priority: 3,
		category: 'Physical',
		type: 'Flying',
		target: 'normal',
		basePower: 60,
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
		onHit: function (target, source, move) {
			this.sayQuote(source, "Move-"+move.id, {
				default: ['Oh no! err 03h was somehow tripped unexpectedly!', 
					'KERNEL PANIC', 'A fatal exception BET-BOY has occurred', 'WutFace NotLikeThis'],
				target: target});
		},
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
	},
	'portaltospaaaaaaace': {
		num: 2048,
		id: 'portaltospaaaaaaace',
		name: 'Portal to SPAAAAAAACE',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "10% chance to freeze. Super effective on Water, Ice, Steel, Fire.",
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
		onHit: function (target, source, move) {
			this.sayQuote(source, "Move-"+move.id, {default: 'SPAAAAAAAAAAAAACE!!!!', target: target});
		},
		secondary: {chance: 10, status: 'frz'},
	},
	'doubleascent': {
		num: 2049,
		id: 'doubleascent',
		name: 'Double Ascent',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "Lasts 2 turns. Hits and disappears first turn. Reappears and hits second turn.",
		pp: 10,
		priority: 0,
		category: 'Physical',
		type: 'Dragon',
		target: 'normal',
		basePower: 95,
		accuracy: 95,
		flags: {contact: 1, charge: 1, protect: 1, mirror: 1},
		secondary: false,
		onTry: function (attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-anim', attacker, 'Fly', defender);
			this.add('-prepare', attacker, 'Fly', defender);
			this.sayQuote(attacker, "Move-"+move.id, {target: defender});
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
	},
	'drama': {
		num: 2050,
		id: 'drama',
		name: 'Drama',
		desc: "Causes drama in the subreddit. Both the user and the target are badly poisoned and trapped. This move does not check accuracy.",
		shortDesc: "Badly poisons both the target and the user. The target and the user cannot switch out. This move does not check accuracy.",
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
			this.sayQuote(source, "Move-"+move.id, {target: target});
			target.addVolatile('trapped', source, move, 'trapper');
			source.addVolatile('trapped', target, move, 'trapper');
		},
	},
	'loratory': {
		num: 2051,
		id: 'loratory',
		name: 'Loratory',
		desc: "Gives a lengthy speech about insane headcanon lore. The target is either left confused, or bored to sleep (50:50). (Loratory = Lore + Oratory)",
		shortDesc: "50% chance to put the target to sleep. 50% chance to confuse the target.",
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
			this.sayQuote(source, "Move-"+move.id, {target: target});
			if (Math.random() < 0.5) {
				target.addVolatile('confusion');
			} else {
				target.trySetStatus('slp', source);
			}
		},
	},
	"beatingmist": {
		num: 2052,
		id: "beatingmist",
		name: "Beating Mist",
		desc: "Hits one to six times, with each hit having a 10% chance to lower the target's Special Attack by 1 stage. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit six times. Mega Evolves the user via Sharpedonite afterwards.",
		shortDesc: "Hits 1-6 times. Each hit has 10% chance to lower SpA by 1. Mega Evolves user via Sharpedonite.",
		accuracy: 100,
		basePower: 25,
		category: "Special",
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
		num: 2053, // boomburst is 586
		id: "wailofthebanshee",
		name: "Wail of the Banshee",
		desc: "No additional effect.",
		shortDesc: "No additional effect. Hits adjacent Pokemon.",
		accuracy: 100,
		basePower: 110,
		category: "Special",
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
		num: 2054,
		id: "witchscurse",
		name: "Witch's Curse",
		desc: "The target loses 1/4 of its maximum HP, rounded down, at the end of this turn. If the target uses Baton Pass, the replacement will continue to be affected.",
		shortDesc: "Target loses 1/4 of its max HP for 1 turn.",
		accuracy: 100,
		basePower: 80,
		category: "Special",
		pp: 15,
		priority: 0,
		flags: {protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Boomburst', target);
		},
		secondary: {
			chance: 100,
			volatileStatus: 'witchscurse',
		},
		effect: {
			duration: 2,
			onStart: function (pokemon, source) {
				this.add('-singleturn', pokemon, "Witch's Curse", '[of] ' + source);
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
		num: 2055,
		id: "foxfire",
		name: "Foxfire",
		desc: "Burns the target. Lowers the target's accuracy by 1 stage.",
		shortDesc: "Burns the target. Lowers the target's accuracy by 1.",
		accuracy: 85,
		basePower: 0,
		category: "Status",
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
		num: 2056,
		id: "spectralincantation",
		name: "Spectral Incantation",
		desc: "The user loses 1/2 of its maximum HP, rounded down, in exchange for raising the user's Special Attack and Special Defense by 2 stages.",
		shortDesc: "User loses 1/2 its max HP. Raises the user's Sp. Atk and Sp. Def by 2.",
		accuracy: true,
		basePower: 0,
		category: "Status",
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
	"gigahornbreak": {
		num: 2057,
		id: "gigahornbreak",
		name: "Giga Horn Break",
		desc: "The user recovers 3/4 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.",
		shortDesc: "User recovers 75% of the damage dealt.",
		pp: 10,
		priority: 0,
		flags: {contact: 1, protect: 1, mirror: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Horn Leech', target);
		},
		accuracy: 100,
		basePower: 80,
		category: 'Physical',
		drain: [3, 4],
		secondary: false,
		target: "normal",
		type: "Grass",
	},
	"goatflu": {
		num: 2058,
		id: "goatflu",
		name: "Goat Flu",
		desc: "Inflicts the target with Goat Flu. The target loses 1/6 of its maximum HP, rounded down, at the end of each turn, and has its Attack and Speed halved while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if there is no target or if the target is already affected. Grass Pokemon are immune to this move, but not the effect.",
		shortDesc: "The target is inflicted by Goat Flu.",
		statusTag: '<span class="bad">Goat&nbsp;Flu</span>',
		pp: 10,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		accuracy: 100,
		basePower: 0,
		category: "Status",
		volatileStatus: 'goatflu',
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'Ice Burn', target);
		},
		onTryHit: function (target, source, move) {
			if (target.volatiles.goatflu) {
				return false;
			}
			if (target.hasType('Grass')) {
				this.add('-immune', target, '[msg]');
				return null;
			}
		},
		effect: {
			onStart: function (pokemon, source) {
				this.add('-start', pokemon, 'Goat Flu', '[of] ' + source, 
					`[msg] ${source.name} spread Goat Flu onto ${pokemon.name}!`);
			},
			onResidualOrder: 10,
			onResidual: function (pokemon) {
				this.damage(pokemon.maxhp / 6);
			},
			onModifySpe: function (spe, pokemon) {
				return this.chainModify(0.5);
			},
			onModifyAtk: function (atk, pokemon) {
				return this.chainModify(0.5);
			},
		},
		target: "normal",
		type: "Grass",
	},
	"operationlove": {
		num: 2059,
		id: "operationlove",
		name: "Operation Love",
		desc: "Spreads love throughout the world! Attracts the target, regardless of gender or sexual preference, and changes the target's first move to Attract.",
		shortDesc: "A target becomes infaturated, and gains the move Attract over the target's first move.",
		pp: 15,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, authentic: 1},
		volatileStatus: 'attract',
		//TODO implement?
		onPrepareHit: function (target, source, move) {
			this.attrLastMove('[still]');
			if (!move.animActivated) {
				move.animActivated = true;
				this.add('-anim', source, 'Hypnosis', source);
				this.sayQuote(source, "Move-"+move.id, {target: target});
			}
		},
		onHit: function (target, source, me) {
			if (target.side == source.side) return; //Don't replace moves of allies.
			let move = Tools.getMove.call(this, "attract");
			let addedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			target.moveset[0] = addedMove;
			// target.baseMoveset[0] = addedMove;
			target.moves[0] = toId(move.name);
		},
		secondary: false,
		target: "allAdjacentFoes",
		// target: "allAdjacent",
		type: "Fairy",
		contestType: "Cute",
	},
	"huntingforproctors": {
		num: 2060,
		id: 'huntingforproctors',
		name: "Hunting for Proctors",
		desc: "User picks up a random item from the ground. If the user does this, this attack deals double damage.",
		shortDesc: "If possible, user recieves a random item, and doubles this move's power.",
		pp: 10,
		accuracy: 100,
		basePower: 60,
		flags: {contact: 1, protect: 1, mirror: 1},
		category: 'Physical',
		target: "normal",
		type: "Ground",
		//TODO implement
	},
	"poweraboose": {
		num: 2061,
		id: "poweraboose",
		name: "Power Aboose",
		desc: "",
		shortDesc: "50% chance to burn, Heals back 25% of the damage dealt, High critical hit ratio",
		pp: 15,
		accuracy: 95,
		critRatio: 2,
		basePower: 80,
		secondary: {
			chance: 50,
			status: 'brn',
		},
		flags: {protect:1, mirror:1, heal:1},
		drain: [1, 4],
		category: 'Physical',
		target: "normal",
		type: "Fire",
	},
	"absolutezero": {
		num: 2062,
		id: "absolutezero",
		name: "Absolute Zero",
		desc: "",
		shortDesc: "100% change to freeze the opponent",
		category: "Status",
		pp: 5,
		accuracy: 40,
		basePower: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, sound: 1, authentic: 1},
		onPrepareHit: function (target, source, move) { // animation
			this.attrLastMove('[still]');
			this.add('-anim', source, 'sheercold', target);
		},
		status: 'frz',
		secondary: false,
		target: "normal",
		type: "Ice",
		contestType: "Clever",
	},
};
