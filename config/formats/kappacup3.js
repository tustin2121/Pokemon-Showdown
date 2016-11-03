// Metas for Kappa Cup Season 3

exports.Sections = {
	"Kappa Cup Season 3": { column: 4, sort: 4, },
};
exports.Formats = [
	{
		name: "Uber Tier Shift",
		desc: [
			"Pok&eacute;mon get all their stats boosted/nerfed according to tiers. Uber get -5, UU/BL2 get +5, RU/BL3 get +10, NU/BL4 get +15, PU get +20, and FU and lower get +25.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3554765/\">Tier Shift</a>",
		],
		section: "Kappa Cup Season 3",
		column: 4,

		mod: 'ubertiershift',
		ruleset: ['Ubers'],
		banlist: [],
	},
	{
		name: "Mix and Mega Doubles",
		section: "Kappa Cup Season 3",

		mod: 'mixandmega',
		gameType: 'doubles',
		ruleset: ['Doubles Ubers'],
		banlist: ['Gengarite', 'Shadow Tag', 'Dynamic Punch', 'Zap Cannon', 'Electrify'],
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
			let uberStones = ['beedrillite', 'gengarite', 'kangaskhanite', 'mawilite', 'medichamite'];
			if (template.tier === 'Uber' || uberStones.indexOf(item.id) >= 0) return ["" + template.species + " is not allowed to hold " + item.name + "."];
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
	{
		name: "Uber Alphabet Cup",
		section: "Kappa Cup Season 3",

		searchShow: false,
		ruleset: ['Pokemon', 'Team Preview', 'Standard'],
		banlist: ['Swoobat', 'Ignore Alphabet Moves'],
		onValidateTeam: function (team, format) {
			let letters = {};
			let letter = '';
			for (let i = 0; i < team.length; i++) {
				letter = Tools.getTemplate(team[i]).species.slice(0, 1).toUpperCase();
				if (letter in letters) return ['Your team cannot have more that one Pokémon starting with the letter "' + letter + '".'];
				letters[letter] = 1;
			}
		},
	},
	{
		name: "Ubers Got Talent",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3569554/\">Got Talent</a>"],
		section: "Kappa Cup Season 3",

		mod: 'gottalent',
		ruleset: ['Ubers'],
		banlist: ['Shuckle', 'Speed Boost'],
	},
	{
		name: "Cross Evolution+",
		section: "Kappa Cup Season 3",

		ruleset: ['Ubers', 'Baton Pass Clause'],
		onValidateTeam: function (team) {
			let nameTable = {};
			for (let i = 0; i < team.length; i++) {
				let name = team[i].name;
				if (name) {
					if (nameTable[name]) {
						return ["Your Pokémon must have different nicknames.", "(You have more than one " + name + ")"];
					}
					nameTable[name] = true;
				}
			}
		},
		// Note: "validateSet" = replace set validation rules. "onValidateSet" = additional set rules.
		// Also, "validateTeam" = completely replace all validation.
		validateSet: function (set, teamHas) {
			let crossTemplate = this.tools.getTemplate(set.name);
			if (!crossTemplate.exists) return this.validateSet(set, teamHas);
			let template = this.tools.getTemplate(set.species);
			if (!template.exists) return ["The Pokemon '" + set.species + "' does not exist."];
			if (!template.evos.length) return ["" + template.species + " cannot cross evolve because it doesn't evolve."];
			if (crossTemplate.species == 'Shedinja' || crossTemplate.species == 'Gyarados') return ["" + template.species + " cannot cross evolve into " + crossTemplate.species + " because it is a banned evolution."];
			if (template.species == 'Scyther' || template.species == 'Sneasel' || template.species == 'Archen') return ["" + template.species + " cannot cross evolve into " + crossTemplate.species + " because it is banned from cross evolving."];
			if (crossTemplate.battleOnly || !crossTemplate.prevo) return ["" + template.species + " cannot cross evolve into " + crossTemplate.species + " because it isn't an evolution."];
			let crossPrevoTemplate = this.tools.getTemplate(crossTemplate.prevo);
			if (!crossPrevoTemplate.prevo !== !template.prevo) return ["" + template.species + " cannot cross into " + crossTemplate.species + " because they are not consecutive evolutionary stages."];

			// Make sure no stat is too high/low to cross evolve to
			let stats = {'hp': 'HP', 'atk': 'Attack', 'def': 'Defense', 'spa': 'Special Attack', 'spd': 'Special Defense', 'spe': 'Speed'};
			for (let statid in template.baseStats) {
				let evoStat = template.baseStats[statid] + crossTemplate.baseStats[statid] - crossPrevoTemplate.baseStats[statid];
				if (evoStat < 1) {
					return ["" + template.species + " cannot cross evolve to " + crossTemplate.species + " because its " + stats[statid] + " would be too low."];
				} else if (evoStat > 255) {
					return ["" + template.species + " cannot cross evolve to " + crossTemplate.species + " because its " + stats[statid] + " would be too high."];
				}
			}

			let mixedTemplate = Object.assign({}, template);
			// Ability test
			let ability = this.tools.getAbility(set.ability);
			if (ability.name !== 'Huge Power' && ability.name !== 'Pure Power' && ability.name !== 'Shadow Tag') mixedTemplate.abilities = crossTemplate.abilities;

			mixedTemplate.learnset = Object.assign({}, template.learnset);
			let newMoves = 0;
			for (let i in set.moves) {
				let move = toId(set.moves[i]);
				if (!this.checkLearnset(move, template)) continue;
				if (this.checkLearnset(move, crossTemplate)) continue;
				if (++newMoves > 2) continue;
				mixedTemplate.learnset[move] = ['6T'];
			}
			return this.validateSet(set, teamHas, mixedTemplate);
		},
		onBegin: function () {
			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (let i = 0, len = allPokemon.length; i < len; i++) {
				let pokemon = allPokemon[i];
                                if (pokemon.set.name === pokemon.set.species) continue;
				let crossTemplate = this.getTemplate(pokemon.name);
				if (!crossTemplate.exists) continue;
				try {
				let template = pokemon.baseTemplate;
				let crossPrevoTemplate = this.getTemplate(crossTemplate.prevo);
				let mixedTemplate = Object.assign({}, template);
				mixedTemplate.baseSpecies = mixedTemplate.species = template.species + '-' + crossTemplate.species;
				mixedTemplate.weightkg = Math.max(0.1, template.weightkg + crossTemplate.weightkg - crossPrevoTemplate.weightkg);
				mixedTemplate.nfe = false;

				mixedTemplate.baseStats = {};
				for (let statid in template.baseStats) {
					mixedTemplate.baseStats[statid] = template.baseStats[statid] + crossTemplate.baseStats[statid] - crossPrevoTemplate.baseStats[statid];
				}
				pokemon.hp = pokemon.maxhp = Math.floor(Math.floor(2 * mixedTemplate.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] >> 2) + 100) * pokemon.level / 100 + 10);

				mixedTemplate.types = template.types.slice();
				if (crossTemplate.types[0] !== crossPrevoTemplate.types[0]) mixedTemplate.types[0] = crossTemplate.types[0];
				if (crossTemplate.types[1] !== crossPrevoTemplate.types[1]) mixedTemplate.types[1] = crossTemplate.types[1] || crossTemplate.types[0];
				if (mixedTemplate.types[0] === mixedTemplate.types[1]) mixedTemplate.types.length = 1;

				pokemon.baseTemplate = mixedTemplate;
				pokemon.formeChange(mixedTemplate);
				pokemon.crossEvolved = true;
				} catch (e) {
					this.add('-hint', 'Failed to cross evolve ' + pokemon.baseTemplate.species + ' to ' + crossTemplate.species + '. Please report this error so that it can be fixed.');
				}
			}
		},
		onSwitchInPriority: 1,
		onSwitchIn: function (pokemon) {
			if (pokemon.crossEvolved) {
				this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[silent]');
			}
		},
	},
	{
		name: "Trademarked-EX",
		section: "Kappa Cup Season 3",

		mod: 'trademark',
		ruleset: ['Ubers'],
		banlist: ['Ignore Illegal Abilities'],

		onValidateTeam: function (team) {
			let abilityTable = {};
			let restrictedCount = 0;
			for (let i = 0; i < team.length; i++) {
				let ability = team[i].ability;
				if (ability && ability.isTrademark) {
					if (abilityTable[name]) {
						return ["Your Pokémon must have different trademarked abilities.", "(You have more than one Pokémon with the " + ability + " trademark)"];
					}
					if (ability === "partingshot" || ability === "batonpass" || ability === "protect" || ability === "spikyshield") {
						restrictedCount++;
					}
					abilityTable[name] = true;
				}
			}
			if (restrictedCount > 1) {
				return ["You can only have one of Parting Shot, Baton Pass, Protect and Spiky Shield as a trademark."];
			}
		},
		onValidateSet: function (set) {
			let bannedTrademarks = [
				'Block', 'Mean Look', 'Spider Web', 'Nature Power', 'Heal Pulse', 'Confuse Ray',
				'Flatter', 'Swagger', 'Teeter Dance', 'Supersonic', 'Sweet Kiss', 'Detect', 'Copycat',
				'Destiny Bond', 'Me First', 'Mimic', 'Mirror Move', 'Sketch', 'Mat Block', 'Skill Swap',
				'Roar', 'Whirlwind', 'Assist',
			];
			let move = this.getMove(set.ability);
			if (!move.exists) {
				let abilities = this.getTemplate(set.species).abilities;
				let legalAbility = false;
				for (let a in abilities) {
					if (abilities[a] === set.ability) {
						legalAbility = true;
					}
				}
				return !legalAbility ? ['' + set.species + ' cannot have ' + set.ability] : [];
			}
			if (bannedTrademarks.includes(move.name)) {
				return [move.name + ' is a banned trademark.', '(' + set.species + ' has ' + move.name + ' as a trademark.)'];
			}
			if (set.species === 'Slaking' || set.species === 'Regigigas' || this.getTemplate(set.species).tier === 'Uber') {
				return [set.species + ' can\'t use trademarked moves.', '(' + set.species + ' has ' + move.name + '.)'];
			}
			if (move.name === 'Roar' || move.name === 'Whirlwind') return ['' + set.species + ' has an illegal trademark ability', '(' + move.name + ' is not allowed as a trademark ability)'];
			if (move.category !== 'Status') return ['You can only trademark status moves', '(' + set.species + '\'s trademark is ' + move.name + ')'];
			if (set.moves.indexOf(move.name) >= 0) return ['You cannot use a move that is trademarked', '(' + set.species + ' has ' + move.name + ' as ability and a move)'];

			let template = this.getTemplate(set.species);
			template = this.getTemplate(template.baseSpecies);
			let added = {};
			let canLearn = set.species === 'Smeargle';
			do {
				// We don't care for how it obtains the move as long as the Pokemon learns it
				added[template.species] = true;
				if (template.learnset[move.id]) {
					canLearn = true;
					break;
				}
				if (template.prevo) {
					template = this.getTemplate(template.prevo);
				}
			} while (template && template.species && !added[template.species]);
			if (!canLearn) {
				return ['' + set.species + ' cannot learn ' + move.name];
			}
		},
	},
	{
		name: 'Classic Stat Switch',
		section: 'Kappa Cup Season 3',

		mod: 'classicstatswitch',
		ruleset: ['Ubers', 'Baton Pass Clause'],
		banlist: ['Azumarill', 'Regirock', 'Regice', 'Mawilite', 'Diancite'],
		onModifyMove: function (move) {
			if (move.category == "Status") return;
			let physicalTypes = [
				'Normal', 'Fighting', 'Flying', 'Ground', 'Rock', 'Bug',
				'Ghost', 'Poison', 'Steel',
			];
			if (physicalTypes.includes(move.type)) {
				move.category = "Physical";
			} else {
				move.category = "Special";
			}
		},
		onModifyMovePriority: -100,
	},
	{
		name: "Hidden Type",
		desc: [
			"Pok&eacute;mon have an added type determined by their IVs. Same as the Hidden Power type.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3516349/\">Hidden Type</a>",
		],
		section: "Kappa Cup Season 3",

		searchShow: false,
		mod: 'hiddentype',
		ruleset: ['OU'],
	},
	{
		name: "Reverse Type Matchup",
		desc: [
			"The Attackers and Defenders on the type chart are reversed.",
		],
		section: "Kappa Cup Season 3",

		mod: 'reverse',
		ruleset: ['Ubers'],
	},
	{
		name: "Linked",
		desc: [
			"The first and second moves of Pok&eacute;mon become linked. These moves are in turn used one after the other.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3524254/\">Linked</a>",
		],
		section: "Kappa Cup Season 3",

		mod: 'linked',
		ruleset: ['Ubers'],
		banlist: ['Razor Fang', "King's Rock"],
		
		onValidateTeam: function (team, format) {
			var hasChoice = false;
			for (var i = 0; i < team.length; i++) {
				var item = toId(team[i].item);
				if (!item) continue;
				if (item === 'choiceband' || item === 'choicescarf' || item === 'choicespecs') {
					if (hasChoice) return ["You are limited to one Choice item."];
					hasChoice = true;
				}
			}
		},
		onValidateSet: function (set) {
			if (set.moves && set.moves.length >= 2) {
				var moves = [toId(set.moves[0]), toId(set.moves[1])];
				if (moves.indexOf('craftyshield') >= 0 || moves.indexOf('detect') >= 0 || moves.indexOf('kingsshield') >= 0 || moves.indexOf('protect') >= 0 || moves.indexOf('spikyshield') >= 0) {
					return ["Linking protect moves is banned."];
				}
				if (moves.indexOf('superfang') >= 0 && (moves.indexOf('nightshade') >= 0 || moves.indexOf('seismictoss') >= 0)) {
					return ["Linking Super Fang with Night Shade or Seismic Toss is banned."];
				}
				if (this.getMove(moves[0]).flags['charge'] || this.getMove(moves[1]).flags['charge']) {
					return ["Linking two turn moves is banned."];
				}
			}
		}
	},
];