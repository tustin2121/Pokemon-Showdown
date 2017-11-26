// Metas for Kappa Cup Season 4

exports.Sections = {
	"Kappa Kup Season 4": { column: 6, sort: 4, },
	"Kappa Kup Season 4 Playoffs": { column: 6, sort: 5, },
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
			let crossTemplate = this.dex.getTemplate(set.name);
			if (!crossTemplate.exists || crossTemplate.isNonstandard) return this.validateSet(set, teamHas);
			let template = this.dex.getTemplate(set.species);
			if (!template.exists || template.isNonstandard || template === crossTemplate) return this.validateSet(set, teamHas);
			if (!template.nfe) return [`${template.species} cannot cross evolve because it doesn't evolve.`];
			if (crossTemplate.battleOnly || !crossTemplate.prevo) return [`${template.species} cannot cross evolve into ${crossTemplate.species} because it isn't an evolution.`];
			if (template.species === 'Sneasel') return [`Sneasel as a base Pokemon is banned.`];
			let crossBans = {'shedinja': 1, 'solgaleo': 1, 'lunala': 1};
			if (crossTemplate.id in crossBans) return [`${template.species} cannot cross evolve into ${crossTemplate.species} because it is banned.`];
			let crossPrevoTemplate = this.dex.getTemplate(crossTemplate.prevo);
			if (!crossPrevoTemplate.prevo !== !template.prevo) return [`${template.species} cannot cross into ${crossTemplate.species} because they are not consecutive evolutionary stages.`];
			
			// Make sure no stat is too high/low to cross evolve to
			let stats = {'hp':'HP', 'atk':'Attack', 'def':'Defense', 'spa':'Special Attack', 'spd':'Special Defense', 'spe':'Speed'};
			for (let statid in template.baseStats) {
				let evoStat = template.baseStats[statid] + crossTemplate.baseStats[statid] - crossPrevoTemplate.baseStats[statid];
				if (evoStat < 1) {
					return [`${template.species} cannot cross evolve to ${crossTemplate.species} because its ${stats[statid]} would be too low.`];
				} else if (evoStat > 255) {
					return [`${template.species} cannot cross evolve to ${crossTemplate.species} because its ${stats[statid]} would be too high.`];
				}
			}
			
			let mixedTemplate = Object.assign({}, template);
			// Ability test
			let ability = this.dex.getAbility(set.ability);
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
		onModifyTemplate: function (template, pokemon, source) {
			if (source) return;
			if (pokemon.set.name === pokemon.set.species) return;
			let crossTemplate = this.getTemplate(pokemon.set.name);
			if (!crossTemplate.exists) return;
			if (template.battleOnly || !template.nfe) return;
			if (crossTemplate.battleOnly || !crossTemplate.prevo) return;
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

			pokemon.crossEvolved = true;
			return mixedTemplate;
		},
		onBegin: function () {
			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (let i = 0, len = allPokemon.length; i < len; i++) {
				allPokemon[i].baseTemplate = allPokemon[i].template;
			}
		},
		onSwitchInPriority: 1,
		onSwitchIn: function (pokemon) {
			if (pokemon.crossEvolved) {
				this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[silent]');
			}
		},
	},
	
	
	// Week 8: Pan-Z-Monium (Custom Meta)
	{
		name: "[Gen 7] Week 8: Pan-Z-Monium",
		section: "Kappa Kup Season 4",
		desc: [
			"Z-Crystals can trigger any move as a z-move, and can be used once per move instead of once per battle. Ubers are not allowed to hold Z-Crystals.",
		],
		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Uber + Z-Crystal'],
		mod: 'panzmonium',
		searchShow: false,
		
		onChangeSet: function(set, format, setHas) {
			let item = this.getItem(set.item);
			if (item.zMove) setHas['zcrystal'] = true;
		},
		
		// onValidateSet: function(set, format, setHas, teamHas) {
		// 	console.log(`PZM: onValidateSet:  ${require('util').inspect(setHas)}`);
		// }
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
		desc: [
            "Before fainting, Pok&eacute;mon will use the move in their last moveslot.",
            "&bullet; <a href=\"https://www.smogon.com/forums/threads/3601362/\">Last Will</a>",
        ],
		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Endeavor', 'Blast Burn + Explosion + Frenzy Plant + Giga Impact + Hydro Cannon + Hyper Beam + Self Destruct + V-Create > 2'],
		searchShow: false,
		
		onBeforeFaint: function(pokemon, source) {
			if ( !(pokemon.baseTemplate.tier in { Uber:1 }) ) {
				// Ubers may not do this.
				this.add('-hint', `${pokemon.name || pokemon.species}'s Last Will made it get off one last move!`);
				this.runMove(pokemon.moves[pokemon.moves.length - 1], pokemon);
			} else {
				this.add('-hint', `${pokemon.name || pokemon.species} tried to invoke its Last Will... but it failed!`);
			}
		},
	},
	
	
	// Playoffs: Almost Any Ability
	{
		name: "[Gen 7] Playoffs: Almost Any Ability",
		desc: [
			"Pok&eacute;mon can use any ability, barring the few that are banned.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3587901/\">Almost Any Ability</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3595753/\">AAA Resources</a>",
			"&bullet; <a href=\"http://www.smogon.com/tiers/om/analyses/aaa/\">AAA Analyses</a>",
		],
		section: "Kappa Kup Season 4 Playoffs",

		mod: 'gen7',
		searchShow: false,
		ruleset: ['[Gen 7] Ubers', 'Ability Clause', 'Ignore Illegal Abilities'],
		bannedMons: ['Archeops', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion'],
		unbanlist: ['Genesect', 'Landorus', 'Metagross-Mega'],
		bannedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
		onValidateSet: function (set, format) {
			let template = this.getTemplate(set.species || set.name);
			let bannedAbilities = format.bannedAbilities || [];
			let bannedMons = format.bannedMons || [];
			
			let legalAbility = false;
			for (let i in template.abilities) {
				if (set.ability === template.abilities[i]) legalAbility = true;
			}
			
			if (template.tier in { Uber:1 }) {
				if (!legalAbility) return [`Ubers must have a normally legal ability.`];
			}
			else if (bannedMons.includes(template.species)) {
				if (!legalAbility) return [`Mons normally banned from AAA must have a normally legal ability.`];
			}
			else if (bannedAbilities.includes(set.ability)) {
				if (!legalAbility) return ['The ability ' + set.ability + ' is banned on Pok\u00e9mon that do not naturally have it.'];
			}
		},
	},
	{
		name: "[Gen 7] Playoffs: STABmons",
		desc: [
			"Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3587949/\">STABmons</a>",
		],
		section: "Kappa Kup Season 4 Playoffs",

		mod: 'gen7',
		searchShow: false,
		ruleset: ['[Gen 7] OU', 'Ignore STAB Moves'],
		banlist: ['Aerodactylite', 'King\'s Rock', 'Metagrossite', 'Razor Fang'],
		noLearn: ['Acupressure', 'Belly Drum', 'Chatter', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Thousand Arrows'],
		bannedMons: ['Kartana', 'Komala', 'Kyurem-Black', 'Silvally-Ghost', 'Tapu Koko', 'Tapu Lele'],
		
		/**
		 * @param {Move} move
		 * @param {Template} species
		 * @param {PokemonSources} lsetData
		 * @param {AnyObject} set
		 * @return {{type: string, [any: string]: any} | false}
		 */
		checkLearnset(move, species, lsetData = {sources: [], sourcesBefore: this.dex.gen}, set = {}) {
			let dex = this.dex;
	
			let moveid = toId(move);
			if (moveid === 'constructor') return {type: 'invalid'};
			move = dex.getMove(moveid);
			/** @type {?Template} */
			let template = dex.getTemplate(species);
	
			let format = this.format;
			let ruleTable = dex.getRuleTable(format);
			let alreadyChecked = {};
			let level = set.level || 100;
	
			let incompatibleAbility = false;
			let isHidden = false;
			if (set.ability && dex.getAbility(set.ability).name === template.abilities['H']) isHidden = true;
	
			let limit1 = true;
			let sketch = false;
			let blockedHM = false;
	
			let sometimesPossible = false; // is this move in the learnset at all?
	
			// This is a pretty complicated algorithm
	
			// Abstractly, what it does is construct the union of sets of all
			// possible ways this pokemon could be obtained, and then intersect
			// it with a the pokemon's existing set of all possible ways it could
			// be obtained. If this intersection is non-empty, the move is legal.
	
			// We apply several optimizations to this algorithm. The most
			// important is that with, for instance, a TM move, that Pokemon
			// could have been obtained from any gen at or before that TM's gen.
			// Instead of adding every possible source before or during that gen,
			// we keep track of a maximum gen variable, intended to mean "any
			// source at or before this gen is possible."
	
			// set of possible sources of a pokemon with this move, represented as an array
			let sources = /** @type {PokemonSource[]} */ ([]);
			// the equivalent of adding "every source at or before this gen" to sources
			let sourcesBefore = 0;
	
			/**
			 * The minimum past gen the format allows
			 */
			const minPastGen = (format.requirePlus ? 7 : format.requirePentagon ? 6 : 1);
			/**
			 * The format doesn't allow Pokemon who've bred with past gen Pokemon
			 * (e.g. Gen 6-7 before Pokebank was released)
			 */
			const noPastGenBreeding = false;
			/**
			 * The format doesn't allow Pokemon traded from the future
			 * (This is everything except in Gen 1 Tradeback)
			 */
			const noFutureGen = !ruleTable.has('allowtradeback');
			/**
			 * If a move can only be learned from a gen 2-5 egg, we have to check chainbreeding validity
			 * limitedEgg is false if there are any legal non-egg sources for the move, and true otherwise
			 */
			let limitedEgg = null;
	
			let tradebackEligible = false;
			while (template && template.species && !alreadyChecked[template.speciesid]) {
				alreadyChecked[template.speciesid] = true;
				if (dex.gen === 2 && template.gen === 1) tradebackEligible = true;
				// STABmons hack to avoid copying all of validateSet to formats
				let bannedMons = format.bannedMons || [];
				let disallowRule = (template.tier in { Uber:1 }) || (bannedMons.includes(species));
				// @ts-ignore
				let noLearn = format.noLearn || [];
				if (!disallowRule && !noLearn.includes(move.name) && !move.isZ) {
					let types = template.types;
					if (template.baseSpecies === 'Rotom') types = ['Electric', 'Ghost', 'Fire', 'Water', 'Ice', 'Flying', 'Grass'];
					if (template.baseSpecies === 'Shaymin') types = ['Grass', 'Flying'];
					if (template.baseSpecies === 'Hoopa') types = ['Psychic', 'Ghost', 'Dark'];
					if (template.baseSpecies === 'Oricorio') types = ['Fire', 'Flying', 'Electric', 'Psychic', 'Ghost'];
					if (template.baseSpecies === 'Arceus' || template.baseSpecies === 'Silvally' || types.includes(move.type)) return false;
				}
				// End STABmons hack
				if (!template.learnset) {
					if (template.baseSpecies !== template.species) {
						// forme without its own learnset
						template = dex.getTemplate(template.baseSpecies);
						// warning: formes with their own learnset, like Wormadam, should NOT
						// inherit from their base forme unless they're freely switchable
						continue;
					}
					// should never happen
					break;
				}
	
				if (template.learnset[moveid] || template.learnset['sketch']) {
					sometimesPossible = true;
					let lset = template.learnset[moveid];
					if (moveid === 'sketch' || !lset || template.speciesid === 'smeargle') {
						if (move.noSketch || move.isZ) return {type: 'invalid'};
						lset = template.learnset['sketch'];
						sketch = true;
					}
					if (typeof lset === 'string') lset = [lset];
	
					for (let learned of lset) {
						// Every `learned` represents a single way a pokemon might
						// learn a move. This can be handled one of several ways:
						// `continue`
						//   means we can't learn it
						// `return false`
						//   means we can learn it with no restrictions
						//   (there's a way to just teach any pokemon of this species
						//   the move in the current gen, like a TM.)
						// `sources.push(source)`
						//   means we can learn it only if obtained that exact way described
						//   in source
						// `sourcesBefore = Math.max(sourcesBefore, learnedGen)`
						//   means we can learn it only if obtained at or before learnedGen
						//   (i.e. get the pokemon however you want, transfer to that gen,
						//   teach it, and transfer it to the current gen.)
	
						let learnedGen = parseInt(learned.charAt(0));
						if (learnedGen < minPastGen) continue;
						if (noFutureGen && learnedGen > dex.gen) continue;
	
						// redundant
						if (learnedGen <= sourcesBefore) continue;
	
						if (learnedGen < 7 && isHidden && !dex.mod('gen' + learnedGen).getTemplate(template.species).abilities['H']) {
							// check if the Pokemon's hidden ability was available
							incompatibleAbility = true;
							continue;
						}
						if (!template.isNonstandard) {
							// HMs can't be transferred
							if (dex.gen >= 4 && learnedGen <= 3 && ['cut', 'fly', 'surf', 'strength', 'flash', 'rocksmash', 'waterfall', 'dive'].includes(moveid)) continue;
							if (dex.gen >= 5 && learnedGen <= 4 && ['cut', 'fly', 'surf', 'strength', 'rocksmash', 'waterfall', 'rockclimb'].includes(moveid)) continue;
							// Defog and Whirlpool can't be transferred together
							if (dex.gen >= 5 && ['defog', 'whirlpool'].includes(moveid) && learnedGen <= 4) blockedHM = true;
						}
	
						if (learned.charAt(1) === 'L') {
							// special checking for level-up moves
							if (level >= parseInt(learned.substr(2)) || learnedGen >= 7) {
								// we're past the required level to learn it
								// (gen 7 level-up moves can be relearnered at any level)
								// falls through to LMT check below
							} else if (level >= 5 && learnedGen === 3 && template.eggGroups && template.eggGroups[0] !== 'Undiscovered') {
								// Pomeg Glitch
							} else if ((!template.gender || template.gender === 'F') && learnedGen >= 2) {
								// available as egg move
								learned = learnedGen + 'Eany';
								limitedEgg = false;
								// falls through to E check below
							} else {
								// this move is unavailable, skip it
								continue;
							}
						}
	
						if ('LMT'.includes(learned.charAt(1))) {
							if (learnedGen === dex.gen) {
								// current-gen level-up, TM or tutor moves:
								//   always available
								return false;
							}
							// past-gen level-up, TM, or tutor moves:
							//   available as long as the source gen was or was before this gen
							limit1 = false;
							sourcesBefore = Math.max(sourcesBefore, learnedGen);
							limitedEgg = false;
						} else if (learned.charAt(1) === 'E') {
							// egg moves:
							//   only if that was the source
							if ((learnedGen >= 6 && !noPastGenBreeding) || lsetData.fastCheck) {
								// gen 6 doesn't have egg move incompatibilities except for certain cases with baby Pokemon
								learned = learnedGen + 'E' + (template.prevo ? template.id : '');
								sources.push(learned);
								limitedEgg = false;
								continue;
							}
							// it's a past gen; egg moves can only be inherited from the father
							// we'll add each possible father separately to the source list
							let eggGroups = template.eggGroups;
							if (!eggGroups) continue;
							if (eggGroups[0] === 'Undiscovered') eggGroups = dex.getTemplate(template.evos[0]).eggGroups;
							let atLeastOne = false;
							let fromSelf = (learned.substr(1) === 'Eany');
							let eggGroupsSet = new Set(eggGroups);
							learned = learned.substr(0, 2);
							// loop through pokemon for possible fathers to inherit the egg move from
							for (let fatherid in dex.data.Pokedex) {
								let father = dex.getTemplate(fatherid);
								// can't inherit from CAP pokemon
								if (father.isNonstandard) continue;
								// can't breed mons from future gens
								if (father.gen > learnedGen) continue;
								// father must be male
								if (father.gender === 'N' || father.gender === 'F') continue;
								// can't inherit from dex entries with no learnsets
								if (!father.learnset) continue;
								// unless it's supposed to be self-breedable, can't inherit from self, prevos, evos, etc
								// only basic pokemon have egg moves, so by now all evolutions should be in alreadyChecked
								if (!fromSelf && alreadyChecked[father.speciesid]) continue;
								if (!fromSelf && father.evos.includes(template.id)) continue;
								if (!fromSelf && father.prevo === template.id) continue;
								// father must be able to learn the move
								let fatherSources = father.learnset[moveid] || father.learnset['sketch'];
								if (!fromSelf && !fatherSources) continue;
	
								// must be able to breed with father
								if (!father.eggGroups.some(eggGroup => eggGroupsSet.has(eggGroup))) continue;
	
								// detect unavailable egg moves
								if (noPastGenBreeding) {
									const fatherLatestMoveGen = fatherSources[0].charAt(0);
									if (father.tier.startsWith('Bank') || fatherLatestMoveGen !== '7') continue;
									atLeastOne = true;
									break;
								}
	
								// we can breed with it
								atLeastOne = true;
								if (tradebackEligible && learnedGen === 2 && move.gen <= 1) {
									// can tradeback
									sources.push('1ET' + father.id);
								}
								sources.push(learned + father.id);
								if (limitedEgg !== false) limitedEgg = true;
							}
							if (atLeastOne && noPastGenBreeding) {
								// gen 6+ doesn't have egg move incompatibilities except for certain cases with baby Pokemon
								learned = learnedGen + 'E' + (template.prevo ? template.id : '');
								sources.push(learned);
								limitedEgg = false;
								continue;
							}
							// chainbreeding with itself
							// e.g. ExtremeSpeed Dragonite
							if (!atLeastOne) {
								if (noPastGenBreeding) continue;
								sources.push(learned + template.id);
								limitedEgg = 'self';
							}
						} else if (learned.charAt(1) === 'S') {
							// event moves:
							//   only if that was the source
							// Event Pokémon:
							//	Available as long as the past gen can get the Pokémon and then trade it back.
							if (tradebackEligible && learnedGen === 2 && move.gen <= 1) {
								// can tradeback
								sources.push('1ST' + learned.slice(2) + ' ' + template.id);
							}
							sources.push(learned + ' ' + template.id);
						} else if (learned.charAt(1) === 'D') {
							// DW moves:
							//   only if that was the source
							sources.push(learned);
						} else if (learned.charAt(1) === 'V') {
							// Virtual Console moves:
							//   only if that was the source
							if (sources[sources.length - 1] !== learned) sources.push(learned);
						}
					}
				}
				if (ruleTable.has('mimicglitch') && template.gen < 5) {
					// include the Mimic Glitch when checking this mon's learnset
					let glitchMoves = ['metronome', 'copycat', 'transform', 'mimic', 'assist'];
					let getGlitch = false;
					for (const i of glitchMoves) {
						if (template.learnset[i]) {
							if (!(i === 'mimic' && dex.getAbility(set.ability).gen === 4 && !template.prevo)) {
								getGlitch = true;
								break;
							}
						}
					}
					if (getGlitch) {
						sourcesBefore = Math.max(sourcesBefore, 4);
						if (move.gen < 5) {
							limit1 = false;
						}
					}
				}
	
				// also check to see if the mon's prevo or freely switchable formes can learn this move
				if (template.species === 'Lycanroc-Dusk') {
					template = dex.getTemplate('Rockruff-Dusk');
				} else if (template.prevo) {
					template = dex.getTemplate(template.prevo);
					if (template.gen > Math.max(2, dex.gen)) template = null;
					if (template && !template.abilities['H']) isHidden = false;
				} else if (template.baseSpecies !== template.species && template.baseSpecies === 'Rotom') {
					// only Rotom inherit learnsets from base
					template = dex.getTemplate(template.baseSpecies);
				} else {
					template = null;
				}
			}
	
			if (limit1 && sketch) {
				// limit 1 sketch move
				if (lsetData.sketchMove) {
					return {type:'oversketched', maxSketches: 1};
				}
				lsetData.sketchMove = moveid;
			}
	
			if (blockedHM) {
				// Limit one of Defog/Whirlpool to be transferred
				if (lsetData.hm) return {type:'incompatible'};
				lsetData.hm = moveid;
			}
	
			// Now that we have our list of possible sources, intersect it with the current list
			if (!sourcesBefore && !sources.length) {
				if (minPastGen > 1 && sometimesPossible) return {type:'pastgen', gen: minPastGen};
				if (incompatibleAbility) return {type:'incompatibleAbility'};
				return {type: 'invalid'};
			}
			if (sourcesBefore || lsetData.sourcesBefore) {
				// having sourcesBefore is the equivalent of having everything before that gen
				// in sources, so we fill the other array in preparation for intersection
				if (sourcesBefore > lsetData.sourcesBefore) {
					for (const oldSource of lsetData.sources) {
						const oldSourceGen = parseInt(oldSource.charAt(0));
						if (oldSourceGen <= sourcesBefore) {
							sources.push(oldSource);
						}
					}
				} else if (lsetData.sourcesBefore > sourcesBefore) {
					for (const source of sources) {
						const sourceGen = parseInt(source.charAt(0));
						if (sourceGen <= lsetData.sourcesBefore) {
							lsetData.sources.push(source);
						}
					}
				}
				lsetData.sourcesBefore = sourcesBefore = Math.min(sourcesBefore, lsetData.sourcesBefore);
			}
			if (lsetData.sources.length) {
				if (sources.length) {
					let sourcesSet = new Set(sources);
					let intersectSources = lsetData.sources.filter(source => sourcesSet.has(source));
					lsetData.sources = intersectSources;
				} else {
					lsetData.sources = [];
				}
			}
			if (!lsetData.sources.length && !sourcesBefore) {
				return {type:'incompatible'};
			}
	
			if (limitedEgg) {
				// lsetData.limitedEgg = [moveid] of egg moves with potential breeding incompatibilities
				// 'self' is a possible entry (namely, ExtremeSpeed on Dragonite) meaning it's always
				// incompatible with any other egg move
				if (!lsetData.limitedEgg) lsetData.limitedEgg = [];
				lsetData.limitedEgg.push(limitedEgg === true ? moveid : limitedEgg);
			}
	
			return false;
		}

	},
];