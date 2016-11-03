// This is a list of OMs we're keeping around, even if showdown has removed them.

exports.Formats = [

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		name: "Acid Rain",
		section: "OM of the Week",
		column: 2,

		mod: 'acidrain',
		onBegin: function () {
			this.setWeather('raindance');
			delete this.weatherData.duration;
			this.add('-message', "Eh, close enough.");
		},
		ruleset: ['OU'],
		banlist: ['Weather Ball', 'Castform'],
		
		__subsort: -1,
	},
	{
		name: "Old School Machops",
		section: "OM of the Week",

		ruleset: ['Ubers'],
		banlist: [],
		onValidateSet: function (set) {
			let moves = set.moves;
			let problems = [];
			let name = set.name || set.species;
			for (let i = 0; i < moves.length; i++) {
				let move = this.getMove(moves[i]);
				if (move.gen !== 1 && move.id !== 'hiddenpower') {
					problems.push(name + "'s move " + set.moves[i] + " is banned.");
				}
			}
			return problems;
		},
	},
	{
		name: "5 Star Battalion",
		section: "OM of the Week",

		ruleset: ['Ubers'],
		banlist: ['Allow More Moves'],
		onValidateSet: function (set) {
			if (set.moves && set.moves.length > 5) {
				return [(set.name || set.species) + ' has more than five moves.'];
			}
		},
	},
	{
		name: "Extreme Tier Shift",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3540047/\">Extreme Tier Shift</a>"],
		section: "OM of the Month",
		column: 2,

		mod: 'extremetiershift',
		ruleset: ['Ubers'],
		banlist: ['Eviolite'],
	},
	{
		name: "BH Doubles",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3489849/\">Balanced Hackmons</a>"],
		section: "OM of the Month",

		gameType: 'doubles',
		ruleset: ['Balanced Hackmons'],
		banlist: [],
		
		__subsort: formats => formats[toId("Balanced Hackmons")].__subsort+0.1,
	},
	{
		name: "Return'd",
		desc: [
			"The base power of the move in the first slot is determined the same way as Return.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3566102/\">Return'd</a>",
		],
		section: "OM of the Month",

		ruleset: ['OU'],
		banlist: ['Pinsirite'],
		onModifyMovePriority: 2,
		onModifyMove: function (move, pokemon) {
			if (move.basePower > 0 && !move.multihit && pokemon.moves.indexOf(move.id) === 0) {
				move.basePower = Math.floor((pokemon.happiness * 10) / 25) || 1;
			}
		},
	},
	// {
	// 	name: "Groundsource",
	// 	section: "Other Metagames",
	// 	column: 2,

	// 	ruleset: ['Pokemon', 'Team Preview', 'Groundsource Mod', 'HP Percentage Mod', 'Cancel Mod'],
	// 	banlist: [],
	// },
	{
		name: "Almost Any Ability",
		desc: [
			"Pok&eacute;mon can use any ability, barring the few that are banned.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3528058/\">Almost Any Ability</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3578707/\">AAA Resources</a>",
		],
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Ability Clause', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Ignore Illegal Abilities',
			'Arceus', 'Archeops', 'Bisharp', 'Chatot', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Dragonite', 'Giratina', 'Giratina-Origin', 'Groudon',
			'Ho-Oh', 'Hoopa-Unbound', 'Keldeo', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Mamoswine', 'Mewtwo', 'Palkia', 'Rayquaza', 'Regigigas',
			'Reshiram', 'Shaymin-Sky', 'Shedinja', 'Slaking', 'Smeargle', 'Snorlax', 'Suicune', 'Terrakion', 'Weavile', 'Xerneas', 'Yveltal', 'Zekrom',
			'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite', 'Soul Dew', 'Shadow Tag', 'Dynamic Punch', 'Zap Cannon',
		],
		onValidateSet: function (set) {
			let bannedAbilities = {'Arena Trap': 1, 'Contrary': 1, 'Fur Coat': 1, 'Huge Power': 1, 'Illusion': 1, 'Imposter': 1, 'Parental Bond': 1, 'Protean': 1, 'Pure Power': 1, 'Simple':1, 'Speed Boost': 1, 'Wonder Guard': 1};
			if (set.ability in bannedAbilities) {
				let template = this.getTemplate(set.species || set.name);
				let legalAbility = false;
				for (let i in template.abilities) {
					if (set.ability === template.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return ['The ability ' + set.ability + ' is banned on Pok\u00e9mon that do not naturally have it.'];
			}
		},
	},
	{
		name: "Gendermons",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Aegislash', 'Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Dialga', 'Genesect', 'Gengarite', 'Giratina',
			'Greninja', 'Groudon', 'Ho-Oh', 'Hoopa-Unbound', 'Kyogre', 'Kyurem-White', 'Lucarionite', 'Lugia',
			'Mawilite', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Salamencite', 'Shaymin-Sky', 'Xerneas',
			'Yveltal', 'Zekrom', 'Soul Dew', 'Shadow Tag',
		],
		onModifyAtkPriority: 42,
		onModifyAtk: function (atk, pokemon) {
			if (pokemon.gender === 'M') {
				return this.chainModify(1.3);
			} else if (pokemon.gender === 'F') {
				return this.chainModify(0.75);
			}
		},
		onModifyDefPriority: 42,
		onModifyDef: function (def, pokemon) {
			if (pokemon.gender === 'M') {
				return this.chainModify(1.3);
			} else if (pokemon.gender === 'F') {
				return this.chainModify(0.75);
			}
		},
		onModifySpAPriority: 42,
		onModifySpA: function (spa, pokemon) {
			if (pokemon.gender === 'F') {
				return this.chainModify(1.3);
			} else if (pokemon.gender === 'M') {
				return this.chainModify(0.75);
			}
		},
		onModifySpDPriority: 42,
		onModifySpD: function (spd, pokemon) {
			if (pokemon.gender === 'F') {
				return this.chainModify(1.3);
			} else if (pokemon.gender === 'M') {
				return this.chainModify(0.75);
			}
		},
	},
	{
		name: "Mix and Mega",
		desc: [
			"Mega Stones and Primal Orbs can be used on almost any fully evolved Pok&eacute;mon with no Mega Evolution limit.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3540979/\">Mix and Mega</a>",
		],
		section: "Other Metagames",

		searchShow: false,
		mod: 'mixandmega',
		ruleset: ['Ubers', 'Baton Pass Clause'],
		banlist: ['Dynamic Punch', 'Electrify', 'Zap Cannon'],
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
		name: "Type Omelette",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: [],
		mod: 'typeomelette',
		//Since this metagame uses custom types, let's make the types known to the players.
		onSwitchIn: function (pokemon) {
			let typeStr = pokemon.types[0];
			if (pokemon.types[1]) typeStr += '/' + pokemon.types[1];
			this.add('-start', pokemon, 'typechange', typeStr);
		},
	},

	{
		name: "Accessorize",
		desc: ["&bullet; <a href=\"http://www.smogon.com/forums/threads/3546902/\">Accessorize</a>"],
		section: "Other Metagames",

		mod: 'accessorize',
		ruleset: ['Ubers'],
		onValidateSet: function (set) {
			let template = this.getTemplate(set.species || set.name);
			let item = this.getItem(set.item);
			switch (item.id) {
			case 'charcoal': case 'spelltag': case 'magnet': case 'sharpbeak': case 'dragonfang': case 'nevermeltice':
				if (template.baseStats.def <= 5 || template.baseStats.spd <= 5) return ["" + template.species + " does not have enough Def. or Sp. Def. to hold " + item.name + "."];
				break;
			case 'mysticwater': case 'hardstone': case 'cherishball': case 'metalcoat': case 'miracleseed': case 'poisonbarb':
				if (template.baseStats.spe <= 10) return ["" + template.species + " does not have enough Speed to hold " + item.name + "."];
				break;
			case 'twistedspoon': case 'silkscarf': case 'blackglasses':
				if (template.baseStats.def <= 10) return ["" + template.species + " does not have enough Defense to hold " + item.name + "."];
				break;
			case 'silverpowder': case 'softsand': case 'blackbelt':
				if (template.baseStats.spd <= 10) return ["" + template.species + " does not have enough Special Defense to hold " + item.name + "."];
				break;
			}
		},
	},
	{
		name: "Protean Palace",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite'],
		onBeforeMove: function (pokemon, target, move) {
			if (!move) return;
			let moveType = '';
			if (move.id === 'hiddenpower') {
				moveType = pokemon.hpType;
			} else if (move.type === 'Normal' && (pokemon.ignore ? !pokemon.ignore['Ability'] : true)) {
				switch (pokemon.ability) {
				case 'aerilate':
					moveType = 'Flying';
					break;
				case 'pixilate':
					moveType = 'Fairy';
					break;
				case 'refrigerate':
					moveType = 'Ice';
					break;
				default:
					moveType = 'Normal';
				}
			} else {
				moveType = move.type;
			}
			if (pokemon.getTypes().join() !== moveType) {
				this.add('-start', pokemon, 'typechange', moveType);
				pokemon.setType(moveType);
			}
		},
	},

];