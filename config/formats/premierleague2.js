// Metas for Premier League 2

exports.Sections = {
	"Bastion 0": { column: 6, sort: 1, },
	"Bastion 1": { column: 6, sort: 2, },
	"Bastion 2": { column: 6, sort: 3, },
	"Bastion 3": { column: 6, sort: 4, },
	"Bastion 4": { column: 6, sort: 5, },
	"Bastion 5": { column: 6, sort: 6, },
	"Bastion 6": { column: 6, sort: 7, },
	"Bastion 7": { column: 6, sort: 8, },
};
exports.Formats = [
	// Bastion 0: 9v9 Special Fight
	{
		name: "[Gen 7] B0: 9v9 Special Fight", // 9v9 OU
		section: "Bastion 0",

		mod: 'twentyfour',
		teamLength: {
			validate: [1, 9],
			battle: 9,
		},

		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Uber', 'Arena Trap', 'Power Construct', 'Shadow Tag', 'Baton Pass', 'Beat Up'],
	},
	
	// Bastion 1: Uber Singles
	{
		name: "[Gen 7] B1: Uber Singles",
		section: "Bastion 1",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3587184/\">Ubers Metagame Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3591388/\">Ubers Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3599816/\">Ubers Sample Teams</a>",
		],
	 
		mod: 'gen7',
		searchShow: false,
		ruleset: ['[Gen 7] Ubers'],
	},
	
	// Bastion 1: UU Doubles
	{
		name: "[Gen 7] B1: UU Doubles",
		section: "Bastion 1",
		threads: [`&bullet; <a href="https://www.smogon.com/forums/threads/3598014/">Doubles UU Metagame Discussion</a>`],

		mod: 'gen7',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['[Gen 7] Doubles UU'],
	},
	
	// Bastion 1: Mix n Mega
	{
		name: "[Gen 7] B1: Mix n Mega",
		section: "Bastion 1",
		desc: [
			"Mega Stones and Primal Orbs can be used on almost any fully evolved Pok&eacute;mon with no Mega Evolution limit.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3587740/\">Mix and Mega</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3591580/\">Mix and Mega Resources</a>",
			"&bullet; <a href=\"https://www.smogon.com/tiers/om/analyses/mix_and_mega/\">Mix and Mega Analyses</a>",
		],

		mod: 'mixandmega',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Mega Rayquaza Clause', 'Team Preview'],
		banlist: ['Shadow Tag', 'Gengarite', 'Baton Pass', 'Electrify'],
		restrictedStones: ['Beedrillite', 'Blazikenite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z'],
		cannotMega: [
			'Arceus', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Landorus-Therian', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Slaking', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom',
		],
		onValidateTeam: function (team) {
			let itemTable = {};
			for (const set of team) {
				let item = this.getItem(set.item);
				if (!item) continue;
				if (itemTable[item.id] && item.megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + this.getItem(item).name + ")"];
				if (itemTable[item.id] && ['blueorb', 'redorb'].includes(item.id)) return ["You are limited to one of each Primal Orb.", "(You have more than one " + this.getItem(item).name + ")"];
				itemTable[item.id] = true;
			}
		},
		onValidateSet: function (set, format) {
			let template = this.getTemplate(set.species || set.name);
			let item = this.getItem(set.item);
			if (!item.megaEvolves && !['blueorb', 'redorb', 'ultranecroziumz'].includes(item.id)) return;
			if (template.baseSpecies === item.megaEvolves || (template.baseSpecies === 'Groudon' && item.id === 'redorb') || (template.baseSpecies === 'Kyogre' && item.id === 'blueorb') || (template.species.substr(0, 9) === 'Necrozma-' && item.id === 'ultranecroziumz')) return;
			if (template.evos.length) return ["" + template.species + " is not allowed to hold " + item.name + " because it's not fully evolved."];
			let uberStones = format.restrictedStones || [];
			let uberPokemon = format.cannotMega || [];
			if (uberPokemon.includes(template.name) || set.ability === 'Power Construct' || uberStones.includes(item.name)) return ["" + template.species + " is not allowed to hold " + item.name + "."];
		},
		onBegin: function () {
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
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
	
	// Bastion 2: UU Singles
	{
		name: "[Gen 7] B2: UU Singles",
		section: "Bastion 2",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3641851/">UU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3641346/">UU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3621217/">UU Sample Teams</a>`,
		],

		mod: 'gen7',
		searchShow: false,
		ruleset: ['[Gen 7] UU'],
	},
	
	// Bastion 2: Rainbow Tier Singles
	{
		name: "[Gen 7] B2: Rainbow Tier Singles",
		section: "Bastion 2",
		desc: [
			`One Pokémon of each tier (OU/UU/RU/NU/PU/ZU) on your team`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		
		onValidateTeam: function (team) {
			let tierCount = {};
			for (const set of team) {
				let item = this.getItem(set.item);
				let tier = toId(this.getTemplate(item.megaEvolves === set.species ? item.megaStone : set.species).tier);
				switch (tier) {
					case 'uubl':
						tier = 'ou';
						break;
					case 'rubl':
						tier = 'uu';
						break;
					case 'nubl':
						tier = 'ru';
						break;
					case 'publ':
						tier = 'nu';
						break;
					case 'zubl':
						tier = 'pu';
						break;
					case 'lc': case 'lcuber': case 'nfe':
						tier = 'zu';
						break;
				}
				if (!tierCount[tier]) {
					tierCount[tier] = 1;
				} else {
					return [`You have two or more Pokemon on the same tier.`];
				}
			}
		},
	},
	
	// Bastion 2: Scalemons
	{
		name: "[Gen 7] B2: Scalemons",
		section: "Bastion 2",
		desc: `Every Pok&eacute;mon's stats, barring HP, are scaled to give them a BST as close to 600 as possible.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3607934/">Scalemons</a>`,
		],
		
		mod: 'gen7',
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: [
			'Abra', 'Carvanha', 'Gastly', 'Gengar-Mega', 'Mawile-Mega', 'Medicham-Mega', 'Shedinja',
			'Arena Trap', 'Huge Power', 'Shadow Tag',
			'Deep Sea Scale', 'Deep Sea Tooth', 'Eevium Z', 'Eviolite', 'Light Ball', 'Thick Club',
			'Baton Pass',
		],
		unbanlist: ['Rayquaza-Mega'],
		
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
	
	// Bastion 3: Tier Shift (with Ubers)
	{
		name: "[Gen 7] B3: Tier Shift (with Ubers)",
		section: "Bastion 3",
		desc: "Pok&eacute;mon below OU get all their stats boosted. Uber get -10, UU/RUBL get +10, RU/NUBL get +20, NU/PUBL get +30, PU/ZUBL get +40, and ZU or lower get +50.",
		threads: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3610073/\">Tier Shift</a>",
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Damp Rock', 'Deep Sea Tooth', 'Eviolite'],
		onModifyTemplate: function(template, target, source, effect) {
			if (!target) return;
			if (!template.abilities) return false;
			/** @type {{[tier: string]: number}} */
			let boosts = {
				'Uber': -10,
				'UU': 10,
				'RUBL': 10,
				'RU': 20,
				'NUBL': 20,
				'NU': 30,
				'PUBL': 30,
				'PU': 40,
				'ZUBL': 40,
				'ZU': 50,
				'NFE': 50,
				'LC Uber': 50,
				'LC': 50,
			};
			let pokemon = this.deepClone(template);
			if (target.set.item) {
				let item = this.getItem(target.set.item);
				if (item.name === 'Kommonium Z' || item.name === 'Mewnium Z') return;
				if (item.megaEvolves === pokemon.species) pokemon.tier = this.getTemplate(item.megaStone).tier;
			}
			if (pokemon.tier[0] === '(') pokemon.tier = pokemon.tier.slice(1, -1);
			if (!(pokemon.tier in boosts)) return;
			if (target.set.ability === 'Drizzle' && pokemon.tier !== 'Uber') return;
			if (target.set.moves.includes('auroraveil') && !['Uber', 'OU', 'UUBL'].includes(pokemon.tier)) pokemon.tier = 'UU';
			if (target.set.ability === 'Drought' && !['Uber', 'OU', 'UUBL', 'UU', 'RUBL'].includes(pokemon.tier)) pokemon.tier = 'RU';

			let boost = boosts[pokemon.tier];
			for (let statName in pokemon.baseStats) {
				if (statName === 'hp') continue;
				pokemon.baseStats[statName] = this.clampIntRange(pokemon.baseStats[statName] + boost, 1, 255);
			}
			return pokemon;
		},
	},
	
	// Bastion 3: Uber Doubles
	{
		name: "[Gen 7] B3: Uber Doubles",
		section: "Bastion 3",

		mod: 'gen7',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard Doubles', 'Team Preview'],
		banlist: ['Dark Void'],
	},
	
	// Bastion 3: Gods and Followers
	{
		name: "[Gen 7] B3: Gods and Followers",
		section: "Bastion 3",
		desc: `The Pok&eacute;mon in the first slot is the God; the Followers must share a type with the God. If the God Pok&eacute;mon faints, the Followers are inflicted with Embargo.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3589187/">Gods and Followers</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		onValidateTeam: function (team, format, teamHas) {
			let problemsArray = [];
			let types = [];
			for (const [i, set] of team.entries()) {
				let item = this.getItem(set.item);
				let template = this.getTemplate(set.species);
				if (!template.exists) return [`The Pok\u00e9mon "${set.name || set.species}" does not exist.`];
				if (i === 0) {
					types = template.types;
					if (template.species.substr(0, 9) === 'Necrozma-' && item.id === 'ultranecroziumz') types = ['Psychic'];
					if (template.species === 'Meloetta' && set.moves.includes('relicsong')) types = ['Normal'];
					if (item.megaStone && template.species === item.megaEvolves) {
						template = this.getTemplate(item.megaStone);
						let baseTemplate = this.getTemplate(item.megaEvolves);
						types = baseTemplate.types.filter(type => template.types.includes(type));
					}
					let problems = TeamValidator('gen7ubers').validateSet(set, teamHas);
					if (problems) problemsArray = problemsArray.concat(problems);
				} else {
					let problems = TeamValidator('gen7ou').validateSet(set, teamHas);
					if (problems) problemsArray = problemsArray.concat(problems);
					let followerTypes = template.types;
					if (item.megaStone && template.species === item.megaEvolves) {
						template = this.getTemplate(item.megaStone);
						let baseTemplate = this.getTemplate(item.megaEvolves);
						if (!(baseTemplate.types.some(type => types.includes(type)) && template.types.some(type => types.includes(type)))) {
							problemsArray.push("Followers with Mega Stone must share a type with the God in both forms.");
						}
						continue;
					}
					if (template.species === 'Meloetta' && set.moves.includes('relicsong')) {
						if (!types.includes("Normal")) {
							problemsArray.push("Meloetta with Relic Song must share Normal type with the God.");
						}
						continue;
					}
					if (!followerTypes.some(type => types.includes(type))) {
						problemsArray.push(
							"Followers must share a type with the God.",
							`(${template.isMega ? template.baseSpecies : template.species} doesn't share a type with ${team[0].species}.)`,
						);
					}
				}
			}
			return problemsArray;
		},
		onBegin: function () {
			for (const side of this.sides) {
				// @ts-ignore
				side.god = side.pokemon[0];
			}
		},
		onFaint: function (pokemon) {
			// @ts-ignore
			if (pokemon.side.pokemonLeft > 1 && pokemon.side.god === pokemon) {
				this.add('-message', pokemon.set.name + " has fallen! " + pokemon.side.name + "'s team has been Embargoed!");
			}
		},
		onSwitchIn: function (pokemon) {
			// @ts-ignore
			if (pokemon.side.god.hp === 0 && pokemon.addVolatile('embargo', pokemon)) delete pokemon.volatiles['embargo'].duration;
		},
	},
	
	// Bastion 4: Generation Singles
	{
		name: "[Gen 7] B4: Generation Singles",
		section: "Bastion 4",
		desc: [
			`Your team can only have one Uber Pokemon and none of the Pokemon can be from the same generation.`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		
		onValidateTeam: function (team) {
			let uberCount = 0;
			let genCount = {};
			let genLimiters = [0, 151, 251, 386, 493, 649, 721];
			for (const set of team) {
				let template = this.getTemplate(set.species);
				let tier = toId(template.tier);
				if (tier === 'uber') uberCount++;
				let gen = 7;
				for (const genLimiter of genLimiters) {
					if (template.num <= genLimiter) {
						gen = genLimiters.indexOf(genLimiter);
						break;
					}
				}
				if (!genCount[gen]) {
					genCount[gen] = 1;
				} else {
					return [`You have more than one gen ${gen} Pokemon.`];
				}
			}
			if (uberCount > 1) return [`You have more than one Uber Pokemon.`];
		},
	},
	
	// Bastion 4: RU Singles
	{
		name: "[Gen 7] B4: RU Singles",
		section: "Bastion 4",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3638874/">RU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3622740/">RU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3622057/">RU Sample Teams</a>`,
		],

		mod: 'gen7',
		searchShow: false,
		ruleset: ['[Gen 7] RU'],
	},
	
	// Bastion 4: Partners in Crime
	/**
	Code:
	- formats.js https://github.com/XpRienzo/DragonHeaven/blob/master/config/formats.js#L3663
	- /mods/pic https://github.com/XpRienzo/DragonHeaven/tree/master/mods/pic
	*/
	{
		name: "[Gen 7] B4: Partners in Crime",
		section: "Bastion 4",
		desc: [
			"Doubles-based metagame where both active ally Pok&eacute;mon share abilities and moves.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3618488/\">Partners in Crime</a>",
		],

		mod: 'pic',
		gameType: 'doubles',
		ruleset: ['[Gen 7] Doubles OU', 'Sleep Clause Mod'],
		banlist: ['Huge Power', 'Imposter', 'Pure Power', 'Wonder Guard', 'Normalize', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Mimic', 'Sketch', 'Transform'],
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
	
	// Bastion 5: Monotype Singles (no Steel)
	{
		name: "[Gen 7] B5: Monotype Singles (ORIGINAL META, DO NOT STEEL)",
		section: "Bastion 5",
		desc: `All the Pok&eacute;mon on a team must share a type. Steel type doesn't count.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3621036/">Monotype Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3622349">Monotype Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3599682/">Monotype Sample Teams</a>`,
		],

		mod: 'gen7',
		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview'],
		banlist: [
			'Aegislash', 'Arceus', 'Blaziken', 'Darkrai', 'Deoxys-Base', 'Deoxys-Attack', 'Dialga', 'Genesect', 'Gengar-Mega', 'Giratina', 'Groudon',
			'Ho-Oh', 'Hoopa-Unbound', 'Kangaskhan-Mega', 'Kartana', 'Kyogre', 'Kyurem-White', 'Lucario-Mega', 'Lugia', 'Lunala', 'Magearna',
			'Marshadow', 'Mawile-Mega', 'Medicham-Mega', 'Metagross-Mega', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia',
			'Pheromosa', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Solgaleo', 'Tapu Lele', 'Xerneas', 'Yveltal', 'Zekrom', 'Zygarde',
			'Battle Bond', 'Shadow Tag', 'Damp Rock', 'Smooth Rock', 'Terrain Extender', 'Baton Pass',
		],
		
		onValidateTeam: function (team) {
			/**@type {string[]} */
			let typeTable;
			for (const [i, set] of team.entries()) {
				let template = this.getTemplate(set.species);
				if (!template.types) return [`Invalid pokemon ${set.name || set.species}`];
				if (i === 0) {
					typeTable = template.types;
				} else {
					// @ts-ignore
					typeTable = typeTable.filter(type => template.types.includes(type));
				}
				if (this.gen >= 7) {
					let item = this.getItem(set.item);
					if (item.megaStone && template.species === item.megaEvolves) {
						template = this.getTemplate(item.megaStone);
						typeTable = typeTable.filter(type => template.types.includes(type));
					}
					if (item.id === "ultranecroziumz" && template.baseSpecies === "Necrozma") {
						template = this.getTemplate("Necrozma-Ultra");
						typeTable = typeTable.filter(type => template.types.includes(type));
					}
				}
				if (!typeTable.length || (typeTable.length === 1 && typeTable[0] === 'Steel')) return [`Your team must share a type that is not Steel.`];
			}
		},
	},
	
	// Bastion 5: Gen 7 Triples
	{
		name: "[Gen 7] B5: Gen 7 Triples",
		section: "Bastion 5",
		
		mod: 'gen7',
		gameType: 'triples',
		searchShow: false,
		ruleset: ['[Gen 7] Doubles Ubers'],
	},
	
	// Bastion 5: New School Machops
	{
		name: "[Gen 7] B5: New School Machops",
		section: "Bastion 5",
		desc: [
			"No Gen 1/Gen 2 Pokemon or Gen 1 moves allowed",
		],
		
		ruleset: ['[Gen 7] Ubers'],
		banlist: [],
		onValidateSet: function (set) {
			let problems = [];
			let moves = set.moves;
			let template = this.getTemplate(set.species);
			let name = set.name || set.species;
			if ([1, 2].includes(template.gen)) {
				return [`${template.species} is banned.`, `(Gen 1 and 2 Pok\u00e9mon are banned)`];
			}
			for (let i = 0; i < moves.length; i++) {
				let move = this.getMove(moves[i]);
				if (move.gen === 1) {
					problems.push(`${name}'s move ${set.moves[i]} is banned. (Gen 1 moves are banned)`);
				}
			}
			return problems;
		},
	},
	
	// Bastion 6: Camomons
	{
		name: "[Gen 7] B6: Camomons",
		section: "Bastion 6",
		desc: `Pok&eacute;mon change type to match their first two moves.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Camomons</a>`,
		],
		
		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Kartana', 'Kyurem-Black', 'Shedinja'],
		onModifyTemplate: function (template, target, source) {
			if (!target) return; // Chat command
			let types = [...new Set(target.set.moves.slice(0, 2).map(move => this.getMove(move).type))];
			return Object.assign({}, template, {types: types});
		},
		onSwitchIn: function (pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[silent]');
		},
		onAfterMega: function (pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[silent]');
		},
	},
	
	// Bastion 6: PU Singles
	{
		name: "[Gen 7] B6: PU Singles",
		section: "Bastion 6",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645983/">PU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3614892/">PU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3614470/">PU Sample Teams</a>`,
		],

		mod: 'gen7',
		searchShow: false,
		ruleset: ['[Gen 7] PU'],
	},
	
	// Bastion 6: Melmetal Special
	{
		name: "[Gen 7] B6: Melmetal Special",
		desc: [
			"All Pokemon must either be Steel-type OR have 2 Steel-type moves",
		],
		section: "Bastion 6",
		
		ruleset: ['[Gen 7] Ubers'],
		banlist: [],
		onValidateSet: function (set) {
			let moves = set.moves;
			let steelMoveCount = 0;
			let template = this.getTemplate(set.species);
			let name = set.name || set.species;
			for (let i = 0; i < moves.length; i++) {
				let move = this.getMove(moves[i]);
				if (move.type === "Steel") steelMoveCount++;
			}
			if (!template.types.includes("Steel") && steelMoveCount < 2) {
				return [`${name} is neither Steel-type nor have 2 Steel-type moves.`];
			}
		},
	},
	
	// Bastion 7: Old School Waffles
	{
		name: "[Gen 7] B7: Old School Waffles",
		section: "Bastion 7",
		desc: [
			"Only Gen 1 and Gen 2 Pokemon allowed. OU rules and banlist applies.",
		],
		
		ruleset: ['[Gen 7] OU'],
		banlist: [],
		onValidateSet: function (set) {
			let problems = [];
			let moves = set.moves;
			let template = this.getTemplate(set.species);
			let genLimiters = [0, 151, 251, 386, 493, 649, 721];
			let gen = 7;
			for (const genLimiter of genLimiters) {
				if (template.num <= genLimiter) {
					gen = genLimiters.indexOf(genLimiter);
					break;
				}
			}
			if (![1, 2].includes(gen)) {
				return [`${template.species} is banned.`, `(Only Gen 1 and Gen 2 Pokemon are allowed.)`];
			}
			return problems;
		},
	},
	
	// Bastion 7: Middle School Lunch
	{
		name: "[Gen 7] B7: Middle School Lunch",
		section: "Bastion 7",
		desc: [
			"Only Gen 3, 4 and 5 Pokemon allowed. OU rules and banlist applies.",
		],
		
		ruleset: ['[Gen 7] OU'],
		banlist: [],
		onValidateSet: function (set) {
			let problems = [];
			let moves = set.moves;
			let template = this.getTemplate(set.species);
			let genLimiters = [0, 151, 251, 386, 493, 649, 721];
			let gen = 7;
			for (const genLimiter of genLimiters) {
				if (template.num <= genLimiter) {
					gen = genLimiters.indexOf(genLimiter);
					break;
				}
			}
			if (![3, 4, 5].includes(gen)) {
				return [`${template.species} is banned.`, `(Only Gen 3, 4 and 5 Pokemon are allowed.)`];
			}
			return problems;
		},
	},
	
	// Bastion 7: New School Pepperoni
	{
		name: "[Gen 7] B7: New School Pepperoni",
		section: "Bastion 7",
		desc: [
			"Only Gen 6 and Gen 7 Pokemon allowed. OU rules and banlist applies.",
		],
		
		ruleset: ['[Gen 7] OU'],
		banlist: [],
		onValidateSet: function (set) {
			let problems = [];
			let moves = set.moves;
			let template = this.getTemplate(set.species);
			let genLimiters = [0, 151, 251, 386, 493, 649, 721];
			let gen = 7;
			for (const genLimiter of genLimiters) {
				if (template.num <= genLimiter) {
					gen = genLimiters.indexOf(genLimiter);
					break;
				}
			}
			if (![6, 7].includes(gen)) {
				return [`${template.species} is banned.`, `(Only Gen 6 and Gen 7 Pokemon are allowed.)`];
			}
			return problems;
		},
	},
	
	// Bastion 7: Big Guns Show
	{
		name: "[Gen 7] B7: Big Guns Show",
		section: "Bastion 7",
		desc: [
			`2 Pokémon of each tier (Uber/OU/UU) on your team`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		banlist: [
			'Arceus', 'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Lugia', 'Ho-Oh', 'Lunala', 'Yveltal', 'Kyogre',
			'Red Orb',
		],
		teamLength: {
			validate: [6, 6],
			battle: 6,
		},
		
		onValidateTeam: function (team) {
			let tierCount = {};
			for (const set of team) {
				let item = this.getItem(set.item);
				let tier = toId(this.getTemplate(item.megaEvolves === set.species ? item.megaStone : set.species).tier);
				switch (tier) {
					case 'uubl':
						tier = 'ou';
						break;
					case 'rubl':
						tier = 'uu';
						break;
					case 'nubl':
						tier = 'ru';
						break;
					case 'publ':
						tier = 'nu';
						break;
					case 'zubl':
						tier = 'pu';
						break;
					case 'lc': case 'lcuber': case 'nfe':
						tier = 'zu';
						break;
				}
				if (['ru', 'nu', 'pu', 'zu'].includes(tier)) {
					return [`Pokemon in tier ${tier} are banned.`];
				} else if (!tierCount[tier]) {
					tierCount[tier] = 1;
				} else if (tierCount[tier] >= 2) {
					return [`You have more than 2 Pokemon in tier ${tier}.`];
				} else {
					tierCount[tier]++;
				}
			}
		},
	},
	
	// Bastion 7: Vendor Trashscaping
	{
		name: "[Gen 7] B7: Vendor Trashscaping",
		section: "Bastion 7",
		desc: [
			`2 Pokémon of each tier (RU/NU/PU/ZU) on your team`,
		],

		mod: 'twentyfour',
		ruleset: ['[Gen 7] RU'],
		banlist: ['Beat Up'],
		teamLength: {
			validate: [8, 8],
			battle: 8,
		},
		
		onValidateTeam: function (team) {
			let tierCount = {};
			for (const set of team) {
				let item = this.getItem(set.item);
				let tier = toId(this.getTemplate(item.megaEvolves === set.species ? item.megaStone : set.species).tier);
				switch (tier) {
					case 'uubl':
						tier = 'ou';
						break;
					case 'rubl':
						tier = 'uu';
						break;
					case 'nubl':
						tier = 'ru';
						break;
					case 'publ':
						tier = 'nu';
						break;
					case 'zubl':
						tier = 'pu';
						break;
					case 'lc': case 'lcuber': case 'nfe':
						tier = 'zu';
						break;
				}
				if (!['ru', 'nu', 'pu', 'zu'].includes(tier)) {
					return [`Pokemon in tier ${tier} are banned.`];
				} else if (!tierCount[tier]) {
					tierCount[tier] = 1;
				} else if (tierCount[tier] >= 2) {
					return [`You have more than 2 Pokemon in tier ${tier}.`];
				} else {
					tierCount[tier]++;
				}
			}
		},
	},
];