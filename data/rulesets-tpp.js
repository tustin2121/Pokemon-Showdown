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
require("../mods/mixandmega/scripts.js").inject(mixandmegamod.scripts);
exports.BattleFormats["mixandmegamod"] = mixandmegamod;