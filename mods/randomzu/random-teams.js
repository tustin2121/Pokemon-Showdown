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
			Physical: 0,		// Moves that depend on Attack stat
			Special: 0,			// Moves that depend on Special Attack stat
			Status: 0,			// Non-damaging moves
			damage: 0,			// Fixed damage moves
			recovery: 0,		// Recovery moves, excluding Rest
			stab: 0,			// STAB moves, excluding moves from NoStab
			inaccurate: 0,		// Moves with lower than 90% accuracy (for No Guard/Compound Eyes)
			priority: 0,		// Moves with non-zero priority (for Speed setup)
			recoil: 0,			// Moves with recoil damage (for Rock Head/Reckless/Sturdy/Focus Sash)
			drain: 0,			// Moves that drain health from target (for Triage)
			adaptability: 0,	// Moves that benefit from Adaptability (STAB moves)
			strongjaw: 0,		// Moves that benefit from Strong Jaw (bite moves)
			contrary: 0,		// Moves that benefit from Contrary (self-lowering stats)
			hustle: 0,			// Moves that benefit from Hustle (physical moves)
			ironfist: 0,		// Moves that benefit from Iron Fist (punch moves)
			serenegrace: 0,		// Moves that benefit from Serene Grace (20+% secondary rate)
			sheerforce: 0,		// Moves that benefit from Sheer Force (have secondary but not self-boosting, Fake Out excluded)
			skilllink: 0,		// Moves that benefit from Skill Link (2-5 hits)
			technician: 0,		// Moves that benefit from Technician (<= 60 BP, excluding Rapid Spin)
			physicalsetup: 0,	// Moves that boost Attack
			specialsetup: 0,	// Moves that boost Special Attack
			mixedsetup: 0,		// Moves that boost both Attack and Special Attack
			speedsetup: 0,		// Moves that boost Speed
			defensesetup: 0,	// Moves that boost Defense
			physicalpool: 0,	// Physical moves in movepool (unpicked, unrejected)
			specialpool: 0,		// Special moves in movepool (unpicked, unrejected)
			trap: 0,			// Moves that trap or partial-trap
			hazards: 0,			// Hazard moves
			weather: 0,			// Weather moves
			/**@type {Move[]} */
			damagingMoves: [],	// List of moves that are used for damage
			setupType: '',		// Physical/Special/Mixed
		};

		for (let type in Dex.data.TypeChart) {
			counter[type] = 0;
		}

		if (!moves || !moves.length) return counter;

		// Moves that heal a fixed amount:
		let RecoveryMove = [
			'healorder', 'milkdrink', 'moonlight', 'morningsun', 'recover', 'roost', 'shoreup', 'slackoff', 'softboiled', 'strengthsap', 'synthesis',
		];
		// Moves which drop stats:
		let ContraryMove = [
			'clangingscales', 'closecombat', 'dracometeor', 'dragonascent', 'fleurcannon', 'hammerarm', 'hyperspacefury', 'icehammer',
			'leafstorm', 'overheat', 'psychoboost', 'superpower', 'vcreate',
		];
		// Moves that boost Attack:
		let PhysicalSetup = [
			'bellydrum', 'bulkup', 'coil', 'curse', 'dragondance', 'mirrormove', 'poweruppunch', 'shiftgear', 'swordsdance',
		];
		// Moves which boost Special Attack:
		let SpecialSetup = [
			'calmmind', 'chargebeam', 'fierydance', 'geomancy', 'nastyplot', 'quiverdance', 'tailglow', 'healblock',
		];
		// Moves which boost Attack AND Special Attack:
		let MixedSetup = [
			'celebrate', 'clangingscales', 'conversion', 'forestscurse', 'growth', 'happyhour', 'holdhands', 'lastresort', 'shellsmash', 'trickortreat', 'workup',
		];
		// Moves which boost Speed:
		let SpeedSetup = [
			'agility', 'autotomize', 'celebrate', 'clangingscales', 'conversion', 'dragondance', 'flamecharge', 'forestscurse', 'happyhour',
			'holdhands', 'lastresort', 'mefirst', 'quiverdance', 'rockpolish', 'shellsmash', 'shiftgear', 'trickortreat',
		];
		// Moves that shouldn't be the only STAB moves:
		let NoStab = [
			'aquajet', 'bounce', 'dig', 'explosion', 'fakeout', 'firstimpression', 'flamecharge', 'fly', 'iceshard', 'pursuit',
			'quickattack', 'selfdestruct', 'skyattack', 'suckerpunch',
			'chargebeam', 'clearsmog', 'eruption', 'vacuumwave', 'waterspout',
		];
		// Moves that are only used to trap/partial-trap opponent:
		let Trap = [
			'block', 'meanlook', 'spiderweb', 'bind', 'clamp', 'firespin', 'infestation', 'sandtomb', 'whirlpool', 'wrap',
		];
		// Moves which boost Defense or Special Defense (for at least 2 stages):
		let DefenseSetup = [
			'acidarmor', 'amnesia', 'barrier', 'cosmicpower', 'cottonguard', 'defendorder', 'diamondstorm', 'irondefense', 'magneticflux', 'stockpile',
		];
		// Hazard moves
		let Hazards = [
			'stealthrock', 'toxicspikes', 'spikes', 'stickyweb',
		];
		// Weather moves
		let Weather = [
			'raindance', 'sunnyday', 'sandstorm', 'hail',
		];

		// Iterate through all moves we've chosen so far and keep track of what they do:
		for (const [k, moveId] of moves.entries()) {
			let move = this.getMove(moveId);
			if (moveId === 'naturepower') move = this.getMove('triattack');
			let moveid = move.id;
			let movetype = move.type;
			if (['judgment', 'multiattack', 'revelationdance'].includes(moveid)) movetype = Object.keys(hasType)[0];
			if (move.damage || move.damageCallback || moveid === 'foulplay') {
				// Moves that do a set amount of damage:
				counter['damage']++;
				if (!['counter', 'mirrorcoat', 'metalburst'].includes(moveid)) {
					counter.damagingMoves.push(move);
				}
			} else {
				// Are Physical/Special/Status moves:
				counter[move.category]++;
			}
			// Moves that have a low base power:
			if (['lowkick', 'grassknot'].includes(moveid) || (move.basePower && move.basePower <= 60 && moveid !== 'rapidspin')) counter['technician']++;
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
						// Ties between Physical and Special setup should be broken in favor of STABs
						counter[move.category] += 0.1;
					}
				} else if (move.priority === 0 && hasAbility['Protean'] && !NoStab.includes(moveid)) {
					counter['stab']++;
				} else if (movetype === 'Steel' && hasAbility['Steelworker']) {
					counter['stab']++;
				}
				if (move.category === 'Physical') counter['hustle']++;
				if (move.flags['bite']) counter['strongjaw']++;
				if (move.flags['punch']) counter['ironfist']++;
				counter.damagingMoves.push(move);
			}
			// Moves with secondary effects:
			if (move.secondary) {
				if (!['flamecharge', 'poweruppunch', 'chargebeam', 'fakeout'].includes(moveid)) {
					counter['sheerforce']++;
				}
				if (move.secondary.chance && move.secondary.chance >= 20 && move.secondary.chance < 100) {
					counter['serenegrace']++;
				}
			}
			if (move.accuracy && move.accuracy !== true && move.accuracy < 90) counter['inaccurate']++;
			if (move.category !== 'Status' && move.priority !== 0) counter['priority']++;
			if (RecoveryMove.includes(moveid)) counter['recovery']++;
			if (ContraryMove.includes(moveid)) counter['contrary']++;
			if (PhysicalSetup.includes(moveid)) {
				counter['physicalsetup']++;
				counter.setupType = 'Physical';
			}
			if (SpecialSetup.includes(moveid)) {
				counter['specialsetup']++;
				counter.setupType = 'Special';
			}
			if (MixedSetup.includes(moveid)) counter['mixedsetup']++;
			if (SpeedSetup.includes(moveid)) counter['speedsetup']++;
			if (DefenseSetup.includes(moveid)) counter['defensesetup']++;
			if (Trap.includes(moveid)) counter['trap']++;
			if (Hazards.includes(moveid)) counter['hazards']++;
			if (Weather.includes(moveid)) counter['weather']++;
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
					else counter.setupType = 'Special';
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
			require('../../lib/crashlogger')(err, 'The randbat set generator');
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
		let weatherMoves = [
			'raindance', 'sunnyday', 'sandstorm', 'hail',
		];
		let counterAbilities = [
			'Adaptability', 'Contrary', 'Hustle', 'Iron Fist', 'Skill Link', 'Strong Jaw', 'Serene Grace',
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
			
			let hasZ = false;

			// Iterate through the moves again, this time to cull them:
			for (const [k, moveId] of moves.entries()) {
				let move = this.getMove(moveId);
				let moveid = move.id;
				let rejected = false;
				let isSetup = false;

				switch (moveid) {
					
				// Physical setup
				case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance': case 'poweruppunch':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) rejected = true;
					if (counter.Physical < 2 && !(hasMove['rest'] && hasMove['sleeptalk']) && !counter['recovery']) rejected = true;
					if (moveid === 'bellydrum' && counter.Physical + counter['recovery'] < 3) rejected = true;
					if (moveid === 'dragondance' && teamDetails.trickroom && template.baseStats.spe <= 50) rejected = true;
					if (!rejected) isSetup = true;
					break;
				case 'mirrormove':
					if (hasZ || teamDetails.zMove) rejected = true;
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) rejected = true;
					if (counter.Physical < 2) rejected = true;
					if (!rejected) {
						isSetup = true;
						hasZ = true;
					}
					break;
					
				// Special setup
				case 'calmmind': case 'nastyplot': case 'quiverdance': case 'chargebeam': case 'geomancy':
					if (counter.setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					if (counter.Special < 2 && !(hasMove['rest'] && hasMove['sleeptalk']) && !counter['recovery']) rejected = true;
					if (moveid === 'quiverdance' && teamDetails.trickroom && template.baseStats.spe <= 50) rejected = true;
					if (!rejected) isSetup = true;
					break;
				case 'healblock':
					if (hasZ || teamDetails.zMove) rejected = true;
					if (counter.setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					if (counter.Special < 2) rejected = true;
					if (!rejected) {
						isSetup = true;
						hasZ = true;
					}
					break;
					
				// Mixed setup
				case 'growth': case 'shellsmash': case 'workup':
					if (moveid === 'shellsmash' && template.species === 'Shuckle' && hasMove['rest'] && (hasMove['infestation'] || hasMove['toxic'])) break;
					if (counter.setupType !== 'Mixed' || counter['mixedsetup'] > 1) rejected = true;
					if (moveid === 'workup' && counter.damagingMoves.length + counter['recovery'] + counter['speedsetup'] < 3) rejected = true;
					if (moveid === 'growth' && !hasMove['sunnyday'] && teamDetails.weather !== 'sun') rejected = true;
					if (moveid === 'shellsmash' && teamDetails.trickroom && template.baseStats.spe <= 50) rejected = true;
					if (!rejected) isSetup = true;
					break;
				case 'celebrate': case 'happyhour': case 'trickortreat': case 'forestscurse': case 'conversion': case 'clangingscales': case 'lastresort':
					if (hasZ || teamDetails.zMove || isSetup) rejected = true;
					if (moveid === 'conversion' && hasMove['triattack']) rejected = true;
					if (teamDetails.trickroom && template.baseStats.spe <= 50) rejected = true;
					if (!rejected) {
						isSetup = true;
						hasZ = true;
					}
					break;
					
				// Defense setup
				case 'acidarmor': case 'amnesia': case 'barrier': case 'cosmicpower': case 'cottonguard':
				case 'defendorder': case 'irondefense': case 'stockpile': case 'magneticflux':
					if (!counter['recovery'] && !hasMove['rest']) rejected = true;
					if (!rejected) isSetup = true;
					break;
					
				// Speed setup
				case 'agility': case 'autotomize': case 'rockpolish': case 'shiftgear':
					if (counter.damagingMoves.length + counter['recovery'] < 2) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (counter['weather']) rejected = true;
					if (counter['priority']) rejected = true;
					if (hasMove['trickroom'] || (teamDetails.trickroom && template.baseStats.spe <= 50)) rejected = true;
					if (!rejected) isSetup = true;
					break;
				case 'flamecharge':
					if (counter.damagingMoves.length + counter['recovery'] < 3 && !counter.setupType) rejected = true;
					if (counter['priority']) rejected = true;
					if (hasMove['trickroom'] || (teamDetails.trickroom && template.baseStats.spe <= 50)) rejected = true;
					if (!rejected) isSetup = true;
					break;
				case 'mefirst': case 'snatch':
					if (hasZ || teamDetails.zMove || counter.damagingMoves.length + counter['recovery'] < 3) rejected = true;
					if (counter['priority']) rejected = true;
					if (hasMove['trickroom'] || (teamDetails.trickroom && template.baseStats.spe <= 50)) rejected = true;
					if (!rejected) {
						isSetup = true;
						hasZ = true;
					}
					break;
					
				// Trapping moves
				case 'bind': case 'clamp': case 'firespin': case 'infestation': case 'sandtomb': case 'whirlpool': case 'wrap':
					if (counter['trap'] > 1) rejected = true;
					if (counter.setupType && !counter['recovery'] && !hasMove['rest']) rejected = true;
					break;
				case 'block': case 'meanlook': case 'spiderweb':
					if (counter['trap'] > 1) rejected = true;
					if (!hasMove['perishsong'] && !hasMove['toxic'] && !hasMove['spite']) rejected = true;
					break;
					
				// Hazards
				case 'stealthrock': case 'toxicspikes': case 'spikes': case 'stickyweb':
					let setterMax = (moveid === 'spikes') ? 2 : 1;
					if (counter.setupType || hasMove['rest'] && hasMove['sleeptalk'] || teamDetails[moveid] >= setterMax) rejected = true;
					break;
				case 'defog':
					if (counter.setupType || counter['hazards'] || hasMove['rest'] && hasMove['sleeptalk'] || teamDetails.hazardClear > 1) rejected = true;
					break;
				case 'rapidspin':
					if (counter.setupType || hasMove['rest'] && hasMove['sleeptalk'] || teamDetails.hazardClear > 1) rejected = true;
					break;
					
				// Screens
				case 'reflect': case 'lightscreen':
					break;
				case 'auroraveil':
					if (!hasAbility['Snow Warning'] && !hasMove['hail'] && teamDetails.weather !== 'hail') rejected = true;
					break;
				case 'safeguard':
					if (hasMove['destinybond']) rejected = true;
					break;
					
				// Weather
				case 'raindance':
					if (hasZ || teamDetails.zMove || counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasAbility['Swift Swim'] && !hasAbility['Dry Skin'] && !hasAbility['Rain Dish'] && !hasMove['thunder']) rejected = true;
					if (teamDetails.weather === 'rain' || (hasAbility['Hydration'] && hasMove['rest'] && !hasMove['sleeptalk']) || template.baseSpecies === 'Castform') rejected = false;
					if (teamDetails.weather && teamDetails.weather !== 'rain') rejected = true;
					break;
				case 'sunnyday':
					if (hasZ || teamDetails.zMove || counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasAbility['Chlorophyll'] && !hasAbility['Flower Gift'] && !hasMove['solarbeam']) rejected = true;
					if (teamDetails.weather === 'sun' || template.baseSpecies === 'Castform') rejected = false;
					if (teamDetails.weather && teamDetails.weather !== 'sun') rejected = true;
					break;
				case 'hail':
					if (hasZ || teamDetails.zMove || counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasAbility['Slush Rush'] && !hasAbility['Ice Body'] && !(hasType['Ice'] && hasMove['blizzard'])) rejected = true;
					if (teamDetails.weather === 'hail' || template.baseSpecies === 'Castform') rejected = false;
					if (teamDetails.weather && teamDetails.weather !== 'hail') rejected = true;
					break;
				case 'sandstorm':
					if (hasZ || teamDetails.zMove || counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasAbility['Sand Rush'] && !hasAbility['Sand Force']) rejected = true;
					if (teamDetails.weather === 'sand') rejected = false;
					if (teamDetails.weather && teamDetails.weather !== 'sand') rejected = true;
					break;
					
				// Trick Room
				case 'trickroom':
					if (hasMove['lightscreen'] || hasMove['reflect']) rejected = true;
					if (counter.setupType || !!counter['speedsetup'] || counter.damagingMoves.length < 2) rejected = true;
					if (teamDetails.trickroom) rejected = false;
					break;
					
				// Terrain
				case 'electricterrain':
					if (!counter['Electric'] || counter.weather) rejected = true;
					break;
				case 'psychicterrain':
					if (!counter['Psychic'] || hasMove['counter'] || counter.weather) rejected = true;
					break;
					
				// Status-inducing moves (accurate sleep > burn > toxic > para > inaccurate sleep)
				case 'darkvoid': case 'grasswhistle': case 'hypnosis': case 'sing':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (hasMove['stunspore'] || hasMove['thunderwave'] || hasMove['glare'] || hasMove['nuzzle'] || hasMove['toxic'] || hasMove['willowisp']) rejected = true;
					break;
				case 'stunspore': case 'thunderwave': case 'glare': case 'nuzzle':
					if (counter.setupType || counter['speedsetup']) rejected = true;
					if (hasMove['discharge'] || hasMove['bodyslam'] || hasMove['gyroball'] || hasMove['trickroom']) rejected = true;
					if (hasMove['toxic'] || hasMove['willowisp'] || hasMove['spore'] || hasMove['sleeppowder'] || hasMove['lovelykiss']) rejected = true;
					break;
				case 'toxic':
					if (counter.setupType) rejected = true;
					if (hasMove['willowisp'] || hasMove['poisonfang'] || hasMove['spore'] || hasMove['sleeppowder'] || hasMove['lovelykiss'] || hasMove['toxicspikes']) rejected = true;
					break;
				case 'willowisp':
					if (counter.setupType) rejected = true;
					if (hasMove['scald'] || hasMove['sacredfire'] || hasMove['steameruption'] || hasMove['spore'] || hasMove['sleeppowder'] || hasMove['lovelykiss']) rejected = true;
					break;
				case 'spore': case 'sleeppowder': case 'lovelykiss':
					break;
					
				// Confusion-inducing moves
				// only reason to confuse is stall
				case 'confuseray': case 'sweetkiss':
					rejected = true;
					if (template.species === 'regigigas') rejected = false;
					if (hasMove['toxic'] || hasMove['glare'] || hasMove['thunderwave'] || hasMove['nuzzle'] || hasMove['substitute']) rejected = false;
					break;
					
				// Recovery (wish > instant recovery > rest)
				case 'rest':
					if (tempMovePool.includes('sleeptalk') && !hasAbility['Hydration']) rejected = true;
					if (hasAbility['Hydration'] && !hasMove['raindance']) rejected = true;
					if (!hasMove['sleeptalk'] && template.nfe && template.baseStats.hp + template.baseStats.def + template.baseStats.spd < 200) rejected = true;
					if (hasMove['perishsong'] || hasMove['forestscurse']) rejected = false;
					if (hasMove['sleeptalk'] && counter.priority) rejected = true;
					if (hasMove['sleeptalk'] && !counter.setupType && !counter['defensesetup'] && counter.damagingMoves.length < 2) rejected = true;
					if (!hasMove['sleeptalk'] && template.nfe && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 200 && !hasAbility['Guts']) rejected = false;
					if (counter.recovery || hasMove['painsplit'] || hasMove['wish']) rejected = true;
					break;
				case 'healorder': case 'milkdrink': case 'moonlight': case 'morningsun': case 'shoreup': case 'slackoff': case 'recover': case 'roost': case 'softboiled': case 'synthesis':
				case 'painsplit': case 'strengthsap':
					if (hasMove['leechseed'] || hasMove['wish']) rejected = true;
					if (['moonlight', 'morningsun', 'synthesis'].includes(moveid) && teamDetails.weather && teamDetails.weather !== 'sun') rejected = true;
					break;
				case 'psychup':
					if (teamDetails.zMove || hasZ || hasMove['rest'] || hasMove['wish'] || counter.recovery) rejected = true;
					if (!rejected) hasZ = true;
					break;
				case 'wish':
					break;
					
				// Status-curing moves
				case 'healbell': case 'aromatherapy':
					if (hasAbility['Hydration'] && hasMove['raindance'] && hasMove['rest']) rejected = true;
					break;
					
				// Sleep Talk (only be used with Rest + 2 suitable moves OR as Z-Sleep Talk on Komala)
				case 'sleeptalk':
					if (!hasMove['rest']) rejected = true;
					if (hasAbility['Comatose'] && !teamDetails.zMove && !hasZ && counter.damagingMoves.length >= 3) rejected = false;
					if (hasMove['cottonguard']) rejected = true;
					if (counter.priority) rejected = true;
					if (!rejected && hasAbility['Comatose']) hasZ = true;
					break;
					
				// Phazing moves / haze
				case 'roar': case 'whirlwind':
					if (counter.setupType || counter['speedsetup']) rejected = true;
					if (hasMove['dragontail'] || hasMove['circlethrow'] || hasMove['leechseed'] || hasMove['encore'] || hasMove['perishsong'] || counter['trap']) rejected = true;
					break;
				case 'circlethrow': case 'dragontail':
					if (counter.setupType && !(hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (counter['speedsetup'] || hasMove['encore'] || hasMove['perishsong'] || counter['trap']) rejected = true;
					break;
				case 'haze':
					if (hasMove['foulplay']) rejected = true;
					if (counter.setupType || counter['speedsetup'] || counter['defensesetup'] || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (hasMove['stickyweb']) rejected = true;
					break;
					
				// Moves that need other moves/items/abilities to be useful at all
				case 'endeavor':
					if (slot > 0) rejected = true;
					if (!counter.setupType && counter.damagingMoves.length <= 2) rejected = false;
					if (counter['recovery'] || hasMove['wish'] || hasMove['rest']) rejected = true;
					break;
				case 'endure':
					if (!hasMove['reversal'] || hasMove['substitute']) rejected = true;
					break;
				case 'focuspunch':
					if (!hasMove['substitute'] || counter.damagingMoves.length < 2) rejected = true;
					break;
				case 'foresight': case 'odorsleuth':
					if (!hasMove['rapidspin']) rejected = true;
					break;
				case 'perishsong':
					if (!hasMove['protect'] && !counter.recovery && !hasMove['rest']) rejected = true;
					if (!counter['trap']) rejected = true;
					break;
				case 'reversal':
					if (!hasMove['substitute']) rejected = true;
					if (!teamDetails.zMove && !hasZ) {
						rejected = false;
						hasZ = true;
					}
					break;
				case 'storedpower':
					if (!counter.setupType && !counter['defensesetup']) rejected = true;
					break;
				case 'weatherball':
					if (!counter.weather) rejected = true;
					break;
				
				// Z-moves only
				case 'bounce': case 'dig': case 'fly':
					if (teamDetails.zMove || hasZ || counter.setupType !== 'Physical') rejected = true;
					if (!rejected) hasZ = true;
					break;
				case 'gigaimpact': case 'hyperbeam':
					if (teamDetails.zMove || hasZ || !counter.setupType) rejected = true;
					if (hasAbility['Truant']) rejected = false;
					if (!rejected && !hasAbility['Truant']) hasZ = true;
					break;
				case 'solarbeam':
					if (!hasAbility['Drought'] && !hasMove['sunnyday']) rejected = true;
					if (!teamDetails.zMove && !hasZ && !counter['Grass'] && !hasType['Grass']) {
						rejected = false;
						hasZ = true;
					}
					break;
				case 'zapcannon':
					if (teamDetails.zMove || hasZ) rejected = true;
					if (hasMove['facade']) rejected = true; // for Flareon
					if (!rejected) hasZ = true;
					break;
					
				// Volt turn (U-turn > Volt Switch > Parting Shot)
				case 'partingshot':
					if (counter.setupType || counter['speedsetup']) rejected = true;
					if (hasMove['uturn'] || hasMove['voltswitch']) rejected = true;
					break;
				case 'voltswitch':
					if (counter.setupType || counter['speedsetup']) rejected = true;
					if (hasMove['uturn']) rejected = true;
					break;
				case 'uturn':
					if (counter.setupType || counter['speedsetup']) rejected = true;
					break;
					
				// Attack moves that don't take attack stats into account
				case 'foulplay':
					if (counter.setupType || counter['speedsetup']) rejected = true;
					if (counter.damagingMoves.length > 2) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (counter.damagingMoves.length - 1 === counter['priority']) rejected = true;
					break;
				case 'nightshade': case 'seismictoss': case 'superfang': case 'psywave':
					if (counter.setupType || counter['speedsetup']) rejected = true;
					if (counter.damagingMoves.length > 2) rejected = true;
					if ((moveid === 'seismictoss' || moveid === 'superfang') && (counter['Fighting'] + counter['Normal'] > 0 || hasMove['nightshade'])) rejected = true;
					if (moveid === 'superfang' && hasMove['seismictoss']) rejected = true;
					if (moveid === 'nightshade' && counter['Ghost'] > 0) rejected = true;
					if (moveid === 'psywave' && (counter['Psychic'] > 0 || hasMove['seismictoss'])) rejected = true;
					break;
					
				// Protect
				case 'protect':
					if (counter.setupType && !hasMove['wish']) rejected = true;
					if (counter.damagingMoves.length > 2) rejected = true;
					if (hasMove['rest'] || hasMove['lightscreen'] && hasMove['reflect']) rejected = true;
					break;
				case 'banefulbunker':
					if (hasMove['spikyshield']) rejected = true;
					break;
				case 'spikyshield':
					break;
					
				// Other status moves
				case 'leechseed':
					if (counter.setupType || counter['speedsetup']) rejected = true;
					if (hasMove['dragontail'] || hasMove['roar'] || hasMove['whirlwind']) rejected = true;
					break;
				case 'substitute':
					if (hasMove['dracometeor'] || (hasMove['leafstorm'] && !hasAbility['Contrary'])) rejected = true;
					if (hasMove['rest'] || hasMove['taunt']) rejected = true;
					if (hasMove['uturn'] || hasMove['voltswitch'] || hasMove['partingshot']) rejected = true;
					if (hasMove['counter'] || hasMove['mirrorcoat'] || hasMove['metalburst']) rejected = true;
					break;
				case 'switcheroo': case 'trick':
					if (counter.Physical + counter.Special < 3 || counter.setupType || counter['speedsetup']) rejected = true;
					if (hasMove['acrobatics'] || hasMove['suckerpunch']) rejected = true;
					if (hasAbility['Klutz']) rejected = false; // for Lopunny
					break;
				case 'taunt': case 'encore': case 'disable':
					if (hasMove['sleeptalk']) rejected = true;
					break;
				case 'yawn':
					if (hasMove['toxic'] || hasMove['willowisp'] || hasMove['thunderwave']) rejected = true;
					break;
				case 'tailwind':
					if (counter['speedsetup']) rejected = true;
					break;
				case 'healingwish': case 'memento':
					if (counter.setupType || counter['recovery'] || hasMove['wish'] || hasMove['substitute'] || hasMove['destinybond']) rejected = true;
					break;
				case 'destinybond':
					if (hasMove['substitute']) rejected = true;
					break;
				case 'magiccoat':
					if (hasMove['facade'] || hasMove['rest']) rejected = true;
					break;
				case 'soak':
					if (!hasMove['toxic']) rejected = true;
					break;
				case 'screech':
					if (counter.Physical < 3) rejected = true;
					break;
				case 'magnetrise':
					if (hasMove['voltswitch']) rejected = true;
					break;
				case 'assist':
					break;
				case 'spite':
					if ((hasMove['soak'] && hasMove['toxic']) || !hasMove['block']) rejected = true;
					break;

				// Bad after setup
				case 'fakeout':
					if (counter.setupType || hasMove['substitute'] || hasMove['switcheroo'] || hasMove['trick']) rejected = true;
					break;
				case 'waterspout':
					if (counter.setupType || !!counter['speedsetup'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'pursuit':
					if (counter.setupType || (hasMove['rest'] && hasMove['sleeptalk']) || counter['Dark'] > 2 || (hasMove['knockoff'] && !hasType['Dark'])) rejected = true;
					break;

				// Bit redundant to have both
				// Attacks:
				case 'bugbite': case 'bugbuzz': case 'signalbeam':
					if (hasMove['uturn'] && !counter.setupType) rejected = true;
					if (hasMove['xscissor']) rejected = true;
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
				case 'thief':
					if ((hasMove['darkpulse'] || hasMove['foulplay'] || hasMove['pursuit']) && counter.setupType !== 'Physical') rejected = true;
					if (hasMove['suckerpunch']) rejected = true;
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
				case 'discharge':
					if (hasMove['thunderbolt'] && !isDoubles) rejected = true;
					break;
				case 'thunder':
					if ((hasMove['thunderbolt'] || tempMovePool.includes('thunderbolt')) && !hasMove['raindance']) rejected = true;
					if (hasMove['sunnyday']) rejected = true;
					break;
				case 'thunderbolt':
					if ((hasMove['discharge'] && isDoubles) || (hasMove['raindance'] && hasMove['thunder']) || (hasMove['voltswitch'] && hasMove['wildcharge'])) rejected = true;
					if (hasMove['thunderfang'] && counter.setupType === 'Physical') rejected = true;
					break;
				case 'thunderfang':
					if ((hasMove['thunderbolt'] || tempMovePool.includes('thunderbolt')) && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'thunderpunch':
					if (hasAbility['Galvanize'] && !!counter['Normal']) rejected = true;
					if (hasMove['thunder'] && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'wildcharge':
					if (hasMove['thunderbolt'] && !hasMove['voltswitch']) rejected = true;
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
					if (hasAbility['Contrary']) isSetup = true;
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
					if (moveid === 'firepunch' && counter.setupType !== 'Physical' && hasMove['flamethrower']) rejected = true;
					break;
				case 'fireblast': case 'magmastorm':
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
					if (hasMove['memento']) rejected = true;
					break;
				case 'airslash':
					if (hasMove['acrobatics'] || hasMove['bravebird']) rejected = true;
					if (hasMove['hurricane'] && !tempMovePool.includes('raindance') && !hasMove['sunnyday']) rejected = true;
					break;
				case 'bravebird':
					if (hasMove['hurricane'] && hasMove['raindance']) rejected = true;
					break;
				case 'hurricane':
					if (tempMovePool.includes('raindance')) rejected = true;
					if ((hasMove['bravebird'] || hasMove['acrobatics']) && !hasMove['raindance']) rejected = true;
					if (hasMove['sunnyday']) rejected = true;
					break;
				case 'hex':
					if (hasMove['shadowball'] && !hasMove['willowisp']) rejected = true;
					break;
				case 'shadowball':
					if (hasMove['hex'] && hasMove['willowisp']) rejected = true;
					break;
				case 'shadowclaw':
					if (hasMove['phantomforce'] || hasMove['shadowforce'] || hasMove['shadowsneak']) rejected = true;
					if (hasMove['shadowball'] && counter.setupType !== 'Physical') rejected = true;
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
				case 'powerwhip':
					if ((hasAbility['Drought'] || hasMove['sunnyday']) && hasMove['solarbeam']) rejected = true;
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
				case 'blizzard':
					if (hasMove['icebeam'] && !teamDetails['hail']) rejected = true;
					break;
				case 'icebeam':
					if (hasMove['blizzard'] && teamDetails['hail'] || hasMove['freezedry']) rejected = true;
					break;
				case 'iceshard':
					if (hasMove['freezedry']) rejected = true;
					break;
				case 'icywind':
					if (hasMove['icebeam']) rejected = true;
					break;
				case 'frostbreath': // added z-move check for Glaceon
					if ((hasMove['icebeam'] || hasMove['blizzard'] || hasMove['freezedry']) && !teamDetails.zMove) rejected = true;
					break;
				case 'bodyslam':
					if (hasMove['glare'] && hasMove['headbutt'] || hasMove['doubleedge']) rejected = true;
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
				case 'gigaimpact':
					if (hasMove['doubleedge'] || hasMove['return']) rejected = true;
					break;
				case 'hiddenpower':
					if (hasMove['rest'] || (!counter.stab && counter.damagingMoves.length < 2) || counter[move.type] > 1) rejected = true;
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
					if (hasMove['bodyslam'] || hasMove['doubleedge'] || hasMove['headcharge'] || hasMove['headbutt']) rejected = true;
					break;
				case 'acidspray':
					if (hasMove['sludgebomb'] || counter.Special < 2) rejected = true;
					break;
				case 'poisonjab':
					if (hasMove['gunkshot']) rejected = true;
					if ((hasMove['sludgewave'] || hasMove['sludgebomb']) && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'sludgewave':
					if (hasMove['poisonjab']) rejected = true;
					break;
				case 'sludgebomb':
					if (hasMove['sludgewave']) rejected = true;
					break;
				case 'photongeyser': case 'psychic':
					if (hasMove['psyshock'] || counter.setupType === 'Special' && hasMove['storedpower']) rejected = true;
					break;
				case 'psychocut': case 'zenheadbutt':
					if ((hasMove['psychic'] || hasMove['psyshock']) && counter.setupType !== 'Physical') rejected = true;
					if (hasAbility['Contrary'] && !counter.setupType && !!counter['physicalpool']) rejected = true;
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
				case 'headsmash': case 'powergem':
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
					break;
				case 'bulletpunch':
					if (hasType['Steel'] && counter.stab < 2 && !hasAbility['Adaptability'] && !hasAbility['Technician']) rejected = true;
					break;
				case 'flashcannon':
					if ((hasMove['ironhead'] || hasMove['meteormash'] || hasMove['gyroball']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'gyroball':
					if ((hasMove['ironhead'] || hasMove['meteormash']) && template.baseStats.spe > 30) rejected = true;
					if (hasMove['flashcannon'] && counter.setupType === 'Special') rejected = true;
					if (counter['speedsetup']) rejected = true;
					break;
				case 'ironhead': case 'meteormash':
					if (hasMove['gyroball'] && template.baseStats.spe <= 30) rejected = true;
					if (hasMove['flashcannon'] && counter.setupType === 'Special') rejected = true;
					break;
				case 'hydropump':
					if (hasMove['liquidation'] || hasMove['razorshell'] || hasMove['waterfall'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['scald'] && (counter.Special < 4 || template.types.length > 1 && counter.stab < 3)) rejected = true;
					break;
				case 'originpulse': case 'surf':
					if (hasMove['hydropump'] || hasMove['scald'] || hasMove['waterfall'] || hasMove['liquidation']) rejected = true;
					break;
				case 'scald':
					if (hasMove['liquidation'] || hasMove['waterfall'] || hasMove['waterpulse']) rejected = true;
					break;
				case 'waterfall':
					if (hasMove['liquidation']) rejected = true;
					break;

				// Status:
				case 'electroweb':
					if (counter.setupType || !!counter['speedsetup'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['discharge'] || hasMove['gyroball'] || hasMove['spore'] || hasMove['toxic'] || hasMove['trickroom'] || hasMove['yawn']) rejected = true;
					break;
				case 'powersplit':
					if (hasMove['guardsplit']) rejected = true;
					break;
				case 'featherdance':
					if (hasMove['foulplay'] || hasMove['haze']) rejected = true;
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
				
				// Force Pyukumuku to have Toxic
				if (template.id === 'pyukumuku' && !hasMove['toxic']) {
					rejected = true;
				}
				
				// Give slightly more chance to have hazard removal (around 1/3 chance to reroll for it if exists in movepool)
				if ((tempMovePool.includes('defog') || tempMovePool.includes('rapidspin')) && !teamDetails.hazardClear && this.randomChance(1, 10)) {
					rejected = true;
				}
				
				// Weather/movetype incompatibility
				if (move.type === 'Fire' && hasMove['raindance'] || move.type === 'Water' && hasMove['sunnyday']) {
					rejected = true;
				}
				
				// No more than one weather move
				if (weatherMoves.includes(moveid) && counter['weather'] > 1) {
					rejected = true;
				}
				
				// Force weather move if team needs it
				if (weatherMoves.filter(move => tempMovePool.includes(move)).length && this.randomChance(1, 5)) {
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
				if (!rejected && template.species !== 'Pyukumuku' && template.species !== 'Smeargle' &&
					(counter['physicalsetup'] + counter['specialsetup'] < 2 && (!counter.setupType || counter.setupType === 'Mixed' || (move.category !== counter.setupType && move.category !== 'Status') || counter[counter.setupType] + counter.Status > 3)) &&
					((counter.damagingMoves.length === 0 && !hasMove['metalburst']) ||
					(!counter.stab && (template.types.length > 1 || (template.types[0] !== 'Normal' && template.types[0] !== 'Psychic') || !hasMove['icebeam'] || template.baseStats.spa >= template.baseStats.spd) && (!!counter['physicalpool'] || !!counter['specialpool']) && !hasMove['foulplay']) ||
					(hasType['Bug'] && (tempMovePool.includes('megahorn') || tempMovePool.includes('pinmissile') || (hasType['Flying'] && !hasMove['hurricane'] && tempMovePool.includes('bugbuzz')))) ||
					((hasType['Dark'] && !counter['Dark']) || hasMove['suckerpunch'] && !hasAbility['Contrary'] && counter.stab < template.types.length) ||
					(hasType['Dragon'] && !counter['Dragon'] && !hasAbility['Aerilate'] && !hasAbility['Pixilate'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Electric'] && !counter['Electric'] && !hasAbility['Galvanize']) ||
					(hasType['Fairy'] && !counter['Fairy'] && (!!counter['speedsetup'] || !counter['Status'])) ||
					(hasType['Fighting'] && !counter['Fighting'] && (counter.setupType || !counter['Status'])) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Ghost'] && !hasType['Dark'] && !counter['Ghost'] && !hasAbility['Steelworker'] && !hasMove['foulplay']) ||
					(hasType['Grass'] && !hasType['Fairy'] && !hasType['Poison'] && !hasType['Steel'] && !counter['Grass']) ||
					(hasType['Ground'] && !counter['Ground'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Ice'] && !counter['Ice'] && !hasAbility['Refrigerate']) ||
					(hasType['Psychic'] && !!counter['Psychic'] && !hasType['Flying'] && !hasAbility['Pixilate'] && template.types.length > 1 && counter.stab < 2) ||
					(hasType['Rock'] && !counter['Rock'] && counter.setupType === 'Physical') ||
					(((hasType['Steel'] && hasAbility['Technician']) || hasAbility['Steelworker']) && !counter['Steel']) ||
					(hasType['Water'] && (!counter['Water'] || !counter.stab) && !hasAbility['Protean'] && !hasMove['willowisp']) ||
					((hasAbility['Adaptability'] && !counter.setupType && template.types.length > 1 && (!counter[template.types[0]] || !counter[template.types[1]])) ||
					((hasAbility['Aerilate'] || (hasAbility['Galvanize'] && !counter['Electric']) || hasAbility['Pixilate'] || (hasAbility['Refrigerate'] && !hasMove['blizzard'])) && !counter['Normal']) ||
					(hasAbility['Contrary'] && !counter['contrary'] && template.species !== 'Shuckle') ||
					(hasAbility['Gale Wings'] && !counter['Flying']) ||
					(hasAbility['Guts'] && hasType['Normal'] && tempMovePool.includes('facade')) ||
					(hasAbility['Psychic Surge'] && !counter['Psychic']) ||
					(hasAbility['Slow Start'] && tempMovePool.includes('substitute')) ||
					(hasAbility['Stance Change'] && !counter.setupType && tempMovePool.includes('kingsshield')) ||
					(template.requiredMove && tempMovePool.includes(toId(template.requiredMove)))))) {
					// Reject Status or non-STAB
					if (!isSetup && !move.weather && moveid !== 'judgment' && moveid !== 'rest' && moveid !== 'sleeptalk' && !hasMove['perishsong']) {
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
					// Adaptability, Contrary, Hustle, Iron Fist, Skill Link, Strong Jaw, Serene Grace
					rejectAbility = !counter[toId(ability)];
				} else if (ateAbilities.includes(ability)) {
					rejectAbility = !counter['Normal'];
				} else if (ability === 'Blaze') {
					rejectAbility = !counter['Fire'];
				} else if (ability === 'Chlorophyll') {
					rejectAbility = !hasMove['sunnyday'] && teamDetails.weather !== 'sun';
				} else if (ability === 'Competitive') {
					rejectAbility = !counter['Special'];
				} else if (ability === 'Compound Eyes' || ability === 'No Guard') {
					rejectAbility = !counter['inaccurate'];
				} else if (ability === 'Defiant' || ability === 'Moxie') {
					rejectAbility = !counter['Physical'];
				} else if (ability === 'Flare Boost' || ability === 'Moody' || ability === 'Innards Out') {
					rejectAbility = true;
				} else if (ability === 'Gluttony') {
					rejectAbility = !hasMove['bellydrum'];
				} else if (ability === 'Hydration' || ability === 'Rain Dish' || ability === 'Swift Swim') {
					rejectAbility = !hasMove['raindance'] && teamDetails.weather !== 'rain';
				} else if (ability === 'Ice Body' || ability === 'Slush Rush' || ability === 'Snow Cloak') {
					rejectAbility = !hasMove['hail'] && teamDetails.weather !== 'hail';
				} else if (ability === 'Leaf Guard') {
					rejectAbility = teamDetails.weather !== 'sun';
				} else if (ability === 'Lightning Rod') {
					rejectAbility = template.types.includes('Ground');
				} else if (ability === 'Limber') {
					rejectAbility = template.types.includes('Electric');
				} else if (ability === 'Liquid Voice') {
					rejectAbility = !hasMove['hypervoice'];
				} else if (ability === 'Oblivious') {
					rejectAbility = !counter.Status;
				} else if (ability === 'Overcoat') {
					rejectAbility = abilities.includes('Sturdy');
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
					rejectAbility = teamDetails.weather !== 'sand';
				} else if (ability === 'Sand Rush') {
					rejectAbility = !hasMove['sandstorm'] && teamDetails.weather !== 'sand';
				} else if (ability === 'Scrappy') {
					rejectAbility = !template.types.includes('Normal');
				} else if (ability === 'Sheer Force') {
					rejectAbility = !counter['sheerforce'] || template.isMega || (abilities.includes('Iron Fist') && counter['ironfist'] > counter['sheerforce']) || hasMove['flamecharge'] || hasMove['poweruppunch'] || hasMove['chargebeam'];
				} else if (ability === 'Simple') {
					rejectAbility = !counter.setupType && !hasMove['cosmicpower'] && !hasMove['flamecharge'];
				} else if (ability === 'Snow Warning') {
					rejectAbility = hasMove['hypervoice'];
				} else if (ability === 'Solar Power') {
					rejectAbility = !counter['Special'] || template.isMega;
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

			if (abilities.includes('Chlorophyll') && (hasMove['sunnyday'] || teamDetails.weather === 'sun')) {
				ability = 'Chlorophyll';
			}
			if (abilities.includes('Galvanize') && !!counter['Normal']) {
				ability = 'Galvanize';
			}
			if (abilities.includes('Guts') && ability !== 'Quick Feet' && (hasMove['facade'] || hasMove['protect'] || (hasMove['rest'] && hasMove['sleeptalk']))) {
				ability = 'Guts';
			}
			if (abilities.includes('Hydration') && !hasMove['sleeptalk'] && (hasMove['raindance'] || teamDetails.weather === 'rain')) {
				ability = 'Hydration';
			}
			if (abilities.includes('Insomnia') && hasMove['skillswap']) {
				ability = 'Insomnia';
			}
			if (abilities.includes('Marvel Scale') && hasMove['rest'] && hasMove['sleeptalk']) {
				ability = 'Marvel Scale';
			}
			if (abilities.includes('No Guard') && hasMove['dynamicpunch']) {
				ability = 'No Guard';
			}
			if (abilities.includes('Plus') && hasMove['magneticflux']) {
				ability = 'Plus';
			}
			if (abilities.includes('Prankster') && counter.Status > 1) {
				ability = 'Prankster';
			}
			if (abilities.includes('Sand Rush') && (hasMove['sandstorm'] || teamDetails.weather === 'sand')) {
				ability = 'Sand Rush';
			}
			if (abilities.includes('Slush Rush') && (hasMove['hail'] || teamDetails.weather === 'hail')) {
				ability = 'Slush Rush';
			}
			if (abilities.includes('Swift Swim') && (hasMove['raindance'] || teamDetails.weather === 'rain')) {
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
			} else if (template.species === 'Unfezant') {
				ability = 'Super Luck';
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
			if (template.baseSpecies === 'Arceus' && (hasMove['judgment'] || !counter[template.types[0]] || teamDetails.zMove)) {
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
		} else if (template.species === 'Genesect' && hasMove['technoblast']) {
			item = 'Douse Drive';
			species = 'Genesect-Douse';
		} else if (template.species === 'Kadabra') {
			item = (hasMove['counter']) ? 'Focus Sash' : 'Life Orb';
		} else if (template.species === 'Komala' && hasMove['sleeptalk']) {
			item = this.randomChance(3, 5) ? 'Choice Scarf' : 'Choice Band';
		} else if (template.species === 'Kommo-o' && !teamDetails.zMove) {
			item = hasMove['clangingscales'] ? 'Kommonium Z' : 'Dragonium Z';
		} else if (template.baseSpecies === 'Lycanroc' && hasMove['stoneedge'] && counter.setupType && !teamDetails.zMove && !hasMove['endeavor']) {
			item = 'Lycanium Z';
		} else if (template.species === 'Marshadow' && hasMove['spectralthief'] && counter.setupType && !teamDetails.zMove) {
			item = 'Marshadium Z';
		} else if (template.species === 'Mimikyu' && hasMove['playrough'] && counter.setupType && !teamDetails.zMove) {
			item = 'Mimikium Z';
		} else if (['Necrozma-Dusk-Mane', 'Necrozma-Dawn-Wings'].includes(template.species) && !teamDetails.zMove) {
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
		} else if (template.species === 'Shedinja') {
			item = this.randomChance(2, 3) ? 'Focus Sash' : 'Lum Berry';
		} else if (template.species === 'Slaking') {
			item = counter.Physical >= 4 ? 'Choice Band' : 'Life Orb';
		} else if (template.species === 'Smeargle') {
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
		} else if ((hasMove['conversion'] || hasMove['mefirst'] || hasMove['celebrate'] || hasMove['happyhour'] || hasMove['psychup']) && !teamDetails.zMove) {
			item = 'Normalium Z';
		} else if (hasMove['forestscurse'] && !teamDetails.zMove) {
			item = 'Grassium Z';
		} else if (hasMove['trickortreat'] && !teamDetails.zMove) {
			item = 'Ghostium Z';
		} else if ((hasMove['snatch'] || hasMove['memento']) && !teamDetails.zMove) {
			item = 'Darkinium Z';
		} else if (hasMove['zapcannon'] && !teamDetails.zMove) {
			item = 'Electrium Z';
		} else if (hasMove['healblock'] && !teamDetails.zMove) {
			item = 'Psychium Z';
		} else if (['Latias', 'Latios'].includes(template.species) && counter['Psychic'] + counter['Dragon'] >= 2) {
			item = 'Soul Dew';
		} else if (hasMove['bellydrum']) {
			if (ability === 'Gluttony') {
				item = this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki']) + ' Berry';
			} else if (template.baseStats.spe <= 50 && !teamDetails.zMove && this.randomChance(2, 3)) {
				item = 'Normalium Z';
			} else {
				item = 'Sitrus Berry';
			}
		} else if (hasMove['dig'] && !teamDetails.zMove) {
			item = 'Groundium Z';
		} else if (hasMove['fleurcannon'] && !!counter['speedsetup'] && !teamDetails.zMove) {
			item = 'Fairium Z';
		} else if (hasMove['electricterrain']) {
			item = !teamDetails.zMove ? 'Electrium Z' : (this.randomChance(1, 2) ? 'Electric Seed' : 'Terrain Extender');
		} else if (hasMove['psychicterrain']) {
			item = !teamDetails.zMove ? 'Psychium Z' : (this.randomChance(1, 2) ? 'Psychic Seed' : 'Terrain Extender');
		} else if ((hasMove['gigaimpact'] || hasMove['hyperbeam']) && ability !== 'Truant' && !teamDetails.zMove) {
			item = 'Normalium Z';
		} else if ((hasMove['magmastorm'] || hasMove['mindblown'] && !!counter['Status']) && !teamDetails.zMove) {
			item = 'Firium Z';
		} else if ((hasMove['fly'] || (hasMove['hurricane'] && template.baseStats.spa >= 95) || ((hasMove['bounce'] || (hasAbility['Gale Wings'] && hasMove['bravebird'])) && counter.setupType) || hasMove['mirrormove']) && !teamDetails.zMove) {
			item = 'Flyinium Z';
		} else if (hasMove['skyattack']) {
			item = (ability === 'Unburden' || teamDetails.zMove) ? 'Power Herb' : 'Flyinium Z';
		} else if (hasMove['tailwind'] && ['Sniper', 'Super Luck'].includes(ability) && !teamDetails.zMove) {
			item = 'Flyinium Z';
		} else if (hasMove['solarbeam'] && !hasAbility['Drought'] && !hasMove['sunnyday'] && teamDetails['sun']) {
			item = !teamDetails.zMove ? 'Grassium Z' : 'Power Herb';
		} else if (hasMove['shellsmash'] && ability !== 'Contrary') {
			item = (ability === 'Solid Rock' && counter['priority']) ? 'Weakness Policy' : 'White Herb';
		} else if (ability === 'Harvest') {
			item = hasMove['rest'] ? 'Lum Berry' : 'Sitrus Berry';
		} else if (ability === 'Slow Start') {
			item = 'Leftovers';
		} else if (['Poison Heal', 'Toxic Boost'].includes(ability)) {
			item = 'Toxic Orb';
		} else if (hasMove['rest'] && !hasMove['sleeptalk'] && !hasMove['perishsong'] && !['Natural Cure', 'Shed Skin'].includes(ability)) {
			item = (hasMove['raindance'] && ability === 'Hydration') ? 'Damp Rock' : (template.evos.length && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 200) ? 'Eviolite' : 'Chesto Berry';
		} else if (hasMove['psychoshift'] || (['Guts', 'Quick Feet'].includes(ability) && !hasMove['sleeptalk'])) {
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
		} else if (['Magic Guard', 'Sheer Force'].includes(ability) && counter.damagingMoves.length > 1) {
			item = 'Life Orb';
		} else if (hasMove['raindance'] && (!hasMove['thunder'] || template.baseSpecies === 'Castform')) {
			if (template.baseSpecies === 'Castform' && !teamDetails.zMove) {
				item = 'Waterium Z';
			} else {
				item = (ability === 'Swift Swim' && counter.Status < 2) ? 'Life Orb' : 'Damp Rock';
			}
		} else if (hasMove['sunnyday'] && (!hasMove['solarbeam'] || template.baseSpecies === 'Castform')) {
			if (template.baseSpecies === 'Castform' && !teamDetails.zMove) {
				item = 'Firium Z';
			} else {
				item = (ability === 'Chlorophyll' && counter.Status < 2) ? 'Life Orb' : 'Heat Rock';
			}
		} else if (hasMove['hail'] && (!hasMove['blizzard'] || template.baseSpecies === 'Castform')) {
			if (template.baseSpecies === 'Castform' && !teamDetails.zMove) {
				item = 'Icium Z';
			} else {
				item = (ability === 'Slush Rush' && counter.Status < 2) ? 'Life Orb' : 'Icy Rock';
			}
		} else if (hasMove['sandstorm']) {
			item = (['Sand Rush', 'Sand Force'].includes(ability) && counter.Status < 2) ? 'Life Orb' : 'Smooth Rock';
		} else if (hasMove['auroraveil'] || hasMove['lightscreen'] && hasMove['reflect']) {
			item = 'Light Clay';
		} else if (((ability === 'Speed Boost' && !hasMove['substitute']) || (ability === 'Stance Change')) && counter.Physical + counter.Special > 2) {
			item = 'Life Orb';
		} else if (hasType['Grass'] && template.baseStats.spe <= 60 && hasMove['sleeppowder'] && counter.setupType && !teamDetails.zMove) {
			item = 'Grassium Z';
		} else if (counter.Physical >= 4 && !hasMove['bodyslam'] && !hasMove['dragontail'] && !hasMove['fakeout'] && !hasMove['flamecharge'] && !hasMove['rapidspin'] && !hasMove['suckerpunch'] && !hasMove['poweruppunch'] && !counter['trap'] && !isDoubles) {
			item = (template.baseStats.atk >= 80 || ability === 'Huge Power') && template.baseStats.spe >= 60 && template.baseStats.spe <= 98 && !counter['priority'] && this.randomChance(3, 5) ? 'Choice Scarf' : 'Choice Band';
		} else if (counter.Special >= 4 && !hasMove['acidspray'] && !hasMove['chargebeam'] && !hasMove['clearsmog'] && !hasMove['fierydance'] && !hasMove['icywind'] && !counter['trap'] && !isDoubles) {
			item = template.baseStats.spa >= 80 && template.baseStats.spe >= 60 && template.baseStats.spe <= 98 && !counter['priority'] && this.randomChance(3, 5) ? 'Choice Scarf' : 'Choice Specs';
		} else if (((counter.Physical >= 3 && hasMove['defog']) || (counter.Special >= 3 && hasMove['uturn'])) && template.baseStats.spe >= 60 && template.baseStats.spe <= 98 && !counter['priority'] && !hasMove['foulplay'] && !hasMove['icywind'] && this.randomChance(3, 5) && !counter['trap'] && !isDoubles) {
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
		} else if (counter.Status >= 3 && template.baseStats.spe < 80 && !hasMove['sleeptalk'] && !hasMove['protect'] && !hasMove['magiccoat']) {
			item = "Mental Herb";
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
		} else if (this.getEffectiveness('Ground', template) >= 2 && ability !== 'Levitate' && !hasMove['magnetrise']) {
			item = 'Air Balloon';
		} else if (['Iron Barbs', 'Rough Skin'].includes(ability) && this.randomChance(1, 2)) {
			item = 'Rocky Helmet';
		} else if (counter.Physical + counter.Special >= 4 && template.baseStats.spd >= 60 && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 185 && !hasMove['naturepower']) {
			item = 'Assault Vest';
		} else if (counter.damagingMoves.length >= 4 && !counter['damage']) {
			item = (!!counter['Dragon'] || !!counter['Normal'] || (hasMove['suckerpunch'] && !hasType['Dark'])) ? 'Life Orb' : 'Expert Belt';
		} else if (template.species === 'Palkia' && (hasMove['dracometeor'] || hasMove['spacialrend']) && hasMove['hydropump']) {
			item = 'Lustrous Orb';
		} else if (counter.damagingMoves.length >= 3 && !!counter['speedsetup'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 250) {
			item = 'Weakness Policy';
		} else if (slot === 0 && !['Regenerator', 'Sturdy'].includes(ability) && !counter['recoil'] && !counter['recovery'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd < 185) {
			item = 'Focus Sash';

		// This is the "REALLY can't think of a good item" cutoff
		} else if (counter.damagingMoves.length >= 3 && ability !== 'Sturdy' && !hasMove['acidspray'] && !hasMove['dragontail'] && !hasMove['foulplay'] && !hasMove['rapidspin'] && !hasMove['superfang'] && !counter['damage']) {
			item = (template.baseStats.hp + template.baseStats.def + template.baseStats.spd < 185 || !!counter['speedsetup'] || hasMove['trickroom']) ? 'Life Orb' : 'Leftovers';
		} else if (ability === 'Sturdy' && hasMove['explosion'] && !counter['speedsetup']) {
			item = 'Custap Berry';
		} else if (ability === 'Super Luck') {
			item = 'Scope Lens';
		} else if (hasMove['partingshot'] && !teamDetails.zMove) {
			item = 'Darkinium Z';
			
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
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && hasType['Poison']) {
			item = 'Black Sludge';
		}

		let level;

		let levelScale = {
			LC: 100,
			'LC Uber': 100,
			NFE: 100,
			ZU: 100,
		};
		let customScale = {
			// S Rank, new additions
			Swanna: 89,
			
			// A+ Rank
			Combusken: 90, Electivire: 90, Golem: 90, Komala: 90, "Silvally-Dragon": 90,
			
			// A Rank
			Bouffalant: 91, Bronzor: 91, Crustle: 91, Exeggutor: 91, "Gourgeist-Super": 91,
			Mareanie: 91, Pinsir: 91, Rapidash: 91, "Rotom-Fan": 91, "Silvally-Fighting": 91, Torterra: 91,
			
			// A- Rank
			Altaria: 92, Beheeyem: 92, Floatzel: 92, Kadabra: 92, Kecleon: 92, Leafeon: 92, Lickilicky: 92, Mawile: 92, Muk: 92, Pyukumuku: 92,
			"Silvally-Ghost": 92, "Silvally-Water": 92, Simisear: 92,
			
			// B+ Rank
			Dusclops: 93, Granbull: 93, Marowak: 93, Monferno: 93, "Mr. Mime": 93, Pawniard: 93, Poliwrath: 93,
			Raichu: 93, Shiinotic: 93, Silvally: 93, "Silvally-Dark": 93, Simipour: 93, Simisage: 93, Toucannon: 93, Vigoroth: 93,
			
			// B Rank
			Avalugg: 94, Bellossom: 94, Camerupt: 94, Chatot: 94, "Golem-Alola": 94, Machoke: 94,
			"Oricorio-Pom-Pom": 94, Purugly: 94, Sandslash: 94, Sawsbuck: 94, Servine: 94, "Silvally-Ground": 94,
			
			// B- Rank
			Butterfree: 95, Carbink: 95, Cradily: 95, Ditto: 95, Dugtrio: 95, Electrode: 95, Fraxure: 95, Golduck: 95, "Hakamo-o": 95, Jumpluff: 95,
			Oricorio: 95, Metang: 95, Rampardos: 95, Raticate: 95, "Silvally-Grass": 95, "Silvally-Poison": 95,
			
			// C+ Rank
			Armaldo: 96, Basculin: 96, "Basculin-Blue-Striped": 96, Bibarel: 96, Cacturne: 96, Corsola: 96, Drifblim: 96, Dusknoir: 96,
			Furfrou: 96, Glaceon: 96, Grumpig: 96, Huntail: 96, "Lycanroc-Midnight": 96, Misdreavus: 96, Ninjask: 96, Probopass: 96,
			Regice: 96, Regigigas: 96, Relicanth: 96, Shuckle: 96, "Silvally-Electric": 96, Swoobat: 96,
			Volbeat: 96, Wishiwashi: 96, Zebstrika: 96,
			
			// C Rank
			Arbok: 97, Beartic: 97, Duosion: 97, Frogadier: 97, Gabite: 97, "Gourgeist-Small": 97, Hippopotas: 97,
			Lapras: 97, Meowstic: 97, Munchlax: 97, Murkrow: 97, Natu: 97, Noctowl: 97, Quilladin: 97, Smeargle: 97, Stunfisk: 97, Vibrava: 97, Vullaby: 97,
			
			// C- Rank
			Chimecho: 98, Flareon: 98, Gogoat: 98, Trevenant: 98, "Wormadam-Trash": 98,
			
			// Usually Useless
			Ampharos: 99, Gothitelle: 99, Leavanny: 99, Masquerain: 99, "Meowstic-F": 99, Politoed: 99, Shedinja: 99,
			"Silvally-Fire": 99, "Silvally-Ice": 99, "Silvally-Psychic": 99, Slaking: 99, Togetic: 99, Whirlipede: 99, Zweilous: 99,
			
			// Holistic judgement
			Unown: 115,	Wobbuffet: 115, Luvdisc: 110, Spinda: 105, 'Castform-Rainy': 105, 'Castform-Snowy': 105, 'Castform-Sunny': 105,
		};
		let tier = template.tier;
		if (tier.includes('Unreleased') && baseTemplate.tier === 'Uber') {
			tier = 'Uber';
		}
		if (tier.charAt(0) === '(') {
			tier = tier.slice(1, -1);
		}
		level = levelScale[tier] || 88;
		if (customScale[template.name]) level = customScale[template.name];

		// Prepare optimal HP
		let srWeakness = this.getEffectiveness('Rock', template);
		while (evs.hp > 1) {
			let hp = Math.floor(Math.floor(2 * template.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if (hasMove['substitute'] && hasMove['reversal']) {
				// Reversal users should be able to use four Substitutes
				if (hp % 4 > 0) break;
			} else if (hasMove['substitute'] && (item === 'Petaya Berry' || item === 'Sitrus Berry' || ability === 'Power Construct' && item !== 'Leftovers')) {
				// Three Substitutes should activate Petaya Berry for Dedenne
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
		if (!counter.Physical && !hasMove['copycat'] && !hasMove['transform']) {
			evs.atk = 0;
			ivs.atk = 0;
		}
		
		if (ability === 'Beast Boost' && counter.Special < 1) {
			evs.spa = 0;
			ivs.spa = 0;
		}

		if (hasMove['gyroball'] || hasMove['trickroom'] || (teamDetails.trickroom && template.baseStats.spe <= 50)) {
			evs.spe = 0;
			ivs.spe = 0;
		}
		
		// For debug only
		// if (tryCount) evs.spe = tryCount;
		// if (teamDetails.weather === 'sun') evs.spe = 1;
		// if (teamDetails.weather === 'rain') evs.spe = 2;
		// if (teamDetails.weather === 'sand') evs.spe = 3;
		// if (teamDetails.weather === 'hail') evs.spe = 4;
		// if (teamDetails.trickroom) evs.spe = 5;
		// evs.spa = teamDetails.cantrickroom;
		// evs.spd = teamDetails.needtrickroom;

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
			shiny: this.randomChance(1, 256), // upped shiny chance because
		};
	}
	
	randomTeam() {
		let pokemon = [];
		let sets = [];

		const excludedTiers = ['Unreleased', 'Uber', 'OU', 'UUBL', 'UU', 'RUBL', 'RU', 'NUBL', 'NU', 'PUBL', 'PU', 'ZUBL'];
		const allowedNFE = [
			'Kadabra', 'Vigoroth', 'Combusken', 'Misdreavus', 'Monferno',
			'Bronzor', 'Machoke', 'Metang', 'Pawniard', 'Fraxure', 'Hakamo-o', 'Servine', 'Togetic',
			'Dusclops', 'Gabite', 'Mareanie', 'Murkrow', 'Quilladin', 'Vullaby', 'Duosion', 'Munchlax',
			'Natu', 'Vibrava', 'Frogadier',
		];

		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			if (id === "silvallyghost") continue;
			let template = this.getTemplate(id);
			if (template.tier.charAt(0) === '(') {
				template.tier = template.tier.slice(1, -1);
			}
			if (template.gen <= this.gen && !excludedTiers.includes(template.tier) && !template.isNonstandard && template.randomBattleMoves || id === 'exeggutor') {
				pokemonPool.push(id);
			}
		}

		let typeCount = {};
		let typeComboCount = {};
		let baseFormes = {};
		/**@type {RandomTeamsTypes["TeamDetails"]} */
		let teamDetails = {
			zMove: 0,
			sun: 0, rain: 0, sand: 0, hail: 0,
			stealthrock: 0, toxicspikes: 0, stickyweb: 0, spikes: 0, hazardClear: 0,
			cansun: 0, canrain: 0, cansand: 0, canhail: 0,
			needsun: 0, needrain: 0, needsand: 0, needhail: 0,
			cantrickroom: 0, needtrickroom: 0,
		};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;

			// Only certain NFE Pokemon are allowed
			if (template.nfe && !allowedNFE.includes(template.species)) continue;

			// Adjust rate for species with multiple formes
			switch (template.baseSpecies) {
			case 'Silvally':
				if (this.randomChance(15, 16)) continue;
				break;
			case 'Gourgeist':
				if (this.randomChance(3, 4)) continue;
				break;
			case 'Castform': case 'Oricorio': case 'Wormadam':
				if (this.randomChance(2, 3)) continue;
				break;
			case 'Basculin': case 'Meowstic': case 'Golem':
				if (this.randomChance(1, 2)) continue;
				break;
			}

			let types = template.types;

			// Limit 2 of any type
			let skip = false;
			for (const type of types) {
				if (typeCount[type] > 1) {
					skip = true;
					break;
				}
			}
			if (skip) continue;
			
			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			
			// Sand Stream and Snow Warning don't count towards the type combo limit
			if (Object.values(template.abilities).includes('Sand Stream')) {
				typeCombo = 'Sand Stream';
				if (typeCombo in typeComboCount) continue;
			} else if (Object.values(template.abilities).includes('Snow Warning')) {
				typeCombo = 'Snow Warning';
				if (typeCombo in typeComboCount) continue;
			} else {
				if (typeComboCount[typeCombo] >= 1) continue;
			}
			
			// Check if template can summon weather
			if (template.randomBattleMoves.includes('sunnyday')) teamDetails['cansun']++;
			if (template.randomBattleMoves.includes('raindance')) teamDetails['canrain']++;
			if (template.randomBattleMoves.includes('sandstorm') || Object.values(template.abilities).includes('Sand Stream')) teamDetails['cansand']++;
			if (template.randomBattleMoves.includes('hail') || Object.values(template.abilities).includes('Snow Warning')) teamDetails['canhail']++;
			
			// Check if template may need weather
			if (Object.values(template.abilities).includes('Chlorophyll')) teamDetails['needsun']++;
			if (Object.values(template.abilities).includes('Swift Swim')) teamDetails['needrain']++;
			if (Object.values(template.abilities).includes('Sand Rush')) teamDetails['needsand']++;
			if (Object.values(template.abilities).includes('Slush Rush') || template.randomBattleMoves.includes('auroraveil')) teamDetails['needhail']++;
			
			// Check if template can use trick room
			if (template.randomBattleMoves.includes('trickroom')) teamDetails['cantrickroom']++;
			
			// Check if template may want trick room
			if (template.baseStats.spe <= 70) teamDetails['needtrickroom']++;
			
			pokemon.push(template);
			
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
			typeComboCount[typeCombo] = 1;
		}
		
		// Pick a weather for the team
		let weatherSetup = 0;
		for (let weather of ['rain', 'sun', 'sand', 'hail']) {
			if (teamDetails['can' + weather] && teamDetails['need' + weather] && 
				teamDetails['can' + weather] + teamDetails['need' + weather] > weatherSetup) {
				weatherSetup = teamDetails['can' + weather] + teamDetails['need' + weather];
				teamDetails.weather = weather;
			}
		}
		
		// If no weather picked, check if team is suitable for trick room
		if (!teamDetails.weather && teamDetails['cantrickroom'] && (teamDetails['needtrickroom'] >= 3)) {
			teamDetails.trickroom = true;
		}
		
		for (let template of pokemon) {
			let set = this.randomSet(template, sets.length, teamDetails);

			// Okay, the set passes, add it to our team
			sets.push(set);
			
			let item = this.getItem(set.item);

			// Team has weather/hazards/hazard removal
			if (item.zMove) teamDetails['zMove']++;
			if (set.moves.includes('sunnyday')) teamDetails['sun']++;
			if (set.moves.includes('raindance')) teamDetails['rain']++;
			if (set.ability === 'Snow Warning' || set.moves.includes('hail')) teamDetails['hail']++;
			if (set.ability === 'Sand Stream' || set.moves.includes('sandstorm')) teamDetails['sand']++;
			if (set.moves.includes('stealthrock')) teamDetails['stealthrock']++;
			if (set.moves.includes('toxicspikes')) teamDetails['toxicspikes']++;
			if (set.moves.includes('stickyweb')) teamDetails['stickyweb']++;
			if (set.moves.includes('spikes')) teamDetails['spikes']++;
			if (set.moves.includes('defog') || set.moves.includes('rapidspin')) teamDetails['hazardClear']++;
		}
		return sets;
	}
};

module.exports = RandomZUTeams;
