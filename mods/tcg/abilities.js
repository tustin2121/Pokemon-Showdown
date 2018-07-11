'use strict';

exports.BattleAbilities = {
	"aerilate": {
		desc: "This Pokemon's Normal-type moves have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Flying type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.aerilateBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.aerilateBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		id: "aerilate",
		name: "Aerilate",
		rating: 4,
		num: 185,
	},
	"deltastream": {
		desc: "On switch-in, the weather becomes strong winds that remove the weaknesses of the Normal type from Normal-type Pokemon. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by Desolate Land or Primordial Sea.",
		shortDesc: "On switch-in, strong winds begin until this Ability is not active in battle.",
		onStart: function (source) {
			this.setWeather('deltastream');
		},
		onAnySetWeather: function (target, source, weather) {
			if (this.getWeather().id === 'deltastream' && !['desolateland', 'primordialsea', 'deltastream'].includes(weather.id)) return false;
		},
		onEnd: function (pokemon) {
			if (this.weatherData.source !== pokemon) return;
			for (const side of this.sides) {
				for (const target of side.active) {
					if (target === pokemon) continue;
					if (target && target.hp && target.hasAbility('deltastream')) {
						this.weatherData.source = target;
						return;
					}
				}
			}
			this.clearWeather();
		},
		id: "deltastream",
		name: "Delta Stream",
		rating: 5,
		num: 191,
	},
	"galewings": {
		shortDesc: "If this Pokemon is at full HP, its Normal-type moves have their priority increased by 1.",
		onModifyPriority: function (priority, pokemon, target, move) {
			if (move && move.type === 'Normal' && pokemon.hp === pokemon.maxhp) return priority + 1;
		},
		id: "galewings",
		name: "Gale Wings",
		rating: 3,
		num: 177,
	},
	"rattled": {
		desc: "This Pokemon's Speed is raised by 1 stage if hit by a Dark-, Grass-, or Psychic-type attack.",
		shortDesc: "This Pokemon's Speed is raised 1 stage if hit by a Dark-, Grass-, or Psychic-type attack.",
		onAfterDamage: function (damage, target, source, effect) {
			if (effect && (effect.type === 'Dark' || effect.type === 'Grass' || effect.type === 'Psychic')) {
				this.boost({spe: 1});
			}
		},
		id: "rattled",
		name: "Rattled",
		rating: 1.5,
		num: 155,
	},
	"refrigerate": {
		desc: "This Pokemon's Normal-type moves become Water-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Water type and have 1.2x power.",
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' && !['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'weatherball'].includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Water';
				move.refrigerateBoosted = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			if (move.refrigerateBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		id: "refrigerate",
		name: "Refrigerate",
		rating: 4,
		num: 174,
	},
	"sandforce": {
		desc: "If Sandstorm is active, this Pokemon's Fighting- and Steel-type attacks have their power multiplied by 1.3. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "This Pokemon's Fighting/Steel attacks do 1.3x in Sandstorm; immunity to it.",
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (this.isWeather('sandstorm')) {
				if (move.type === 'Fighting' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([0x14CD, 0x1000]);
				}
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		id: "sandforce",
		name: "Sand Force",
		rating: 2,
		num: 159,
	},
	"scrappy": {
		shortDesc: "This Pokemon can hit Psychic types with Normal- and Fighting-type moves.",
		onModifyMovePriority: -5,
		onModifyMove: function (move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		id: "scrappy",
		name: "Scrappy",
		rating: 3,
		num: 113,
	},
	"swarm": {
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using a Grass-type attack.",
		shortDesc: "At 1/3 or less of its max HP, this Pokemon's attacking stat is 1.5x with Grass attacks.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		id: "swarm",
		name: "Swarm",
		rating: 2,
		num: 68,
	},
	"thickfat": {
		desc: "If a Pokemon uses a Fire- or Water-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "Fire/Water-type moves against this Pokemon deal damage with a halved attacking stat.",
		onModifyAtkPriority: 6,
		onSourceModifyAtk: function (atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onSourceModifySpA: function (atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		id: "thickfat",
		name: "Thick Fat",
		rating: 3.5,
		num: 47,
	},
	
	// CAP
	"mountaineer": {
		shortDesc: "On switch-in, this Pokemon avoids all Fighting-type attacks and Stealth Rock.",
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit: function (target, source, move) {
			if (move.type === 'Fighting' && !target.activeTurns) {
				this.add('-immune', target, '[msg]', '[from] ability: Mountaineer');
				return null;
			}
		},
		id: "mountaineer",
		isNonstandard: true,
		name: "Mountaineer",
		rating: 3.5,
		num: -2,
	},
};
