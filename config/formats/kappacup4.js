// Metas for Kappa Cup Season 4

exports.Sections = {
	"Kappa Kup Season 4": { column: 5, sort: 4, },
};
exports.Formats = [
	// Week 1: Singles
	{
		name: "[Gen 7] Week 1: Singles", // Uber
		section: "Kappa Kup Season 4",
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
	
	
	// Week 2: All Terrain
	{
		name: "[Gen 7] Week 2: All Terrain",
		section: "Kappa Kup Season 4",
		desc: ["&bullet; All Terrain is a metagame in which all terrains are active permanently. Yes, Grassy, Electric, Misty and Psychic terrain are all active all at once."],
		ruleset: ['[Gen 7] OU'],
		banlist: ['Nature Power', 'Secret Power', 'Camoflauge', 'Raichu-Alola'],
		unbanlist: ['Landorus'],
		mod: 'allterrain',
		searchShow: false,
		onBegin: function() {
			this.setTerrain('allterrain');
		},
	},
	
	
	// Week 3: Doubles
	{
		name: "[Gen 7] Week 3: Doubles", // Ubersw
		section: "Kappa Kup Season 4",
		
		mod: 'gen7',
		searchShow: false,
		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard Doubles', 'Team Preview'],
		banlist: ['Illegal', 'Unreleased', 'Dark Void'],
	},
	
	
	// Week 4: Mix n' Mega
	{
		name: "[Gen 7] Week 4: Mix and Mega",
		section: "Kappa Kup Season 4",
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
	
	// Week 5: ??? (Break Week)
	
	// Week 6: Move Equality
	{
	    name: '[Gen 7] Week 6: Move Equality',
	    section: "Kappa Kup Season 4",
		
	    mod: 'gen7',
	    searchShow: false,
	    ruleset: ['[Gen 7] OU'],
	    banlist: ['Mud Slap', 'Power-Up Punch', 'Fell Stinger'],
		
	    onModifyMove: function(move) {
	        let moveTemplate = this.getMove(toId(move));
	        if (moveTemplate.category === 'Status' || moveTemplate.basePower === 0 || moveTemplate.priority !== 0) return move;
	        // Moves aren't allowed to modify its base power
	        if (move.basePowerCallback || move.onBasePower) return move;
	        move = Object.assign({}, move);
	        if (move.isZ && move.basePower > 1) {
	            move.basePower = 180;
	        } else if (move.multihit) {
	            let maxhits = Array.isArray(move.multihit) ? move.multihit[1] : move.multihit;
	            move.basePower = Math.floor(100 / maxhits);
	            move.zMovePower = 180;
	        } else {
	            move.basePower = 100;
	            move.zMovePower = 180;
	        }
	        return move;
	    },
	},
	
	// Week 7: Cross Evo Doubles
	{
		name: "[Gen 7] Week 7: Cross Evolution",
		section: "Kappa Kup Season 4",
		desc: [
			"You can \"cross-evolve\" your Pok&eacute;mon by naming them after the intended Pok&eacute;mon.",
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3594854/\">Cross Evolution</a>",
		],
		mod: 'gen7',
		searchShow: false,
		gameType: 'doubles',
		ruleset: ['[Gen 7] Doubles Ubers', 'Baton Pass Clause'],
		banlist: ['Rule:nicknameclause'],
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
		validateSet: function (set, teamHas) {
			let crossTemplate = Dex.getTemplate(set.name);
			if (!crossTemplate.exists || crossTemplate.isNonstandard) return this.validateSet(set, teamHas);
			let template = Dex.getTemplate(set.species);
			if (!template.exists) return [`The Pokemon ${set.species} does not exist.`];
			if (!template.evos.length) return [`${template.species} cannot cross evolve because it doesn't evolve.`];
			if (template.species === 'Sneasel') return [`Sneasel as a base Pokemon is banned.`];
			let crossBans = {'shedinja': 1, 'solgaleo': 1, 'lunala': 1};
			if (crossTemplate.id in crossBans) return [`${template.species} cannot cross evolve into ${crossTemplate.species} because it is banned.`];
			if (crossTemplate.battleOnly || !crossTemplate.prevo) return [`${template.species} cannot cross evolve into ${crossTemplate.species} because it isn't an evolution.`];
			let crossPrevoTemplate = Dex.getTemplate(crossTemplate.prevo);
			if (!crossPrevoTemplate.prevo !== !template.prevo) return [`${template.species} cannot cross into ${crossTemplate.species} because they are not consecutive evolutionary stages.`];

			// Make sure no stat is too high/low to cross evolve to
			let stats = {
				'hp': 'HP',
				'atk': 'Attack',
				'def': 'Defense',
				'spa': 'Special Attack',
				'spd': 'Special Defense',
				'spe': 'Speed',
			};
			for (let statid in template.baseStats) {
				let evoStat = template.baseStats[statid] + crossTemplate.baseStats[statid] - crossPrevoTemplate.baseStats[statid];
				if (evoStat < 1) {
					return [`${template.species} cannot cross evolve to ${crossTemplate.species} because its ${stats[statid]} would be too low.`];
				} else if (evoStat > 255) {
					return [`{template.species} cannot cross evolve to ${crossTemplate.species} because its ${stats[statid]} would be too high.`];
				}
			}

			let mixedTemplate = Object.assign({}, template);
			// Ability test
			let ability = Dex.getAbility(set.ability);
			let abilityBans = {'hugepower': 1, 'purepower': 1, 'shadowtag': 1};
			if (!(ability.id in abilityBans)) mixedTemplate.abilities = crossTemplate.abilities;

			mixedTemplate.learnset = Object.assign({}, template.learnset);
			let newMoves = 0;
			for (let i in set.moves) {
				let move = toId(set.moves[i]);
				if (!this.checkLearnset(move, template)) continue;
				if (this.checkLearnset(move, crossTemplate)) continue;
				if (++newMoves > 2) continue;
				mixedTemplate.learnset[move] = ['7T'];
			}
			return this.validateSet(set, teamHas, mixedTemplate);
		},
		onModifyTemplate: function (template, pokemon) {
			if (pokemon.crossEvolved || pokemon.set.name === pokemon.species) return template;
			let crossTemplate = this.getTemplate(pokemon.name);
			if (!crossTemplate.exists || crossTemplate.num === template.num) return template;
			let crossPrevoTemplate = this.getTemplate(crossTemplate.prevo);
			let mixedTemplate = Object.assign({}, template);
			mixedTemplate.baseSpecies = mixedTemplate.species = template.species + '-' + crossTemplate.species;
			mixedTemplate.weightkg = Math.max(0.1, template.weightkg + crossTemplate.weightkg - crossPrevoTemplate.weightkg);
			mixedTemplate.nfe = false;

			mixedTemplate.baseStats = {};
			for (let statid in template.baseStats) {
				mixedTemplate.baseStats[statid] = template.baseStats[statid] + crossTemplate.baseStats[statid] - crossPrevoTemplate.baseStats[statid];
			}

			mixedTemplate.types = template.types.slice();
			if (crossTemplate.types[0] !== crossPrevoTemplate.types[0]) mixedTemplate.types[0] = crossTemplate.types[0];
			if (crossTemplate.types[1] !== crossPrevoTemplate.types[1]) mixedTemplate.types[1] = crossTemplate.types[1] || crossTemplate.types[0];
			if (mixedTemplate.types[0] === mixedTemplate.types[1]) mixedTemplate.types.length = 1;

			pokemon.baseTemplate = mixedTemplate;
			pokemon.crossEvolved = "Yes";
			return mixedTemplate;
		},
		onSwitchInPriority: 1,
		onSwitchIn: function (pokemon) {
			if (pokemon.crossEvolved === "Yes") {
				this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[silent]');
			}
		},
	},
	
	
	// Week 8: Pan-Z-Monium (Custom Meta)
	{
		name: "[Gen 7] Week 8: Pan-Z-Monium",
		section: "Kappa Kup Season 4",
		desc: [
			"Z-Crystals can trigger any move as a z-move, and can be used once per move instead of once per battle.",
		],
		// TODO: implement
		ruleset: ['[Gen 7] OU'],
		mod: 'panzmonium',
		searchShow: false,
	},
	// Backup if Pan-Z-Monium falls through
	// { 
	// 	name: "[Gen 7] Week 8: Sketchmons",
	// 	desc: [
	// 		"Pok&eacute;mon gain access to one Sketched move.",
	// 		"&bullet; <a href=\"https://www.smogon.com/forums/threads/3587743/\">Sketchmons</a>",
	// 		"&bullet; <a href=\"https://www.smogon.com/tiers/om/analyses/sketchmons/\">Sketchmons Analyses</a>",
	// 	],

	// 	mod: 'gen7',
	// 	ruleset: ['[Gen 7] OU', 'Allow One Sketch', 'Sketch Clause'],
	// 	banlist: ['Dugtrio-Base'],
	// 	noSketch: ['Belly Drum', 'Celebrate', 'Conversion', "Forest's Curse", 'Geomancy', 'Happy Hour', 'Hold Hands', 'Lovely Kiss', 'Purify', 'Shell Smash', 'Shift Gear', 'Sketch', 'Spore', 'Sticky Web', 'Trick-or-Treat'],
	// },
	
	
	// Week 9: Last Will
	{
		name: "[Gen 7] Week 9: Last Will",
		section: "Kappa Kup Season 4",
		desc: ["&bullet; Every Pokemon will use the move in their last moveslot before fainting in battle."],
		ruleset: ['[Gen 7] OU'],
		mod: 'lastwill',
		searchShow: false,
	},
];