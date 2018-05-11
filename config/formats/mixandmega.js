
/* global toId */
exports.Formats = [];

function create(base, mod) {
	exports.Formats.push(Object.assign({}, base, mod));
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Mix and Mega Expansion
// Courtesy of https://github.com/urkerab/Pokemon-Showdown

let mmFormat = {
	name: "[Gen 7] Mix and Mega",
	section: "Mix and Mega",
	desc: "Mega Stones and Primal Orbs can be used on almost any fully evolved Pok&eacute;mon with no Mega Evolution limit.",
	threads: [
		"&bullet; <a href=\"https://www.smogon.com/forums/threads/3587740/\">Mix and Mega</a>",
		"&bullet; <a href=\"https://www.smogon.com/forums/threads/3591580/\">Mix and Mega Resources</a>",
		"&bullet; <a href=\"https://www.smogon.com/tiers/om/analyses/mix_and_mega/\">Mix and Mega Analyses</a>",
	],

	mod: 'mixandmega',
	searchShow: false,
	challengeShow: true,
	tournamentShow: false,
	ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Mega Rayquaza Clause', 'Team Preview'],
	banlist: ['Baton Pass', 'Electrify'],
	onValidateTeam: function (team) {
		let itemTable = {};
		for (let i = 0; i < team.length; i++) {
			let item = this.getItem(team[i].item);
			if (!item) continue;
			/* // Old rules:
			if (!(item in itemTable)) {
				itemTable[item] = 1;
			} else if (itemTable[item] < 2) {
				itemTable[item]++;
			} else {
				if (item.megaStone) return ["You are limited to two of each Mega Stone.", "(You have more than two " + this.getItem(item).name + ")"];
				if (item.id === 'blueorb' || item.id === 'redorb') return ["You are limited to two of each Primal Orb.", "(You have more than two " + this.getItem(item).name + ")"];
			}
			/*/ // New rules:
			if (!itemTable[item]) itemTable[item] = 0;
			if (++itemTable[item] < 3) continue;
			if (item.megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + item.name + ".)"];
			if (item.id === 'blueorb' || item.id === 'redorb') return ["You are limited to one of each Primal Orb.", "(You have more than one " + item.name + ".)"];
			//*/
		}
	},
	onValidateSet: function (set) {
		let template = this.getTemplate(set.species || set.name);
		let item = this.getItem(set.item);
		if (!item.megaEvolves && item.id !== 'blueorb' && item.id !== 'redorb' && item !== 'ultranecroziumz') return;
		if (template.baseSpecies === item.megaEvolves || (template.baseSpecies === 'Groudon' && item.id === 'redorb') || (template.baseSpecies === 'Kyogre' && item.id === 'blueorb') || (template.baseSpecies === 'Necrozma' && item.id === 'ultranecroziumz')) return;
		/* // Old rules:
		if (template.evos.length) return ["" + template.species + " is not allowed to hold " + item.name + " because it's not fully evolved."];
		let uberStones = ['beedrillite', 'blazikenite', 'gengarite', 'kangaskhanite', 'mawilite', 'medichamite'];
		if (template.tier === 'Uber' || set.ability === 'Power Construct' || uberStones.includes(item.id)) return ["" + template.species + " is not allowed to hold " + item.name + "."];
		/*/ // New rules:
		if (template.nfe) return ["" + template.species + " is not allowed to hold " + item.name + " because it's not fully evolved."];
		if (template.tier.endsWith('Uber') || set.ability === 'Power Construct') {
			return [template.species + " is not allowed to hold a Mega Stone."];
		}
		switch (item.id) {
			case 'beedrillite': case 'gengarite': case 'kangaskhanite': case 'pidgeotite':
				return [item.name + " is only allowed to be held by " + item.megaEvolves + "."];
			case 'blazikenite':
				if (set.ability === 'Speed Boost') break;
				return ["You are only allowed to hold Blazikenite if your Ability is Speed Boost."];
			case 'mawilite': case 'medichamite':
				if (set.ability === 'Huge Power' || set.ability === 'Pure Power') break;
				if (template.species === "Mawile" || template.species === "Medicham") break;
				return ["You are only allowed to hold " + item.name + " if your Ability is Huge Power or Pure Power."];
			case 'ultranecroziumz':
				return ["Ultranecrozium Z is only allowed to be held by Necrozma-Dawn-Wings or Necrozma-Dusk-Mane."];
		}
		//*/
	},
	onBegin: function () {
		let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
		for (let i = 0, len = allPokemon.length; i < len; i++) {
			let pokemon = allPokemon[i];
			pokemon.originalSpecies = pokemon.baseTemplate.species;
		}
	},
	onSwitchIn: function (pokemon) {
		let oMegaTemplate = this.getTemplate(pokemon.template.originalMega);
		if (oMegaTemplate.exists && pokemon.originalSpecies !== oMegaTemplate.baseSpecies) {
			// Place volatiles on the Pokémon to show its mega-evolved condition and details
			this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			let oTemplate = this.getTemplate(pokemon.originalSpecies);
			if (oTemplate.types.length !== pokemon.template.types.length || oTemplate.types[1] !== pokemon.template.types[1]) {
				this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
			}
		}
	},
	onSwitchOut: function (pokemon) {
		let oMegaTemplate = this.getTemplate(pokemon.template.originalMega);
		if (oMegaTemplate.exists && pokemon.originalSpecies !== oMegaTemplate.baseSpecies) {
			this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
		}
	},
};

create(mmFormat, {
	overrides: true, //override the original format, as we've made changes
	searchShow: true,
});

create(mmFormat, {
	name: "[Gen 7] Mix and Mega Doubles",
	searchShow: true,
	
	gameType: 'doubles',
	banlist: [],
});
create(mmFormat, {
	name: "[Gen 7] Mix and Mega Triples",
	searchShow: true,
	
	gameType: 'triples',
	banlist: [],
});
create(mmFormat, {
	name: "[Gen 7] Mix and Mega Random",
	searchShow: true,
	tournamentShow: true,
	
	team: 'random',
	ruleset: ['Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	banlist: [],
});
create(mmFormat, {
	name: "[Gen 7] Mix and Mega Random Doubles",
	searchShow: true,
	tournamentShow: true,
	
	team: 'random',
	ruleset: ['Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	gameType: 'doubles',
	banlist: [],
});
create(mmFormat, {
	name: "[Gen 7] Mix and Mega Random Triples",
	searchShow: true,
	tournamentShow: true,
	
	team: 'random',
	ruleset: ['Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	gameType: 'triples',
	banlist: [],
});
create(mmFormat, {
	name: "[Gen 7] Mix and Mega Monotype",
	desc: [
		"Mega Stones and Primal Orbs can be used on any fully evolved Pok&eacute;mon with no Mega Evolution limit.",
		"All the Pok&eacute;mon on a team must share a type.",
	],
	threads: [
		"&bullet; <a href=\"https://www.smogon.com/forums/threads/3587740/\">Mix and Mega</a>",
	],
	
	ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Mega Rayquaza Clause', 'Team Preview', 'Same Type Clause'],
	banlist: ['Smooth Rock', 'Terrain Extender'],
});

create(mmFormat, {
	name: "[Gen 7] Mix and Mega UU",
	section: "Mix and Mega",
	desc: "Mega Stones and Primal Orbs can be used on almost any fully evolved Pok&eacute;mon with no Mega Evolution limit.",
	threads: [
		"&bullet; <a href=\"https://www.smogon.com/forums/threads/3612051/\">UU OMs Mega Thread</a>",
	],

	banlist: [
		'Alakazam-Mega', 'Arceus-Ghost', 'Blacephalon', 'Blaziken-Mega', 'Blissey', 'Buzzwole', 
		'Charizard-Mega-X', 'Darkrai', 'Ditto', 'Entei', 'Ferrothorn', 'Garchomp', 'Genesect', 
		'Golisopod', 'Greninja-Ash', 'Groudon-Primal', 'Heatran', 'Ho-Oh', 'Hoopa-Unbound',
		'Kartana', 'Keldeo', 'Kyogre-Primal', 'Landorus-Therian', 'Lucario-Mega', 'Magearna', 
		'Manaphy', 'Marshadow', 'Mew', 'Mewtwo-Mega-Y', 'Mimikyu', 'Naganadel', 'Necrozma-Dusk-Mane',
		'Noivern', 'Raikou', 'Rayquaza-Mega', 'Shaymin-Sky', 'Shuckle', 'Skarmory', 'Tapu Koko',
		'Tapu Lele', 'Toxapex', 'Tyranitar-Mega', 'Victini', 'Volcarona', 'Weavile', 'Xerneas', 
		'Zapdos', 'Zygarde',
	],
});