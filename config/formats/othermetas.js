// This is a list of OMs we're keeping around, even if showdown has removed them.

exports.Formats = [

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 0] Acid Rain",
		section: "Other Metagames",

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
		name: "[Gen 0] Old School Machops",
		section: "Other Metagames",
		
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
		name: "[Gen 0] 5 Star Battalion",
		section: "Other Metagames",
		
		ruleset: ['Ubers'],
		banlist: ['Allow More Moves'],
		onValidateSet: function (set) {
			if (set.moves && set.moves.length > 5) {
				return [(set.name || set.species) + ' has more than five moves.'];
			}
		},
	},
	{
		name: "[Gen 0] Extreme Tier Shift",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3540047/\">Extreme Tier Shift</a>"],
		section: "Other Metagames",

		mod: 'extremetiershift',
		ruleset: ['Ubers'],
		banlist: ['Eviolite'],
	},
	{
		name: "[Gen 0] BH Doubles",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3489849/\">Balanced Hackmons</a>"],
		section: "Other Metagames",

		gameType: 'doubles',
		ruleset: ['Balanced Hackmons'],
		banlist: [],
		
		// __subsort: subSortOf => subSortOf("Balanced Hackmons")+0.1,
	},
	{
		name: "[Gen 0] Return'd",
		desc: [
			"The base power of the move in the first slot is determined the same way as Return.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3566102/\">Return'd</a>",
		],
		section: "Other Metagames",

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
		name: "[Gen 0] Almost Any Ability",
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
		name: "[Gen 0] Gendermons",
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
	//* Uncomment this if Mix and Mega is ever removed from smogon's formats, for whatever reason.
	{
		name: "[Gen 7] Mix and Mega",
		overrides: 'ensure', //If smogon ever removes this format, we'll still have it.
		desc: [
			"Mega Stones and Primal Orbs can be used on almost any fully evolved Pok&eacute;mon with no Mega Evolution limit.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3587740/\">Mix and Mega</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3591580/\">Mix and Mega Resources</a>",
			"&bullet; <a href=\"https://www.smogon.com/tiers/om/analyses/mix_and_mega/\">Mix and Mega Analyses</a>",
		],

		mod: 'mixandmega',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Mega Rayquaza Clause', 'Team Preview'],
		banlist: ['Baton Pass', 'Electrify'],
		onValidateTeam: function (team) {
			let itemTable = {};
			for (let i = 0; i < team.length; i++) {
				let item = this.getItem(team[i].item);
				if (!item) continue;
				if (!(item in itemTable)) {
					itemTable[item] = 1;
				} else if (itemTable[item] < 2) {
					itemTable[item]++;
				} else {
					if (item.megaStone) return ["You are limited to two of each Mega Stone.", "(You have more than two " + this.getItem(item).name + ")"];
					if (item.id === 'blueorb' || item.id === 'redorb') return ["You are limited to two of each Primal Orb.", "(You have more than two " + this.getItem(item).name + ")"];
				}
			}
		},
		onValidateSet: function (set) {
			let template = this.getTemplate(set.species || set.name);
			let item = this.getItem(set.item);
			if (!item.megaEvolves && item.id !== 'blueorb' && item.id !== 'redorb') return;
			if (template.baseSpecies === item.megaEvolves || (template.baseSpecies === 'Groudon' && item.id === 'redorb') || (template.baseSpecies === 'Kyogre' && item.id === 'blueorb')) return;
			if (template.evos.length) return ["" + template.species + " is not allowed to hold " + item.name + " because it's not fully evolved."];
			let uberStones = ['beedrillite', 'blazikenite', 'gengarite', 'kangaskhanite', 'mawilite', 'medichamite'];
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
	{
		name: "[Gen 0] Type Omelette",
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
		name: "[Gen 0] Accessorize",
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
		name: "[Gen 0] Protean Palace",
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
	{
		name: "FU",
		desc: [
			"The tier below PU. Only available here!",
		],
		section: "ORAS Singles",

		ruleset: ['PU'],
		banlist: ['PU', 'Chatter'],
		
		__subsort: subSortOf => subSortOf("PU")+0.1,
	},
	{
		name: "LC Supreme",
		section: "ORAS Singles",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3505710/\">LC Metagame Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/dex/xy/formats/lc/\">LC Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3547566/\">LC Viability Ranking</a>",
		],
		__subsort: subSortOf => subSortOf("LC")+0.1,
		
		defaultLevel: 100,
		maxLevel: 100,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['LC Uber', 'Gligar', 'Misdreavus', 'Scyther', 'Sneasel', 'Tangela', 'Dragon Rage', 'Sonic Boom', 'Swagger'],
	},
	
	{
		name: "[Gen 7] Totem Battle",
		section: "SM Singles",
		desc: ["Player 1 is a Totem Pokemon."],
		gameType: 'totem',
		mod: 'totembattle',
		
		maxLevel: 1000,
		defaultLevel: 100,
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Perish Song'],
		
		// Custom PseudoEvent called before anything is sent to the client (save for join messages)
		onPreSetup : function() {
			// this.gameType = 'doubles';
		},
		
		// Called first
		validateTeam: function(team, removeNicknames) {
			this.tools.getName = this.format.getName;
			return this.baseValidateTeam(team, removeNicknames);
		},
		
		// Called last
		onValidateTeam: function(team, format, teamHas) {
			// Encode Totem boosts into gender so they survive the transfer to the battle sim process
			for (let i = 0; i < team.length; i++) {
				if (team[i].totemboost) {
					let str = "";
					Object.keys(team[i].totemboost).forEach(k => {
						let b = team[i].totemboost[k];
						while (b > 0) {
							str += k; b--;
						}
					});
					team[i].gender = (team[i].gender||"") + str;
				}
			}
		},
		
		getName : function(name) {
			if (typeof name !== 'string' && typeof name !== 'number') return '';
			name = ('' + name).replace(/[\|\s\u202e]+/g, ' ').trim();
	
			// remove zalgo
			name = name.replace(/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g, '');
			name = name.replace(/[\u239b-\u23b9]/g, '');
	
			return name;
		},
		
		onChangeSet: function(set, format) {
			let name = set.name;
			if (!name) return;
			let boosts = {};
			let idx1 = name.indexOf("[");
			let idx2 = name.indexOf("]");
			console.log(`MON=${set.name||set.species}  IDX1=${idx1} 2=${idx2}`);
			if (idx1 > -1 && idx2 > idx1) {
				let str = name.slice(idx1, idx2+1);
				name = name.replace(str, '').trim();
				str = str.slice(1,-1);
				console.log(`STR="${str}`);
				str = str.split(/\s*,\s*/i);
				console.log(`STR2="${str}"`);
				let n = 0;
				for (let i = 0; i < str.length && n < 5; i++) {
					let res;
					if ((res = /([\+\-])(atk|def|spe|spd|spa)/i.exec(str[i]))) {
						let stat = res[2].toLowerCase();
						boosts[stat] = (boosts[stat]||0) + (res[1]==='+')?1:-1;
						n++;
					}
				}
				if (n === 0) {
					boosts.def = 1; //default to 1 defense boost
				}
				set.totemboost = boosts;
			}
			
			name = name.replace(/[\,\[\]]+/g, ' ').trim();
			if (name.length > 18) name = name.substr(0, 18).trim();
			set.name = name;
			console.log(`BOOSTS: ${JSON.stringify(boosts)} NAME="${set.name}"`);
		},
		
		onBegin: function(){
			// Move the pokemon with the totem boosts to the front of player 1's party, so it comes out first.
			let totem = null;
			for (let i = 0; i < this.p1.pokemon.length; i++) {
				if (this.p1.pokemon[i].set.totemboost) {
					totem = this.p1.pokemon[i];
					this.p1.pokemon[i].totemboost = this.p1.pokemon[i].set.totemboost;
					break;
				}
			}
			if (!totem) {
				this.p1.pokemon[0].totemboost = {def:1};
			}
		},
		
		onSwitchIn: function(pokemon) {
			if (pokemon.totemboost && pokemon.side === this.p1) {
				pokemon.addVolatile("totemaura");
			}
		},
		
		onResidualOrder: 100, //Run last (Residuals use ascending order priority)
		onResidual: function () {
			if (this.turn === 1 && this.p1.pokemonLeft > 1) { //Turn 1 
				// this.add(`Totem ${"Pokemon"}'s aura flared to life!`);
				this.add('message', `${this.p1.active[0].name} called its ally pokemon!`);
				this.p1.active.push(null); //expand array to 2
				this.switchIn(this.p1.pokemon[1], 1);
			}
		},
	},
	{
		name: "[Gen 7] Ubers Plus",
		mod: 'gen7',
		section: "SM Singles",
		ruleset: ['Pokemon Plus', 'Standard', 'Swagger Clause', 'Team Preview', 'Mega Rayquaza Clause'],
		banlist: ['Allow Fake'],
		__subsort: subSortOf => subSortOf("[Gen 7] Ubers")+0.1,
	},
	{
		name: "[Gen 7] Reverse Type Matchup",
		desc: [
			"The Attackers and Defenders on the type chart are reversed.",
		],
		section: "Other Metagames",
		mod: 'reverse',
		ruleset: ['Pokemon Plus', 'Standard', 'Swagger Clause', 'Team Preview', 'Mega Rayquaza Clause'],
		banlist: ['Allow Fake'],
	},
	{
		name: '[Gen 7] Snowball Fight',
		section: 'Other Metagames',
		column: 4,
		ruleset: ['Ubers'],
		banlist: [],
		mod: 'snowballfight',
		onValidateSet: function (set) {
			set.moves.push('fling');
		},
		onBeforeTurn: function () {
			if (!this.p1.snowballs) {
				this.p1.snowballs = 0;
			}
			if (!this.p2.snowballs) {
				this.p2.snowballs = 0;
			}
		},
		onFaintPriority: 100,
		onFaint: function (pokemon) {
			if (pokemon.side.pokemonLeft === 0) {
				if (this.p1.snowballs > this.p2.snowballs) {
					this.win(this.p1);
				} else if (this.p2.snowballs > this.p1.snowballs) {
					this.win(this.p2);
				}
			}
		},
	},
];
