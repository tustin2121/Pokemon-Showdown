'use strict';

exports.BattleAbilities = { // define custom abilities here.
	"glitchiate": {
		num: 2001,
		id: "glitchiate",
		name: "Glitchiate",
		desc: "This Pokemon's moves become ???-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's moves become ??? type and have 1.3x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) { // still boost moves even if they are already ???-type (TM56)
			move.type = '???';
			if (move.category !== 'Status') pokemon.addVolatile('glitchiate');
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower, pokemon, target, move) {
				return this.chainModify([0x14CD, 0x1000]); // multiplies BP by 5325/4096 (~1.3000488), like in the games
			},
		},
		rating: 4,
	},
	"serenegraceplus": {
		num: 2002,
		id: "serenegraceplus",
		name: "Serene Grace Plus",
		desc: "This Pokemon's moves have their secondary chances multiplied by 3.",
		shortDesc: "This Pokemon's moves have their secondary chances multiplied by 3.",
		onModifyMovePriority: -2,
		onModifyMove: function (move) {
			if (move.secondaries && move.id !== 'secretpower') {
				for (let i = 0; i < move.secondaries.length; i++) {
					move.secondaries[i].chance *= 3;
				}
			}
		},
		rating: 5,
	},
	'spoopify': {
		num: 2003,
		id: "spoopify",
		name: "Spoopify",
		desc: "Makes stuff Ghost on switch-in.",
		shortDesc: "On switch-in, this Pokemon changes all opponents' primary type to Ghost.",
		onStart: function (pokemon) {
			this.add("-ability", pokemon, "Spoopify");
			let activeFoe = pokemon.side.foe.active;
			for (let i = 0; i < activeFoe.length; i++) {
				let foe = activeFoe[i];
				let tempTypes = foe.types.slice();
				if (!foe.hasType('Ghost')) {
					tempTypes[0] = 'Ghost';
				} else if (foe.types[0] !== 'Ghost') {
					tempTypes.shift();
				} else {
					continue;
				}
				foe.types = tempTypes;
				this.add('-start', foe, 'typechange', foe.types.join('/'), '[from] Spoopify', '[of] '+pokemon);
			}
		},
		rating: 4,
	},
	/*'scrubterrain': { // MLZekrom pls, Scrub Terrain was really hacky. Happy it's out of the meta.
		num: 2004,
		id: 'scrubterrain',
		name: 'Scrub Terrain',
		desc: '',
		shortDesc: '',
		onStart: function (pokemon) {
			this.setWeather('scrubterrain');
		},
		onAnySetWeather: function (target, source, weather) {
			if (this.getWeather().id === 'scrubterrain' && !(weather.id in {desolateland:1, primordialsea:1, deltastream:1, scrubterrain:1})) return false;
		},
		onEnd: function (pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('scrubterrain')) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		rating: 4,
	},*/
	'proteon': { // Eeveelutionlvr's ability.
		num: 2005,
		id: 'proteon',
		name: 'Proteon',
		desc: "This Pokemon transforms into an Eeveelution to match the type of the move it is about to use, if possible.",
		shortDesc: "This Pokemon transforms into an Eeveelution to match the type of the move it is about to use, if possible.",
		onPrepareHit: function (source, target, move) {
			let type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				let species = '';
				if (type === 'Electric') {
					species = 'Jolteon';
				} else if (type === 'Normal') {
					species = 'Eevee';
				} else if (type === 'Water') {
					species = 'Vaporeon';
				} else if (type === 'Fire') {
					species = 'Flareon';
				} else if (type === 'Psychic') {
					species = 'Espeon';
				} else if (type === 'Dark') {
					species = 'Umbreon';
				} else if (type === 'Ice') {
					species = 'Glaceon';
				} else if (type === 'Grass') {
					species = 'Leafeon';
				} else if (type === 'Fairy') {
					species = 'Sylveon';
				}
				if (species !== '' && source.template.speciesid !== toId(species)) { // don't transform if type is not an eeveelution type or you are already that eeveelution.
					source.formeChange(species);
					this.add('-formechange', source, species, '[msg]', '[from] ability: Proteon');
					source.setAbility('proteon');
				}
			}
		},
		rating: 4.5,
	},
	'swahahahahaggers': { // Sohippy's ability: con on switch-in.
		num: 2006,
		id: 'swahahahahaggers',
		name: 'Swahahahahaggers',
		desc: "On switch-in, all opponents become confused for 1 turn, with 70% self-hit chance.",
		shortDesc: "On switch-in, all opponents become confused for 1 turn, with 70% self-hit chance.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Swahahahahaggers');
			let activeFoe = pokemon.side.foe.active;
			for (let i = 0; i < activeFoe.length; i++) {
				let foe = activeFoe[i];
				foe.addVolatile('sconfusion');
			}
		},
		rating: 4,
	},
	'psychologist': { // Kooma's ability: immune to all "mental" volatile statuses.
		num: 2007,
		id: 'psychologist',
		name: 'Psychologist',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "[PLACEHOLDER DESCRIPTION]",
		onUpdate: function (pokemon) {
			let list = ['embargo', 'encore', 'flinch', 'healblock', 'attract', 'nightmare', 'taunt', 'torment', 'confusion', 'sconfusion'];
			let activated = false;
			for (let i = 0; i < list.length; i++) {
				if (pokemon.volatiles[list[i]]) {
					pokemon.removeVolatile(list[i]);
					activated = (activated || []);
					activated.push(list[i]);
				}
			}
			if (activated) {
				this.add('-activate', pokemon, 'ability: Psychologist');
				// For items that don't report themselves ending, report them ending.
				activated.forEach(item => {
					switch (item) {
						case 'attract': 
							this.add('-end', pokemon, 'move: Attract', '[from] ability: Psychologist'); 
							break;
						case 'nightmare':
							this.add('-end', pokemon, 'Nightmare', '[from] ability: Psychologist'); 
							break;
					}
				});
			}
		},
		onImmunity: function (type, pokemon) {
			let list = ['embargo', 'encore', 'flinch', 'healblock', 'attract', 'nightmare', 'taunt', 'torment', 'confusion', 'sconfusion'];
			for (let i = 0; i < list.length; i++) {
				if (type === list[i]) {
					this.add('-immune', pokemon, list[i], '[from] ability: Psychologist');
					return null;
				}
			}
		},
		rating: 4,
	},
	'seaandsky': { // Kap'n Kooma's ability: Primordial Sea plus Swift Swim.
		num: 2008,
		id: 'seaandsky',
		name: 'Sea and Sky',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "[PLACEHOLDER DESCRIPTION]",
		onStart: function (source) {
			this.setWeather('primordialsea');
		},
		onAnySetWeather: function (target, source, weather) {
			if (this.getWeather().id === 'primordialsea' && !(weather.id in {desolateland:1, primordialsea:1, deltastream:1})) return false; // no more Sandstorm overwriting the Heavy Rain!
		},
		onEnd: function (pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					let target = this.sides[i].active[j];
					if (target === pokemon) continue;
					if (target && target.hp && (target.ability === 'primordialsea' || target.ability === 'seaandsky') && (!target.ignore || target.ignore['Ability'] !== true)) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		onModifySpe: function (spe, pokemon) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return this.chainModify(2);
			}
		},
		rating: 5,
	},
	'littleengine': { // Poomph, the little engine who couldn't. Little moody.
		num: 2009,
		id: "littleengine",
		name: "Little Engine",
		desc: "This Pokemon has a random stat raised by 1 stage at the end of each turn.",
		shortDesc: "Raises a random stat by 1 at the end of each turn.",
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			let stats = [], i = '';
			let boost = {};
			for (let i in pokemon.boosts) {
				if (pokemon.boosts[i] < 6) {
					stats.push(i);
				}
			}
			if (stats.length) {
				i = stats[this.random(stats.length)];
				boost[i] = 1;
			}
			this.boost(boost);
		},
		rating: 4.5,
	},
	'furriercoat': { // WhatevsFur, better fur coat, no frz.
		num: 2010,
		id: "furriercoat",
		name: "Furrier Coat",
		desc: "This Pokemon's Defense and Sp. Defense are doubled. This Pokemon cannot be frozen.",
		shortDesc: "This Pokemon's Defense and Sp. Defense are doubled. This Pokemon cannot be frozen.",
		onModifyDefPriority: 6,
		onModifyDef: function (def) {
			return this.chainModify(2);
		},
		onModifySpDPriority: 6,
		onModifySpD: function (spd) { //SpD not Spd TriHard
			return this.chainModify(2);
		},
		onImmunity: function (type, pokemon) {
			if (type === 'frz') return false;
		},
		rating: 3.5,
	},
	'nofun': {
		num: 2011,
		id: "nofun",
		name: "No Fun",
		desc: "Abilities are fun. No more ability for you.",
		shortDesc: "Abilities are fun. No more ability for you.",
		rating: 0,
	},
	'nofunallowed': {
		num: 2012,
		id: "nofunallowed",
		name: "No Fun Allowed",
		desc: "Makes opponent's ability No Fun. Causes all custom moves to fail.",
		shortDesc: "Makes opponent's ability No Fun. Causes all custom moves to fail.",
		onFoeSwitchIn: function (pokemon) {
			let oldAbility = pokemon.setAbility('nofun', pokemon, 'nofun', true);
			if (oldAbility) {
				this.add('-endability', pokemon, oldAbility, '[from] ability: No Fun Allowed');
				this.add('-ability', pokemon, 'No Fun', '[from] ability: No Fun Allowed');
			}
		},
		onStart: function (pokemon) {
			let foeactive = pokemon.side.foe.active;
			for (let i = 0; i < foeactive.length; i++) {
				let foe = foeactive[i];
				let oldAbility = foe.setAbility('nofun', foe, 'nofun', true);
				if (oldAbility) {
					this.add('-endability', foe, oldAbility, '[from] ability: No Fun Allowed');
					this.add('-ability', foe, 'No Fun', '[from] ability: No Fun Allowed');
				}
			}
		},
		onAnyTryMove: function (target, source, effect) {
			if (effect.num >= 2000) {
				this.attrLastMove('[still]');
				this.add('-ability', source, 'No Fun Allowed');
				this.add('message', "No Fun Mantis's No Fun Allowed suppressed the signature move!");
				return false;
			}
		},
		rating: 3.5,
	},
	"dictator": {
		num: 2013,
		id: "dictator",
		name: "Dictator",
		desc: "On switch-in, this Pokemon lowers the Attack, Special Attack and Speed of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Attack, Special Attack and Speed of adjacent opponents by 1 stage.",
		onStart: function (pokemon) {
			let foeactive = pokemon.side.foe.active;
			let activated = false;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Dictator', 'boost');
					activated = true;
				}
				if (foeactive[i].volatiles['substitute']) {
					this.add('-activate', foeactive[i], 'Substitute', 'ability: Dictator', '[of] ' + pokemon);
				} else {
					this.boost({atk: -1, spa: -1, spe: -1}, foeactive[i], pokemon);
				}
			}
		},
		rating: 4,
	},
	"messiah": {
		num: 2014,
		id: "messiah",
		name: "Messiah",
		desc: "This Pokemon blocks certain status moves and instead uses the move against the original user. Increases Sp.Attack by 2 when triggered",
		shortDesc: "This Pokemon blocks certain status moves and bounces them back to the user. Also gets a SpA boost when triggered",
		onTryHitPriority: 1,
		onTryHit: function (target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			this.useMove(newMove, target, source);
			this.boost({spa:2}, target);
			return null;
		},
		onAllyTryHitSide: function (target, source, move) {
			if (target.side === source.side || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			let newMove = this.getMoveCopy(move.id);
			newMove.hasBounced = true;
			this.useMove(newMove, target, source);
			this.boost({spa:2}, target); // now boosts when bouncing back hazards
			return null;
		},
		effect: {
			duration: 1,
		},
		rating: 4.5,
	},
	'technicality': {
		num: 2015,
		rating: 2,
		id: 'technicality',
		name: 'Technicality',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "[PLACEHOLDER DESCRIPTION]",
		onFoeTryMove: function (target, source, effect) {
			if (this.random(10) === 0) {
				this.attrLastMove('[still]');
				this.sayQuote(source, "Ability-"+effect.id, {
					target: target, 
					default: ["This move doesn't work because I say so!", "You are not allowed to use that move!", "Unauthorized use of that move!"]
				});
				//TODO report ability!
				return false;
			}
		},
	},
	'megaplunder': {
		num: 2016,
		id: 'megaplunder',
		name: 'Mega Plunder',
		desc: "[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]",
		shortDesc: "[PLACEHOLDER DESCRIPTION]",
		rating: 0,
	},
	'pikapower': {
		num: 2017,
		id: "pikapower",
		name: "Pika Power",
		desc: "This Pok&#xe9;mon has a 10% chance of exploding if you target it.",
		shortdesc: "May explode when hit.",
		rating: 2,
		onTryHit: function (target, source, move) {
			if (target === source || move.hasBounced) {
				return;
			}
			if (this.random(10) === 1) {
				// this.add("c|" + target.name + "|KAPOW"); //Quote moved to the Move explosion
				let newMove = this.getMoveCopy("explosion");
				this.useMove(newMove, target, source);
				return null;
			}
		},
	},
	'banevade': {
		num: 2018,
		id: "banevade",
		name: "Ban Evade",
		desc: "This Pokemon's evasion is evaluated by end of each turn. Higher evasion at lower HP. OHKO moves will fail.",
		shortDesc: "Higher evasion at lower HP. Immune to OHKO.",
		onTryHit: function (pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[msg]');
				return null;
			}
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			if (pokemon.hp > pokemon.maxhp / 2 && pokemon.boosts.evasion < 0) {
				this.boost({evasion: 0 - pokemon.boosts.evasion}, pokemon);
			} else if (pokemon.hp <= pokemon.maxhp / 2 && pokemon.hp > pokemon.maxhp / 4 && pokemon.boosts.evasion < 2) {
				this.boost({evasion: 2 - pokemon.boosts.evasion}, pokemon);
			} else if (pokemon.hp <= pokemon.maxhp / 4 && pokemon.hp > pokemon.maxhp / 32 && pokemon.boosts.evasion < 4) {
				this.boost({evasion: 4 - pokemon.boosts.evasion}, pokemon);
			} else if (pokemon.hp <= pokemon.maxhp / 32 && pokemon.boosts.evasion < 6) {
				this.boost({evasion: 6 - pokemon.boosts.evasion}, pokemon);
			}
			//TODO report ability!
		},
		rating: 3,
	},
	'incinerate': {
		num: 2019,
		id: "incinerate",
		name: "Incinerate",
		desc: "This Pokemon's Normal type moves become Fire type and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal type moves become Fire type and have 1.3x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.id !== 'struggle' && move.type === 'Normal') { // don't mess with Struggle, only change normal moves.
				move.type = 'Fire';
				if (move.category !== 'Status') pokemon.addVolatile('incinerate');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower, pokemon, target, move) {
				return this.chainModify([0x14CD, 0x1000]); // not sure how this one works but this was in the Aerilate code in Pokemon Showdown.
			},
		},
		rating: 3.5,
	},
	'physicalakazam': { // Makes Alakazam into a physical tank
		num: 2020,
		id: "physicalakazam",
		name: "Physicalakazam",
		desc: "This Pokemon's Attack is doubled and its Defense is increased 1.5x.",
		shortDesc: "This Pokemon's Attack is doubled and its Defense is increased 1.5x.",
		onModifyDefPriority: 6,
		onModifyDef: function (def) {
			return this.chainModify(1.5);
		},
		onModifyAtkPriority: 6,
		onModifyAtk: function (atk) {
			return this.chainModify(2);
		},
		rating: 3.5,
	},
	"defiantplus": {
		num: 2021,
		id: "defiantplus",
		name: "Defiant Plus",
		desc: "This Pokemon's Attack and Speed is raised by 2 stages for each of its stat stages that is lowered by an opposing Pokemon. If this Pokemon has a major status condition, its Speed is multiplied by 1.5; the Speed drop from paralysis is ignored.",
		shortDesc: "This Pokemon's Attack and Speed is raised by 2 for each of its stats that is lowered by a foe. If this Pokemon is statused, its Speed is 1.5x; ignores Speed drop from paralysis.",
		onAfterEachBoost: function (boost, target, source) {
			if (!source || target.side === source.side) {
				return;
			}
			let statsLowered = false;
			for (let i in boost) {
				if (boost[i] < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({atk: 2, spe: 2});
			}
		},
		onModifySpe: function (spe, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		rating: 2.5,
	},
	'silverscale': { // Abyll's Milotic's ability: Upgraded marvel scale
		num: 2022,
		id: "silverscale",
		name: "Silver Scale",
		desc: "If this Pokemon has a major status condition, its Sp Defense is multiplied by 1.5, and Speed by 1.25.",
		shortDesc: "If this Pokemon is statused, its Sp Defense is 1.5x and Speed is 1.25x.",
		onModifySpDPriority: 6,
		onModifySpD: function (spD, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		onModifySpePriority: 6,
		onModifySpe: function (spe, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.25);
			}
		},
		rating: 2.5,
	},
	'gottagofast': { // Pokson's speedboost
		num: 2023,
		id: 'gottagofast',
		name: 'Gotta Go Fast',
		desc: "Chance of boosting speed when using signature move",
		shortDesc: "Chance of boost when using special move",
		rating: 2.5,
		onSourceHit: function (target, source, move) {
			if (source && move && (move.id === "boost" || move.id === "spindash")) {
				if (this.random(10) < 3) {
					this.boost({spe: 12}, source); //TODO report ability? Check Speed Boost on Ninjask
				}
			}
		},
	},
	'drawingrequest': {
		num: 2024,
		id: 'drawingrequest',
		name: 'Drawing Request',
		desc: "At the end of each turn, replaces this Pokemon's first move with a random move from the pool of all Special attacks >= 60 BP and all status moves, minus the ones that boost the user's Attack stat, and the ones this Pokemon already has.",
		shortDesc: 'TL;DR', // DansGame
		rating: 3,
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual: function (pokemon) {
			let moves = [];
			let movedex = require('./moves.js').BattleMovedex;
			for (let i in movedex) {
				let move = movedex[i];
				if (i !== move.id) continue;
				if (move.isNonstandard) continue;
				if (move.category === 'Physical') continue;
				if (move.basePower < 60 && move.category !== 'Status') continue;
				if (move.category === 'Status' && move.boosts && move.boosts.atk && move.boosts.atk > 0 && move.target === 'self') continue;
				if (pokemon.hasMove(move)) continue;
				moves.push(move);
			}
			let move = '';
			if (moves.length) {
				moves.sort(function (a, b) {return a.num - b.num;});
				move = moves[this.random(moves.length)];
			}
			if (!move) {
				return false;
			}
			pokemon.moveset[0] = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			pokemon.moves[0] = toId(move.name);
			this.add('message', pokemon.name + ' acquired a new move using its Drawing Request!');
			//TODO report ability!
		},
	},
	"mindgames": {
		num: 2025,
		id: "mindgames",
		name: "Mind Games",
		desc: "When this Pokemon switches in, it appears as the last unfainted Pokemon in its party until it takes direct damage from another Pokemon's attack. This Pokemon's actual level and HP are displayed instead of those of the mimicked Pokemon.",
		shortDesc: "This Pokemon appears as the last Pokemon in the party until it takes direct damage.",
		onBeforeSwitchIn: function (pokemon) {
			pokemon.illusion = null;
			let foe = pokemon.side.foe;
			pokemon.illusion = foe.pokemon[this.random(foe.pokemon.length)];
		},
		// illusion clearing is hardcoded in the damage function
		rating: 4.5,
	},
	'jackyofalltrades': {
		num: 2026,
		id: 'jackyofalltrades',
		name: 'Jack(y) of All Trades',
		desc: '[PLACEHOLDER DESCRIPTION! FIX YO SHIT, TIESOUL!]',
		shortDesc: '[PLACEHOLDER DESCRIPTION]',
		rating: 4,
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (basePower <= 80) {
				this.debug('Technician boost');
				return this.chainModify(1.5);
			}
		},
	},
	'mirrorguard': {
		num: 2027,
		id: 'mirrorguard',
		name: 'Mirror Guard',
		desc: 'Pokemon bounces residual damage. Curse and Substitute on use, Belly Drum, Pain Split, Struggle recoil, and confusion damage are considered direct damage.',
		shortDesc: 'This Pokemon bounces residual damage.',
		onDamage: function (damage, target, source, effect) {
			console.log(arguments);
			if (effect.effectType === 'Move' || effect.wasMirrored) {
				return;
			}
			let newEffect = Object.create(effect);
			newEffect.wasMirrored = true;
			let foes = target.side.foe.active;
			for (let i = 0; i < foes.length; i++) {
				let foe = foes[i];
				this.damage(damage, foe, source, newEffect);
			}
			return false; //TODO git blame this quote \/
		},
		// Would be totally broken on something holding Toxic Orb.
		// Good thing I haven't done that, right?
		rating: 5,
	},
	'superprotean': {
		num: 2028,
		id: 'superprotean',
		name: 'Super Protean',
		desc: 'Adds the type of every move used to the pokemon.',
		shortDesc: 'Gets a shitload of types.',
		onPrepareHit: function (source, target, move) {
			let type = move.type;
			if (!source.hasType(type)) {
				let tempTypes = [];
				for (let i = 0; i < source.types.length; i++) {
					tempTypes[i] = source.types[i];
				}
				tempTypes.push(type);
				source.types = tempTypes;
				this.add('-start', source, 'typechange', source.types.join('/')); //TODO report ability!
			}
		},
		rating: 4,
	},
	'invocation': {
		num: 2029,
		name: 'Invocation',
		id: 'invocation',
		desc: 'Randomly transforms into a fossil god on switch-in.',
		shortDesc: 'Transforms into a fossil.',
		onStart: function (pokemon) {
			let fossils = ['Omastar', 'Kabutops', 'Aerodactyl', 'Cradily', 'Armaldo', 'Bastiodon', 'Rampardos', 'Carracosta', 'Archeops', 'Aurorus', 'Tyrantrum'];
			let fossil = fossils[this.random(fossils.length)];
			pokemon.formeChange(fossil);
			this.add('-formechange', pokemon, fossil, '[msg]'); //TODO report ability!
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
			let index = pokemon.moves.indexOf('godswrath');
			move = this.getMove(move);
			pokemon.moveset[index] = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			pokemon.moves[index] = toId(move.name);
		},
		rating: 1,
	},
	'heraldofdeath': {
		num: 2030,
		id: 'heraldofdeath',
		name: 'Herald of Death',
		desc: "On switch-in, each adjacent opposing active Pokemon receives a perish count of 4 if it doesn't already have a perish count. At the end of each turn including the turn used, the perish count of all active Pokemon lowers by 1 and Pokemon faint if the number reaches 0. The perish count is removed from Pokemon that switch out. If a Pokemon uses Baton Pass while it has a perish count, the replacement will gain the perish count and continue to count down.",
		shortDesc: 'On switch-in, all adjacent opponents will faint in 3 turns.',
		onStart: function (pokemon) {
			let foeactive = pokemon.side.foe.active;
			let result = false;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (!foeactive[i].volatiles['perishsong']) {
					foeactive[i].addVolatile('perishsong');
					this.add('-start', foeactive[i], 'perish3', '[silent]');
					result = true;
				}
			}
			if (result) this.add('message', 'The Herald of Death has arrived. All opposing Pokemon will perish in 3 turns!'); //TODO report ability!
		},
		rating: 3.5,
	},
	"beatmisty": {
		num: 2031,
		id: "beatmisty",
		name: "Beat Misty",
		desc: "This Pokemon is immune to Water-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Water-type move. This Pokemon has a 10% chance to survive an attack that would KO it with 1 HP.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Water moves; Water immunity. This Pokemon has a 10% chance to survive an attack that would KO it with 1 HP.",
		onTryHit: function (target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.maxhp / 4)) {
					this.add('-immune', target, '[msg]', '[from] ability: Beat Misty');
				}
				return null;
			}
		},
		onDamage: function (damage, target, source, effect) {
			if (this.random(10) === 7 && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add("-activate", target, "ability: Beat Misty");
				return target.hp - 1;
			}
		},
		rating: 3.5,
	},
	"summongoats": {
		num: 2032,
		id: "summongoats",
		name: "Summon Goats",
		desc: "Summons additional goats to attack with a fraction of power the higher the current HP is. X is equal to (user's current HP * 48 / user's maximum HP), rounded down; the number of additional hits is 0 if X is 0 to 12, 1 if X is 13 to 24, 2 if X is 25 to 36, 3 if X is 37 to 47, and 4 if X is 48. The second hit has its damage halved; the third hit has its damage thirded, etc. Does not affect multi-hit moves or moves that have multiple targets. tl;dr: Parental Bond with more possible hits.", // Sticking to game mechanics TriHard
		shortDesc: "This Pokemon's damaging moves hit multiple times depending on its current HP. Damage decreases from the second hit onwards.",
		onPrepareHitPriority: 10, //higher than Goat of Arms item
		onPrepareHit: function (source, target, move) {
			if (move.id in {iceball: 1, rollout: 1}) return;
			if (move.category !== 'Status' && !move.selfdestruct && !move.multihit && !move.flags['charge'] && !move.spreadHit) {
				
				let num = Math.floor(source.hp * 48 / source.maxhp);
				if (num < 12) num = 0;
				else if (num < 24) num = 1;
				else if (num < 36) num = 2;
				else if (num < 48) num = 3;
				else num = 4;
				move.multihit = num+1;
				source.addVolatile('summongoats');
			}
		},
		effect: {
			duration: 1,
			onBasePowerPriority: 8,
			onBasePower: function (basePower) {
				if (this.effectData.hit) {
					this.effectData.hit++;
					return this.chainModify(1.0 / this.effectData.hit);
				} else {
					this.effectData.hit = 1;
				}
			},
			onSourceModifySecondaries: function (secondaries, target, source, move) {
				if (move.id === 'secretpower' && this.effectData.hit < 2) {
					// hack to prevent accidentally suppressing King's Rock/Razor Fang
					return secondaries.filter(effect => effect.volatileStatus === 'flinch');
				}
			},
		},
		rating: 5,
	},
	"nolovelost": {
		num: 2033,
		id: "nolovelost",
		name: "No Love Lost",
		desc: "This pokemon is immune to the effects of Attract. If the pokemon is hit by Attract, the user is instead attracted to this pokemon, and this pokemon gains +2 SpA and +2 SpD.",
		shortDesc: "Cannot be Attracted, but gains +2 SpA, +2 SpD, and an attracted foe if tried.",
		//TODO Implement
		rating: 1,
	},
	"speedrunner": {
		num: 2034,
		id: "speedrunner",
		name: "SpeedRunner",
		desc: "On switching in, this pokemon gains +1 spe, and the opponent loses +1 spe. Further, this Pokemon's moves of 60 power or less have their power multiplied by 1.5, including Struggle.",
		shortDesc: "Increase Speed of yourself by 1,decrease speed of opponent by 1(during switch in) +Technician",
		onBasePower: function (basePower, attacker, defender, move) {
			if (basePower <= 60) {
				this.debug('Technician boost');
				return this.chainModify(1.5);
			}
		},
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'SpeedRunner', 'boost');
			this.boost({spe: 1}, pokemon, pokemon);
			let foeactive = pokemon.side.foe.active;
			for (let i = 0; i < foeactive.length; i++) {
				if (!foeactive[i] || !this.isAdjacent(foeactive[i], pokemon)) continue;
				if (foeactive[i].volatiles['substitute']) {
					this.add('-immune', foeactive[i], '[msg]');
				} else {
					this.boost({spe: -1}, foeactive[i], pokemon);
				}
			}
		},
	},
	"slickice": {
		num: 2035,
		id: "slickice",
		name: "Slick Ice",
		desc: "All Ice type moves used by this Pokemon gain +1 Priority. Upon using an Ice type move this Pokemon gains Dragon typing as a third type.",
		shortDesc: "All Ice type moves used by this Pokemon gain +1 Priority. Upon using an Ice type move this Pokemon gains Dragon typing as a third type.",
		onModifyPriority: function(priority, pokemon, target, move) {
			if (move && move.type === "Ice") return priority + 1;
		},
		onAfterMoveSecondarySelf: function (source, target, move) {
			if (move.type === "Ice" && !source.hasType('Dragon')) {
				if (source.addType('Dragon')) {
					this.add('-start', source, 'typeadd', 'Dragon', '[from] ability: Slick Ice');
				}
			}
		},
	},
	"cheatcode": {
		num: 2036,
		id: "cheatcode",
		name: "Cheat Code",
		desc: "Upon switching in, and at the end of every turn, this pokemon gains two new signature moves, appended onto its move pool. One of the moves is from the opponent's set of signature moves, and the other is a random fossil god move (resolved in random order). Upon using an extra move, the move vanishes from the move set. This ability cannot add a move if there are already four extra moves. Moves are kept through switching.",
		shortDesc: "Gains two signiture moves at the end of every turn.",
		onResidualOrder: 28,
		onResidual: function(pokemon) { //On end of turn
			let self = this;
			let methods = [];
			this.debug("CheatCode activating...");
			switch (this.random(2)) {
				case 0: methods = [getOpponentMove, getGodMove]; break;
				case 1: methods = [getGodMove, getOpponentMove]; break;
			}
			
			let addedMoves = [];
			while (methods.length > 0) {
				if (pokemon.moves.length >= 8) break; //If there's more than 4 extra moves, don't add more
				
				let moveid = methods.pop().call(this);
				this.debug("CheatCode: adding move "+moveid);
				if (moveid === undefined) continue; //Can't add a move
				addedMoves.push(moveid);
				let move = this.getMove(moveid);
				let sketchedMove = {
					move: move.name,
					id: move.id,
					pp: move.pp,
					maxpp: move.pp,
					target: move.target,
					disabled: false,
					used: false,
				};
				pokemon.moveset.push(sketchedMove);
				pokemon.baseMoveset.push(sketchedMove);
				pokemon.moves.push(toId(move.name));
			}
			if (addedMoves.length == 0) {
				this.debug("CheatCode failed to add any moves.");
				return;
			}
			this.add('-ability', pokemon, 'Cheat Code');
			if (pokemon.name === 'tustin2121') {
				// If this is owned by tustin2121, act like he's using /evalbattle
				// evalbattlePrint.call(this);
			}
			this.add(`raw|>>> this.${pokemon.toString().substr(0,2)}.active[${pokemon.side.active.indexOf(pokemon)}].moves.push(${addedMoves.toString()})`);
			this.add(`raw|<<< ${pokemon.moves.length}`);
			this.sayQuote(pokemon, "Ability-cheatcode");
			
			this.debug("CheatCode complete.");
			return;
			
			function getOpponentMove() {
				let moves = [];
				let targets = pokemon.side.foe.active;
				for (let i = 0; i < targets.length; i++) {
					if (!targets[i] || targets[i].fainted) continue;
					let sigmoves = targets[i].set.signatureMoves;
					if (!sigmoves) continue;
					for (let j = 0; j < sigmoves.length; j++) {
						// Don't include moves we already have
						if (pokemon.moves.indexOf(sigmoves[j]) > -1) continue;
						moves.push(sigmoves[j]);
					}
				}
				return moves[this.random(moves.length)];
			}
			
			function getGodMove() {
				let moves = [];
				let godmoves = [
					'abstartselect',
					'wait4baba',
					'balancedstrike',
					'texttospeech',
					'holyducttapeofclaw',
					'warecho',
					'skullsmash',
					'danceriot',
					'bluescreenofdeath',
					'portaltospaaaaaaace',
					'doubleascent',
				];
				for (let j = 0; j < godmoves.length; j++) {
					// Don't include moves we already have
					if (pokemon.moves.indexOf(godmoves[j]) > -1) continue;
					moves.push(godmoves[j]);
				}
				return moves[this.random(moves.length)];
			}
			
			function evalbattlePrint() {
				let enemy = pokemon.side.foe.active;
				let enemyid = Math.floor(Math.random()*enemy.length); //choose random pokemon
				enemy = enemy[enemyid]; 
				switch(Math.floor(Math.random()*10)) {
					case 0:
						this.add(`raw|>>> this.${enemy.toString().substr(0,2)}.active[${enemyid}].hp`);
						this.add(`raw|<<< ${enemy.hp}`);
						break;
					case 1:
						this.add(`raw|>>> this.${enemy.toString().substr(0,2)}.active[${enemyid}].moves`);
						this.add(`raw|<<< ${enemy.moves}`);
						break;
					case 2:
					case 3:
					case 4:
					case 5:
					case 6:
					case 7:
					case 8:
					case 9:
						this.add(`raw|>>> this.${enemy.toString().substr(0,2)}.active[${enemyid}].ability`);
						this.add(`raw|<<< ${enemy.ability}`);
						this.add('-ability', enemy, this.getAbility(enemy.ability), '[from] evalbattle', '[silent]');
						break;
				}
				
			}
		},
		onAfterMoveSecondarySelf: function (source, target, move) {
			// Used an added move
			let index = source.moves.indexOf(move.id);
			if (index >= 4) {
				this.debug("Removing move.id "+move.id+" from index "+index);
				source.moves.splice(index, 1);
				source.moveset.splice(index, 1);
				source.baseMoveset.splice(index, 1);
			}
		},
		//TODO on end (no funed) remove all extra moves
	},
	"mediator": {
		num: 2037,
		id: "mediator",
		name: "Mediator",
		desc: "Every turn, has a 50% chance of healing a random ally's status condition, and has a 10% chance of healing his opponents status condition. In doubles or triples, each chance is calculated independently.",
		shortDesc: "",
		onResidualOrder: 18,
		onResidual: function(pokemon) {
			let activated = false;
			pokemon.side.active.forEach(m => {
				if (m.hp && m.status && this.random(2) === 0) {
					if (!activated) { 
						this.add('-activate', pokemon, 'ability: Mediator');
						activated = true;
					}
					m.cureStatus();
				}
			});
			pokemon.side.foe.active.forEach(m => {
				if (m.hp && m.status && this.random(10) === 0) {
					if (!activated) { 
						this.add('-activate', pokemon, 'ability: Mediator');
						activated = true;
					}
					m.cureStatus();
				}
			});
		},
	},
};
