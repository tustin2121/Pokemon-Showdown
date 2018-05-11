'use strict';

exports.BattleItems = {
	blueorb: {
		inherit: true,
		onSwitchIn: function (pokemon) {
			if (pokemon.isActive && !pokemon.template.isPrimal) {
				this.insertQueue({pokemon: pokemon, choice: 'runPrimal'});
			}
		},
		onPrimal: function (pokemon) {
			let species = pokemon.template.baseSpecies == pokemon.originalSpecies ? pokemon.template.species : pokemon.originalSpecies;
			let template = this.getMixedTemplate(species, 'Kyogre-Primal');
			pokemon.formeChange(template);
			pokemon.baseTemplate = template;
			if (species === 'Kyogre') {
				pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, pokemon.details);
			} else {
				if (pokemon.illusion) {
					pokemon.ability = '';
					species = pokemon.illusion.template.species;
				}
				this.add('-formechange', pokemon, species);
				this.add('-start', pokemon, 'Blue Orb', '[silent]');
			}
			this.add('-primal', pokemon.illusion || pokemon);
			pokemon.setAbility(template.abilities['0'], null, true);
			pokemon.baseAbility = pokemon.ability;
		},
		onTakeItem: false,
	},
	redorb: {
		inherit: true,
		onSwitchIn: function (pokemon) {
			if (pokemon.isActive && !pokemon.template.isPrimal) {
				this.insertQueue({pokemon: pokemon, choice: 'runPrimal'});
			}
		},
		onPrimal: function (pokemon) {
			let species = pokemon.template.baseSpecies == pokemon.originalSpecies ? pokemon.template.species : pokemon.originalSpecies;
			let template = this.getMixedTemplate(species, 'Groudon-Primal');
			pokemon.formeChange(template);
			if (species === 'Groudon') {
				pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('detailschange', pokemon, pokemon.details);
			} else {
				if (pokemon.illusion) {
					pokemon.ability = '';
					this.add('-formechange', pokemon, pokemon.illusion.template.species);
					this.add('-start', pokemon, 'Red Orb', '[silent]');
					let types = pokemon.illusion.template.types;
					if (types.length > 1 || types[types.length - 1] !== 'Fire') {
						this.add('-start', pokemon, 'typechange', (types[0] !== 'Fire' ? types[0] + '/' : '') + 'Fire', '[silent]');
					}
				} else {
					this.add('-formechange', pokemon, species);
					this.add('-start', pokemon, 'Red Orb', '[silent]');
					if (pokemon.baseTemplate.types.length !== pokemon.template.types.length || pokemon.baseTemplate.types[1] !== pokemon.template.types[1]) {
						this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
					}
				}
			}
			this.add('-primal', pokemon.illusion || pokemon);
			pokemon.setAbility(template.abilities['0'], null, true);
			pokemon.baseAbility = pokemon.ability;
			pokemon.baseTemplate = template;
		},
		onTakeItem: false,
	},
};
