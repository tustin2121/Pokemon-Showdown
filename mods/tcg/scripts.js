'use strict';

exports.BattleScripts = {
	init: function () {
		let transfers = {Bug:'Grass', Flying:'Normal', Ghost:'Psychic', Ground:'Fighting', Ice:'Water', Poison:'Psychic', Rock:'Fighting'};
		for (let i in this.data.Movedex) {
			if (this.data.Movedex[i].type in transfers) this.modData('Movedex', i).type = transfers[this.data.Movedex[i].type];
		}
		for (let i in this.data.Pokedex) {
			if (this.data.Pokedex[i].types[0] in transfers) this.modData('Pokedex', i).types[0] = transfers[this.data.Pokedex[i].types[0]];
			if (this.data.Pokedex[i].types[1] in transfers) this.modData('Pokedex', i).types[1] = transfers[this.data.Pokedex[i].types[1]];
			if (this.data.Pokedex[i].types[0] === this.data.Pokedex[i].types[1]) this.data.Pokedex[i].types.pop();
		}
	},
	pokemon: {
		hasType: function (type) {
			if (!type) return false;
			if (Array.isArray(type)) {
				for (let i = 0; i < type.length; i++) {
					if (this.hasType(type[i])) return true;
				}
			} else {
				let transfers = {Bug:'Grass', Flying:'Normal', Ghost:'Psychic', Ground:'Fighting', Ice:'Water', Poison:'Psychic', Rock:'Fighting'};
				type = transfers[type] || type;
				if (this.getTypes().includes(type)) return true;
			}
			return false;
		},
		getTypes: function (excludeAdded) {
			let types = this.types;
			if (!excludeAdded && this.addedType) {
				types = types.concat(this.addedType);
			}
			if ('roost' in this.volatiles) {
				types = types.filter(type => type !== 'Normal');
			}
			if (types.length) return types;
			return 'Normal';
		},
		isGrounded: function (/*negateImmunity*/) {
			if ('gravity' in this.battle.pseudoWeather) return true;
			if ('ingrain' in this.volatiles) return true;
			if ('smackdown' in this.volatiles) return true;
			if (this.hasItem('ironball')) return true;
			//if (!negateImmunity && this.hasType('Flying')) return false;
			if (this.hasAbility('levitate') && !this.battle.suppressingAttackEvents()) return null;
			if ('magnetrise' in this.volatiles) return false;
			if ('telekinesis' in this.volatiles) return false;
			return !this.hasItem('airballoon');
		},
		runImmunity: function (type, message) {
			if (!type || type === '???') {
				return true;
			}
			let transfers = {Bug:'Grass', Flying:'Normal', Ghost:'Psychic', Ground:'Fighting', Ice:'Water', Poison:'Psychic', Rock:'Fighting'};
			type = transfers[type] || type;
			if (this.fainted) {
				return false;
			}
			let isGrounded;
			let negateResult = this.battle.runEvent('NegateImmunity', this, type);
			if (type === 'Fighting') {
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
};
