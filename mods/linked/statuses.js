'use strict';

exports.BattleStatuses = {
	slp: {
		inherit: true,
		onBeforeMove: function (pokemon, target, move) {
			if (this.effectData.timerDecreased !== this.turn) {
				this.effectData.timerDecreased = this.turn;
				if (pokemon.getAbility().isHalfSleep) {
					pokemon.statusData.time--;
				}
				pokemon.statusData.time--;
				if (pokemon.statusData.time <= 0) {
					pokemon.cureStatus();
					return;
				}
				this.add('cant', pokemon, 'slp');
			}
			if (move.sleepUsable) {
				return;
			}
			return false;
		}
	},
	frz: {
		inherit: true,
		onBeforeMove: function (pokemon, target, move) {
			if (move.flags['defrost']) return;
			if (this.effectData.durationRolled !== this.turn && this.random(5) === 0) {
				pokemon.cureStatus();
				return;
			}
			if (this.effectData.durationRolled !== this.turn) {
				// Display the `frozen` message only once per turn.
				this.effectData.durationRolled = this.turn;
				this.add('cant', pokemon, 'frz');
			}
			return false;
		}
	},
	par: {
		inherit: true,
		onStart: function (target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'par', '[from] ability: ' + sourceEffect.name, '[of] ' + source);
			} else {
				this.add('-status', target, 'par');
			}
			this.effectData.lastCheckTurn = this.turn;
		},
		onBeforeMove: function (pokemon) {
			if (this.effectData.lastCheckTurn !== this.turn) {
				// Check for `par` only once per turn.
				this.effectData.lastCheckTurn = this.turn;
				this.effectData.lastCheck = (this.random(4) === 0);
				if (this.effectData.lastCheck) {
					this.add('cant', pokemon, 'par');
					return false;
				}
			}
			if (this.effectData.lastCheckTurn === this.turn && this.effectData.lastCheck) {
				// this.add('cant', pokemon, 'par');
				return false;
			}
		},
	},
	confusion: {
		inherit: true,
		onStart: function (target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'lockedmove') {
				this.add('-start', target, 'confusion', '[fatigue]');
			} else {
				this.add('-start', target, 'confusion');
			}
			this.effectData.time = this.random(2, 6);
			this.effectData.timerDecreased = this.turn;
		},
		onBeforeMove: function (pokemon) {
			if (this.effectData.movePrevented) return false;
			if (this.effectData.timerDecreased !== this.turn) {
				this.effectData.timerDecreased = this.turn;
				pokemon.volatiles.confusion.time--;
				if (!pokemon.volatiles.confusion.time) {
					pokemon.removeVolatile('confusion');
					return;
				}
				
				this.add('-activate', pokemon, 'confusion');
				if (this.random(2) === 0) {
					return;
				}
				this.damage(this.getDamage(pokemon, pokemon, 40), pokemon, pokemon, {
					id: 'confused',
					effectType: 'Move',
					type: '???',
				});
				this.effectData.movePrevented = true;
				return false;
			}
		}
	},
	flinch: {
		inherit: true,
		onBeforeMove: function (pokemon) {
			if (this.effectData.movePrevented) return false;
			if (!this.runEvent('Flinch', pokemon)) {
				return;
			}
			if (!this.effectData.movePrevented) {
				// no need to display the flinch message twice
				this.effectData.movePrevented = true;
				this.add('cant', pokemon, 'flinch');
			}
			return false;
		}
	},    
	mustrecharge: {
		inherit: true,
		onBeforeMove: function (pokemon) {
			if (!this.effectData.movePrevented) {
				// no need to display the recharge message twice
				this.effectData.movePrevented = true;
				this.add('cant', pokemon, 'recharge');
			}
			if (!pokemon.moveThisTurn) pokemon.removeVolatile('mustrecharge');
			return false;
		}
	},
 
	/**
	 * Gems and Auras
	 * Make sure that they only boost a single move
	 *
	 */

	gem: {
		inherit: true,
		onBeforeMove: function (pokemon) {
			if (pokemon.moveThisTurn) pokemon.removeVolatile('gem');
		}
	},
	aura: {
		inherit: true,
		onBeforeMove: function (pokemon) {
			if (pokemon.moveThisTurn) pokemon.removeVolatile('aura');
		}
	}
};
