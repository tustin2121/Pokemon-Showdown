'use strict';

const Pokemon = require('../../sim/pokemon');

exports.BattleScripts = {
	init: function () {
		// Object.values(this.data.Abilities).forEach(ability => {
		// 	if (ability.id === 'trace') return;
		// 	let id = 'other' + ability.id;
		// 	this.data.Statuses[id] = Object.assign({}, ability);
		// 	this.data.Statuses[id].id = id;
		// 	this.data.Statuses[id].noCopy = true;
		// 	this.data.Statuses[id].effectType = "Ability";
		// 	this.data.Statuses[id].fullname = 'ability: ' + ability.name;
		// });
	},
	pokemon: {
		hasAbility(ability) {
			if (this.ignoringAbility()) return false;
			if (Array.isArray(ability)) return ability.some(ability => this.hasAbility(ability));
			ability = toId(ability);
			return this.ability === ability || !!this.volatiles["ability:" + ability];
		},
		
		/**
		 * @param {string | Effect} status
		 * @param {Pokemon?} source
		 * @param {Effect?} sourceEffect
		 * @param {string | Effect?} linkedStatus
		 */
		addVolatile(statusid, source = null, sourceEffect = null, linkedStatus = null) {
			// If this isn't an ability, call the original function
			if (!statusid.startsWith('ability:')) return Pokemon.prototype.addVolatile.call(this, statusid, source, sourceEffect, linkedStatus);
			
			// Now run stuff like we are setting an ability
			if (!this.hp) return false;
			let ability = this.battle.getEffect(statusid);
			statusid = 'ability:'+ability.id;
			if (this.battle.event) {
				if (!source) source = this.battle.event.source;
				if (!sourceEffect) sourceEffect = this.battle.effect;
			}
			if (!this.battle.runEvent('SetAbility', this, source, sourceEffect, ability)) return false;
			
			this.volatiles[statusid] = { id: ability.id, target:this };
			this.battle.singleEvent('Start', ability, this.volatiles[statusid], this, source, sourceEffect);
			// if (!result) {
			// 	// cancel
			// 	this.battle.singleEvent('End', ability, this.volatiles[statusid], this, source);
			// 	delete this.volatiles[statusid];
			// 	return result;
			// }
			return true;
		},
		
		/**
		 * @param {string | Effect} status
		 */
		getVolatile(statusid) {
			if (!statusid.startsWith('ability:')) return Pokemon.prototype.getVolatile.call(this, statusid);
			
			let ability = this.battle.getEffect(statusid);
			statusid = 'ability:'+ability.id;
			if (!this.volatiles[statusid]) return null;
			return ability;
		},
	
		/**
		 * @param {string | Effect} status
		 */
		removeVolatile(statusid) {
			if (!statusid.startsWith('ability:')) return Pokemon.prototype.removeVolatile.call(this, statusid);
			
			if (!this.hp) return false;
			let ability = this.battle.getEffect(statusid);
			statusid = 'ability:'+ability.id;
			if (!this.volatiles[statusid]) return false;
			this.battle.singleEvent('End', ability, this.volatiles[statusid], this);
			if (this.battle.effect && this.battle.effect.effectType === 'Move') {
				this.battle.add('-endability', this, ability, '[from] move: ' + this.battle.getMove(this.battle.effect.id));
			}
			delete this.volatiles[statusid];
			return true;
		},
		
		transformInto(pokemon, user, effect) {
			let template = pokemon.template;
			if (pokemon.fainted || pokemon.illusion || (pokemon.volatiles['substitute'] && this.battle.gen >= 5)) {
				return false;
			}
			if (!template.abilities || (pokemon && pokemon.transformed && this.battle.gen >= 2) || (user && user.transformed && this.battle.gen >= 5)) {
				return false;
			}
			if (!this.formeChange(template, true)) {
				return false;
			}
			this.transformed = true;

			this.types = pokemon.types;
			this.addedType = pokemon.addedType;
			this.knownType = this.side === pokemon.side && pokemon.knownType;

			for (let statName in this.stats) {
				this.stats[statName] = pokemon.stats[statName];
			}
			this.moveSlots = [];
			this.set.ivs = (this.battle.gen >= 5 ? this.set.ivs : pokemon.set.ivs);
			this.hpType = (this.battle.gen >= 5 ? this.hpType : pokemon.hpType);
			this.hpPower = (this.battle.gen >= 5 ? this.hpPower : pokemon.hpPower);
			for (let i = 0; i < pokemon.moveSlots.length; i++) {
				let moveData = pokemon.moveSlots[i];
				let moveName = moveData.move;
				if (moveData.id === 'hiddenpower') {
					moveName = 'Hidden Power ' + this.hpType;
				}
				this.moveSlots.push({
					move: moveName,
					id: moveData.id,
					pp: moveData.maxpp === 1 ? 1 : 5,
					maxpp: this.battle.gen >= 5 ? (moveData.maxpp === 1 ? 1 : 5) : moveData.maxpp,
					target: moveData.target,
					disabled: false,
					used: false,
					virtual: true,
				});
			}
			for (let j in pokemon.boosts) {
				this.boosts[j] = pokemon.boosts[j];
			}
			if (effect) {
				this.battle.add('-transform', this, pokemon, '[from] ' + effect.fullname);
			} else {
				this.battle.add('-transform', this, pokemon);
			}
			this.setAbility(pokemon.ability, this, {id: 'transform'});
			this.innates.forEach(innate => this.removeVolatile(innate, this));
			pokemon.innates.forEach(innate => this.addVolatile(innate, this));
			return true;
		},
	},
};