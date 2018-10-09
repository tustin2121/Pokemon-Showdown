// Metas for Kappa Cup Season 5

exports.Sections = {
	"Kappa Kup Season 5": { column: 5, sort: 4, },
	"Kappa Kup Season 5 Playoffs": { column: 5, sort: 5, },
};
exports.Formats = [
	// Week 0: Type CondensinG
	{
		name: "[Gen 7] Week 0: Type CondensinG",
		section: "Kappa Kup Season 5",
		desc: "The current 18 types are condensed into the 11 types that are available in the Trading Card Game.",
		threads: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3573231/\">Type CondensinG</a>",
		],

		mod: 'tcg',
		ruleset: ['[Gen 7] OU'],
	},
	
	// Week 1: Ubers
	{
		name: "[Gen 7] Week 1: Singles", // Uber
		section: "Kappa Kup Season 5",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3587184/\">Ubers Metagame Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3591388/\">Ubers Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3599816/\">Ubers Sample Teams</a>",
		],
	 
		mod: 'gen7',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview', 'Mega Rayquaza Clause'],
		banlist: ['Baton Pass'],
	},
	
	
	// Week 2: Benjamin Butterfree
	/**
	Description
	Pokemon de-evolve when fainted and lose access to moves they could only learn in their evolved form
	
	Code
	- formats.js https://github.com/XpRienzo/DragonHeaven/blob/master/config/formats.js#L2945 
	- /mods/bb https://github.com/XpRienzo/DragonHeaven/tree/master/mods/bb
	OR
	- formats.js https://github.com/urkerab/Pokemon-Showdown/blob/8ee9bb7db2355b02dd25105be15facd8bdaf64b2/config/local-formats.js#L720
	- /sim/battle.js at line 2527 (idk what line this corresponds to on the tppl server, just search for "if (!faintData" and it should pop up)
	if (!faintData.target.fainted && this.runEvent('BeforeFaint', faintData.target, faintData.source, faintData.effect)) {
	
	Status
	- In the first one, battle crashes when pokemon de-evolve, in the second one, pokemon's health is not restored properly. Choose whichever one is easier to fix I guess OpieOP. This is how the battle should function: https://replay.pokemonshowdown.com/rom-gen7benjaminbutterfreerandombattle-224884
	*/
	{
		name: "[Gen 7] Week 2: Benjamin Butterfree",
		section: "Kappa Kup Season 5",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/benjamin-butterfree-aka-pokemon-deevolution.3581895/\">Benjamin Butterfee (Pokemon DeEvolution)</a>",
		],
		mod: 'bb',
		// team: 'random',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', "Team Preview"],
		onAfterDamage: function(damage, target, source, move) {
			if (!target.willDevolve) return;
			target.devolve();
		},
	},
	
	
	// Week 3: Mix and Mega
	{
		name: "[Gen 7] Week 3: Mix and Mega",
		section: "Kappa Kup Season 5",
		desc: [
			"Mega Stones and Primal Orbs can be used on almost any fully evolved Pok&eacute;mon with no Mega Evolution limit.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3587740/\">Mix and Mega</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3591580/\">Mix and Mega Resources</a>",
			"&bullet; <a href=\"https://www.smogon.com/tiers/om/analyses/mix_and_mega/\">Mix and Mega Analyses</a>",
		],

		mod: 'mixandmega',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Mega Rayquaza Clause', 'Team Preview'],
		banlist: ['Baton Pass', 'Electrify'],
		onValidateTeam: function (team) {
			let itemTable = {};
			for (let i = 0; i < team.length; i++) {
				let item = this.getItem(team[i].item);
				if (!item) continue;
				if (itemTable[item] && item.megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + this.getItem(item).name + ")"];
				if (itemTable[item] && (item.id === 'blueorb' || item.id === 'redorb')) return ["You are limited to one of each Primal Orb.", "(You have more than one " + this.getItem(item).name + ")"];
				itemTable[item] = true;
			}
		},
		onValidateSet: function (set) {
			let template = this.getTemplate(set.species || set.name);
			let item = this.getItem(set.item);
			if (!item.megaEvolves && item.id !== 'blueorb' && item.id !== 'redorb') return;
			if (template.baseSpecies === item.megaEvolves || (template.baseSpecies === 'Groudon' && item.id === 'redorb') || (template.baseSpecies === 'Kyogre' && item.id === 'blueorb')) return;
			if (template.evos.length) return ["" + template.species + " is not allowed to hold " + item.name + " because it's not fully evolved."];
			let uberStones = ['beedrillite', 'blazikenite', 'gengarite', 'kangaskhanite', 'mawilite', 'medichamite', 'pidgeotite'];
			if (template.tier === 'Uber' || set.ability === 'Power Construct' || uberStones.includes(item.id)) return ["" + template.species + " is not allowed to hold " + item.name + "."];
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
	},
	
	
	// Week 4: ~~Linked~~ Doubles Ubers
	/**
	Code:
	- formats.js https://github.com/Zarel/Pokemon-Showdown/blob/000e77d2c7cf6d829a61c64e4d3d51879aaa6759/config/formats.js#L442
	
	Status:
	- Everything works as intended (otherwise it wouldn't be on the main smogon server lol)
	 */
	 {
		name: "[Gen 7] Week 4: Doubles Ubers",
		section: "Kappa Kup Season 5",
		
		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard Doubles', 'Team Preview'],
		banlist: ['Dark Void'],
	},
	
	
	// Week 5: Scalemons
	{
		name: "[Gen 7] Week 5: Scalemons",
		section: "Kappa Kup Season 5",
		desc: `Every Pok&eacute;mon's stats, barring HP, are scaled to give them a BST as close to 600 as possible.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3607934/">Scalemons</a>`,
		],
		
		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: [
			'Carvanha', 'Gengar-Mega', 'Mawile-Mega', 'Medicham-Mega', 'Shedinja', 'Arena Trap', 'Shadow Tag', 'Deep Sea Scale',
			'Deep Sea Tooth', 'Eevium Z', 'Eviolite', 'Light Ball', 'Thick Club', 'Baton Pass',
		],
		onModifyTemplate: function (template, target, source) {
			template = Object.assign({}, template);
			template.baseStats = Object.assign({}, template.baseStats);
			let stats = ['atk', 'def', 'spa', 'spd', 'spe'];
			// @ts-ignore
			let pst = stats.map(stat => template.baseStats[stat]).reduce((x, y) => x + y);
			let scale = 600 - template.baseStats['hp'];
			for (const stat of stats) {
				// @ts-ignore
				template.baseStats[stat] = this.clampIntRange(template.baseStats[stat] * scale / pst, 1, 255);
			}
			return template;
		},
	},
	
	
	// Week 6: Partners in Crime
	/**
	Code:
	- formats.js https://github.com/XpRienzo/DragonHeaven/blob/master/config/formats.js#L3663
	- /mods/pic https://github.com/XpRienzo/DragonHeaven/tree/master/mods/pic
	
	Status:
	- Everything works as intended
	*/
	{
		name: "[Gen 7] Week 6: Partners in Crime",
		section: "Kappa Kup Season 5",
		desc: [
			"Doubles-based metagame where both active ally Pok&eacute;mon share abilities and moves.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3618488/\">Partners in Crime</a>",
		],

		mod: 'pic',
		gameType: 'doubles',
		ruleset: ['[Gen 7] Doubles OU', 'Sleep Clause Mod'],
		banlist: ['Huge Power', 'Imposter', 'Parental Bond', 'Pure Power', 'Wonder Guard', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Mimic', 'Sketch', 'Transform'],
		onDisableMovePriority: -1,
		onSwitchInPriority: 2,
		onSwitchIn: function (pokemon) {
			if (this.p1.active.every(ally => ally && !ally.fainted)) {
				let p1a = this.p1.active[0], p1b = this.p1.active[1];
				if (p1a.ability !== p1b.ability) {
					let p1a_innate = 'ability' + p1b.ability;
					p1a.volatiles[p1a_innate] = {id: p1a_innate, target: p1a};
					let p1b_innate = 'ability' + p1a.ability;
					p1b.volatiles[p1b_innate] = {id: p1b_innate, target: p1b};
				}
			}
			if (this.p2.active.every(ally => ally && !ally.fainted)) {
				let p2a = this.p2.active[0], p2b = this.p2.active[1];
				if (p2a.ability !== p2b.ability) {
					let p2a_innate = 'ability' + p2b.ability;
					p2a.volatiles[p2a_innate] = {id: p2a_innate, target: p2a};
					let p2b_innate = 'ability' + p2a.ability;
					p2b.volatiles[p2b_innate] = {id: p2b_innate, target: p2b};
				}
			}
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.ability !== pokemon.ability) {
				if (!pokemon.innate) {
					pokemon.innate = 'ability' + ally.ability;
					delete pokemon.volatiles[pokemon.innate];
					pokemon.addVolatile(pokemon.innate);
				}
				if (!ally.innate) {
					ally.innate = 'ability' + pokemon.ability;
					delete ally.volatiles[ally.innate];
					ally.addVolatile(ally.innate);
				}
			}
		},
		onSwitchOut: function (pokemon) {
			if (pokemon.innate) {
				pokemon.removeVolatile(pokemon.innate);
				delete pokemon.innate;
			}
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.innate) {
				ally.removeVolatile(ally.innate);
				delete ally.innate;
			}
		},
		onFaint: function (pokemon) {
			if (pokemon.innate) {
				pokemon.removeVolatile(pokemon.innate);
				delete pokemon.innate;
			}
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.innate) {
				ally.removeVolatile(ally.innate);
				delete ally.innate;
			}
		},
	},
	
	
	// Week 7: ~~Mix and Mega Doubles~~ Mergemons
	/**
	Status:
	- Not on the server, but shouldn't be terribly hard to make
	*/
	{
		name: "[Gen 7] Week 7: Mergemons Doubles",
		section: "Kappa Kup Season 5",
		desc: [
			"Pok&eacute;mon gain the movepool of the previous and the next fully evolved Pok&eacute;mon, according to the Pok&eacute;dex.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3591780/\">Mergemons</a>",
		],

		mod: 'mergemons',
		gameType: 'doubles',
		ruleset: ['[Gen 7] Doubles Ubers'],
		banlist: [],
	},
	
	
	// Week 8: Dual Wielding
	/**
	Status:
	- Already on the server as OM of the Month, no issues (presumably)
	 */
 	{
		name: "[Gen 7] Week 8: Dual Wielding",
		section: "Kappa Kup Season 5",
		desc: [
			"Pok&eacute;mon can forgo their Ability in order to use a second item.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3608611//\">Dual Wielding</a>",
		],

		mod: 'dualwielding',
		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Regigigas', 'Slaking'],
		validateSet: function (set, teamHas) {
			let template = this.dex.getTemplate(set.species || set.name);
			let dual = this.dex.getItem(set.ability);
			if (!dual.exists || template.tier === 'Uber') return this.validateSet(set, teamHas);
			let item = this.dex.getItem(set.item);
			let validator = new this.constructor(Dex.getFormat(this.format.id+'@@@Ignore Illegal Abilities'));
			let problems = validator.validateSet(Object.assign({}, set, {ability: ''}), teamHas) 
				|| validator.validateSet(Object.assign({}, set, {ability: '', item: set.ability}, teamHas)) 
				|| [];
			if (dual.id === item.id) problems.push(`You cannot have two of the same item on a Pokemon. (${set.name || set.species} has two of ${item.name})`);
			if (item.isChoice && dual.isChoice) problems.push(`You cannot have two choice items on a Pokemon. (${set.name || set.species} has ${item.name} and ${dual.name})`);
			return problems;
		},
	},
	
	
	// Week 9: Metagamiate
	/**
	Description:
	Each pokemon has an -ate ability corresponding to their type
	
	Code:
	- formats.js https://github.com/XpRienzo/DragonHeaven/blob/master/config/formats.js#L3522
	
	Status:
	- Should be working, although I haven't tested it extensively, nothing game-breaking though

	*/
	{
		name: "[Gen 7] Week 9: Metagamiate",
		section: "Kappa Kup Season 5",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3604808/\">Metagamiate</a>"],
		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Dragonite', 'Kyurem-Black'],
		onModifyMovePriority: -1,
		onModifyMove: function (move, pokemon) {
			if (move.type === 'Normal' 
				&& !move.isZ 
				&& move.id !== 'hiddenpower' 
				&& !pokemon.hasAbility(['aerilate', 'galvanize', 'normalize', 'pixilate', 'refrigerate'])
				&& !(pokemon.baseTemplate.tier in { Uber:1 }) ) 
			{
				let types = pokemon.getTypes();
				let type = types.length < 2 || !pokemon.set.shiny ? types[0] : types[1];
				move.type = type;
				move.isMetagamiate = true;
			}
		},
		onBasePowerPriority: 8,
		onBasePower: function (basePower, attacker, defender, move) {
			if (!move.isMetagamiate) return;
			return this.chainModify([0x1333, 0x1000]);
		},
		validateSet: function (set, teamHas) {
			let trueTemplate = this.dex.getTemplate(set.species);
			let forgedTemplate = Object.assign({}, this.dex.getTemplate(set.species));
			if (forgedTemplate.eventPokemon) {
				let ep = []; //Avoid format crosstalk by using an empty array as a base
				for (let i = 0; i < forgedTemplate.eventPokemon.length; i++) {
					ep.push(Object.assign({}, forgedTemplate.eventPokemon[i])); //Avoid format crosstalk by using Object.assign
					ep[i].shiny = 1;
				}
				forgedTemplate.eventPokemon = ep;
			}
			return this.validateSet(set, teamHas, forgedTemplate);
		},
	},
	
	
	
	// Week 10: Pokebilities
	/**
	Code:
	- formats.js https://github.com/XpRienzo/DragonHeaven/blob/master/config/formats.js#L3732
	- /mods/pokebilities https://github.com/XpRienzo/DragonHeaven/tree/master/mods/pokebilities
	
	Status:
	- Everything works as intended
	*/
	{
		name: "[Gen 7] Week 10: Pokebilities",
		section: "Kappa Kup Season 5",
		desc: ["&bullet; <a href=\"http://www.smogon.com/forums/threads/3588652/\">Pokebilities</a>: A Pokemon has all of its abilities active at the same time."],
		mod: 'pokebilities',
		ruleset: ["[Gen 7] Ubers"],
		banlist: ["Blaziken"],
		onSwitchInPriority: 1,
		onBegin: function() {
			// let statusability = {
			// 	"aerilate": true,
			// 	"aurabreak": true,
			// 	"flashfire": true,
			// 	"parentalbond": true,
			// 	"pixilate": true,
			// 	"refrigerate": true,
			// 	"sheerforce": true,
			// 	"slowstart": true,
			// 	"truant": true,
			// 	"unburden": true,
			// 	"zenmode": true
			// };
			for (let p = 0; p < this.sides.length; p++) {
				for (let i = 0; i < this.sides[p].pokemon.length; i++) {
					let pokemon = this.sides[p].pokemon[i];
					let template = this.getTemplate(pokemon.species);
					pokemon.innates = [];
					let banned = this.data.Formats[toId("[Gen 7] OU")].banlist.concat("Battle Bond").map(x=>toId(x));
					for (let a in template.abilities) {
						let abilityid = toId(template.abilities[a]);
						if (banned.includes(abilityid)) continue;
						if (toId(a) === 'h' && template.unreleasedHidden) continue;
						if (abilityid === pokemon.ability) continue;
						pokemon.innates.push('ability:'+abilityid);
					}
				}
			}
		},
		onSwitchIn: function(pokemon) {
			for (let i = 0; i < pokemon.innates.length; i++) {
				if (!pokemon.volatiles[pokemon.innates[i]])
					pokemon.addVolatile(pokemon.innates[i]);
			}
		},
		onAfterMega: function(pokemon) {
			for (let i = 0; i < pokemon.innates.length; i++) {
				pokemon.removeVolatile(pokemon.innates[i]);
			}
		},
	},
	
];