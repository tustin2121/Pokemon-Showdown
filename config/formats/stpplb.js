//

exports.Sections = {
	"STPPLB":	{ column: 5, sort: 3, },
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

// Super Glitch Rules:
// Rule 0: All pokemon have the moves Super Glitch and Recycle, and hold a Leppa Berry.
// Rule 1: No switching.
// Rule 2: you can't use recycle when you can use super glitch unless your leppa berry has been consumed
// Rule 3: If you used Imprison, you must switch out (overriding rule 1)
// Rule 4: Can't use pokemon with BST higher than 600
// Rule 5: Some abilities are banned (see list below)
// Rule 6: Can't have two pokemon with the same ability
let superglitch = {
	name: 'Super Glitch',
	section: 'STPPLB',
	column: 2,
	searchShow: true,
	mod: 'stpplb',
	ruleset: ['Switching Rule', 'Recycle Rule', 'BST Limit Rule', 'Duplicate Ability Rule', 'HP Percentage Mod', 'Species Clause', 'Cancel Mod', 'Team Preview', 'Mix and Mega Mod'],
	banlist: ['No Fun Allowed', 'Wonder Guard', 'Physicalakazam', 'Defiant Plus', 'Messiah', 'Cursed Body', 'Moody', 'Little Engine', 'Unnerve', 'Magician', 'Pickpocket', 'Imposter', 'Iron Barbs', 'Rough Skin', 'Stench', 'Herald of Death'],
	
	maxLevel: 100,
	defaultLevel: 100,

	onBegin: function () {
		this.add('-message', "Super Glitch: All pokemon have the moves Super Glitch and Recycle, and hold a Leppa Berry.");
	},
	
	onChangeSet: function(set) {
		set.item = 'Leppa Berry'; //Force item to Leppa Berry
		set.moves = ['recycle', 'superglitch']; //Force moveset to Recycle and Superglitch
		
		// This EV check is usually done in the Pokemon ruleset. 
		// But since we don't have that ruleset, we must do it here:
		let problems = [];
		let totalEV = 0;
		for (let k in set.evs) {
			if (typeof set.evs[k] !== 'number' || set.evs[k] < 0) {
				set.evs[k] = 0;
			}
			totalEV += set.evs[k];
		}
		// In gen 6, it is impossible to battle other players with pokemon that break the EV limit
		if (totalEV > 510 && this.gen >= 6) {
			problems.push((set.name || set.species) + " has more than 510 total EVs.");
		}
		return problems;
	},
};

exports.Formats = [
	// STPPLB
	create(stpplb, {
		name: "Super TPPL Bros.",
		team: 'randomtpplb',
	}),
	create(stpplb, {
		name: "Super TPPL Bros. Doubles",
		team: 'randomtpplb',
		gameType: 'doubles',
	}),
	create(stpplb, {
		name: "Super TPPL Bros. Triples",
		team: 'randomtpplb',
		gameType: 'triples',
	}),
	
	// STPPLBP
	create(stpplb, {
		name: "Super TPPL Bros. Plus",
		team: 'randomtpplbp',
	}),
	create(stpplb, {
		name: "Super TPPL Bros. Plus Doubles",
		team: 'randomtpplbp',
		gameType: 'doubles',
	}),
	create(stpplb, {
		name: "Super TPPL Bros. Plus Triples",
		team: 'randomtpplbp',
		gameType: 'triples',
	}),
	
	// STPPB
	create(stpplb, {
		name: "Super TPP Bros.",
		team: 'randomtppb',
	}),
	create(stpplb, {
		name: "Super TPP Bros. Doubles",
		team: 'randomtppb',
		gameType: 'doubles',
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
