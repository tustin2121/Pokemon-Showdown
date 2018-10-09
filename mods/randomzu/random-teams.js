'use strict';

const Dex = require('./../../sim/dex');

const RandomTeams = require('../../data/random-teams');

class RandomZUTeams extends RandomTeams {
	/**
	 * @param {Format | string} format
	 * @param {?PRNG | [number, number, number, number]} [prng]
	 */
	constructor(format, prng) {
		super(format, prng);
	}
	
	/**
	 * @param {?string[]} moves
	 * @param {{[k: string]: boolean}} [hasType]
	 * @param {{[k: string]: boolean}} [hasAbility]
	 * @param {string[]} [movePool]
	 */
	queryMoves(moves, hasType = {}, hasAbility = {}, movePool = []) {
		// This is primarily a helper function for random setbuilder functions.
		let counter = {
			Physical: 0, Special: 0, Status: 0, damage: 0, recovery: 0, stab: 0, inaccurate: 0, priority: 0, recoil: 0, drain: 0,
			adaptability: 0, bite: 0, contrary: 0, hustle: 0, ironfist: 0, serenegrace: 0, sheerforce: 0, skilllink: 0, technician: 0,
			physicalsetup: 0, specialsetup: 0, mixedsetup: 0, speedsetup: 0, physicalpool: 0, specialpool: 0, trap: 0,
			/**@type {Move[]} */
			damagingMoves: [],
			/**@type {{[k: string]: number}} */
			damagingMoveIndex: {},
			setupType: '',
		};

		for (let type in Dex.data.TypeChart) {
			counter[type] = 0;
		}

		if (!moves || !moves.length) return counter;

		// Moves that heal a fixed amount:
		let RecoveryMove = [
			'healorder', 'milkdrink', 'moonlight', 'morningsun', 'recover', 'roost', 'slackoff', 'softboiled', 'strengthsap', 'synthesis',
		];
		// Moves which drop stats:
		let ContraryMove = [
			'closecombat', 'dracometeor', 'fleurcannon', 'leafstorm', 'overheat', 'psychoboost', 'superpower', 'vcreate',
		];
		// Moves that boost Attack:
		let PhysicalSetup = [
			'bellydrum', 'bulkup', 'coil', 'curse', 'dragondance', 'honeclaws', 'howl', 'meditate', 'mirrormove', 'poweruppunch', 'sharpen', 'shiftgear', 'swordsdance',
		];
		// Moves which boost Special Attack:
		let SpecialSetup = [
			'calmmind', 'chargebeam', 'fierydance', 'geomancy', 'nastyplot', 'quiverdance', 'tailglow',
		];
		// Moves which boost Attack AND Special Attack:
		let MixedSetup = [
			'celebrate', 'clangingscales', 'conversion', 'growth', 'happyhour', 'holdhands', 'lastresort', 'shellsmash', 'workup',
		];
		// Moves which boost Speed:
		let SpeedSetup = [
			'agility', 'autotomize', 'celebrate', 'clangingscales', 'dragondance', 'flamecharge', 'happyhour', 'holdhands', 'lastresort', 'mefirst', 'rockpolish', 'shiftgear',
		];
		// Moves that shouldn't be the only STAB moves:
		let NoStab = [
			'aquajet', 'bounce', 'explosion', 'fakeout', 'firstimpression', 'flamecharge', 'fly', 'iceshard', 'pursuit', 'quickattack', 'skyattack', 'suckerpunch',
			'chargebeam', 'clearsmog', 'eruption', 'vacuumwave', 'waterspout',
		];
		// Moves that are only used to trap/partial-trap opponent:
		let Trap = [
			'block', 'meanlook', 'spiderweb', 'bind', 'clamp', 'firespin', 'infestation', 'sandtomb', 'whirlpool', 'wrap',
		];

		// Iterate through all moves we've chosen so far and keep track of what they do:
		for (const [k, moveId] of moves.entries()) {
			let move = this.getMove(moveId);
			let moveid = move.id;
			let movetype = move.type;
			if (moveid === 'judgment' || moveid === 'multiattack' || moveid === 'revelationdance') movetype = Object.keys(hasType)[0];
			if (move.damage || move.damageCallback) {
				// Moves that do a set amount of damage:
				counter['damage']++;
				if (moveid !== 'counter' || moveid !== 'mirrorcoat' || moveid !== 'metalburst') {
					counter.damagingMoves.push(move);
					counter.damagingMoveIndex[moveid] = k;
				}
			} else {
				// Are Physical/Special/Status moves:
				counter[move.category]++;
			}
			// Moves that have a low base power:
			if (moveid === 'lowkick' || (move.basePower && move.basePower <= 60 && moveid !== 'rapidspin')) counter['technician']++;
			// Moves that hit up to 5 times:
			if (move.multihit && Array.isArray(move.multihit) && move.multihit[1] === 5) counter['skilllink']++;
			if (move.recoil || move.hasCustomRecoil) counter['recoil']++;
			if (move.drain) counter['drain']++;
			// Conversion converts exactly one non-STAB into STAB
			if (moveid === 'conversion') {
				counter['stab']++;
				counter['adaptability']++;
			}
			// Moves which have a base power, but aren't super-weak like Rapid Spin:
			if ((move.basePower > 30 || move.multihit || move.basePowerCallback || moveid === 'naturepower') && !Trap.includes(moveid)) {
				counter[movetype]++;
				if (hasType[movetype] || movetype === 'Normal' && (hasAbility['Aerilate'] || hasAbility['Galvanize'] || hasAbility['Pixilate'] || hasAbility['Refrigerate'])) {
					counter['adaptability']++;
					// STAB:
					// Certain moves aren't acceptable as a Pokemon's only STAB attack
					if (!NoStab.includes(moveid) && (moveid !== 'hiddenpower' || Object.keys(hasType).length === 1)) {
						counter['stab']++;
						// Ties between Physical and Special setup should broken in favor of STABs
						counter[move.category] += 0.1;
					}
				} else if (move.priority === 0 && hasAbility['Protean'] && !NoStab.includes(moveid)) {
					counter['stab']++;
				} else if (movetype === 'Steel' && hasAbility['Steelworker']) {
					counter['stab']++;
				}
				if (move.category === 'Physical') counter['hustle']++;
				if (move.flags['bite']) counter['bite']++;
				if (move.flags['punch']) counter['ironfist']++;
				counter.damagingMoves.push(move);
				counter.damagingMoveIndex[moveid] = k;
			}
			// Moves with secondary effects:
			if (move.secondary) {
				if (moveid !== 'flamecharge' && moveid !== 'poweruppunch' && moveid !== 'chargebeam') {
					counter['sheerforce']++;
				}
				if (move.secondary.chance && move.secondary.chance >= 20 && move.secondary.chance < 100) {
					counter['serenegrace']++;
				}
			}
			// Moves with low accuracy:
			if (move.accuracy && move.accuracy !== true && move.accuracy < 90) counter['inaccurate']++;
			// Moves with non-zero priority:
			if (move.category !== 'Status' && move.priority !== 0) counter['priority']++;

			// Moves that change stats:
			if (RecoveryMove.includes(moveid)) counter['recovery']++;
			if (ContraryMove.includes(moveid)) counter['contrary']++;
			if (PhysicalSetup.includes(moveid)) {
				counter['physicalsetup']++;
				counter.setupType = 'Physical';
			} else if (SpecialSetup.includes(moveid)) {
				counter['specialsetup']++;
				counter.setupType = 'Special';
			}
			if (MixedSetup.includes(moveid)) counter['mixedsetup']++;
			if (SpeedSetup.includes(moveid)) counter['speedsetup']++;
			if (Trap.includes(moveid)) counter['trap']++;
		}

		// Keep track of the available moves
		for (const moveid of movePool) {
			let move = this.getMove(moveid);
			if (move.damageCallback) continue;
			if (move.category === 'Physical') counter['physicalpool']++;
			if (move.category === 'Special') counter['specialpool']++;
		}

		// Choose a setup type:
		if (counter['mixedsetup']) {
			counter.setupType = 'Mixed';
		} else if (counter.setupType) {
			let pool = {};
			pool.Physical = counter.Physical + counter['physicalpool'];
			pool.Special = counter.Special + counter['specialpool'];
			if (counter['physicalsetup'] && counter['specialsetup']) {
				if (pool.Physical === pool.Special) {
					if (counter.Physical > counter.Special) counter.setupType = 'Physical';
					if (counter.Special > counter.Physical) counter.setupType = 'Special';
				} else {
					counter.setupType = pool.Physical > pool.Special ? 'Physical' : 'Special';
				}
			} else if (!pool[counter.setupType] || pool[counter.setupType] === 1 && (!moves.includes('rest') || !moves.includes('sleeptalk'))) {
				counter.setupType = '';
			}
		}
		counter['Physical'] = Math.floor(counter['Physical']);
		counter['Special'] = Math.floor(counter['Special']);

		return counter;
	}

	/**
	 * @param {string | Template} template
	 * @param {number} [slot]
	 * @param {RandomTeamsTypes["TeamDetails"]} [teamDetails]
	 * @return {RandomTeamsTypes["RandomSet"]}
	 */
	randomSet(template, slot, teamDetails = {}) {
		template = this.getTemplate(template);
		let baseTemplate = template;
		let species = template.species;
		let isDoubles = false;
		
		let bannedAbilities = [
			'Drought', 'Drizzle', 'Arena Trap', 'Shadow Tag',
		];
		
		let zCrystals = {
			Bug: "Buginium Z",
			Dark: "Darkinium Z",
			Dragon: "Dragonium Z",
			Electric: "Electrium Z",
			Fairy: "Fairium Z",
			Fighting: "Fightinium Z",
			Fire: "Firium Z",
			Flying: "Flyinium Z",
			Ghost: "Ghostium Z",
			Grass: "Grassium Z",
			Ground: "Groundium Z",
			Ice: "Icium Z",
			Normal: "Normalium Z",
			Poison: "Poisonium Z",
			Psychic: "Psychium Z",
			Rock: "Rockium Z",
			Steel: "Steelium Z",
			Water: "Waterium Z",
		};

		if (!template.exists || (!template.randomBattleMoves && !template.learnset)) {
			// GET IT? UNOWN? BECAUSE WE CAN'T TELL WHAT THE POKEMON IS
			template = this.getTemplate('unown');

			let err = new Error('Template incompatible with random battles: ' + species);
			require('../lib/crashlogger')(err, 'The randbat set generator');
		}

		if (template.battleOnly) {
			// Only change the species. The template has custom moves, and may have different typing and requirements.
			species = template.baseSpecies;
		}

		const randMoves = template.randomBattleMoves;
		let movePool = (randMoves ? randMoves.slice() : template.learnset ? Object.keys(template.learnset) : []);
		/**@type {string[]} */
		let moves = [];
		let ability = '';
		let item = '';
		let evs = {
			hp: 85,
			atk: 85,
			def: 85,
			spa: 85,
			spd: 85,
			spe: 85,
		};
		let ivs = {
			hp: 31,
			atk: 31,
			def: 31,
			spa: 31,
			spd: 31,
			spe: 31,
		};
		let hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) {
			hasType[template.types[1]] = true;
		}
		let hasAbility = {};
		if (!bannedAbilities.includes(template.abilities[0])) {
			hasAbility[template.abilities[0]] = true;
		}
		if (template.abilities[1] && !bannedAbilities.includes(template.abilities[1])) {
			// @ts-ignore
			hasAbility[template.abilities[1]] = true;
		}
		if (template.abilities['H'] && !bannedAbilities.includes(template.abilities['H'])) {
			// @ts-ignore
			hasAbility[template.abilities['H']] = true;
		}
		let availableHP = 0;
		for (const moveid of movePool) {
			if (moveid.startsWith('hiddenpower')) availableHP++;
		}

		// These moves can be used even if we aren't setting up to use them:
		let SetupException = [
			'closecombat', 'extremespeed', 'suckerpunch', 'superpower',
			'clangingscales', 'dracometeor', 'leafstorm', 'overheat',
		];
		let counterAbilities = [
			'Adaptability', 'Contrary', 'Hustle', 'Iron Fist', 'Skill Link',
		];
		let ateAbilities = [
			'Aerilate', 'Galvanize', 'Pixilate', 'Refrigerate',
		];

		/**@type {{[k: string]: boolean}} */
		let hasMove = {};
		let counter;
		
		// for retrying move selection
		let tempMovePool = movePool.slice();
		let tryCount = 0;
		let availableHPCount = availableHP;

		do {
			// Keep track of all moves we have:
			hasMove = {};
			for (const moveid of moves) {
				if (moveid.startsWith('hiddenpower')) {
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
			}

			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length < 4 && tempMovePool.length) {
				let moveid = this.sampleNoReplace(tempMovePool);
				if (moveid.startsWith('hiddenpower')) {
					availableHPCount--;
					if (hasMove['hiddenpower']) continue;
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
				moves.push(moveid);
			}

			counter = this.queryMoves(moves, hasType, hasAbility, tempMovePool);

			// Iterate through the moves again, this time to cull them:
			for (const [k, moveId] of moves.entries()) {
				let move = this.getMove(moveId);
				let moveid = move.id;
				let rejected = false;
				let isSetup = false;

				switch (moveid) {
				// Not very useful without their supporting moves
				case 'acidarmor': case 'amnesia': case 'barrier': case 'cosmicpower': case 'cottonguard':
				case 'defendorder': case 'irondefense': case 'stockpile':
					if (!counter['recovery'] && !hasMove['rest']) rejected = true;
					break;
				case 'bind': case 'clamp': case 'firespin': case 'infestation': case 'sandtomb': case 'whirlpool': case 'wrap':
					if (counter['trap'] > 1) rejected = true;
					break;
				case 'block': case 'meanlook': case 'spiderweb':
					if (!hasMove['perishsong']) rejected = true;
					if (counter['trap'] > 1) rejected = true;
					break;
				case 'clangingscales':
					if (teamDetails.zMove) rejected = true;
					break;
				case 'dig': case 'fly':
					if (teamDetails.zMove || counter.setupType !== 'Physical') rejected = true;
					break;
				case 'electricterrain':
					if (!counter['Electric']) rejected = true;
					break;
				case 'endure':
					if (!hasMove['reversal'] || hasMove['substitute']) rejected = true;
					break;
				case 'focuspunch':
					if (!hasMove['substitute'] || counter.damagingMoves.length < 2) rejected = true;
					break;
				case 'gigaimpact': case 'hyperbeam':
					if ((teamDetails.zMove || !counter.setupType) && !hasAbility['Truant']) rejected = true;
					break;
				case 'perishsong':
					// if (!hasMove['protect']) rejected = true;
					if (!counter['trap']) rejected = true;
					break;
				case 'reflect':
					if (!hasMove['calmmind'] && !hasMove['lightscreen']) rejected = true;
					if (tempMovePool.length > 1) {
						let screen = tempMovePool.indexOf('lightscreen');
						if (screen >= 0) this.fastPop(tempMovePool, screen);
					}
					break;
				case 'rest':
					if (tempMovePool.includes('sleeptalk') && !hasAbility['Hydration']) rejected = true;
					if (hasAbility['Hydration'] && tempMovePool.includes('sleeptalk') && !hasMove['raindance']) rejected = true;
					if (!hasMove['sleeptalk'] && template.evos.length) rejected = true;
					if (hasMove['perishsong']) rejected = false;
					if (hasMove['sleeptalk'] && counter['priority']) rejected = true;
					break;
				case 'sleeptalk':
					if (!hasMove['rest']) rejected = true;
					if (counter['priority']) rejected = true;
					if (tempMovePool.length > 1) {
						let rest = tempMovePool.indexOf('rest');
						if (rest >= 0) this.fastPop(tempMovePool, rest);
					}
					break;
				case 'storedpower':
					if (!counter.setupType && (!hasMove['cosmicpower'] || !hasMove['lastresort'] || !hasMove['conversion'])) rejected = true;
					break;

				// Set up once and only if we have the moves for it
				case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) {
						if (!hasMove['growth'] || hasMove['sunnyday']) rejected = true;
					}
					if (counter.Physical + counter['physicalpool'] < 2 && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'calmmind': case 'geomancy': case 'nastyplot': case 'quiverdance': case 'tailglow':
					if (counter.setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					if (counter.Special + counter['specialpool'] < 2 && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'growth': case 'shellsmash': case 'workup':
					if (counter.setupType !== 'Mixed' || counter['mixedsetup'] > 1) rejected = true;
					if (moveid !== 'growth' && counter.damagingMoves.length + counter['recovery'] < 3 && !hasAbility['Tinted Lens']) rejected = true;
					if (moveid === 'growth' && !hasMove['sunnyday']) rejected = true;
					isSetup = true;
					break;
				case 'agility': case 'autotomize': case 'rockpolish':
					if (counter.damagingMoves.length + counter['recovery'] < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!counter.setupType) isSetup = true;
					break;
				case 'flamecharge':
					if (counter.damagingMoves.length < 3 && !counter.setupType) rejected = true;
					if (hasMove['dracometeor'] || hasMove['overheat']) rejected = true;
					break;
				case 'celebrate': case 'happyhour':
					if (teamDetails.zMove || counter.setupType !== 'Mixed' || isSetup) rejected = true;
					isSetup = true;
					break;
				case 'conversion':
					if (teamDetails.zMove || hasMove['triattack']) rejected = true;
					isSetup = true;
					break;
				case 'mefirst':
					if (teamDetails.zMove || counter.damagingMoves.length < 3) rejected = true;
					isSetup = true;
					break;
				case 'mirrormove':
					if (teamDetails.zMove) rejected = true;
					if (counter.Physical + counter['physicalpool'] < 2) rejected = true;
					isSetup = true;
					break;
				case 'psychup':
					if (teamDetails.zMove || hasMove['rest'] || counter['recovery']) rejected = true;
					break;

				// Bad after setup
				case 'circlethrow': case 'dragontail':
					if (counter.setupType && ((!hasMove['rest'] && !hasMove['sleeptalk']) || hasMove['stormthrow'])) rejected = true;
					if (!!counter['speedsetup'] || hasMove['encore'] || hasMove['raindance'] || hasMove['roar'] || hasMove['whirlwind']) rejected = true;
					break;
				case 'defog':
					if (counter.setupType || hasMove['spikes'] || hasMove['stealthrock'] || (hasMove['rest'] && hasMove['sleeptalk']) || teamDetails.hazardClear) rejected = true;
					break;
					break;
				case 'fakeout':
					if (counter.setupType || hasMove['substitute'] || hasMove['switcheroo'] || hasMove['trick']) rejected = true;
					break;
				case 'foulplay':
					if (counter.setupType || !!counter['speedsetup'] || counter['Dark'] > 2 || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (counter.damagingMoves.length - 1 === counter['priority']) rejected = true;
					break;
				case 'haze': case 'spikes': case 'waterspout':
					if (counter.setupType || !!counter['speedsetup'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'healbell':
					if (counter['speedsetup']) rejected = true;
					break;
				case 'healingwish': case 'memento':
					if (counter.setupType || !!counter['recovery'] || hasMove['substitute'] || hasMove['destinybond']) rejected = true;
					break;
				case 'leechseed': case 'roar': case 'whirlwind':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['dragontail']) rejected = true;
					break;
				case 'nightshade': case 'seismictoss': case 'superfang':
					if (counter.damagingMoves.length > 2 || counter.setupType) rejected = true;
					break;
				case 'protect':
					if (counter.setupType && !hasMove['wish']) rejected = true;
					if (!isDoubles && counter.damagingMoves.length > 2) rejected = true;
					if (hasMove['rest'] || hasMove['lightscreen'] && hasMove['reflect']) rejected = true;
					break;
				case 'pursuit':
					if (counter.setupType || (hasMove['rest'] && hasMove['sleeptalk']) || (hasMove['knockoff'] && !hasType['Dark'])) rejected = true;
					break;
				case 'rapidspin':
					if (counter.setupType || teamDetails.hazardClear) rejected = true;
					break;
				case 'reversal':
					if (!hasMove['substitute'] && teamDetails.zMove) rejected = true;
					break;
				case 'stealthrock':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest'] || teamDetails.stealthRock) rejected = true;
					break;
				case 'switcheroo': case 'trick':
					if (counter.Physical + counter.Special < 3 || counter.setupType) rejected = true;
					if (hasMove['acrobatics'] || hasMove['lightscreen'] || hasMove['reflect'] || hasMove['suckerpunch'] || hasMove['trickroom']) rejected = true;
					break;
				case 'toxicspikes':
					if (counter.setupType || teamDetails.toxicSpikes) rejected = true;
					break;
				case 'trickroom':
					if (counter.setupType || !!counter['speedsetup'] || counter.damagingMoves.length < 2) rejected = true;
					if (hasMove['lightscreen'] || hasMove['reflect']) rejected = true;
					break;
				case 'uturn':
					if (counter.setupType || !!counter['speedsetup'] || hasAbility['Protean'] && counter.Status > 2) rejected = true;
					if (hasType['Bug'] && counter.stab < 2 && counter.damagingMoves.length > 2 && !hasAbility['Adaptability'] && !hasMove['technoblast']) rejected = true;
					break;
				case 'voltswitch':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['magnetrise'] || hasMove['uturn']) rejected = true;
					break;

				// Bit redundant to have both
				// Attacks:
				case 'bugbite': case 'bugbuzz': case 'signalbeam':
					if (hasMove['uturn'] && !counter.setupType) rejected = true;
					break;
				case 'lunge':
					if (hasMove['leechlife']) rejected = true;
					break;
				case 'darkestlariat': case 'nightslash':
					if (hasMove['knockoff'] || hasMove['pursuit'] || hasMove['throatchop']) rejected = true;
					break;
				case 'darkpulse':
					if (hasMove['shadowball']) rejected = true;
					if ((hasMove['crunch'] || hasMove['hyperspacefury']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'suckerpunch':
					if (counter['Dark'] > 1 && !hasType['Dark']) rejected = true;
					if (counter.damagingMoves.length < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'dualchop':
					if (hasMove['dragonclaw'] || hasMove['dragontail'] || hasMove['outrage']) rejected = true;
					break;
				case 'dragonclaw':
					if (hasMove['dragontail'] || hasMove['outrage']) rejected = true;
					break;
				case 'dracometeor':
					if (hasMove['swordsdance'] || counter.setupType === 'Physical' && hasMove['outrage']) rejected = true;
					break;
				case 'dragonpulse': case 'spacialrend':
					if (hasMove['dracometeor'] || hasMove['outrage']) rejected = true;
					break;
				case 'outrage':
					if (hasMove['dracometeor'] && counter.damagingMoves.length < 3) rejected = true;
					if (hasMove['clangingscales'] && !teamDetails.zMove) rejected = true;
					break;
				case 'chargebeam':
					if (hasMove['thunderbolt'] && counter.Special < 3) rejected = true;
					break;
				case 'discharge':
					if (hasMove['thunderbolt'] && !isDoubles) rejected = true;
					break;
				case 'thunder':
					if ((hasMove['thunderbolt'] || tempMovePool.includes('thunderbolt')) && !hasMove['raindance']) rejected = true;
					break;
				case 'thunderbolt':
					if ((hasMove['discharge'] && isDoubles) || (hasMove['raindance'] && hasMove['thunder']) || (hasMove['voltswitch'] && hasMove['wildcharge'])) rejected = true;
					break;
				case 'thunderpunch':
					if (hasAbility['Galvanize'] && !!counter['Normal']) rejected = true;
					break;
				case 'dazzlinggleam':
					if (hasMove['playrough'] && counter.setupType !== 'Special') rejected = true;
					break;
				case 'drainingkiss':
					if (hasMove['dazzlinggleam'] || counter.setupType !== 'Special' && !hasAbility['Triage']) rejected = true;
					break;
				case 'aurasphere': case 'focusblast':
					if ((hasMove['closecombat'] || hasMove['superpower']) && counter.setupType !== 'Special') rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'drainpunch':
					if (!hasMove['bulkup'] && (hasMove['closecombat'] || hasMove['highjumpkick'])) rejected = true;
					if ((hasMove['focusblast'] || hasMove['superpower']) && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'closecombat': case 'highjumpkick':
					if ((hasMove['aurasphere'] || hasMove['focusblast'] || tempMovePool.includes('aurasphere')) && counter.setupType === 'Special') rejected = true;
					if (hasMove['bulkup'] && hasMove['drainpunch']) rejected = true;
					break;
				case 'machpunch':
					if (hasType['Fighting'] && counter.stab < 2 && !hasAbility['Technician']) rejected = true;
					break;
				case 'stormthrow':
					if (hasMove['circlethrow'] && hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'superpower':
					if (counter['Fighting'] > 1 && counter.setupType) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk'] && !hasAbility['Contrary']) rejected = true;
					break;
				case 'vacuumwave':
					if ((hasMove['closecombat'] || hasMove['machpunch']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'lowkick':
					if (hasMove['closecombat'] || hasMove['machpunch']) rejected = true;
					break;
				case 'fierydance': case 'firepunch': case 'flamethrower': case 'flareblitz':
					if (hasMove['blazekick'] || hasMove['heatwave'] || hasMove['overheat'] || hasMove['sacredfire']) rejected = true;
					if (hasMove['fireblast'] && counter.setupType !== 'Physical' && !hasAbility['Reckless']) rejected = true;
					break;
				case 'fireblast':
					if (hasMove['lavaplume'] && !counter.setupType && !counter['speedsetup']) rejected = true;
					if (hasMove['mindblown'] && counter.setupType) rejected = true;
					if (hasMove['flareblitz'] && hasAbility['Reckless']) rejected = true;
					break;
				case 'firefang':
					if (counter['Fire'] > 1) rejected = true;
					break;
				case 'lavaplume':
					if (hasMove['firepunch'] || hasMove['fireblast'] && (counter.setupType || !!counter['speedsetup'])) rejected = true;
					break;
				case 'overheat':
					if (hasMove['fireblast'] || hasMove['lavaplume'] || counter.setupType === 'Special') rejected = true;
					break;
				case 'acrobatics':
					if (hasMove['hurricane'] && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'airslash':
					if (hasMove['acrobatics'] || hasMove['bravebird'] || hasMove['hurricane']) rejected = true;
					break;
				case 'hex':
					if (!hasMove['willowisp']) rejected = true;
					break;
				case 'shadowball':
					if (hasMove['hex'] && hasMove['willowisp']) rejected = true;
					break;
				case 'shadowclaw':
					if (hasMove['phantomforce'] || (hasMove['shadowball'] && counter.setupType !== 'Physical') || hasMove['shadowsneak']) rejected = true;
					break;
				case 'shadowsneak':
					if (hasType['Ghost'] && template.types.length > 1 && counter.stab < 2) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (hasMove['shadowpunch']) rejected = true;
					break;
				case 'bulletseed':
					if (counter['Grass'] > 1 && !hasAbility['Technician'] && !hasAbility['Skill Link']) rejected = true;
					break;
				case 'energyball':
					if (hasMove['gigadrain'] || hasMove['solarbeam'] && (hasAbility['Drought'] || hasMove['sunnyday'])) rejected = true;
					if ((hasMove['leafblade'] || hasMove['seedbomb']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'gigadrain':
					if (hasMove['petaldance'] || hasMove['powerwhip'] || (hasMove['seedbomb'] && !isDoubles)) rejected = true;
					if (counter.Special < 4 && !counter.setupType && hasMove['leafstorm']) rejected = true;
					break;
				case 'leafblade': case 'woodhammer':
					if (hasMove['gigadrain'] && counter.setupType !== 'Physical') rejected = true;
					if (hasMove['leafstorm'] && hasAbility['Contrary']) rejected = true;
					break;
				case 'leafstorm':
					if (counter['Grass'] > 1 && counter.setupType) rejected = true;
					break;
				case 'seedbomb':
					if (hasMove['woodhammer']) rejected = true;
					break;
				case 'solarbeam':
					if ((!hasAbility['Drought'] && !hasMove['sunnyday']) || hasMove['gigadrain'] || hasMove['leafstorm']) rejected = true;
					break;
				case 'bonemerang': case 'precipiceblades':
					if (hasMove['earthquake']) rejected = true;
					break;
				case 'earthpower':
					if (hasMove['earthquake'] && counter.setupType !== 'Special') rejected = true;
					break;
				case 'avalanche':
					if (counter['Ice'] > 1) rejected = true;
					break;
				case 'icebeam':
					if (hasMove['blizzard'] || hasMove['freezedry']) rejected = true;
					break;
				case 'iceshard':
					if (hasMove['freezedry']) rejected = true;
					break;
				case 'frostbreath':
					if (hasMove['icebeam'] || hasMove['blizzard'] || hasMove['freezedry']) rejected = true;
					break;
				case 'bodyslam':
					if (hasMove['glare'] && hasMove['headbutt'] || hasMove['doubleedge']) rejected = true;
					break;
				case 'endeavor':
					if (slot > 0) rejected = true;
					break;
				case 'explosion':
					if (counter.setupType || (hasAbility['Refrigerate'] && hasMove['freezedry']) || hasMove['wish']) rejected = true;
					break;
				case 'extremespeed':
					if (counter.setupType !== 'Physical' && hasMove['vacuumwave']) rejected = true;
					break;
				case 'facade':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (hasMove['dynamicpunch']) rejected = true;	// for Machoke
					if (counter.damagingMoves.length < 2) rejected = true;
					break;
				case 'hiddenpower':
					if (hasMove['rest'] || !counter.stab && counter.damagingMoves.length < 2) rejected = true;
					break;
				case 'hypervoice':
					if (hasMove['blizzard'] || hasMove['naturepower'] || hasMove['return']) rejected = true;
					break;
				case 'judgment':
					if (counter.setupType !== 'Special' && counter.stab > 1) rejected = true;
					break;
				case 'quickattack':
					if (hasType['Normal'] && (!counter.stab || counter['Normal'] > 2)) rejected = true;
					if (hasMove['feint']) rejected = true;
					break;
				case 'return': case 'rockclimb':
					if (hasMove['bodyslam'] || hasMove['doubleedge']) rejected = true;
					break;
				case 'weatherball':
					if (!hasMove['raindance'] && !hasMove['sunnyday']) rejected = true;
					break;
				case 'acidspray':
					if (hasMove['sludgebomb'] || counter.Special < 2) rejected = true;
					break;
				case 'poisonjab':
					if (hasMove['gunkshot']) rejected = true;
					break;
				case 'sludgewave':
					if (hasMove['poisonjab']) rejected = true;
					break;
				case 'photongeyser': case 'psychic':
					if (hasMove['psyshock'] || counter.setupType === 'Special' && hasMove['storedpower']) rejected = true;
					break;
				case 'psychocut': case 'zenheadbutt':
					if ((hasMove['psychic'] || hasMove['psyshock']) && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'psyshock':
					if (tempMovePool.length > 1) {
						let psychic = tempMovePool.indexOf('psychic');
						if (psychic >= 0) this.fastPop(tempMovePool, psychic);
					}
					break;
				case 'ancientpower':
					if (hasMove['powergem'] || hasMove['rockslide']) rejected = true;
					break;
				case 'headsmash':
					if (hasMove['stoneedge']) rejected = true;
					break;
				case 'rockblast': case 'rockslide':
					if (hasMove['headsmash'] || hasMove['stoneedge'] || hasMove['powergem']) rejected = true;
					break;
				case 'smackdown':
					if (!counter['Ground'] || !!counter['Rock']) rejected = true;
					break;
				case 'rocktomb':
					if (!!counter['Rock'] || !!counter['speedsetup']) rejected = true;
				case 'bulletpunch':
					if (hasType['Steel'] && counter.stab < 2 && !hasAbility['Adaptability'] && !hasAbility['Technician']) rejected = true;
					break;
				case 'flashcannon':
					if (hasMove['ironhead'] || hasMove['meteormash']) rejected = true;
					break;
				case 'hydropump':
					if (hasMove['liquidation'] || hasMove['razorshell'] || hasMove['waterfall'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['scald'] && (counter.Special < 4 || template.types.length > 1 && counter.stab < 3)) rejected = true;
					break;
				case 'originpulse': case 'surf':
					if (hasMove['hydropump'] || hasMove['scald'] || hasMove['waterfall']) rejected = true;
					break;
				case 'scald':
					if (hasMove['liquidation'] || hasMove['waterfall'] || hasMove['waterpulse']) rejected = true;
					break;
				case 'waterfall':
					if (hasMove['liquidation']) rejected = true;
					break;

				// Status:
				case 'electroweb': case 'stunspore': case 'thunderwave':
					if (counter.setupType || !!counter['speedsetup'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['discharge'] || hasMove['gyroball'] || hasMove['spore'] || hasMove['toxic'] || hasMove['trickroom'] || hasMove['yawn']) rejected = true;
					break;
				case 'toxic':
					if (counter.setupType || hasMove['flamecharge'] || hasMove['hypnosis'] || hasMove['sleeppowder'] || hasMove['willowisp'] || hasMove['yawn']) rejected = true;
					break;
				case 'willowisp':
					if (hasMove['scald']) rejected = true;
					break;
				case 'raindance':
					if (counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasAbility['Swift Swim'] && !hasAbility['Dry Skin'] && !hasAbility['Rain Dish'] && !hasMove['thunder']) rejected = true;
					if (teamDetails['swiftswim'] || (hasAbility['Hydration'] && hasMove['rest'] && !hasMove['sleeptalk'])) rejected = false;
					if (hasMove['sunnyday'] || hasMove['hail'] || hasMove['sandstorm']) rejected = true;
					if (counter['Fire']) rejected = true;
					break;
				case 'sunnyday':
					if (counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasAbility['Chlorophyll'] && !hasAbility['Flower Gift'] && !hasMove['solarbeam']) rejected = true;
					if (teamDetails['chlorophyll']) rejected = false;
					if (hasMove['raindance'] || hasMove['hail'] || hasMove['sandstorm']) rejected = true;
					if (counter['Water']) rejected = true;
					if (rejected && tempMovePool.length > 1) {
						let solarbeam = tempMovePool.indexOf('solarbeam');
						if (solarbeam >= 0) this.fastPop(tempMovePool, solarbeam);
						if (tempMovePool.length > 1) {
							let weatherball = tempMovePool.indexOf('weatherball');
							if (weatherball >= 0) this.fastPop(tempMovePool, weatherball);
						}
					}
					break;
				case 'hail':
					if (counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasAbility['Slush Rush'] && !hasAbility['Ice Body'] && !(hasType['Ice'] && hasMove['blizzard'])) rejected = true;
					if (teamDetails['slushrush']) rejected = false;
					if (hasMove['sunnyday'] || hasMove['raindance'] || hasMove['sandstorm']) rejected = true;
					break;
				case 'sandstorm':
					if (counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasAbility['Sand Rush'] && !hasAbility['Sand Force']) rejected = true;
					if (teamDetails['sandrush']) rejected = false;
					if (hasMove['sunnyday'] || hasMove['hail'] || hasMove['raindance']) rejected = true;
					break;
				case 'milkdrink': case 'moonlight': case 'painsplit': case 'recover': case 'roost': case 'softboiled': case 'synthesis':
					if (hasMove['leechseed'] || hasMove['rest'] || hasMove['wish']) rejected = true;
					break;
				case 'safeguard':
					if (hasMove['destinybond']) rejected = true;
					break;
				case 'substitute':
					if (hasMove['dracometeor'] || (hasMove['leafstorm'] && !hasAbility['Contrary']) || hasMove['pursuit'] || hasMove['rest'] || hasMove['taunt'] || hasMove['uturn'] || hasMove['voltswitch'] || hasMove['counter'] || hasMove['mirrorcoat'] || hasMove['metalburst']) rejected = true;
					break;
				case 'powersplit':
					if (hasMove['guardsplit']) rejected = true;
					break;
				case 'wideguard':
					if (hasMove['protect']) rejected = true;
					break;
				case 'magiccoat':
					if (hasMove['facade'] || hasMove['rest'] || hasMove['sleeptalk']) rejected = true;
					break;
				case 'taunt':
					if (hasMove['sleeptalk']) rejected = true;
					break;
				case 'partingshot':
					if (hasMove['uturn']) rejected = true;
					break;
				}

				// Increased/decreased priority moves are unneeded with moves that boost only speed
				if (move.priority !== 0 && (!!counter['speedsetup'] || hasMove['copycat'])) {
					rejected = true;
				}

				// Certain Pokemon should always have a recovery move
				if (!counter.recovery && template.baseStats.hp >= 125 && tempMovePool.includes('wish')) {
					if (move.category === 'Status' || !hasType[move.type] && !move.damage) rejected = true;
				}
				
				// No need for this; NFEs in ZU are good enough without recovery moves
				// if (template.nfe && !isSetup && !counter.recovery && !!counter['Status'] && (tempMovePool.includes('recover') || tempMovePool.includes('roost'))) {
					// if (move.category === 'Status' || !hasType[move.type]) rejected = true;
				// }
				
				// Force Eevee to have Last Resort
				if (template.id === 'eevee' && !hasMove['lastresort']) {
					rejected = true;
				}

				// This move doesn't satisfy our setup requirements:
				if ((move.category === 'Physical' && counter.setupType === 'Special') || (move.category === 'Special' && counter.setupType === 'Physical')) {
					// Reject STABs last in case the setup type changes later on
					if (!SetupException.includes(moveid) && (!hasType[move.type] || counter.stab > 1 || counter[move.category] < 2)) rejected = true;
				}
				if (counter.setupType && !isSetup && counter.setupType !== 'Mixed' && move.category !== counter.setupType && counter[counter.setupType] < 2 && moveid !== 'rest' && moveid !== 'sleeptalk') {
					// Mono-attacking with setup and RestTalk is allowed
					// Reject Status moves only if there is nothing else to reject
					if (move.category !== 'Status' || counter[counter.setupType] + counter.Status > 3 && counter['physicalsetup'] + counter['specialsetup'] < 2) rejected = true;
				}
				if (counter.setupType === 'Special' && moveid === 'hiddenpower' && template.types.length > 1 && counter['Special'] <= 2 && !hasType[move.type] && !counter['Physical'] && counter['specialpool']) {
					// Hidden Power isn't good enough
					rejected = true;
				}

				// Pokemon should have moves that benefit their Type/Ability/Weather, as well as moves required by its forme
				if (!rejected && (counter['physicalsetup'] + counter['specialsetup'] < 2 && (!counter.setupType || counter.setupType === 'Mixed' || (move.category !== counter.setupType && move.category !== 'Status') || counter[counter.setupType] + counter.Status > 3)) &&
					((counter.damagingMoves.length === 0 && !hasMove['metalburst']) ||
					(!counter.stab && (counter.Status < 2 || counter.setupType || template.types.length > 1 || (template.types[0] !== 'Normal' && template.types[0] !== 'Psychic') || !hasMove['icebeam']) && (counter['physicalpool'] || counter['specialpool']) && !hasMove['foulplay']) ||
					(hasType['Bug'] && (tempMovePool.includes('megahorn') || tempMovePool.includes('pinmissile') || (hasType['Flying'] && !hasMove['hurricane'] && tempMovePool.includes('bugbuzz')))) ||
					((hasType['Dark'] && !counter['Dark']) || hasMove['suckerpunch'] && counter.stab < template.types.length) ||
					(hasType['Dragon'] && !counter['Dragon'] && !hasAbility['Aerilate'] && !hasAbility['Pixilate'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Electric'] && !counter['Electric'] && !hasAbility['Galvanize']) ||
					(hasType['Fighting'] && !counter['Fighting'] && (counter.setupType || !counter['Status'])) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Ghost'] && !hasType['Dark'] && !counter['Ghost'] && !hasAbility['Steelworker'] && !hasMove['foulplay']) ||
					(hasType['Ground'] && !counter['Ground'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Ice'] && !counter['Ice'] && !hasAbility['Refrigerate']) ||
					(hasType['Psychic'] && !!counter['Psychic'] && !hasType['Flying'] && !hasAbility['Pixilate'] && template.types.length > 1 && counter.stab < 2) ||
					(((hasType['Steel'] && hasAbility['Technician']) || hasAbility['Steelworker']) && !counter['Steel']) ||
					(hasType['Water'] && (!counter['Water'] || !counter.stab) && !hasAbility['Protean']) ||
					((hasAbility['Adaptability'] && !counter.setupType && template.types.length > 1 && (!counter[template.types[0]] || !counter[template.types[1]])) ||
					((hasAbility['Aerilate'] || (hasAbility['Galvanize'] && !counter['Electric']) || hasAbility['Pixilate'] || (hasAbility['Refrigerate'] && !hasMove['blizzard'])) && !counter['Normal']) ||
					(hasAbility['Contrary'] && !counter['contrary'] && template.species !== 'Shuckle') ||
					(hasAbility['Dark Aura'] && !counter['Dark']) ||
					(hasAbility['Gale Wings'] && !counter['Flying']) ||
					(hasAbility['Grassy Surge'] && !counter['Grass']) ||
					(hasAbility['Guts'] && hasType['Normal'] && tempMovePool.includes('facade')) ||
					(hasAbility['Psychic Surge'] && !counter['Psychic']) ||
					(hasAbility['Slow Start'] && tempMovePool.includes('substitute')) ||
					(hasAbility['Stance Change'] && !counter.setupType && tempMovePool.includes('kingsshield')) ||
					(tempMovePool.includes('technoblast') || template.requiredMove && tempMovePool.includes(toId(template.requiredMove)))))) {
					// Reject Status or non-STAB
					if (!isSetup && !move.weather && moveid !== 'judgment' && moveid !== 'rest' && moveid !== 'sleeptalk' && moveid !== 'technoblast' && !hasMove['perishsong']) {
						if (move.category === 'Status' || !hasType[move.type] || move.selfSwitch || move.basePower && move.basePower < 40 && !move.multihit) rejected = true;
					}
				}

				// Sleep Talk shouldn't be selected without Rest
				if (moveid === 'rest' && rejected) {
					let sleeptalk = tempMovePool.indexOf('sleeptalk');
					if (sleeptalk >= 0) {
						if (tempMovePool.length < 2) {
							rejected = false;
						} else {
							this.fastPop(tempMovePool, sleeptalk);
						}
					}
				}
				
				// Remove rejected moves from the move list
				if (rejected) {
					if (tempMovePool.length - availableHPCount || availableHPCount && (moveid === 'hiddenpower' || !hasMove['hiddenpower'])) {
						// There are still moves left in move pool
						moves.splice(k, 1);
					} else if (tryCount < 10) {
						// No more moves in move pool, reset everything and increment try count
						moves = [];
						tempMovePool = movePool.slice();
						availableHPCount = availableHP;
						tryCount++;
					}
					break;
				}
			}
		} while (moves.length < 4 && tempMovePool.length);

		// Moveset modifications
		if (hasMove['autotomize'] && hasMove['heavyslam']) {
			if (template.id === 'celesteela') {
				moves[moves.indexOf('heavyslam')] = 'flashcannon';
			} else {
				moves[moves.indexOf('autotomize')] = 'rockpolish';
			}
		}
		if (moves[0] === 'conversion') {
			moves[0] = moves[3];
			moves[3] = 'conversion';
		}

		/**@type {[string, string | undefined, string | undefined]} */
		// @ts-ignore
		let abilities = Object.values(baseTemplate.abilities);
		abilities.sort((a, b) => this.getAbility(b).rating - this.getAbility(a).rating);
		let ability0 = this.getAbility(abilities[0]);
		let ability1 = this.getAbility(abilities[1]);
		let ability2 = this.getAbility(abilities[2]);
		if (abilities[1]) {
			if (abilities[2] && ability1.rating <= ability2.rating && this.randomChance(1, 2)) {
				[ability1, ability2] = [ability2, ability1];
			}
			if (ability0.rating <= ability1.rating && this.randomChance(1, 2)) {
				[ability0, ability1] = [ability1, ability0];
			} else if (ability0.rating - 0.6 <= ability1.rating && this.randomChance(1, 3)) {
				[ability0, ability1] = [ability1, ability0];
			}
			ability = ability0.name;

			let rejectAbility;
			do {
				rejectAbility = this.getAbility(ability).rating <= 0;
				if (bannedAbilities.includes(ability)) {
					rejectAbility = true;
				} else if (counterAbilities.includes(ability)) {
					// Adaptability, Contrary, Hustle, Iron Fist, Skill Link
					rejectAbility = !counter[toId(ability)];
				} else if (ateAbilities.includes(ability)) {
					rejectAbility = !counter['Normal'];
				} else if (ability === 'Blaze') {
					rejectAbility = !counter['Fire'];
				} else if (ability === 'Chlorophyll') {
					rejectAbility = !hasMove['sunnyday'] && !teamDetails['sun'] && this.randomChance(2, 3);
				} else if (ability === 'Competitive') {
					rejectAbility = !counter['Special'] || (hasMove['rest'] && hasMove['sleeptalk']);
				} else if (ability === 'Compound Eyes' || ability === 'No Guard') {
					rejectAbility = !counter['inaccurate'];
				} else if (ability === 'Defiant' || ability === 'Moxie') {
					rejectAbility = !counter['Physical'];
				} else if (ability === 'Flare Boost' || ability === 'Moody') {
					rejectAbility = true;
				} else if (ability === 'Gluttony') {
					rejectAbility = !hasMove['bellydrum'];
				} else if (ability === 'Hydration' || ability === 'Rain Dish' || ability === 'Swift Swim') {
					rejectAbility = !hasMove['raindance'] && !teamDetails['rain'] && this.randomChance(2, 3);
				} else if (ability === 'Ice Body' || ability === 'Slush Rush' || ability === 'Snow Cloak') {
					rejectAbility = !hasMove['hail'] && !teamDetails['hail'] && this.randomChance(2, 3);
				} else if (ability === 'Leaf Guard') {
					rejectAbility = !teamDetails['sun'];
				} else if (ability === 'Lightning Rod') {
					rejectAbility = template.types.includes('Ground');
				} else if (ability === 'Limber') {
					rejectAbility = template.types.includes('Electric');
				} else if (ability === 'Liquid Voice') {
					rejectAbility = !hasMove['hypervoice'];
				} else if (ability === 'Overgrow') {
					rejectAbility = !counter['Grass'];
				} else if (ability === 'Poison Heal') {
					rejectAbility = abilities.includes('Technician') && !!counter['technician'];
				} else if (ability === 'Power Construct') {
					rejectAbility = template.forme === '10%' && !hasMove['substitute'];
				} else if (ability === 'Prankster') {
					rejectAbility = !counter['Status'];
				} else if (ability === 'Pressure' || ability === 'Synchronize') {
					rejectAbility = counter.Status < 2;
				} else if (ability === 'Regenerator') {
					rejectAbility = abilities.includes('Magic Guard');
				} else if (ability === 'Quick Feet') {
					rejectAbility = hasMove['bellydrum'];
				} else if (ability === 'Reckless' || ability === 'Rock Head') {
					rejectAbility = !counter['recoil'];
				} else if (ability === 'Sand Force' || ability === 'Sand Veil') {
					rejectAbility = !teamDetails['sand'];
				} else if (ability === 'Sand Rush') {
					rejectAbility = !hasMove['sandstorm'] && !teamDetails['sand'] && this.randomChance(2, 3);
				} else if (ability === 'Scrappy') {
					rejectAbility = !template.types.includes('Normal');
				} else if (ability === 'Serene Grace') {
					rejectAbility = !counter['serenegrace'] || template.species === 'Blissey' || template.species === 'Togetic';
				} else if (ability === 'Sheer Force') {
					rejectAbility = !counter['sheerforce'] || template.isMega || (abilities.includes('Iron Fist') && counter['ironfist'] > counter['sheerforce']) || hasMove['flamecharge'] || hasMove['poweruppunch'] || hasMove['chargebeam'];
				} else if (ability === 'Simple') {
					rejectAbility = !counter.setupType && !hasMove['cosmicpower'] && !hasMove['flamecharge'];
				} else if (ability === 'Snow Warning') {
					rejectAbility = hasMove['hypervoice'];
				} else if (ability === 'Solar Power') {
					rejectAbility = !counter['Special'] || template.isMega;
				} else if (ability === 'Strong Jaw') {
					rejectAbility = !counter['bite'];
				} else if (ability === 'Sturdy') {
					rejectAbility = !!counter['recoil'] && !counter['recovery'];
				} else if (ability === 'Swarm') {
					rejectAbility = !counter['Bug'];
				} else if (ability === 'Technician') {
					rejectAbility = !counter['technician'] || (abilities.includes('Skill Link') && counter['skilllink'] >= counter['technician']);
				} else if (ability === 'Tinted Lens') {
					rejectAbility = counter['damage'] >= counter.damagingMoves.length || (counter.Status > 2 && !counter.setupType);
				} else if (ability === 'Torrent') {
					rejectAbility = !counter['Water'];
				} else if (ability === 'Triage') {
					rejectAbility = !counter['recovery'] && !counter['drain'];
				} else if (ability === 'Unburden') {
					rejectAbility = template.isMega || (!counter.setupType && !hasMove['acrobatics']);
				} else if (ability === 'Water Absorb') {
					rejectAbility = abilities.includes('Volt Absorb') || (abilities.includes('Water Bubble') && !!counter['Water']);
				}

				if (rejectAbility) {
					if (ability === ability0.name) {
						ability = ability1.name;
					} else if (ability === ability1.name && abilities[2]) {
						ability = ability2.name;
					} else {
						// Default to the highest rated non-banned ability if all are rejected
						// Assume no Pokemon has two banned abilities
						ability = !bannedAbilities.includes(abilities[0]) ? abilities[0] : abilities[1];
						rejectAbility = false;
					}
				}
			} while (rejectAbility);

			if (abilities.includes('Chlorophyll') && hasMove['sunnyday']) {
				ability = 'Chlorophyll';
			}
			if (abilities.includes('Galvanize') && !!counter['Normal']) {
				ability = 'Galvanize';
			}
			if (abilities.includes('Guts') && ability !== 'Quick Feet' && (hasMove['facade'] || hasMove['protect'] || (hasMove['rest'] && hasMove['sleeptalk']))) {
				ability = 'Guts';
			}
			if (abilities.includes('Hydration') && !hasMove['sleeptalk'] && (hasMove['raindance'] || teamDetails['rain'])) {
				ability = 'Hydration';
			}
			if (abilities.includes('Prankster') && counter.Status > 1) {
				ability = 'Prankster';
			}
			if (abilities.includes('Sand Rush') && hasMove['sandstorm']) {
				ability = 'Sand Rush';
			}
			if (abilities.includes('Slush Rush') && hasMove['hail']) {
				ability = 'Slush Rush';
			}
			if (abilities.includes('Swift Swim') && hasMove['raindance']) {
				ability = 'Swift Swim';
			}
			if (abilities.includes('Triage') && !!counter['drain']) {
				ability = 'Triage';
			}
			if (abilities.includes('Unburden') && hasMove['acrobatics']) {
				ability = 'Unburden';
			}
			if (template.species === 'Ambipom' && !counter['technician']) {
				// If it doesn't qualify for Technician, Skill Link is useless on it
				ability = 'Pickup';
			} else if (template.baseSpecies === 'Basculin') {
				ability = 'Adaptability';
			} else if (template.species === 'Lopunny' && hasMove['switcheroo'] && this.randomChance(2, 3)) {
				ability = 'Klutz';
			} else if ((template.species === 'Rampardos' && !hasMove['headsmash']) || hasMove['rockclimb']) {
				ability = 'Sheer Force';
			} else if (template.species === 'Torterra' && !counter['Grass']) {
				ability = 'Shell Armor';
			} else if (template.species === 'Umbreon') {
				ability = 'Synchronize';
			} else if (template.id === 'venusaurmega') {
				ability = 'Chlorophyll';
			} else if (template.id === 'dugtrioalola' && hasMove['sandstorm']) {
				ability = 'Sand Force';
			} else if (template.species === 'Shuckle' && hasMove['shellsmash']) {
				ability = 'Contrary';
			}
		} else {
			ability = ability0.name;
		}

		item = 'Leftovers';
		if (template.requiredItems) {
			if (template.baseSpecies === 'Arceus' && (hasMove['judgment'] || !counter[template.types[0]])) {
				// Judgment doesn't change type with Z-Crystals
				item = template.requiredItems[0];
			} else {
				item = this.sample(template.requiredItems);
			}
		} else if (hasMove['magikarpsrevenge']) {
			// PoTD Magikarp
			item = 'Choice Band';

		// First, the extra high-priority items
		} else if (template.species === 'Clamperl' && !hasMove['shellsmash']) {
			item = 'Deep Sea Tooth';
		} else if (template.species === 'Cubone' || template.baseSpecies === 'Marowak') {
			item = 'Thick Club';
		} else if (template.species === 'Decidueye' && hasMove['spiritshackle'] && counter.setupType && !teamDetails.zMove) {
			item = 'Decidium Z';
		} else if (template.species === 'Dedenne') {
			item = 'Petaya Berry';
		} else if (template.species === 'Deoxys-Attack') {
			item = (slot === 0 && hasMove['stealthrock']) ? 'Focus Sash' : 'Life Orb';
		} else if (template.species === 'Farfetch\'d') {
			item = 'Stick';
		} else if (template.species === 'Kadabra') {
			item = (hasMove['counter']) ? 'Focus Sash' : 'Life Orb';
		} else if (template.species === 'Kommo-o' && !teamDetails.zMove) {
			item = hasMove['clangingscales'] ? 'Kommonium Z' : 'Dragonium Z';
		} else if (template.baseSpecies === 'Lycanroc' && hasMove['stoneedge'] && counter.setupType && !teamDetails.zMove) {
			item = 'Lycanium Z';
		} else if (template.species === 'Marshadow' && hasMove['spectralthief'] && counter.setupType && !teamDetails.zMove) {
			item = 'Marshadium Z';
		} else if (template.species === 'Mimikyu' && hasMove['playrough'] && counter.setupType && !teamDetails.zMove) {
			item = 'Mimikium Z';
		} else if ((template.species === 'Necrozma-Dusk-Mane' || template.species === 'Necrozma-Dawn-Wings') && !teamDetails.zMove) {
			if (hasMove['autotomize'] && hasMove['sunsteelstrike']) {
				item = 'Solganium Z';
			} else if (hasMove['trickroom'] && hasMove['moongeistbeam']) {
				item = 'Lunalium Z';
			} else {
				item = 'Ultranecrozium Z';
				if (!hasMove['photongeyser']) {
					for (const moveid of moves) {
						let move = this.getMove(moveid);
						if (move.category === 'Status' || hasType[move.type]) continue;
						moves[moves.indexOf(moveid)] = 'photongeyser';
						break;
					}
				}
			}
		} else if (template.baseSpecies === 'Pikachu') {
			item = 'Light Ball';
		} else if (template.species === 'Raichu-Alola' && hasMove['thunderbolt'] && !teamDetails.zMove && this.randomChance(1, 4)) {
			item = 'Aloraichium Z';
		} else if (template.species === 'Shedinja' || template.species === 'Smeargle') {
			item = 'Focus Sash';
		} else if (template.species === 'Unfezant' && counter['Physical'] >= 2) {
			item = 'Scope Lens';
		} else if (template.species === 'Unown') {
			item = 'Choice Specs';
		} else if (template.species === 'Wishiwashi') {
			item = this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki']) + ' Berry';
		} else if (template.species === 'Wobbuffet') {
			if (hasMove['destinybond']) {
				item = 'Custap Berry';
			} else {
				item = isDoubles || this.randomChance(1, 2) ? 'Sitrus Berry' : 'Leftovers';
			}
		} else if (template.species === 'Zygarde-10%' && hasMove['substitute'] && !teamDetails.zMove) {
			item = hasMove['outrage'] ? 'Dragonium Z' : 'Groundium Z';
		} else if (template.species === 'Eevee' && !teamDetails.zMove) {
			item = 'Eevium Z';
		} else if (ability === 'Imposter') {
			item = 'Choice Scarf';
		} else if (hasMove['geomancy']) {
			item = 'Power Herb';
		} else if (ability === 'Klutz' && hasMove['switcheroo']) {
			// To perma-taunt a Pokemon by giving it Assault Vest
			item = 'Assault Vest';
		} else if (hasMove['switcheroo'] || hasMove['trick']) {
			if (template.baseStats.spe >= 60 && template.baseStats.spe <= 98) {
				item = 'Choice Scarf';
			} else {
				item = (counter.Physical > counter.Special) ? 'Choice Band' : 'Choice Specs';
			}
		} else if ((hasMove['conversion'] || hasMove['mefirst'] || hasMove['celebrate'] || hasMove['happyhour']) && !teamDetails.zMove) {
			item = 'Normalium Z';
		} else if (hasMove['dig'] && !teamDetails.zMove) {
			item = 'Groundium Z';
		} else if (hasMove['electricterrain']) {
			item = !teamDetails.zMove ? 'Electrium Z' : (this.randomChance(1, 2) ? 'Electric Seed' : 'Terrain Extender');
		} else if ((hasMove['gigaimpact'] || hasMove['hyperbeam']) && !hasAbility['Truant'] && !teamDetails.zMove) {
			item = 'Normalium Z';
		} else if (hasMove['mindblown'] && !!counter['Status'] && !teamDetails.zMove) {
			item = 'Firium Z';
		} else if ((hasMove['fly'] || ((hasMove['bounce'] || (hasAbility['Gale Wings'] && hasMove['bravebird'])) && counter.setupType) || hasMove['mirrormove']) && !teamDetails.zMove) {
			item = 'Flyinium Z';
		} else if (hasMove['solarbeam'] && !hasAbility['Drought'] && !hasMove['sunnyday'] && !teamDetails['sun']) {
			item = !teamDetails.zMove ? 'Grassium Z' : 'Power Herb';
		} else if (hasMove['psychup'] && !teamDetails.zMove) {
			item = 'Psychium Z';
		} else if ((template.species === 'Latias' || template.species === 'Latios') && counter['Psychic'] + counter['Dragon'] >= 2) {
			item = 'Soul Dew';
		} else if (hasMove['bellydrum']) {
			if (ability === 'Gluttony') {
				item = this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki']) + ' Berry';
			} else if (template.baseStats.spe <= 50 && !teamDetails.zMove && this.randomChance(1, 2)) {
				item = 'Normalium Z';
			} else {
				item = 'Sitrus Berry';
			}
		} else if (hasMove['shellsmash'] && ability !== 'Contrary') {
			item = (ability === 'Solid Rock' && counter['priority']) ? 'Weakness Policy' : 'White Herb';
		} else if (ability === 'Harvest') {
			item = hasMove['rest'] ? 'Lum Berry' : 'Sitrus Berry';
		} else if (ability === 'Poison Heal' || ability === 'Toxic Boost') {
			item = 'Toxic Orb';
		} else if (hasMove['rest'] && !hasMove['sleeptalk'] && !hasMove['perishsong'] && ability !== 'Natural Cure' && ability !== 'Shed Skin') {
			item = (hasMove['raindance'] && ability === 'Hydration') ? 'Damp Rock' : 'Chesto Berry';
		} else if (hasMove['psychoshift'] || (ability === 'Guts' && !hasMove['sleeptalk'])) {
			item = (hasType['Fire'] || ability === 'Quick Feet') ? 'Toxic Orb' : 'Flame Orb';
		} else if (ability === 'Unburden') {
			if (hasMove['fakeout']) {
				item = 'Normal Gem';
			} else {
				item = 'Sitrus Berry';
			}
		} else if (hasMove['acrobatics']) {
			item = '';

		// Medium priority
		} else if (template.evos.length && ability !== 'Speed Boost' && (template.baseStats.spe < 80 || (template.baseStats.atk < 80 && template.baseStats.spa < 80) ||
			counter.setupType)) {
			item = 'Eviolite';
		} else if ((ability === 'Magic Guard' || ability === 'Sheer Force') && counter.damagingMoves.length > 1) {
			item = 'Life Orb';
		} else if (hasMove['raindance'] && !hasMove['thunder']) {
			item = (ability === 'Swift Swim' && counter.Status < 2) ? 'Life Orb' : 'Damp Rock';
		} else if (hasMove['sunnyday'] && !hasMove['solarbeam']) {
			item = (ability === 'Chlorophyll' && counter.Status < 2) ? 'Life Orb' : 'Heat Rock';
		} else if (hasMove['hail'] && !hasMove['blizzard']) {
			item = (ability === 'Slush Rush' && counter.Status < 2) ? 'Life Orb' : 'Icy Rock';
		} else if (hasMove['sandstorm']) {
			item = ((ability === 'Sand Rush' || ability === 'Sand Force') && counter.Status < 2) ? 'Life Orb' : 'Smooth Rock';
		} else if (hasMove['auroraveil'] || hasMove['lightscreen'] && hasMove['reflect']) {
			item = 'Light Clay';
		} else if (((ability === 'Speed Boost' && !hasMove['substitute']) || (ability === 'Stance Change')) && counter.Physical + counter.Special > 2) {
			item = 'Life Orb';
		} else if (hasType['Grass'] && template.baseStats.spe <= 60 && hasMove['sleeppowder'] && counter.setupType && !teamDetails.zMove) {
			item = 'Grassium Z';
		} else if (counter.Physical >= 4 && !hasMove['bodyslam'] && !hasMove['dragontail'] && !hasMove['fakeout'] && !hasMove['flamecharge'] && !hasMove['rapidspin'] && !hasMove['suckerpunch'] && !hasMove['poweruppunch'] && !counter['trap'] && !isDoubles) {
			item = template.baseStats.atk >= 80 && template.baseStats.spe >= 60 && template.baseStats.spe <= 98 && !counter['priority'] && this.randomChance(3, 5) ? 'Choice Scarf' : 'Choice Band';
		} else if (counter.Special >= 4 && !hasMove['acidspray'] && !hasMove['chargebeam'] && !hasMove['clearsmog'] && !hasMove['fierydance'] && !counter['trap'] && !isDoubles) {
			item = template.baseStats.spa >= 80 && template.baseStats.spe >= 60 && template.baseStats.spe <= 98 && !counter['priority'] && this.randomChance(3, 5) ? 'Choice Scarf' : 'Choice Specs';
		} else if (((counter.Physical >= 3 && hasMove['defog']) || (counter.Special >= 3 && hasMove['uturn'])) && template.baseStats.spe >= 60 && template.baseStats.spe <= 98 && !counter['priority'] && !hasMove['foulplay'] && this.randomChance(3, 5) && !counter['trap'] && !isDoubles) {
			item = 'Choice Scarf';
		} else if (ability === 'Defeatist' || hasMove['eruption'] || hasMove['waterspout']) {
			item = counter.Status <= 1 ? 'Expert Belt' : 'Leftovers';
		} else if (isDoubles && counter.damagingMoves.length >= 4 && template.baseStats.spe >= 60 && !hasMove['fakeout'] && !hasMove['flamecharge'] && !hasMove['suckerpunch'] && ability !== 'Multiscale' && ability !== 'Sturdy') {
			item = 'Life Orb';
		} else if (hasMove['reversal'] && !teamDetails.zMove) {
			item = 'Fightinium Z';
		} else if ((hasMove['endeavor'] || hasMove['flail'] || hasMove['reversal']) && ability !== 'Sturdy') {
			item = 'Focus Sash';
		} else if (template.evos.length) {
			item = "Eviolite";
		} else if (counter.Status >= 3 && template.baseStats.spe < 80 && !hasMove['sleeptalk']) {
			item = "Mental Herb";
		} else if (this.getEffectiveness('Ground', template) >= 2 && ability !== 'Levitate' && !hasMove['magnetrise']) {
			item = 'Air Balloon';
		} else if (hasMove['outrage'] && (counter.setupType || ability === 'Multiscale')) {
			item = 'Lum Berry';
		} else if (isDoubles && this.getEffectiveness('Ice', template) >= 2) {
			item = 'Yache Berry';
		} else if (isDoubles && this.getEffectiveness('Rock', template) >= 2) {
			item = 'Charti Berry';
		} else if (isDoubles && this.getEffectiveness('Fire', template) >= 2) {
			item = 'Occa Berry';
		} else if (isDoubles && this.getImmunity('Fighting', template) && this.getEffectiveness('Fighting', template) >= 2) {
			item = 'Chople Berry';
		} else if ((ability === 'Slow Start' || hasMove['clearsmog'] || hasMove['curse'] || hasMove['detect'] || hasMove['protect'] || hasMove['sleeptalk']) && !isDoubles) {
			item = 'Leftovers';
		} else if (hasMove['substitute']) {
			item = counter.damagingMoves.length > 2 && !!counter['drain'] && !counter['damage'] ? 'Life Orb' : 'Leftovers';
		} else if ((ability === 'Iron Barbs' || ability === 'Rough Skin') && this.randomChance(1, 2)) {
			item = 'Rocky Helmet';
		} else if (counter.Physical + counter.Special >= 4 && template.baseStats.spd >= 60 && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 185) {
			item = 'Assault Vest';
		} else if (counter.damagingMoves.length >= 4 && !counter['damage']) {
			item = (!!counter['Dragon'] || !!counter['Normal'] || (hasMove['suckerpunch'] && !hasType['Dark'])) ? 'Life Orb' : 'Expert Belt';
		} else if (template.species === 'Palkia' && (hasMove['dracometeor'] || hasMove['spacialrend']) && hasMove['hydropump']) {
			item = 'Lustrous Orb';
		} else if (counter.damagingMoves.length >= 3 && !!counter['speedsetup'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 250) {
			item = 'Weakness Policy';
		} else if (slot === 0 && ability !== 'Regenerator' && ability !== 'Sturdy' && !counter['recoil'] && !counter['recovery'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd < 225) {
			item = 'Focus Sash';
		} else if (counter.damagingMoves.length >= 3 && ability !== 'Sturdy' && !hasMove['acidspray'] && !hasMove['dragontail'] && !hasMove['foulplay'] && !hasMove['rapidspin'] && !hasMove['superfang'] && !counter['damage']) {
			item = (template.baseStats.hp + template.baseStats.def + template.baseStats.spd < 225 || !!counter['speedsetup'] || hasMove['trickroom']) ? 'Life Orb' : 'Leftovers';

		// This is the "REALLY can't think of a good item" cutoff
		} else if (ability === 'Sturdy' && hasMove['explosion'] && !counter['speedsetup']) {
			item = 'Custap Berry';
		} else if (ability === 'Super Luck') {
			item = 'Scope Lens';
			
		// 30% chance to get a Z-Crystal for attacking moves
		} else if (this.randomChance(3, 10) && ability !== 'Contrary' && (template.baseStats.atk >= 90 || template.baseStats.spa >= 90 || counter.setupType) && !teamDetails.zMove) {
			let moveTypes = [];
			let category = {
				Physical: template.baseStats.atk >= 90 || counter.setupType === 'Physical' || counter.setupType === 'Mixed',
				Special: template.baseStats.spa >= 90 || counter.setupType === 'Special' || counter.setupType === 'Mixed',
			};
			for (let moveId of moves) {
				if (moveId === 'foulplay') continue;
				let move = this.getMove(moveId);
				if ((move.zMovePower >= 160) && !(move.type === 'Normal' && !hasType['Normal']) && category[move.category]) {
					moveTypes.push(move.type);
				}
			}
			let zType = this.sampleNoReplace(moveTypes);
			item = zType ? zCrystals[zType] : 'Leftovers';
		} else if (hasType['Poison']) {
			item = 'Black Sludge';
		} else if (this.getEffectiveness('Rock', template) >= 1 || hasMove['dragontail']) {
			item = 'Leftovers';
		} else if (this.getImmunity('Ground', template) && this.getEffectiveness('Ground', template) >= 1 && ability !== 'Levitate' && ability !== 'Solid Rock' && !hasMove['magnetrise'] && !hasMove['sleeptalk']) {
			item = 'Air Balloon';
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && hasType['Poison']) {
			item = 'Black Sludge';
		}

		let level = 75;

		if (!isDoubles) {
			let levelScale = {
				LC: 96,
				'LC Uber': 92,
				NFE: 90,
				ZU: 88,
			};
			let customScale = {
				// S Rank, new additions
				Altaria: 77, Floatzel: 77, "Gourgeist-Super": 77, Komala: 77, Pyukumuku: 77, Swanna: 77,
				
				// A+ Rank
				Golem: 78, Kecleon: 78, Mareanie: 78, Monferno: 78, Pinsir: 78,
				
				// A Rank
				Abomasnow: 79, Bronzor: 79, Chatot: 79, Combusken: 79, Crustle: 79, Grumpig: 79, Kadabra: 79,
				"Mr. Mime": 79, Muk: 79, Probopass: 79, Rapidash: 79, "Silvally-Fighting": 79, Vigoroth: 79,
				
				// A- Rank
				Beheeyem: 80, Bouffalant: 80, "Dugtrio-Alola": 80, Electivire: 80, Oricorio: 80, "Silvally-Dragon": 80,
				"Silvally-Water": 80, Simipour: 80, Tangela: 80, Zebstrika: 80,
				
				// B+ Rank
				Gabite: 81, "Gourgeist-Large": 81, Granbull: 81, Leafeon: 81, Lickilicky: 81, Machoke: 81, Mawile: 81, Metang: 81, Misdreavus: 81,
				Pawniard: 81, Purugly: 81, Raichu: 81, "Rotom-Fan": 81, Sandslash: 81, Shiftry: 81, Shuckle: 81, "Silvally-Dark": 81,
				
				// B Rank
				Bellossom: 82, Carbink: 82, Regice: 82, Roselia: 82, Sawsbuck: 82, Seaking: 82, "Silvally-Grass": 82,
				"Silvally-Poison": 82, Simisear: 82, Toucannon: 82, Volbeat: 82,
				
				// B- Rank
				Armaldo: 83, Basculin: 83, Beartic: 83, Bibarel: 83, Butterfree: 83, Camerupt: 83, Cradily: 83, Dusclops: 83, Dusknoir: 83,
				Fraxure: 83, Golduck: 83, "Hakamo-o": 83, Huntail: 83, Lapras: 83, Marowak: 83, Masquerain: 83, Meowstic: 83, Noctowl: 83,
				"Oricorio-Pom-Pom": 83, Quilladin: 83, Rampardos: 83, Raticate: 83, Silvally: 83, Smeargle: 83, Vullaby: 83, Wishiwashi: 83,
				
				// C+ Rank
				Arbok: 84, Ditto: 84, Drifblim: 84, Duosion: 84, Electrode: 84, "Golem-Alola": 84, Gumshoos: 84, Jumpluff: 84, Leavanny: 84,
				"Meowstic-F": 84, Munchlax: 84, Murkrow: 84, Ninjask: 84, Relicanth: 84, Servine: 84, "Silvally-Ground": 84,
				Simisage: 84, Silggoo: 84, Swoobat: 84, Togetic: 84,
				
				// C Rank
				Ampharos: 85, Avalugg: 85, Cacturne: 85, Chimecho: 85, Dugtrio: 85, Flareon: 85, Gogoat: 85, Illumise: 85, Klang: 85, Onix: 85, Natu: 85,
				"Silvally-Fire": 85, Stunfisk: 85, Torkoal: 85, Trevenant: 85, Vibrava: 85,
				
				// C- Rank
				Chinchou: 86, Fearow: 86, Frogadier: 86, Glaceon: 86, Gothitelle: 86, "Gourgeist-Small": 86, Honedge: 86, Krokorok: 86,
				"Lycanroc-Midnight": 86, Oranguru: 86, Politoed: 86, Shiinotic: 86, "Silvally-Bug": 86, "Silvally-Electric": 86, "Silvally-Rock": 86,
				Slaking: 86, Solrock: 86, Wartortle: 86, Wigglytuff: 86, "Wormadam-Trash": 86,
				
				// Usually Useless
				Eevee: 87, Furfrou: 87, Girafarig: 87, Glalie: 87, Gourgeist: 87, Lampent: 87, Lopunny: 87, Lumineon: 87, Poipole: 87,
				Prinplup: 87, Regigigas: 87, Seviper: 87, Shedinja: 87, "Silvally-Flying": 87, "Silvally-Ice": 87, "Silvally-Psychic": 87,
				Weepinbell: 87, Zweilous: 87,
				
				// Holistic judgement
				Unown: 100,	Luvdisc: 99, Wobbuffet: 99, Spinda: 90,
			};
			let tier = template.tier;
			if (tier.includes('Unreleased') && baseTemplate.tier === 'Uber') {
				tier = 'Uber';
			}
			if (tier.charAt(0) === '(') {
				tier = tier.slice(1, -1);
			}
			level = levelScale[tier] || 75;
			if (customScale[template.name]) level = customScale[template.name];
		} else {
			// We choose level based on BST. Min level is 70, max level is 99. 600+ BST is 70, less than 300 is 99. Calculate with those values.
			// Every 10.34 BST adds a level from 70 up to 99. Results are floored. Uses the Mega's stats if holding a Mega Stone
			let baseStats = template.baseStats;
			// If Wishiwashi, use the school-forme's much higher stats
			if (template.baseSpecies === 'Wishiwashi') baseStats = this.getTemplate('wishiwashischool').baseStats;

			let bst = baseStats.hp + baseStats.atk + baseStats.def + baseStats.spa + baseStats.spd + baseStats.spe;
			// Adjust levels of mons based on abilities (Pure Power, Sheer Force, etc.) and also Eviolite
			// For the stat boosted, treat the Pokemon's base stat as if it were multiplied by the boost. (Actual effective base stats are higher.)
			let templateAbility = (baseTemplate === template ? ability : template.abilities[0]);
			if (templateAbility === 'Huge Power' || templateAbility === 'Pure Power') {
				bst += baseStats.atk;
			} else if (templateAbility === 'Parental Bond') {
				bst += 0.25 * (counter.Physical > counter.Special ? baseStats.atk : baseStats.spa);
			} else if (templateAbility === 'Protean') {
				bst += 0.3 * (counter.Physical > counter.Special ? baseStats.atk : baseStats.spa);
			} else if (templateAbility === 'Fur Coat') {
				bst += baseStats.def;
			} else if (templateAbility === 'Slow Start') {
				bst -= baseStats.atk / 2 + baseStats.spe / 2;
			} else if (templateAbility === 'Truant') {
				bst *= 2 / 3;
			}
			if (item === 'Eviolite') {
				bst += 0.5 * (baseStats.def + baseStats.spd);
			}
			level = 70 + Math.floor(((600 - this.clampIntRange(bst, 300, 600)) / 10.34));
		}

		// Prepare optimal HP
		let srWeakness = this.getEffectiveness('Rock', template);
		while (evs.hp > 1) {
			let hp = Math.floor(Math.floor(2 * template.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if (hasMove['substitute'] && hasMove['reversal']) {
				// Reversal users should be able to use four Substitutes
				if (hp % 4 > 0) break;
			} else if (hasMove['substitute'] && (item === 'Sitrus Berry' || ability === 'Power Construct' && item !== 'Leftovers')) {
				// Two Substitutes should activate Sitrus Berry or Power Construct
				if (hp % 4 === 0) break;
			} else if (hasMove['bellydrum'] && (item === 'Sitrus Berry' || ability === 'Gluttony')) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || hp % (4 / srWeakness) > 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		if (!counter['Physical'] && !hasMove['copycat'] && !hasMove['transform']) {
			evs.atk = 0;
			ivs.atk = 0;
		}
		
		if (ability === 'Beast Boost' && counter.Special < 1) {
			evs.spa = 0;
			ivs.spa = 0;
		}

		if (hasMove['gyroball'] || hasMove['trickroom']) {
			evs.spe = 0;
			ivs.spe = 0;
		}
		
		// if (tryCount) evs.spe = tryCount;

		return {
			name: template.baseSpecies,
			species: species,
			gender: template.gender,
			moves: moves,
			ability: ability,
			evs: evs,
			ivs: ivs,
			item: item,
			level: level,
			shiny: this.randomChance(1, 1024),
		};
	}
	
	randomTeam() {
		let pokemon = [];

		const excludedTiers = ['Unreleased', 'Uber', 'OU', 'UUBL', 'UU', 'RUBL', 'RU', 'NUBL', 'NU', 'PUBL', 'PU', 'ZUBL'];
		const allowedNFE = [
			'Kadabra', 'Vigoroth', 'Combusken', 'Misdreavus', 'Monferno', 'Tangela',
			'Bronzor', 'Machoke', 'Metang', 'Pawniard', 'Fraxure', 'Hakamo-o', 'Servine', 'Togetic',
			'Dusclops', 'Gabite', 'Mareanie', 'Murkrow', 'Quilladin', 'Roselia', 'Vullaby', 'Duosion', 'Munchlax', 'Onix', 'Sliggoo',
			'Chinchou', 'Klang', 'Lampent', 'Natu', 'Vibrava', 'Frogadier', 'Krokorok', 'Prinplup', 'Wartortle', 'Weepinbell',
			'Eevee', 'Poipole', 'Honedge', 'Zweilous',
			'Hippopotas',
		];

		// For Monotype
		let isMonotype = this.format.id === 'gen7monotyperandombattle';
		let typePool = Object.keys(this.data.TypeChart);
		let type = this.sample(typePool);

		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			let template = this.getTemplate(id);
			if (isMonotype) {
				let types = template.types;
				if (template.battleOnly) types = this.getTemplate(template.baseSpecies).types;
				if (types.indexOf(type) < 0) continue;
			}
			if (template.gen <= this.gen && !excludedTiers.includes(template.tier) && !template.isMega && !template.isPrimal && !template.isNonstandard && template.randomBattleMoves) {
				pokemonPool.push(id);
			}
		}

		// PotD stuff
		let potd;
		if (global.Config && Config.potd && this.getRuleTable(this.getFormat()).has('potd')) {
			potd = this.getTemplate(Config.potd);
		}

		let typeCount = {};
		let typeComboCount = {};
		let baseFormes = {};
		let uberCount = 0;
		let puCount = 0;
		/**@type {RandomTeamsTypes["TeamDetails"]} */
		let teamDetails = {};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;

			// Only certain NFE Pokemon are allowed
			if (template.evos.length && !allowedNFE.includes(template.species)) continue;
			
			// Only allow Eevee if team doesn't already have Z-move user
			if (template.id === 'eevee' && teamDetails.zMove) continue;

			let tier = template.tier;

			// Adjust rate for species with multiple formes
			switch (template.baseSpecies) {
			case 'Silvally':
				if (this.randomChance(14, 15)) continue;
				break;
			case 'Pikachu':
				if (this.randomChance(6, 7)) continue;
				continue;
			case 'Castform':
				if (this.randomChance(3, 4)) continue;
				break;
			case 'Gourgeist': case 'Oricorio':
				if (this.randomChance(2, 3)) continue;
				break;
			case 'Basculin': case 'Meowstic':
				if (this.randomChance(1, 2)) continue;
				break;
			}

			let types = template.types;

			if (!isMonotype) {
				// Limit 2 of any type
				let skip = false;
				for (const type of types) {
					if (typeCount[type] > 1 && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
				if (skip) continue;
			}

			let set = this.randomSet(template, pokemon.length, teamDetails, this.format.gameType !== 'singles');
			
			// No Megas
			if (this.getItem(set.item).megaStone) continue;

			// Illusion shouldn't be the last Pokemon of the team
			if (set.ability === 'Illusion' && pokemon.length > 4) continue;

			// Pokemon shouldn't have Physical and Special setup on the same set
			let incompatibleMoves = ['bellydrum', 'swordsdance', 'calmmind', 'nastyplot'];
			let intersectMoves = set.moves.filter(move => incompatibleMoves.includes(move));
			if (intersectMoves.length > 1) continue;

			// Limit 1 of any type combination, 2 in monotype
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle' || set.ability === 'Sand Stream' || set.ability === 'Snow Warning') {
				// Drought, Drizzle, Sand Stream and Snow Warning don't count towards the type combo limit
				typeCombo = set.ability;
				if (typeCombo in typeComboCount) continue;
			} else {
				if (typeComboCount[typeCombo] >= (isMonotype ? 2 : 1)) continue;
			}

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			if (pokemon.length === 6) {
				// Set Zoroark's level to be the same as the last Pokemon
				let illusion = teamDetails['illusion'];
				if (illusion) pokemon[illusion - 1].level = pokemon[5].level;
				break;
			}
			
			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;

			// Increment type counters
			for (const type of types) {
				if (type in typeCount) {
					typeCount[type]++;
				} else {
					typeCount[type] = 1;
				}
			}
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Team has Mega/weather/hazards
			let item = this.getItem(set.item);
			if (item.megaStone) teamDetails['megaStone'] = 1;
			if (item.zMove) teamDetails['zMove'] = 1;
			if (set.moves.includes('sunnyday')) teamDetails['sun'] = 1;
			if (set.moves.includes('raindance')) teamDetails['rain'] = 1;
			if (set.ability === 'Snow Warning' || set.moves.includes('hail')) teamDetails['hail'] = 1;
			if (set.ability === 'Sand Stream' || set.moves.includes('sandstorm')) teamDetails['sand'] = 1;
			if (set.moves.includes('stealthrock')) teamDetails['stealthRock'] = 1;
			if (set.moves.includes('toxicspikes')) teamDetails['toxicSpikes'] = 1;
			if (set.moves.includes('defog') || set.moves.includes('rapidspin')) teamDetails['hazardClear'] = 1;
			if (set.ability === 'Chlorophyll') teamDetails['chlorophyll'] = 1;
			if (set.ability === 'Swift Swim') teamDetails['swiftswim'] = 1;
			if (set.ability === 'Sand Rush') teamDetails['sandrush'] = 1;
			if (set.ability === 'Slush Rush') teamDetails['slushrush'] = 1;
			
			// For setting Zoroark's level
			if (set.ability === 'Illusion') teamDetails['illusion'] = pokemon.length;
		}
		return pokemon;
	}
}

module.exports = RandomZUTeams;
