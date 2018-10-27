// This is a list of OMs we're keeping around, even if showdown has removed them.

exports.Formats = [
	
	// Triples
	///////////////////////////////////////////////////////////////////
	
	{
		name: "[Gen 7] Random Triples Battle",
		section: "US/UM Triples",
		threads: [`&bullet; <a href="https://www.smogon.com/forums/threads/3601525/">Sets and Suggestions</a>`],
		
		mod: 'gen7',
		gameType: 'triples',
		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Triples OU",
		section: "US/UM Triples",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3634611/">Triples OU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3623347/">Triples OU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3590987/">Triples OU Sample Teams</a>`,
		],

		mod: 'gen7',
		gameType: 'triples',
		ruleset: ['Pokemon', 'Standard Doubles', 'Swagger Clause', 'Team Preview'],
		banlist: ['DUber', 'Power Construct', 'Eevium Z', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder'],
	},
	{
		name: "[Gen 7] Triples Ubers",
		section: "US/UM Triples",
		
		mod: 'gen7',
		gameType: 'triples',
		ruleset: ['Pokemon', 'Standard Doubles', 'Team Preview'],
		banlist: ['Dark Void'],
	},
	{
		name: "[Gen 7] Triples UU",
		section: "US/UM Triples",
		threads: [`&bullet; <a href="https://www.smogon.com/forums/threads/3598014/">Triples UU Metagame Discussion</a>`],
		
		mod: 'gen7',
		gameType: 'triples',
		ruleset: ['[Gen 7] Triples OU'],
		banlist: ['DOU', 'DBL'],
	},
	{
		name: "[Gen 7] Triples Anything Goes",
		section: "US/UM Triples",

		mod: 'gen7',
		gameType: 'triples',
		ruleset: ['Pokemon Plus', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Allow Fake'],
	},
	
	// Recategorize Metas
	///////////////////////////////////////////////////////////////////
	
	{
		name: "[Gen 6] Random Battle",
		overrides: 'section',
		section: "Randomized Past Gens",
		__subsort: 1,
	},
	{
		name: "[Gen 5] Random Battle",
		overrides: 'section',
		section: "Randomized Past Gens",
		__subsort: 2,
	},
	{
		name: "[Gen 4] Random Battle",
		overrides: 'section',
		section: "Randomized Past Gens",
		__subsort: 3,
	},
	{
		name: "[Gen 3] Random Battle",
		overrides: 'section',
		section: "Randomized Past Gens",
		__subsort: 4,
	},
	{
		name: "[Gen 2] Random Battle",
		overrides: 'section',
		section: "Randomized Past Gens",
		__subsort: 5,
	},
	{
		name: "[Gen 1] Random Battle",
		overrides: 'section',
		section: "Randomized Past Gens",
		__subsort: 6,
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////
	
	{
		name: "[Gen 7] Acid Rain",
        desc: "All four types of weather are active 100% of the time.",
        threads: [
            "&bullet; <a href=\"https://www.smogon.com/forums/threads/3518506/\">Acid Rain</a>",
        ],
		section: "Other Metagames",

		mod: 'acidrain',
		ruleset: ['[Gen 7] Ubers'],
        banlist: ['Weather Ball', 'Castform'],
		
		onBegin: function () {
            this.setWeather('primordialsea');
            this.add('-message', 'The pH of this heavy rain seems to be quite low!');
        },
        onSetWeather: function (target, source, weather) {
            return weather.id === 'primordialsea';
        },
		
		__subsort: -1,
	},
	{
		name: "[Gen 0] Old School Machops",
		section: "Other Metagames",
		
		ruleset: ['[Gen 7] Ubers'],
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
		
		ruleset: ['[Gen 7] Ubers', 'Allow More Moves'],
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
		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Eviolite'],
	},
	{
		name: "[Gen 0] BH Doubles",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3489849/\">Balanced Hackmons</a>"],
		section: "Other Metagames",

		gameType: 'doubles',
		ruleset: ['[Gen 7] Balanced Hackmons'],
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

		ruleset: ['[Gen 7] OU'],
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
		ruleset: ['[Gen 7] Ubers'],
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
		name: "[Gen 6] FU",
		desc: [
			"The tier below PU. Only available here!",
		],
		section: "OR/AS Singles",

		ruleset: ['[Gen 6] PU'],
		banlist: ['[Gen 6] PU', 'Chatter'],
		
		__subsort: subSortOf => subSortOf("[Gen 6] PU")+0.1,
	},
	{
		name: "[Gen 7] ZU",
		desc: [
			"The tier below PU. Only available here!",
		],
		section: "US/UM Singles",

		mod: 'gen7',
		ruleset: ['[Gen 7] PU'],
		banlist: ['PU', 'ZUBL'],
		
		__subsort: subSortOf => subSortOf("[Gen 7] Monotype")-0.1,
	},
	{
		name: "[Gen 7] ZU Random",
		desc: [
			"ZU Random Battles!",
		],
		section: "US/UM Singles",

		mod: 'randomzu',
		team: 'random',
		
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', 'Standard'],
		
		__subsort: subSortOf => subSortOf("[Gen 7] Monotype")-0.05,
	},
	{
		name: "LC Supreme",
		section: "OR/AS Singles",
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
		section: "US/UM Singles",
		desc: ["Player 1 is a Totem Pokemon."],
		gameType: 'totem',
		mod: 'totembattle',
		__subsort: subSortOf => subSortOf("[Gen 7] CAP")+0.1,
		
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
			this.dex.getName = this.format.getName;
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
		section: "US/UM Singles",
		ruleset: ['Pokemon Plus', 'Standard', 'Team Preview', 'Mega Rayquaza Clause', 'Allow Fake'],
		banlist: ['Baton Pass'],
		__subsort: subSortOf => subSortOf("[Gen 7] Ubers")+0.1,
	},
	{
		name: "[Gen 7] Reverse Type Matchup",
		desc: [
			"The Attackers and Defenders on the type chart are reversed.",
		],
		section: "Other Metagames",
		mod: 'reverse',
		ruleset: ['Pokemon Plus', 'Standard', 'Team Preview', 'Mega Rayquaza Clause', 'Allow Fake'],
		banlist: ['Baton Pass'],
	},
	/**
	Code:
	- formats.js https://github.com/XpRienzo/DragonHeaven/blob/master/config/formats.js#L3663
	- /mods/pic https://github.com/XpRienzo/DragonHeaven/tree/master/mods/pic
	
	Status:
	- Everything works as intended
	*/
	{
		name: "[Gen 7] Partners in Crime",
		section: "Other Metagames",
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
	{
		name: '[Gen 7] Snowball Fight',
		section: 'Other Metagames',
		column: 4,
		ruleset: ['[Gen 7] Ubers'],
		banlist: [],
		mod: 'snowballfight',
		onValidateSet: function (set) {
			set.moves.push('fling');
		},
		// Standard PseudoEvent
		onBegin: function() {
			this.add('-stadium', '[norequest]', `[bg] bg-snow.jpg`);
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
	{
		name: "[Gen 7] Scalemons",
		section: "Other Metagames",
		desc: `Every Pok&eacute;mon's stats, barring HP, are scaled to give them a BST as close to 600 as possible.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3607934/">Scalemons</a>`,
		],
		
		mod: 'gen7',
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
	/*
	{
		name: "[Gen 7] Seasons Samba",
		desc: [
			"Over the course of the battle, the seasons change rapidly. Every 3 turns, the battle moves into the next season. The battle starts at the beginning of a random season. While a season is in effect, passive stat stage boosts (+2) are given to the pokemon on the field. These boosts are lost when the season changes. A season also has a common weather effect associated with it, and a chance of a random move happening during the game.",
			"Spring: There's a 60% chance it will start or stop raining, at the end of a given turn. There's a 5% chance of a random Thunderbolt hitting one of the battlers during a rain storm. Grass +SpA, Bug +Atk, Flying +Spe, Fairy +SpD.",
			"Summer: There's a 60% chance it will start or stop being sunny, at the end of a turn. There's a 5% chance of a random Heat Wave hitting all of the battlers during a sunny day. Fire +SpA, Steel +Atk, Fighting +Spe, Electric +SpD.",
			"Autumn: There's a 30% chance of 'high winds', at the end of the turn. High winds are randomly either from player 1's or player 2's side of the field. The source side gains tailwind speed for the following turn. Many field effects (spikes, pointed stones, leech seed, etc) are swept away from the destination side of the field. Many of the the same are transferred from the source to the destination side. There's a 5% chance of a random Rock Throw hitting one of the battlers during a high winds. Ghost +SpA, Dark +Atk, Poison +SpD, Psychic +Spe.",
			"Winter: There's a 60% chance of hail starting or stopping at the end of a turn. There's a 5% chance of a random Blizzard hitting all of the battlers during a hail storm. Ice +Spe, Water +Def, Ground +SpD, Rock +Atk",
			"All weather-altering moves and abilities are banned.",
			
			"Camoflauge: Spring=>Grass, Summer=>Fire, Autumn=>Ghost, Winter=>Ice",
			"Grassy Terrain: Winter ends Grassy Terrain early. Using Grassy Terrain during winter will fail.",
			"Misty Terrain: High Winds during Autumn ends Misty Terrain. Using it during high winds will fail.",
			"Electric Terrain: When Electric Terrain is active at the end of a turn when springtime rain is active, the chance of the random Thunderbolt becomes 100%, and the Electric Terrain 'is discharged' as a result of the attack.",
			"Psychic Terrain: All chances of random attacks due to weather become 0% while Psychic Terrain is active.",
		],
	},
	*/
];
