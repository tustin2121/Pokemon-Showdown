"use strict";

exports.BattleItems = {
	////////////////////////////////////////////////////////////////////////////
	// Modified Items
	
	blueorb: {
		inherit: true,
		onSwitchIn: function (pokemon) {
			if (pokemon.isActive && !pokemon.template.isPrimal) {
				this.insertQueue({pokemon: pokemon, choice: 'runPrimal'});
			}
		},
		onPrimal: function (pokemon) {
			let template = this.getMixedTemplate(pokemon.originalSpecies, 'Kyogre-Primal');
			pokemon.formeChange(template);
			pokemon.baseTemplate = template;
			if (pokemon.originalSpecies === 'Kyogre') {
				pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, pokemon.details);
			} else {
				if (pokemon.illusion) pokemon.ability = '';
				let oTemplate = this.getTemplate(pokemon.illusion || pokemon.originalSpecies);
				this.add('-formechange', pokemon, oTemplate.species);
				this.add('-start', pokemon, 'Blue Orb', '[silent]');
			}
			this.add('-primal', pokemon.illusion || pokemon);
			pokemon.setAbility(template.abilities['0']);
			pokemon.baseAbility = pokemon.ability;
		},
		onTakeItem: function (item) {
			return false;
		},
	},
	redorb: {
		inherit: true,
		onSwitchIn: function (pokemon) {
			if (pokemon.isActive && !pokemon.template.isPrimal) {
				this.insertQueue({pokemon: pokemon, choice: 'runPrimal'});
			}
		},
		onPrimal: function (pokemon) {
			let template = this.getMixedTemplate(pokemon.originalSpecies, 'Groudon-Primal');
			pokemon.formeChange(template);
			pokemon.baseTemplate = template;
			if (pokemon.originalSpecies === 'Groudon') {
				pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, pokemon.details);
			} else {
				let oTemplate = this.getTemplate(pokemon.illusion || pokemon.originalSpecies);
				this.add('-formechange', pokemon, oTemplate.species);
				this.add('-start', pokemon, 'Red Orb', '[silent]');
				if (pokemon.illusion) {
					pokemon.ability = '';
					let types = pokemon.illusion.template.types;
					if (types.length > 1 || types[types.length - 1] !== 'Fire') {
						this.add('-start', pokemon, 'typechange', (types[0] !== 'Fire' ? types[0] + '/' : '') + 'Fire', '[silent]');
					}
				} else if (oTemplate.types.length !== pokemon.template.types.length || oTemplate.types[1] !== pokemon.template.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
				}
			}
			this.add('-primal', pokemon.illusion || pokemon);
			pokemon.setAbility(template.abilities['0']);
			pokemon.baseAbility = pokemon.ability;
		},
		onTakeItem: function (item) {
			return false;
		},
	},
	
	////////////////////////////////////////////////////////////////////////////
	// Custom Items
	"lunchabylls": {
		num: 2001,
		id: "lunchabylls",
		name: "Lunchabylls",
		desc: "At the end of every turn, holder restores 1/16 of its max HP. Recovers 1/8th hp if statused",
		fling: {
			basePower: 10,
		},
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual: function (pokemon) {
			if (pokemon.status) {
				this.heal(pokemon.maxhp / 8);
			} else {
				this.heal(pokemon.maxhp / 16);
			}
		},
	},
	'speedshoes': {
		num: 2002,
		id: 'speedshoes',
		name: 'Speed Shoes',
		desc: "Doubles speed.",
		fling: {
			basePower: 15,
		},
		onModifySpe: function (spe, pokemon) {
			return this.chainModify(2);
		},
	},
	'dex': {
		num: 2003,
		id: 'dex',
		name: 'Dex',
		desc: 'Boosts accuracy by 20% and crit rate by one stage.',
		fling: {
			basePower: 15,
		},
		onModifyMove: function (move) {
			move.critRatio++;
		},
		onSourceModifyAccuracy: function (accuracy) {
			if (typeof accuracy === 'number') {
				return accuracy * 1.2;
			}
		},
	},
	'membrane': {
		num: 2004,
		id: 'membrane',
		name: 'Membrane',
		desc: 'Reduces super-effective damage by 25%',
		fling: {
			basePower: 1,
		},
		onSourceModifyDamage: function (damage, source, target, move) {
			if (move.typeMod > 0) {
				this.debug('Membrane neutralize');
				return this.chainModify(0.75);
			}
		},
	},
	'mistywater': { //just mystic water with a new name
		num: 2005,
		id: 'mistywater',
		name: 'Misty Water',
		desc: "Increases power of Water-type moves by 20%.",
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 6,
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Water') {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
	},
	'murkyincense': {
		num: 2006,
		id: "murkyincense",
		name: "Murky Incense",
		desc: "Holder's attacks do 1.3x damage, and it loses 1/10 its max HP after the attack. If holder is the target of a foe's move, that move loses one additional PP.",
		fling: {
			basePower: 10,
		},
		onModifyDamage: function (damage, source, target, move) {
			return this.chainModify([0x14CC, 0x1000]);
		},
		onAfterMoveSecondarySelf: function (source, target, move) {
			if (source && source !== target && move && move.category !== 'Status' && !move.ohko) {
				this.damage(source.maxhp / 10, source, source, this.getItem('murkyincense'));
			}
		},
		onDeductPP: function (target, source) {
			if (target.side === source.side) return;
			return 1;
		},
		
	},
	'goatofarms': { //If you want this item, azum, YOU implement it OpieOP
		num: 2007,
		id: 'goatofarms',
		name: "Goat of Arms",
		desc: "Holder calls fourth 1 extra goat to help with attacks. This will add +1 attack to all attacks except selfdestructive, charge, and spread hit attacks. This will lower the power of subsequent attacks on already existing multi-hit moves, because Azum is a TriHard. You cannot gain more than 5 goat followers. If this item is knocked off, the goats flee.",
		shortDesc: "Holder calls forth 1 extra goat to tag along. Works even if holder's ability isn't Summon Goats.",
		statusTags: {
			goatofarms1: '<span class="good">+1&nbsp;Goat</span>',
			goatofarms2: '<span class="good">+2&nbsp;Goats</span>',
			goatofarms3: '<span class="good">+3&nbsp;Goats</span>',
			goatofarms4: '<span class="good">+4&nbsp;Goats</span>',
			goatofarms5: '<span class="good">+5&nbsp;Goats</span>',
		},
		fling: {
			basePower: 20, // just make up a power depending on the estimated size/weight of the item
		},
		onHit: function(target, source, move) {
			if (!target.hp) return; // Don't activate if we're dead now
			if (move.category === "Status" || move.damage || move.damageCallback) return; //Ignore status and direct damage
			if (move.id === 'knockoff') return; //Don't do this if the goatofarms is about to be knocked off.
			target.addVolatile('goatofarms');
		},
		onTakeItem: function(item, pokemon, source) {
			if (!this.debug) return true; // This will be true when KnockOff stupidly calls this function wrong
			pokemon.removeVolatile('goatofarms');
			return true;
		},
		effect: {
			onStart: function(pokemon) {
				this.effectData.num = 1;
				this.add('-start', pokemon, 'goatofarms'+this.effectData.num, 
					`[msg] ${pokemon.name}'s called in calvery with ${(pokemon.gender=='F')?'her':'his'} Goat of Arms!`);
			},
			onRestart: function(pokemon) {
				if (this.effectData.num == 5) return; //limit to +5
				this.add('-end', pokemon, 'goatofarms'+this.effectData.num, '[silent]');
				this.effectData.num = Math.min(this.effectData.num+1, 5); //limit to +5
				this.add('-start', pokemon, 'goatofarms'+this.effectData.num, 
					`[msg] ${pokemon.name}'s called in more calvery with ${(pokemon.gender=='F')?'her':'his'} Goat of Arms!`);
			},
			onEnd: function (pokemon) {
				this.add('-end', pokemon, 'goatofarms'+this.effectData.num, 
					`[msg] ${pokemon.name}'s calvery fled!`);
			},
			onPrepareHitPriority: 8, //lower than Summon Goats ability
			onPrepareHit: function (source, target, move) {
				if (move.id in {iceball: 1, rollout: 1}) return;
				if (move.category === 'Status') return;
				if (move.selfdestruct || move.flags['charge'] || move.spreadHit) return;
				
				move.multihit = (move.multihit || 1) + this.effectData.num;
				source.addVolatile('summongoats'); //Use the same effect as summongoats
			},
		}
	},
	'rockethooves': {
		num: 2008,
		id: "rockethooves",
		name: "Rocket Hooves",
		desc: "Increases the holder's Speed by 1 for each super-effective hit.",
		shortDesc: "Increases the holder's Speed by 1 for each super-effective hit.",
		fling: {
			basePower: 100, //throwing a shoe WutFace
		},
		onHit: function (target, source, move) {
			if (target.hp && move.category !== 'Status' && !move.damage && !move.damageCallback && move.typeMod > 0) {
				this.boost({spe: 1});
			}
		},
	},
	"zsash": {
		num: 2009,
		id: "zsash",
		name: "Z-Sash",
		desc: "A band made of edible material. If the holder's HP is full, will survived an attack that would KO it with 1 HP. Restores 1/4 max HP when at 1/2 max HP or less. Single use.",
		// desc: "Sitrus Berry+Focus Sash(if sash activates sitrus berry also activates,if only sitrus berry activates z-sash is consumed)",
		isBerry: true, // Technically not a berry, but is as edible as one
		naturalGift: {
			basePower: 80,
			type: "Psychic",
		},
		onDamage: function (damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				if (target.eatItem()) {
					return target.hp - 1;
				}
			}
		},
		onUpdate: function (pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onTryEatItem: function (item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon)) return false;
		},
		onEat: function (pokemon) {
			this.add('raw', `It's surprisingly tasty!`);
			this.heal(pokemon.maxhp / 4);
		},
		//TODO implement
	},
	"reinforcedglass": {
		num: 2010,
		id: "reinforcedglass",
		name: "Reinforced Glass",
		desc: "If the holder is hit with a super effective move, that move is nullified, and this item breaks. Single Use.",
		fling: {
			basePower: 40,
		},
		onTryHit: function(target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle') 
				return;
			this.debug("Reinforced Glass immunity: "+move.id);
			if (target.runEffectiveness(move) > 0) { //hit by super effective move
				if (target.useItem()) {
					this.add('-immune', target, '[from] item: Reinforced Glass', 
						`[msg] ${target.name}'s Reinforced Glass took the brunt of the attack and shattered!`);
					return null;
				}
			}
		},
	}
};
