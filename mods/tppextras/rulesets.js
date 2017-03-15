// Note: These rulesets are included at the end of rulesets.js

'use strict';

exports.BattleFormats = {
	// Stadium Selection: Allow the combatants to choose battle field and music before the fight begins.
	stadiumselection: {
		effectType: 'Rule',
		name: "Stadium Selection",
		onStartPriority: -11,
		onStart: function () {
			try {
				let bgmindex = Config.stadium.music();
				let bgiindex = Config.stadium.background();
				
				this.stadium = {};
				this.stadium.update = this.effect.updateStadium.bind(this);
				this.stadium.update({
					request: true,
					m_battle: bgmindex.randBattle(),
					bgimg: bgiindex.convertToId(bgiindex.getRandomBG(this.gen)),
				});
				
				this.add('rule', "Stadium Selection: Combatants can use the Battle Options before battle to choose battle music and background selection.");
			} catch (e) {
				console.error("Stadium Selection rule failed."+
					"The following error occurred while loading music and backgrounds:\n", e);
				this.add('error', 'Stadium Selection rule failed. Please see console.');
			}
		},
		onStadiumRequest: function(request) {
			this.debug("StadiumRequest: "+request.join('|'));
			if (!this.stadium || !this.stadium.request || !request) return;
			try {
				let bgmindex = Config.stadium.music();
				let bgiindex = Config.stadium.background();
				
				switch (request[0]) {
					case 'field': 
						let id = bgiindex.convertToId(request[1]);
						this.stadium.update({ bgimg: id });
						break;
					case 'music': 
						if (!bgmindex.isValidBattle(request[1])) {
							this.add('error', `'${request[1]}' is an invalid battle music id.`);
							break;
						}
						this.stadium.update({ m_battle: request[1] });
						break;
					case 'vmusic': 
						if (!bgmindex.isValidVictory(request[1])) {
							this.add('error', `'${request[1]}' is an invalid victory music id.`);
							break;
						}
						this.stadium.update({ m_victory: request[1] });
						break;
					case 'premusic': 
						if (!bgmindex.isValid(request[1])) {
							this.add('error', `'${request[1]}' is an invalid music id.`);
							break;
						}
						this.stadium.update({ m_pre: request[1] });
						break;
				}
			} catch (e) {
				console.error("Error processing stadium request."+
					"The command '/stadium "+request.join('|')+"' gave the following error occurred:\n", e);
				this.add('error', 'Error processing stadium request.');
			}
		},
		onSwitchInPriority: 1,
		onSwitchIn: function() {
			if (this.stadium) {
				this.stadium.update({ request: false, });
			}
		},
		updateStadium : function(changes){
			if (!this.stadium) return;
			let std = this.stadium;
			let args = [];
			if (changes.request !== undefined && changes.request !== std.request) {
				std.request = changes.request;
				args.push(std.request? '[request]' : '[norequest]'); //can change these options in this battle
			}
			if (changes.bgimg !== undefined && changes.bgimg !== std.bgimg) {
				std.bgimg = changes.bgimg;
				args.push('[bg] '+this.stadium.bgimg);
			}
			if (changes.m_battle !== undefined && changes.m_battle !== std.m_battle) {
				std.m_battle = changes.m_battle;
				args.push('[music] '+this.stadium.m_battle);
			}
			if (changes.m_victory !== undefined && changes.m_victory !== std.m_victory) {
				std.m_victory = changes.m_victory;
				args.push('[vmusic] '+this.stadium.m_victory);
			}
			if (changes.m_pre !== undefined && changes.m_pre !== std.m_pre) {
				std.m_pre = changes.m_pre;
				args.push('[premusic] '+this.stadium.m_pre);
			}
			if (args.length > 0) {
				this.add('-stadium', args.join('|'));
			}
		},
	},
	
	// Pokemon Plus: Allow all Fakemon if "Allow Fake" is added to banlist.
	pokemonplus: {
		effectType: 'ValidatorRule',
		name: 'Pokemon Plus',
		onValidateTeam: function (team, format) {
			let problems = [];
			// ----------- legality line ------------------------------------------
			if (!format || !format.banlistTable || !format.banlistTable['illegal']) return problems;
			// everything after this line only happens if we're doing legality enforcement
			let kyurems = 0;
			for (let i = 0; i < team.length; i++) {
				if (team[i].species === 'Kyurem-White' || team[i].species === 'Kyurem-Black') {
					if (kyurems > 0) {
						problems.push('You cannot have more than one Kyurem-Black/Kyurem-White.');
						break;
					}
					kyurems++;
				}
			}
			return problems;
		},
		onChangeSet: function (set, format) {
			let item = this.getItem(set.item);
			let template = this.getTemplate(set.species);
			let problems = [];
			let totalEV = 0;
			let allowFake = !!(format && format.banlistTable && format.banlistTable['allowfake']);

			if (set.species === set.name) delete set.name;
			if (template.gen > this.gen) {
				problems.push(set.species + ' does not exist in gen ' + this.gen + '.');
			}
			if ((template.num === 25 || template.num === 172) && template.tier === 'Illegal') {
				problems.push(set.species + ' does not exist outside of gen ' + template.gen + '.');
			}
			let ability = {};
			if (set.ability) {
				ability = this.getAbility(set.ability);
				if (ability.gen > this.gen) {
					problems.push(ability.name + ' does not exist in gen ' + this.gen + '.');
				}
			}
			if (set.moves) {
				for (let i = 0; i < set.moves.length; i++) {
					let move = this.getMove(set.moves[i]);
					if (move.gen > this.gen) {
						problems.push(move.name + ' does not exist in gen ' + this.gen + '.');
					} else if (!allowFake && move.isNonstandard) {
						problems.push(move.name + ' does not exist.');
					}
				}
			}
			if (item.gen > this.gen) {
				problems.push(item.name + ' does not exist in gen ' + this.gen + '.');
			}
			if (set.moves && set.moves.length > 4 && format.banlistTable['allowMoreMoves']) {
				problems.push((set.name || set.species) + ' has more than four moves.');
			}
			if (set.level && set.level > 100) {
				problems.push((set.name || set.species) + ' is higher than level 100.');
			}

			if (!allowFake) {
				if (template.isNonstandard) {
					problems.push(set.species + ' does not exist.');
				}
				if (ability.isNonstandard) {
					problems.push(ability.name + ' does not exist.');
				}
				if (item.isNonstandard) {
					if (item.isNonstandard === 'gen2') {
						problems.push(item.name + ' does not exist outside of gen 2.');
					} else {
						problems.push(item.name + ' does not exist.');
					}
				}
			}
			for (let k in set.evs) {
				if (typeof set.evs[k] !== 'number' || set.evs[k] < 0) {
					set.evs[k] = 0;
				}
				totalEV += set.evs[k];
			}
			// In gen 6, it is impossible to battle other players with pokemon that break the EV limit
			if (totalEV > 510 && this.gen === 6) {
				problems.push((set.name || set.species) + " has more than 510 total EVs.");
			}

			// ----------- legality line ------------------------------------------
			if (!format.banlistTable || !format.banlistTable['illegal']) return problems;
			// everything after this line only happens if we're doing legality enforcement

			// only in gen 1 and 2 it was legal to max out all EVs
			if (this.gen >= 3 && totalEV > 510) {
				problems.push((set.name || set.species) + " has more than 510 total EVs.");
			}

			if (template.gender) {
				if (set.gender !== template.gender) {
					set.gender = template.gender;
				}
			} else {
				if (set.gender !== 'M' && set.gender !== 'F') {
					set.gender = undefined;
				}
			}

			// Legendary Pokemon must have at least 3 perfect IVs in gen 6
			let baseTemplate = this.getTemplate(template.baseSpecies);
			if (set.ivs && this.gen >= 6 && (baseTemplate.gen >= 6 || format.requirePentagon) && (template.eggGroups[0] === 'Undiscovered' || template.species === 'Manaphy') && !template.prevo && !template.nfe &&
				// exceptions
				template.species !== 'Unown' && template.baseSpecies !== 'Pikachu' && (template.baseSpecies !== 'Diancie' || !set.shiny)) {
				let perfectIVs = 0;
				for (let i in set.ivs) {
					if (set.ivs[i] >= 31) perfectIVs++;
				}
				let reason = (format.requirePentagon ? " and this format requires gen " + this.gen + " Pokémon" : " in gen 6");
				if (perfectIVs < 3) problems.push((set.name || set.species) + " must have at least three perfect IVs because it's a legendary" + reason + ".");
			}

			// limit one of each move
			let moves = [];
			if (set.moves) {
				let hasMove = {};
				for (let i = 0; i < set.moves.length; i++) {
					let move = this.getMove(set.moves[i]);
					let moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(set.moves[i]);
				}
			}
			set.moves = moves;

			let battleForme = template.battleOnly && template.species;
			if (battleForme) {
				if (template.requiredAbility && set.ability !== template.requiredAbility) {
					problems.push("" + template.species + " transforms in-battle with " + template.requiredAbility + "."); // Darmanitan-Zen, Zygarde-Complete
				}
				if (template.requiredItems && !template.requiredItems.includes(item.name)) {
					problems.push("" + template.species + " transforms in-battle with " + Chat.plural(template.requiredItems.length, "either ") + template.requiredItems.join(" or ") + '.'); // Mega or Primal
				}
				if (template.requiredMove && set.moves.indexOf(toId(template.requiredMove)) < 0) {
					problems.push("" + template.species + " transforms in-battle with " + template.requiredMove + "."); // Meloetta-Pirouette, Rayquaza-Mega
				}
				if (!format.noChangeForme) set.species = template.baseSpecies; // Fix forme for Aegislash, Castform, etc.
			} else {
				if (template.requiredAbility && set.ability !== template.requiredAbility) {
					problems.push("" + (set.name || set.species) + " needs the ability " + template.requiredAbility + "."); // No cases currently.
				}
				if (template.requiredItems && !template.requiredItems.includes(item.name)) {
					problems.push("" + (set.name || set.species) + " needs to hold " + Chat.plural(template.requiredItems.length, "either ") + template.requiredItems.join(" or ") + '.'); // Memory/Drive/Griseous Orb/Plate/Z-Crystal - Forme mismatch
				}
				if (template.requiredMove && set.moves.indexOf(toId(template.requiredMove)) < 0) {
					problems.push("" + (set.name || set.species) + " needs to have the move " + template.requiredMove + "."); // Keldeo-Resolute
				}

				// Mismatches between the set forme (if not base) and the item signature forme will have been rejected already.
				// It only remains to assign the right forme to a set with the base species (Arceus/Genesect/Giratina/Silvally).
				if (item.forcedForme && template.species === this.getTemplate(item.forcedForme).baseSpecies && !format.noChangeForme) {
					set.species = item.forcedForme;
				}
			}

			if (template.species === 'Pikachu-Cosplay') {
				let cosplay = {meteormash:'Pikachu-Rock-Star', iciclecrash:'Pikachu-Belle', drainingkiss:'Pikachu-Pop-Star', electricterrain:'Pikachu-PhD', flyingpress:'Pikachu-Libre'};
				for (let i = 0; i < set.moves.length; i++) {
					if (set.moves[i] in cosplay) {
						set.species = cosplay[set.moves[i]];
						break;
					}
				}
			}

			if (set.species !== template.species) {
				// Autofixed forme.
				template = this.getTemplate(set.species);

				if (!format.banlistTable['ignoreillegalabilities'] && !format.noChangeAbility) {
					// Ensure that the ability is (still) legal.
					let legalAbility = false;
					for (let i in template.abilities) {
						if (template.abilities[i] !== set.ability) continue;
						legalAbility = true;
						break;
					}
					if (!legalAbility) { // Default to first ability.
						set.ability = template.abilities['0'];
					}
				}
			}

			return problems;
		},
	}
	
	//Groundsource Mod: I'm quite sure this desnt't work yet
	groundsourcemod: {
		effectType: "Rule",
		name: "Groundsource Mod",
		onStart: function() {
			this.add('rule', 'Groundsource Mod: Some Ground moves can hit flying pokemon');
		},
		pokemon : {
			isGrounded: function(negateImmunity) {
				if ('gravity' in this.battle.pseudoWeather) return true;
				if ('ingrain' in this.volatiles) return true;
				if ('smackdown' in this.volatiles) return true;
				let item = (this.ignoringItem() ? '' : this.item);
				if (item === 'ironball') return true;
				// These pokemon are NOT flying
				if (this.speciesid in ['doduo', 'dodrio']) return true;
				
				if (!negateImmunity && this.hasType('Flying')) return false;
				if (this.hasAbility('levitate') && !this.battle.suppressingAttackEvents()) return null;
				if ('magnetrise' in this.volatiles) return false;
				if ('telekinesis' in this.volatiles) return false;
				if (item === 'airballoon') return false;
				
				// Certain pokemon are inherently floating
				if (this.speciesid in [
					// Fly
					'beedrill', 'beedrillmega', 'dustox', 'venomoth',
					'vibrava', 'flygon', 'shedinja', 'scizor', 
					'volcarona', 'spritzee', 'aromatisse',
					'heracross', 'volbeat', 'illumise',
					'dragonair', 'hydreigon', 'mew', 'mewtwo',
					'latias', 'latios', 'latiasmega', 'latiosmega', 'celebi',
					// Levitate
					'porygon', 'porygon2', 'porygonz', 
					'magnemite', 'magneton', 'magnezone', 
					'vanillite', 'vanillish', 'vanilluxe', 
					'solosis', 'duosion', 'reuniclus',
					'klink', 'klang', 'klinklang',
					'honedge', 'doublade', 'aegislash',
					'gastly', 'haunter', 'duskull', 'dusknoir', 'lampent', 'chandelure',
					'flabebe', 'floette', 'florges',
					'probopass', 'bronzor', 'bronzong',
					'froslass', 'munna', 'musharna',
					'elgyem', 'beheeyem', 'misdreavus', 'mismagius',
					'shuppet', 'banette', 'banettemega', 'yamask', 'cofagrigus',
					'phantump', 'klefki', 'lunatone', 'solrock', 'carbink',
					'unown', 'beldum', 'metang', 'metagross', 'metagrossmega',
					'diancie', 'dianciemega', 'darkrai',
					
					'pumpkaboo', 'castform', 'rotom', 'deoxys', // Alt forms covered by id number below
				]) return false;
				if (this.template.num in [710, 351, 479, 386]) return false;
				
				return true;
			},
			runImmunity: function(type, message) {
				if (!type || type === '???') {
					return true;
				}
				if (!(type in this.battle.data.TypeChart)) {
					if (type === 'Fairy' || type === 'Dark' || type === 'Steel') return true;
					throw new Error("Use runStatusImmunity for " + type);
				}
				if (this.fainted) {
					return false;
				}
				let isGrounded;
				let negateResult = this.battle.runEvent('NegateImmunity', this, type);
				if (type === 'Ground') {
					isGrounded = this.isGrounded(!negateResult);
					if (isGrounded === null) {
						if (message) {
							this.battle.add('-immune', this, '[msg]', '[from] ability: Levitate');
						}
						return false;
					}
				}
				if (!negateResult) return true;
				if ((isGrounded === undefined && !this.battle.getImmunity(type, this)) || isGrounded === false) {
					if (message) {
						this.battle.add('-immune', this, '[msg]');
					}
					return false;
				}
				return true;
			},
		},
	},
	
};

let mixandmegamod = {
	// NOTE: Do NOT use this mod if you plan on overridding any of the installed scripts!
	//   This WILL overwrite custom scripts!
	effectType: 'Rule',
	name: "Mix and Mega Mod",
	onStart: function() {
		this.add('rule', 'Mix and Mega Mod: Any pokemon can mega evolve with any stone.');
		Object.assign(this, this.effect.scripts); //assign our script functions into the battle
		
		let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
		for (let i = 0, len = allPokemon.length; i < len; i++) {
			let pokemon = allPokemon[i];
			pokemon.originalSpecies = pokemon.baseTemplate.species;
		}
	},
	onSwitchInPriority: 1,
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
	scripts: {},
};
require("../mixandmega/scripts.js").inject(mixandmegamod.scripts);
exports.BattleFormats["mixandmegamod"] = mixandmegamod;
