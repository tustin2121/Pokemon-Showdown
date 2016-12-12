//

exports.Sections = {
	"STPPLB":	{ column: 5, sort: 2, },
};

function create(base, mod) {
	return Object.assign({}, base, mod);
}

let stpplb = {
	name: "Super TPPL Bros.",
	section: "STPPLB",
	column: 4,

	mod: 'stpplb',
	searchShow: true,
	team: 'randomtpplb',
	ruleset: ['Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	
	onSwitchInPriority: 1,
	onSwitchIn: function (pokemon) {
		let name = toId(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
		if (!pokemon.set) throw new Error("Pokemon's set is not set!");
		if (!pokemon.template.isMega) { // more hackery for mega abilities.
			pokemon.canMegaEvo = this.canMegaEvo(pokemon); // Bypass one mega limit.
		}
		
		if (pokemon.set.onSwitchIn) 
			pokemon.set.onSwitchIn.call(this, pokemon);
		
		this.sayQuote(pokemon, "SwitchIn");
		
		// Mix and Mega stuff
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
		let name = toId(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
		
		if (pokemon.set.onSwitchOut) 
			pokemon.set.onSwitchOut.call(this, pokemon);
		
		this.sayQuote(pokemon, "SwitchOut");

		// Mix and Mega stuff
		let oMegaTemplate = this.getTemplate(pokemon.template.originalMega);
		if (oMegaTemplate.exists && pokemon.originalSpecies !== oMegaTemplate.baseSpecies) {
			this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
		}
	},
	
	// General quote hooks
	onFaint: function (pokemon) { this.sayQuote(pokemon, "Faint"); },
	onCriticalHit: function(pokemon) { this.sayQuote(pokemon, "CriticalHit"); },
	onAttract: function(pokemon, source) { 
		this.sayQuote(pokemon, "Attract", {source: source, target: pokemon}); 
	},
	

	onBegin: function () {
		this.add('-message', "STPPLB wiki with all Pokemon descriptions: https://www.reddit.com/r/TPPLeague/wiki/stpplb");

		// Mix and Mega stuff
		let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
		for (let i = 0, len = allPokemon.length; i < len; i++) {
			let pokemon = allPokemon[i];
			pokemon.originalSpecies = pokemon.baseTemplate.species;
			
			if (pokemon.set.onBegin)
				pokemon.set.onBegin.call(this, pokemon);
		}
	},
};

let superglitch = {
	name: 'Super Glitch',
	section: 'STPPLB',
	column: 2,
	searchShow: true,
	mod: 'stpplb',
	ruleset: ['Super Glitch Clause', 'HP Percentage Mod', 'Species Clause', 'Cancel Mod', 'No Switching Clause', 'No Recycle Clause', 'Ability Clause', 'Team Preview', 'Mix and Mega Mod'],
	banlist: ['No Fun Allowed', 'Wonder Guard', 'Physicalakazam', 'Defiant Plus', 'Messiah', 'Cursed Body', 'Moody', 'Little Engine', 'Unnerve', 'Magician', 'Pickpocket', 'Imposter', 'Iron Barbs', 'Rough Skin'],
	maxLevel: 100,
	defaultLevel: 100,

	onBegin: function () {
		this.add('-message', "STPPLB wiki with all Pokemon descriptions: https://www.reddit.com/r/TPPLeague/wiki/stpplb");
	},
};

exports.Formats = [
	// Singles
	create(stpplb, {
		name: "Super TPPL Bros.",
		team: 'randomtpplb',
	}),
	create(stpplb, {
		name: "Super TPPL Bros. Plus",
		team: 'randomtpplbp',
	}),
	create(stpplb, {
		name: "Super TPP Bros.",
		team: 'randomtppb',
	}),
	// Doubles
	create(stpplb, {
		name: "Super TPPL Bros. Doubles",
		team: 'randomtpplb',
		gameType: 'doubles',
	}),
	create(stpplb, {
		name: "Super TPPL Bros. Plus Doubles",
		team: 'randomtpplbp',
		gameType: 'doubles',
	}),
	create(stpplb, {
		name: "Super TPP Bros. Doubles",
		team: 'randomtppb',
		gameType: 'doubles',
	}),
	// Triples
	create(stpplb, {
		name: "Super TPPL Bros. Triples",
		team: 'randomtpplb',
		gameType: 'triples',
	}),
	create(stpplb, {
		name: "Super TPPL Bros. Plus Triples",
		team: 'randomtpplbp',
		gameType: 'triples',
	}),
	create(stpplb, {
		name: "Super TPP Bros. Triples",
		team: 'randomtppb',
		gameType: 'triples',
	}),
	
	// Testing
	create(stpplb, {
		name: "Super TPPL Bros. Testing",
		team: undefined,
		searchShow: false,
		ruleset: ['Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Stadium Selection'],
		debug: true,
		validateSet: function(){ return false; } // Always validate
	}),
	create(stpplb, {
		name: "Super TPPL Bros. Testing Doubles",
		gameType: 'doubles',
		team: undefined,
		ruleset: ['Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		searchShow: false,
		debug: true,
		validateSet: function(){ return false; } // Always validate
	}),
	create(stpplb, {
		name: "Super TPPL Bros. Testing Triples",
		gameType: 'triples',
		team: undefined,
		ruleset: ['Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		searchShow: false,
		debug: true,
		validateSet: function(){ return false; } // Always validate
	}),
	
	
	// Super Glitch
	create(superglitch, {
		name: 'Super Glitch',
	}),
	create(superglitch, {
		name: 'Super Glitch Doubles',
		gameType: 'doubles',
	}),
	create(superglitch, {
		name: 'Super Glitch Triples',
		gameType: 'triples',
	}),
];
