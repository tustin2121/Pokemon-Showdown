'use strict';

// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.js

exports.Formats = [

	// XY Singles
	///////////////////////////////////////////////////////////////////

	{
		name: "Random Battle",
		desc: ["Randomized teams of level-balanced Pok&eacute;mon with sets that are generated to be competitively viable."],
		section: "ORAS Singles",

		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "Unrated Random Battle",
		section: "ORAS Singles",

		team: 'random',
		challengeShow: false,
		rated: false,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "OU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3573990/\">OU Metagame Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/dex/xy/tags/ou/\">OU Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3571990/\">OU Viability Ranking</a>",
		],
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Uber', 'Shadow Tag', 'Soul Dew'],
	},
	{
		name: "Ubers",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3522911/\">Ubers Metagame Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3535106/\">Ubers Viability Ranking</a>",
		],
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview', 'Mega Rayquaza Clause'],
		banlist: [],
	},
	{
		name: "UU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3582473/\">np: UU Stage 7.3</a>",
			"&bullet; <a href=\"https://www.smogon.com/dex/xy/tags/uu/\">UU Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3555277/\">UU Viability Ranking</a>",
		],
		section: "ORAS Singles",

		ruleset: ['OU'],
		banlist: ['OU', 'BL', 'Drizzle', 'Drought'],
	},
	{
		name: "RU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3583022/\">np: RU Stage 19</a>",
			"&bullet; <a href=\"https://www.smogon.com/dex/xy/tags/ru/\">RU Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3558546/\">RU Viability Ranking</a>",
		],
		section: "ORAS Singles",

		searchShow: false,
		ruleset: ['UU'],
		banlist: ['UU', 'BL2'],
	},
	{
		name: "RU (suspect test)",
		section: "ORAS Singles",

		ruleset: ['RU'],
		banlist: ['Alomomola'],
	},
	{
		name: "NU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3576747/\">np: NU Stage 15</a>",
			"&bullet; <a href=\"https://www.smogon.com/dex/xy/tags/nu/\">NU Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3555650/\">NU Viability Ranking</a>",
		],
		section: "ORAS Singles",

		ruleset: ['RU', 'Baton Pass Speed Clause'],
		banlist: ['RU', 'BL3'],
	},
	{
		name: "PU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3578583/\">np: PU Stage 9</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3528743/\">PU Viability Ranking</a>",
		],
		section: "ORAS Singles",

		ruleset: ['RU'],
		banlist: ['RU', 'BL3', 'NU', 'BL4', 'Chatter'],
	},
	{
		name: "FU",
		desc: [
			"The tier below PU. Only available here!",
		],
		section: "ORAS Singles",

		ruleset: ['PU'],
		banlist: ['PU', 'Chatter'],
	},
	{
		name: "LC",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3505710/\">LC Metagame Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/dex/xy/formats/lc/\">LC Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3547566/\">LC Viability Ranking</a>",
		],
		section: "ORAS Singles",

		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['LC Uber', 'Gligar', 'Misdreavus', 'Scyther', 'Sneasel', 'Tangela', 'Dragon Rage', 'Sonic Boom', 'Swagger'],
	},
	{
		name: "LC 100",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3505710/\">LC Metagame Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3490462/\">LC Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3547566/\">LC Viability Ranking</a>",
		],
		section: "ORAS Singles",

		maxLevel: 100,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['LC Uber', 'Gligar', 'Misdreavus', 'Scyther', 'Sneasel', 'Tangela', 'Dragon Rage', 'Sonic Boom', 'Swagger'],
	},
	{
		name: "CAP",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3537407/\">CAP Metagame Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/dex/xy/formats/cap/\">CAP Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3545628/\">CAP Viability Ranking</a>",
		],
		section: "ORAS Singles",

		ruleset: ['OU'],
		banlist: ['Allow CAP'],
	},
	{
		name: "Battle Spot Singles",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3527960/\">Battle Spot Singles Metagame Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3554616/\">Battle Spot Singles Viability Ranking</a>",
		],
		section: "ORAS Singles",

		maxForcedLevel: 50,
		teamLength: {
			validate: [3, 6],
			battle: 3,
		},
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview'],
		requirePentagon: true,
	},
	{
		name: "Custom Game",
		section: "ORAS Singles",

		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// XY Doubles
	///////////////////////////////////////////////////////////////////

	{
		name: "Random Doubles Battle",
		section: "ORAS Doubles",

		gameType: 'doubles',
		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "Doubles OU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3580680/\">np: Doubles OU Stage 5</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3498688/\">Doubles OU Banlist</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3535930/\">Doubles OU Viability Ranking</a>",
		],
		section: "ORAS Doubles",

		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard Doubles', 'Swagger Clause', 'Team Preview'],
		banlist: ['Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia',
			'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Salamencite', 'Shaymin-Sky', 'Xerneas', 'Yveltal', 'Zekrom',
			'Soul Dew', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder', 'Gravity ++ Spore',
		],
	},
	{
		name: "Doubles Ubers",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3542746/\">Doubles Ubers</a>"],
		section: "ORAS Doubles",

		gameType: 'doubles',
		ruleset: ['Pokemon', 'Species Clause', 'Moody Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Evasion Abilities Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal', 'Dark Void'],
	},
	{
		name: "Doubles UU",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3542755/\">Doubles UU</a>"],
		section: "ORAS Doubles",

		gameType: 'doubles',
		ruleset: ['Doubles OU'],
		banlist: ['Aegislash', 'Amoonguss', 'Azumarill', 'Bisharp', 'Breloom', 'Charizard-Mega-Y', 'Charizardite Y', 'Conkeldurr',
			'Cresselia', 'Diancie-Mega', 'Diancite', 'Dragonite', 'Ferrothorn', 'Garchomp', 'Gardevoir-Mega', 'Gardevoirite',
			'Gengar', 'Greninja', 'Gyarados', 'Heatran', 'Hoopa-Unbound', 'Hydreigon', 'Jirachi', 'Kangaskhan-Mega', 'Kangaskhanite',
			'Keldeo', 'Kyurem-Black', 'Landorus', 'Landorus-Therian', 'Latios', 'Ludicolo', 'Mawile-Mega', 'Mawilite',
			'Milotic', 'Politoed', 'Rotom-Wash', 'Scizor', 'Scrafty', 'Shaymin-Sky', 'Suicune', 'Sylveon', 'Talonflame',
			'Terrakion', 'Thundurus', 'Togekiss', 'Tyranitar', 'Venusaur', 'Volcanion', 'Weavile', 'Whimsicott', 'Zapdos',
		],
	},
	{
		name: "VGC 2016",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3558332/\">VGC 2016 Rules</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3580592/\">VGC 2016 Viability Ranking</a>",
		],
		section: "ORAS Doubles",

		gameType: 'doubles',
		maxForcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		ruleset: ['Pokemon', 'Species Clause', 'Nickname Clause', 'Item Clause', 'Team Preview', 'Cancel Mod'],
		banlist: ['Illegal', 'Unreleased', 'Mew', 'Celebi', 'Jirachi', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Phione', 'Manaphy',
			'Darkrai', 'Shaymin', 'Shaymin-Sky', 'Arceus', 'Victini', 'Keldeo', 'Meloetta', 'Genesect', 'Diancie', 'Hoopa', 'Hoopa-Unbound', 'Volcanion', 'Soul Dew',
		],
		requirePentagon: true,
		onValidateTeam: function (team) {
			const legends = {'Mewtwo':1, 'Lugia':1, 'Ho-Oh':1, 'Kyogre':1, 'Groudon':1, 'Rayquaza':1, 'Dialga':1, 'Palkia':1, 'Giratina':1, 'Reshiram':1, 'Zekrom':1, 'Kyurem':1, 'Xerneas':1, 'Yveltal':1, 'Zygarde':1};
			let n = 0;
			for (let i = 0; i < team.length; i++) {
				let template = this.getTemplate(team[i].species).baseSpecies;
				if (template in legends) n++;
				if (n > 2) return ["You can only use up to two legendary Pok\u00E9mon."];
			}
		},
	},
	{
		name: "Battle Spot Doubles",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3524352/\">VGC 2015 Rules</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3530547/\">VGC 2015 Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3526666/\">Sample Teams for VGC 2015</a>",
		],
		section: "ORAS Doubles",

		gameType: 'doubles',
		maxForcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview'],
		requirePentagon: true,
	},
	{
		name: "Doubles Custom Game",
		section: "ORAS Doubles",

		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		maxLevel: 9999,
		defaultLevel: 100,
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// XY Triples
	///////////////////////////////////////////////////////////////////

	{
		name: "Random Triples Battle",
		section: "ORAS Triples",

		gameType: 'triples',
		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "Smogon Triples",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3511522/\">Smogon Triples</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3540390/\">Triples Viability Ranking</a>",
		],
		section: "ORAS Triples",

		gameType: 'triples',
		ruleset: ['Pokemon', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Illegal', 'Unreleased', 'Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White',
			'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Xerneas', 'Yveltal', 'Zekrom',
			'Soul Dew', 'Dark Void', 'Perish Song',
		],
	},
	{
		name: "Smogon Triples Ubers",
		section: "ORAS Triples",

		gameType: 'triples',
		ruleset: ['Pokemon', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Illegal', 'Unreleased', 'Dark Void', 'Perish Song'],
	},
	{
		name: "Battle Spot Triples",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3533914/\">Battle Spot Triples Metagame Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3549201/\">Battle Spot Triples Viability Ranking</a>",
		],
		section: "ORAS Triples",

		gameType: 'triples',
		maxForcedLevel: 50,
		teamLength: {
			validate: [6, 6],
		},
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview'],
		requirePentagon: true,
	},
	{
		name: "Triples Custom Game",
		section: "ORAS Triples",

		gameType: 'triples',
		searchShow: false,
		canUseRandomTeam: true,
		maxLevel: 9999,
		defaultLevel: 100,
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

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
		name: "Gifts of the Gods",
		desc: [
			"Each Pok&eacute;mon receives one base stat, depending on its position, from the Uber.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3579610/\">Gifts of the Gods</a>",
		],
		section: "OM of the Month",
		column: 2,

		ruleset: ['Ubers', 'Baton Pass Clause'],
		banlist: ['Uber > 1', 'AG ++ Uber', 'Blissey', 'Chansey', 'Eviolite', 'Mawilite', 'Medichamite', 'Soul Dew', 'Huge Power', 'Pure Power'],
		onBegin: function () {
			let stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
			for (let j = 0; j < this.sides.length; j++) {
				// onBegin happens before Mega Rayquaza clause
				let uber = this.sides[j].pokemon.find(pokemon => ['AG', 'Uber'].includes(this.getTemplate(pokemon.canMegaEvo || pokemon.baseTemplate).tier)) || this.sides[j].pokemon[0];
				for (let i = 0, len = this.sides[j].pokemon.length; i < len; i++) {
					let pokemon = this.sides[j].pokemon[i];
					["baseTemplate", "canMegaEvo"].forEach(key => {
						if (pokemon[key]) {
							let template = Object.assign({}, this.getTemplate(pokemon[key]));
							template.baseStats = Object.assign({}, template.baseStats);
							template.baseStats[stats[i]] = uber.baseTemplate.baseStats[stats[i]];
							pokemon[key] = template;
						}
					});
					pokemon.formeChange(pokemon.baseTemplate);
					if (i === 0 && !pokemon.template.maxHP) {
						pokemon.hp = pokemon.maxhp = Math.floor(Math.floor(2 * pokemon.template.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
					}
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
		name: "BH Doubles",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3489849/\">Balanced Hackmons</a>"],
		section: "OM of the Month",

		gameType: 'doubles',
		ruleset: ['Balanced Hackmons'],
		banlist: [],
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
	{
		name: "Anything Goes",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3523229/\">Anything Goes</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3548945/\">AG Resources</a>",
		],
		section: "Other Metagames",
		column: 2,

		ruleset: ['Pokemon', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Illegal', 'Unreleased'],
	},
	// {
	// 	name: "Groundsource",
	// 	section: "Other Metagames",
	// 	column: 2,

	// 	ruleset: ['Pokemon', 'Team Preview', 'Groundsource Mod', 'HP Percentage Mod', 'Cancel Mod'],
	// 	banlist: [],
	// },
	{
		name: "Balanced Hackmons",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3489849/\">Balanced Hackmons</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3566051/\">BH Suspects and Bans</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3571384/\">BH Resources</a>",
		],
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Ability Clause', '-ate Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Groudon-Primal', 'Kyogre-Primal', 'Arena Trap', 'Huge Power', 'Moody', 'Parental Bond', 'Protean', 'Pure Power', 'Shadow Tag', 'Wonder Guard', 'Assist', 'Chatter'],
	},
	{
		name: "1v1",
		desc: [
			"Bring three Pok&eacute;mon to Team Preview and choose one to battle.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3496773/\">1v1</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3536109/\">1v1 Resources</a>",
		],
		section: 'Other Metagames',

		teamLength: {
			validate: [1, 3],
			battle: 1,
		},
		ruleset: ['Pokemon', 'Moody Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Swagger Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Illegal', 'Unreleased', 'Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga',
			'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo',
			'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Xerneas', 'Yveltal', 'Zekrom',
			'Focus Sash', 'Kangaskhanite', 'Salamencite', 'Soul Dew', 'Perish Song', 'Chansey + Charm + Seismic Toss',
		],
	},
	{
		name: "Monotype",
		desc: [
			"All Pok&eacute;mon on a team must share a type.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3544507/\">Monotype</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3575778/\">Monotype Viability Ranking</a>",
		],
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Same Type Clause', 'Team Preview'],
		banlist: ['Aegislash', 'Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Genesect', 'Giratina', 'Giratina-Origin', 'Greninja', 'Groudon',
			'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Talonflame', 'Xerneas', 'Yveltal', 'Zekrom',
			'Altarianite', 'Charizardite X', 'Damp Rock', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Metagrossite', 'Sablenite', 'Salamencite', 'Slowbronite', 'Smooth Rock', 'Soul Dew',
		],
	},
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
		name: "STABmons",
		desc: [
			"Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3547279/\">STABmons</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3558034/\">STABmons Viability Ranking</a>",
		],
		section: "Other Metagames",

		ruleset: ['OU'],
		banlist: ['Ignore STAB Moves', 'Diggersby', 'Kyurem-Black', 'Porygon-Z', 'Thundurus', 'Aerodactylite', 'Altarianite', "King's Rock", 'Metagrossite', 'Razor Fang'],
	},
	{
		name: "Tier Shift",
		desc: [
			"Pok&eacute;mon below OU/BL get all their stats boosted. UU/BL2 get +5, RU/BL3 get +10, NU/BL4 get +15, and PU or lower get +20.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3554765/\">Tier Shift</a>",
		],
		section: "Other Metagames",

		mod: 'tiershift',
		ruleset: ['OU'],
		banlist: ['Damp Rock'],
	},
	{
		name: "Inverse Battle",
		desc: [
			"Battle with an inverted type chart.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3518146/\">Inverse Battle</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3526371/\">Inverse Battle Viability Ranking</a>",
		],
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Diggersby', 'Giratina-Origin', 'Groudon',
			'Ho-Oh', 'Hoopa-Unbound', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Serperior',
			'Shaymin-Sky', 'Snorlax', 'Xerneas', 'Yveltal', 'Zekrom', 'Gengarite', 'Kangaskhanite', 'Salamencite', 'Soul Dew', 'Shadow Tag',
		],
		onNegateImmunity: false,
		onEffectiveness: function (typeMod, target, type, move) {
			// The effectiveness of Freeze Dry on Water isn't reverted
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.getImmunity(move, type)) return 1;
			return -typeMod;
		},
	},
	{
		name: "LC UU",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3523929/\">LC UU</a>"],
		section: "Other Metagames",

		maxLevel: 5,
		ruleset: ['LC'],
		banlist: ['Abra', 'Aipom', 'Anorith', 'Archen', 'Bunnelby', 'Carvanha', 'Chinchou', 'Cottonee', 'Croagunk', 'Diglett',
			'Drifloon', 'Drilbur', 'Dwebble', 'Elekid', 'Ferroseed', 'Fletchling', 'Foongus', 'Gastly', 'Gothita', 'Honedge',
			'Larvesta', 'Magnemite', 'Mienfoo', 'Munchlax', 'Omanyte', 'Onix', 'Pawniard', 'Ponyta', 'Porygon', 'Scraggy',
			'Shellder', 'Snivy', 'Snubbull', 'Spritzee', 'Staryu', 'Stunky', 'Surskit', 'Timburr', 'Tirtouga', 'Vullaby',
			'Corphish', 'Houndour', 'Pancham', 'Skrelp', 'Vulpix', 'Zigzagoon', 'Shell Smash', 'Sticky Web',
		],
	},
	{
		name: "2v2 Doubles",
		desc: [
			"Double battle where you bring four Pok&eacute;mon to Team Preview and choose only two.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3547040/\">2v2 Doubles</a>",
		],
		section: "Other Metagames",

		gameType: 'doubles',
		searchShow: false,
		teamLength: {
			validate: [2, 4],
			battle: 2,
		},
		ruleset: ['Doubles OU'],
		banlist: ['Kangaskhanite', 'Perish Song'],
	},
	// {
	// 	name: "Hidden Type",
	// 	desc: [
	// 		"Pok&eacute;mon have an added type determined by their IVs. Same as the Hidden Power type.",
	// 		"&bullet; <a href=\"https://www.smogon.com/forums/threads/3516349/\">Hidden Type</a>",
	// 	],
	// 	section: "Other Metagames",

	// 	searchShow: false,
	// 	mod: 'hiddentype',
	// 	ruleset: ['OU'],
	// },
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
		name: "OU Theorymon",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3559611/\">OU Theorymon</a>"],
		section: "Other Metagames",

		mod: 'theorymon',
		searchShow: false,
		ruleset: ['OU'],
	},
	{
		name: "Gen-NEXT OU",
		section: "Other Metagames",

		mod: 'gennext',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard NEXT', 'Team Preview'],
		banlist: ['Uber'],
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

	// Randomized Metas
	///////////////////////////////////////////////////////////////////

	{
		name: "Battle Factory",
		section: "Randomized Metas",
		column: 2,

		team: 'randomFactory',
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Mega Rayquaza Clause'],
	},
	{
		name: "Challenge Cup 1v1",
		section: "Randomized Metas",

		team: 'randomCC',
		teamLength: {
			battle: 1,
		},
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
	},
	{
		name: "Monotype Random Battle",
		section: "Randomized Metas",

		team: 'random',
		searchShow: false,
		ruleset: ['Pokemon', 'Same Type Clause', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "Hackmons Cup",
		desc: ["Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, moves, and item."],
		section: "Randomized Metas",

		team: 'randomHC',
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "Doubles Hackmons Cup",
		section: "Randomized Metas",

		gameType: 'doubles',
		team: 'randomHC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "Triples Hackmons Cup",
		section: "Randomized Metas",

		gameType: 'triples',
		team: 'randomHC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},

	// RoA Spotlight
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 4] NU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3583742/\">DPP NU</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3512254/\">DPP NU Viability Ranking</a>",
		],
		section: "RoA Spotlight",
		column: 3,

		mod: 'gen4',
		ruleset: ['[Gen 4] UU'],
		banlist: ['UU', 'BL2'],
	},

	// BW2 Singles
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 5] OU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3551993/\">BW2 OU Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6431094/\">BW2 Sample Teams</a>",
		],
		section: "BW2 Singles",
		column: 3,

		mod: 'gen5',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Drought ++ Chlorophyll', 'Sand Stream ++ Sand Rush', 'Soul Dew'],
	},
	{
		name: "[Gen 5] Ubers",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3550881/\">BW2 Ubers Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6446463/\">BW2 Ubers Sample Teams</a>",
		],
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['Pokemon', 'Team Preview', 'Standard Ubers'],
		banlist: [],
	},
	{
		name: "[Gen 5] UU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3474024/\">BW2 UU Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6431094/\">BW2 Sample Teams</a>",
		],
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['[Gen 5] OU'],
		banlist: ['OU', 'BL', 'Drought', 'Sand Stream', 'Snow Warning'],
	},
	{
		name: "[Gen 5] RU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3473124/\">BW2 RU Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6431094/\">BW2 Sample Teams</a>",
		],
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['[Gen 5] UU'],
		banlist: ['UU', 'BL2', 'Shell Smash + Baton Pass', 'Snow Warning'],
	},
	{
		name: "[Gen 5] NU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3484121/\">BW2 NU Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6431094/\">BW2 Sample Teams</a>",
		],
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['[Gen 5] RU'],
		banlist: ['RU', 'BL3', 'Prankster + Assist'],
	},
	{
		name: "[Gen 5] LC",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3485860/\">BW2 LC Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6431094/\">BW2 Sample Teams</a>",
		],
		section: "BW2 Singles",

		mod: 'gen5',
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Berry Juice', 'Soul Dew', 'Dragon Rage', 'Sonic Boom', 'LC Uber', 'Gligar', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela'],
	},
	{
		name: "[Gen 5] GBU Singles",
		section: "BW2 Singles",

		mod: 'gen5',
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [3, 6],
			battle: 3,
		},
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview'],
		banlist: ['Dark Void', 'Sky Drop'],
	},
	{
		name: "[Gen 5] Random Battle",
		section: "BW2 Singles",

		mod: 'gen5',
		searchShow: false,
		team: 'random',
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 5] Custom Game",
		section: "BW2 Singles",

		mod: 'gen5',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// BW2 Doubles
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 5] Doubles OU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3533424/\">BW2 Doubles Metagame Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3533421/\">BW2 Doubles Viability Ranking</a>",
		],
		section: 'BW2 Doubles',
		column: 3,

		mod: 'gen5',
		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Jirachi',
			'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Zekrom', 'Soul Dew', 'Dark Void', 'Sky Drop',
		],
	},
	{
		name: "[Gen 5] GBU Doubles",
		section: 'BW2 Doubles',

		mod: 'gen5',
		gameType: 'doubles',
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview'],
		banlist: ['Dark Void', 'Sky Drop'],
	},
	{
		name: "[Gen 5] Doubles Custom Game",
		section: 'BW2 Doubles',

		mod: 'gen5',
		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// DPP Singles
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 4] OU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3551992/\">DPP OU Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6431088/\">DPP Sample Teams</a>",
		],
		section: "DPP Singles",
		column: 3,

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause'],
		banlist: ['Uber'],
	},
	{
		name: "[Gen 4] Ubers",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3505128/\">DPP Ubers Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6446464/\">DPP Ubers Sample Teams</a>",
		],
		section: "DPP Singles",

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Arceus'],
	},
	{
		name: "[Gen 4] UU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3503638/\">DPP UU Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6431088/\">DPP Sample Teams</a>",
		],
		section: "DPP Singles",

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'OU', 'BL'],
	},
	{
		name: "[Gen 4] LC",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/dp/articles/little_cup_guide\">DPP LC Guide</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6431088/\">DPP Sample Teams</a>",
		],
		section: "DPP Singles",

		mod: 'gen4',
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Little Cup'],
		banlist: ['LC Uber', 'Misdreavus', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela', 'Yanma', 'Berry Juice', 'DeepSeaTooth', 'Dragon Rage', 'Sonic Boom'],
	},
	{
		name: "[Gen 4] Custom Game",
		section: "DPP Singles",

		mod: 'gen4',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions
		ruleset: ['Cancel Mod'],
	},

	// DPP Doubles
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 4] Doubles Custom Game",
		section: "DPP Doubles",
		column: 3,

		mod: 'gen4',
		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions
		ruleset: ['Cancel Mod'],
	},

	// Past Generations
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 3] OU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3503019/\">ADV OU Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6431087/\">ADV Sample Teams</a>",
		],
		section: "Past Generations",
		column: 3,

		mod: 'gen3',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'Smeargle + Ingrain'],
	},
	{
		name: "[Gen 3] Ubers",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3536426/\">ADV Ubers Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6446466/\">ADV Ubers Sample Teams</a>",
		],
		section: "Past Generations",

		mod: 'gen3',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Wobbuffet + Leftovers'],
	},
	{
		name: "[Gen 3] Custom Game",
		section: "Past Generations",

		mod: 'gen3',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 2] OU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3503082/\">GSC OU Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6431086/\">GSC Sample Teams</a>",
		],
		section: "Past Generations",

		mod: 'gen2',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber'],
	},
	{
		name: "[Gen 2] Ubers",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3507552/\">GSC Ubers Discussion</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6431086/\">GSC Sample Teams</a>",
		],
		section: "Past Generations",

		mod: 'gen2',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
	},
	{
		name: "[Gen 2] Random Battle",
		section: "Past Generations",

		mod: 'gen2',
		searchShow: false,
		team: 'random',
		ruleset: ['Pokemon', 'Standard'],
	},
	{
		name: "[Gen 2] Custom Game",
		section: "Past Generations",

		mod: 'gen2',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 1] OU",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3486845/\">RBY OU Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6431045/\">RBY Sample Teams</a>",
		],
		section: "Past Generations",

		mod: 'gen1',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber'],
	},
	{
		name: "[Gen 1] Ubers",
		desc: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3541329/\">RBY Ubers Viability Ranking</a>",
			"&bullet; <a href=\"https://www.smogon.com/forums/posts/6431045/\">RBY Sample Teams</a>",
		],
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
		banlist: [],
	},
	{
		name: "[Gen 1] OU (tradeback)",
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Allow Tradeback', 'Uber', 'Unreleased', 'Illegal',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
		],
	},
	{
		name: "[Gen 1] Random Battle",
		section: "Past Generations",

		mod: 'gen1',
		team: 'random',
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 1] Challenge Cup",
		section: "Past Generations",

		mod: 'gen1',
		team: 'randomCC',
		searchShow: false,
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 1] Stadium",
		section: "Past Generations",

		mod: 'stadium',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Uber',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
		],
	},
	{
		name: "[Gen 1] Custom Game",
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},

	// TPP League exclusives
	{
		name: "TPPLA",
		section: "TPP",
		mod: 'tppla',
		column: 4,

		ruleset: ['Custom Game', 'Sleep Clause Mod', 'HP Percentage Mod'],
	},
	{
		name: "TPPLA Doubles",
		section: "TPP",
		mod: 'tppla',

		gameType: 'doubles',
		ruleset: ['Custom Game', 'Sleep Clause Mod', 'HP Percentage Mod'],
	},
	{
		name: "TPPLA Triples",
		section: "TPP",
		mod: 'tppla',

		gameType: 'triples',
		ruleset: ['Custom Game', 'Sleep Clause Mod', 'HP Percentage Mod'],
	},
	{
		name: "Super TPPL Bros.",
		section: "STPPLB",
		column: 4,

		mod: 'stpplb',
		searchShow: true,
		team: 'randomtpplb',
		ruleset: ['Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		debug: true,
		
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
	
		onFaint: function (pokemon) { // PJSalt-y faint messages go here.
			this.sayQuote(pokemon, "Faint");
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
	},

	{
		name: 'Super Glitch',
		section: 'STPPLB',
		column: 2,
		searchShow: true,
		mod: 'stpplb',
		ruleset: ['Super Glitch Clause', 'HP Percentage Mod', 'Species Clause', 'Cancel Mod', 'No Switching Clause', 'No Recycle Clause', 'Ability Clause', 'Team Preview'],
		banlist: ['No Fun Allowed', 'Wonder Guard', 'Physicalakazam', 'Defiant Plus', 'Messiah', 'Cursed Body', 'Moody', 'Little Engine', 'Unnerve', 'Magician', 'Pickpocket', 'Imposter', 'Iron Barbs', 'Rough Skin'],
		maxLevel: 100,
		defaultLevel: 100,

		onBegin: function () {
			this.add('-message', "STPPLB wiki with all Pokemon descriptions: https://www.reddit.com/r/TPPLeague/wiki/stpplb");

			// Mix and Mega stuff
			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (let i = 0, len = allPokemon.length; i < len; i++) {
				let pokemon = allPokemon[i];
				pokemon.originalSpecies = pokemon.baseTemplate.species;
			}
		},

		onSwitchInPriority: 1,
		onSwitchIn: function (pokemon) {
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
			// Mix and Mega stuff
			let oMegaTemplate = this.getTemplate(pokemon.template.originalMega);
			if (oMegaTemplate.exists && pokemon.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	
	{
		name: 'Super Glitch Doubles',
		section: 'STPPLB',
		gameType: 'doubles',
		column: 2,
		searchShow: true,
		mod: 'stpplb',
		ruleset: ['Super Glitch Clause', 'HP Percentage Mod', 'Species Clause', 'Cancel Mod', 'No Switching Clause', 'No Recycle Clause', 'Ability Clause', 'Team Preview'],
		banlist: ['No Fun Allowed', 'Wonder Guard', 'Physicalakazam', 'Defiant Plus', 'Messiah', 'Cursed Body', 'Moody', 'Little Engine', 'Unnerve', 'Magician', 'Pickpocket', 'Imposter', 'Iron Barbs', 'Rough Skin'],
		maxLevel: 100,
		defaultLevel: 100,

		onBegin: function () {
			this.add('-message', "STPPLB wiki with all Pokemon descriptions: https://www.reddit.com/r/TPPLeague/wiki/stpplb");

			// Mix and Mega stuff
			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (let i = 0, len = allPokemon.length; i < len; i++) {
				let pokemon = allPokemon[i];
				pokemon.originalSpecies = pokemon.baseTemplate.species;
			}
		},

		onSwitchInPriority: 1,
		onSwitchIn: function (pokemon) {
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
			// Mix and Mega stuff
			let oMegaTemplate = this.getTemplate(pokemon.template.originalMega);
			if (oMegaTemplate.exists && pokemon.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	
	{
		name: 'Super Glitch Triples',
		section: 'STPPLB',
		gameType: 'triples',
		column: 2,
		searchShow: true,
		mod: 'stpplb',
		ruleset: ['Super Glitch Clause', 'HP Percentage Mod', 'Species Clause', 'Cancel Mod', 'No Switching Clause', 'No Recycle Clause', 'Ability Clause', 'Team Preview'],
		banlist: ['No Fun Allowed', 'Wonder Guard', 'Physicalakazam', 'Defiant Plus', 'Messiah', 'Cursed Body', 'Moody', 'Little Engine', 'Unnerve', 'Magician', 'Pickpocket', 'Imposter', 'Iron Barbs', 'Rough Skin'],
		maxLevel: 100,
		defaultLevel: 100,

		onBegin: function () {
			this.add('-message', "STPPLB wiki with all Pokemon descriptions: https://www.reddit.com/r/TPPLeague/wiki/stpplb");

			// Mix and Mega stuff
			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (let i = 0, len = allPokemon.length; i < len; i++) {
				let pokemon = allPokemon[i];
				pokemon.originalSpecies = pokemon.baseTemplate.species;
			}
		},

		onSwitchInPriority: 1,
		onSwitchIn: function (pokemon) {
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
			// Mix and Mega stuff
			let oMegaTemplate = this.getTemplate(pokemon.template.originalMega);
			if (oMegaTemplate.exists && pokemon.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},

	{
		name: 'Snowball Fight',
		section: 'TPP League',
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
			if (pokemon.side.pokemonLeft === 1) {
				if (this.p1.snowballs > this.p2.snowballs) {
					this.win(this.p1);
				} else if (this.p2.snowballs > this.p1.snowballs) {
					this.win(this.p2);
				}
			}
		},
	},

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
						return ["Your Pokémon must have different trademarked abilities.", "(You have more than one Pokémon with the " + abiility + " trademark)"];
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
let stpplb;
let stpplbi;
for (let i = 0; i < exports.Formats.length; i++) {
	if (exports.Formats[i].name === 'Super TPPL Bros.') {
		stpplb = exports.Formats[i];
		stpplbi = i;
	}
}
if (stpplb) {
	exports.Formats.splice(stpplbi + 1, 0, {
		name: "Super TPPL Bros. Plus",
		section: "STPPLB",

		mod: 'stpplb',
		searchShow: true,
		team: 'randomtpplbp',
		ruleset: ['Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		onUpdate: stpplb.onUpdate,
		onModifyMove: stpplb.onModifyMove,
		onSwitchInPriority: 1,
		onSwitchIn: stpplb.onSwitchIn,
		onSwitchOut: stpplb.onSwitchOut,
		onFaint: stpplb.onFaint,
		onBegin: stpplb.onBegin,
	}, {
		name: "Super TPP Bros.",
		section: "STPPLB",

		mod: 'stpplb',
		searchShow: true,
		team: 'randomtppb',
		ruleset: ['Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		onUpdate: stpplb.onUpdate,
		onModifyMove: stpplb.onModifyMove,
		onSwitchInPriority: 1,
		onSwitchIn: stpplb.onSwitchIn,
		onSwitchOut: stpplb.onSwitchOut,
		onFaint: stpplb.onFaint,
		onBegin: stpplb.onBegin,
	}, {
		name: "Super TPPL Bros. Doubles",
		section: "STPPLB",
		gameType: 'doubles',
	
		mod: 'stpplb',
		searchShow: true,
		team: 'randomtpplb',
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
		onUpdate: stpplb.onUpdate,
		onModifyMove: stpplb.onModifyMove,
		onSwitchInPriority: 1,
		onSwitchIn: stpplb.onSwitchIn,
		onSwitchOut: stpplb.onSwitchOut,
		onFaint: stpplb.onFaint,
		onBegin: stpplb.onBegin,
	}, {
		name: "Super TPPL Bros. Plus Doubles",
		section: "STPPLB",
		gameType: 'doubles',

		mod: 'stpplb',
		searchShow: true,
		team: 'randomtpplbp',
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
		onUpdate: stpplb.onUpdate,
		onModifyMove: stpplb.onModifyMove,
		onSwitchInPriority: 1,
		onSwitchIn: stpplb.onSwitchIn,
		onSwitchOut: stpplb.onSwitchOut,
		onFaint: stpplb.onFaint,
		onBegin: stpplb.onBegin,
	}, {
		name: "Super TPP Bros. Doubles",
		section: "STPPLB",
		gameType: 'doubles',

		mod: 'stpplb',
		searchShow: true,
		team: 'randomtppb',
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
		onUpdate: stpplb.onUpdate,
		onModifyMove: stpplb.onModifyMove,
		onSwitchInPriority: 1,
		onSwitchIn: stpplb.onSwitchIn,
		onSwitchOut: stpplb.onSwitchOut,
		onFaint: stpplb.onFaint,
		onBegin: stpplb.onBegin,
	}, {
		name: "Super TPPL Bros. Triples",
		section: "STPPLB",
		gameType: 'triples',

		mod: 'stpplb',
		searchShow: true,
		team: 'randomtpplb',
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
		onUpdate: stpplb.onUpdate,
		onModifyMove: stpplb.onModifyMove,
		onSwitchInPriority: 1,
		onSwitchIn: stpplb.onSwitchIn,
		onSwitchOut: stpplb.onSwitchOut,
		onFaint: stpplb.onFaint,
		onBegin: stpplb.onBegin,
	}, {
		name: "Super TPPL Bros. Plus Triples",
		section: "STPPLB",
		gameType: 'triples',

		mod: 'stpplb',
		searchShow: true,
		team: 'randomtpplbp',
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
		onUpdate: stpplb.onUpdate,
		onModifyMove: stpplb.onModifyMove,
		onSwitchInPriority: 1,
		onSwitchIn: stpplb.onSwitchIn,
		onSwitchOut: stpplb.onSwitchOut,
		onFaint: stpplb.onFaint,
		onBegin: stpplb.onBegin,
	}, {
		name: "Super TPP Bros. Triples",
		section: "STPPLB",
		gameType: 'triples',

		mod: 'stpplb',
		searchShow: true,
		team: 'randomtppb',
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
		onUpdate: stpplb.onUpdate,
		onModifyMove: stpplb.onModifyMove,
		onSwitchInPriority: 1,
		onSwitchIn: stpplb.onSwitchIn,
		onSwitchOut: stpplb.onSwitchOut,
		onFaint: stpplb.onFaint,
		onBegin: stpplb.onBegin,
	}, {
		name: "Super TPPL Bros. Testing",
		section: "STPPLB",

		mod: 'stpplb',
		searchShow: false,
		ruleset: ['Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		onUpdate: stpplb.onUpdate,
		onModifyMove: stpplb.onModifyMove,
		onSwitchInPriority: 1,
		onSwitchIn: stpplb.onSwitchIn,
		onSwitchOut: stpplb.onSwitchOut,
		onFaint: stpplb.onFaint,
		onBegin: stpplb.onBegin,
		validateSet: function(){ return false; } // Always validate
	});
}
