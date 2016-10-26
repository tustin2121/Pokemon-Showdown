"use strict";

exports.BattleItems = {
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
	// 'goatofarms': { //If you want this item, azum, YOU implement it OpieOP
	// 	num: 2007,
	// 	id: 'goatofarms',
	// 	name: "Goat of Arms",
	// 	desc: "Holder calls forth 1 extra goat to tag along. Works even if holder's ability isn't Summon Goats.",
	// 	fling: {
	// 		basePower: 20, // just make up a power depending on the estimated size/weight of the item
	// 	}
	// 	// I have no idea how to code Summon Goats and this.
	// },
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
};
