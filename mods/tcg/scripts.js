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
		getMoves: function (lockedMove, restrictData) {
			if (lockedMove) {
				lockedMove = toId(lockedMove);
				this.trapped = true;
				if (lockedMove === 'recharge') {
					return [{
						move: 'Recharge',
						id: 'recharge',
					}];
				}
				for (const moveSlot of this.moveSlots) {
					if (moveSlot.id !== lockedMove) continue;
					return [{
						move: moveSlot.move,
						id: moveSlot.id,
					}];
				}
				// does this happen?
				return [{
					move: this.battle.getMove(lockedMove).name,
					id: lockedMove,
				}];
			}
			let moves = [];
			let hasValidMove = false;
			for (const moveSlot of this.moveSlots) {
				let moveName = moveSlot.move;
				if (moveSlot.id === 'hiddenpower') {
					moveName = 'Hidden Power ' + this.hpType;
					if (this.battle.gen < 6) moveName += ' ' + this.hpPower;
				} else if (moveSlot.id === 'return') {
					// @ts-ignore
					moveName = 'Return ' + this.battle.getMove('return').basePowerCallback(this);
				} else if (moveSlot.id === 'frustration') {
					// @ts-ignore
					moveName = 'Frustration ' + this.battle.getMove('frustration').basePowerCallback(this);
				}
				let target = moveSlot.target;
				if (moveSlot.id === 'curse') {
					if (!this.hasType('Psychic')) {
						target = this.battle.getMove('curse').nonGhostTarget || moveSlot.target;
					}
				}
				let disabled = moveSlot.disabled;
				// @ts-ignore
				if (moveSlot.pp <= 0 || disabled && this.side.active.length >= 2 && this.battle.targetTypeChoices(target)) {
					disabled = true;
				} else if (disabled === 'hidden' && restrictData) {
					disabled = false;
				}
				if (!disabled) {
					hasValidMove = true;
				}
				moves.push({
					move: moveName,
					id: moveSlot.id,
					pp: moveSlot.pp,
					maxpp: moveSlot.maxpp,
					target: target,
					disabled: disabled,
				});
			}
			if (hasValidMove) return moves;

			return [];
		},
		hasType: function (type) {
			if (!type) return false;
			if (Array.isArray(type)) {
				for (const typeid of type) {
					if (this.hasType(typeid)) return true;
				}
			} else {
				let transfers = {Bug:'Grass', Flying:'Normal', Ghost:'Psychic', Ground:'Fighting', Ice:'Water', Poison:'Psychic', Rock:'Fighting'};
				type = transfers[type] || type;
				if (this.getTypes().includes(type)) return true;
			}
			return false;
		},
		isGrounded: function (negateImmunity = false) {
			if ('gravity' in this.battle.pseudoWeather) return true;
			if ('ingrain' in this.volatiles && this.battle.gen >= 4) return true;
			if ('smackdown' in this.volatiles) return true;
			let item = (this.ignoringItem() ? '' : this.item);
			if (item === 'ironball') return true;
			// If a Fire/Normal type uses Burn Up and Roost, it becomes ???/Normal-type, but it's still grounded.
			if (this.hasAbility('levitate') && !this.battle.suppressingAttackEvents()) return null;
			if (this.hasType('Normal')) return 0; 
			if ('magnetrise' in this.volatiles) return false;
			if ('telekinesis' in this.volatiles) return false;
			return item !== 'airballoon';
		},
		runImmunity: function (type, message) {
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
	tryMoveHit: function (target, pokemon, move) {
		this.setActiveMove(move, pokemon, target);
		move.zBrokeProtect = false;
		let hitResult = true;

		hitResult = this.singleEvent('PrepareHit', move, {}, target, pokemon, move);
		if (!hitResult) {
			if (hitResult === false) this.add('-fail', target);
			return false;
		}
		this.runEvent('PrepareHit', pokemon, target, move);

		if (!this.singleEvent('Try', move, null, pokemon, target, move)) {
			return false;
		}

		if (move.target === 'all' || move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') {
			if (move.target === 'all') {
				hitResult = this.runEvent('TryHitField', target, pokemon, move);
			} else {
				hitResult = this.runEvent('TryHitSide', target, pokemon, move);
			}
			if (!hitResult) {
				if (hitResult === false) this.add('-fail', target);
				return false;
			}
			return this.moveHit(target, pokemon, move);
		}

		hitResult = this.runEvent('TryImmunity', target, pokemon, move);
		if (!hitResult) {
			if (hitResult !== null) {
				if (!move.spreadHit) this.attrLastMove('[miss]');
				this.add('-miss', pokemon, target);
			}
			return false;
		}

		if (move.ignoreImmunity === undefined) {
			move.ignoreImmunity = (move.category === 'Status');
		}

		if (this.gen < 7 && (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) && !target.runImmunity(move.type, true)) {
			return false;
		}

		hitResult = this.runEvent('TryHit', target, pokemon, move);
		if (!hitResult) {
			if (hitResult === false) this.add('-fail', target);
			return false;
		}

		if (this.gen >= 7 && (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) && !target.runImmunity(move.type, true)) {
			return false;
		}
		if (move.flags['powder'] && target !== pokemon && !this.getImmunity('powder', target)) {
			this.debug('natural powder immunity');
			this.add('-immune', target, '[msg]');
			return false;
		}
		if (this.gen >= 7 && move.pranksterBoosted && pokemon.hasAbility('prankster') && target.side !== pokemon.side && !this.getImmunity('prankster', target)) {
			this.debug('natural prankster immunity');
			if (!target.illusion) this.add('-hint', "In gen 7, Dark is immune to Prankster moves.");
			this.add('-immune', target, '[msg]');
			return false;
		}

		let boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];

		// calculate true accuracy
		let accuracy = move.accuracy;
		let boosts, boost;
		if (accuracy !== true) {
			if (!move.ignoreAccuracy) {
				boosts = this.runEvent('ModifyBoost', pokemon, null, null, Object.assign({}, pokemon.boosts));
				boost = this.clampIntRange(boosts['accuracy'], -6, 6);
				if (boost > 0) {
					accuracy *= boostTable[boost];
				} else {
					accuracy /= boostTable[-boost];
				}
			}
			if (!move.ignoreEvasion) {
				boosts = this.runEvent('ModifyBoost', target, null, null, Object.assign({}, target.boosts));
				boost = this.clampIntRange(boosts['evasion'], -6, 6);
				if (boost > 0) {
					accuracy /= boostTable[boost];
				} else if (boost < 0) {
					accuracy *= boostTable[-boost];
				}
			}
		}
		if (move.ohko) { // bypasses accuracy modifiers
			if (!target.isSemiInvulnerable()) {
				accuracy = 30;
				if (move.ohko === 'Water' && this.gen >= 7 && !pokemon.hasType('Water')) {
					accuracy = 20;
				}
				if (pokemon.level >= target.level && (move.ohko === true || !target.hasType(move.ohko))) {
					accuracy += (pokemon.level - target.level);
				} else {
					this.add('-immune', target, '[ohko]');
					return false;
				}
			}
		} else {
			accuracy = this.runEvent('ModifyAccuracy', target, pokemon, move, accuracy);
		}
		if (move.alwaysHit || (move.id === 'toxic' && this.gen >= 6 && pokemon.hasType('Psychic'))) {
			accuracy = true; // bypasses ohko accuracy modifiers
		} else {
			accuracy = this.runEvent('Accuracy', target, pokemon, move, accuracy);
		}
		// @ts-ignore
		if (accuracy !== true && !this.randomChance(accuracy, 100)) {
			if (!move.spreadHit) this.attrLastMove('[miss]');
			this.add('-miss', pokemon, target);
			return false;
		}

		if (move.breaksProtect) {
			let broke = false;
			for (const effectid of ['banefulbunker', 'kingsshield', 'protect', 'spikyshield']) {
				if (target.removeVolatile(effectid)) broke = true;
			}
			if (this.gen >= 6 || target.side !== pokemon.side) {
				for (const effectid of ['craftyshield', 'matblock', 'quickguard', 'wideguard']) {
					if (target.side.removeSideCondition(effectid)) broke = true;
				}
			}
			if (broke) {
				if (move.id === 'feint') {
					this.add('-activate', target, 'move: Feint');
				} else {
					this.add('-activate', target, 'move: ' + move.name, '[broken]');
				}
			}
		}

		if (move.stealsBoosts) {
			let boosts = {};
			let stolen = false;
			for (let statName in target.boosts) {
				let stage = target.boosts[statName];
				if (stage > 0) {
					boosts[statName] = stage;
					stolen = true;
				}
			}
			if (stolen) {
				this.attrLastMove('[still]');
				this.add('-clearpositiveboost', target, pokemon, 'move: ' + move.name);
				this.boost(boosts, pokemon, pokemon);

				for (let statName in boosts) {
					boosts[statName] = 0;
				}
				target.setBoost(boosts);
				this.add('-anim', pokemon, "Spectral Thief", target);
			}
		}

		move.totalDamage = 0;
		/**@type {number | false} */
		let damage = 0;
		pokemon.lastDamage = 0;
		if (move.multihit) {
			let hits = move.multihit;
			if (Array.isArray(hits)) {
				// yes, it's hardcoded... meh
				if (hits[0] === 2 && hits[1] === 5) {
					if (this.gen >= 5) {
						hits = this.sample([2, 2, 3, 3, 4, 5]);
					} else {
						hits = this.sample([2, 2, 2, 3, 3, 3, 4, 5]);
					}
				} else {
					hits = this.random(hits[0], hits[1] + 1);
				}
			}
			hits = Math.floor(hits);
			let nullDamage = true;
			/**@type {number | false} */
			let moveDamage;
			// There is no need to recursively check the ´sleepUsable´ flag as Sleep Talk can only be used while asleep.
			let isSleepUsable = move.sleepUsable || this.getMove(move.sourceEffect).sleepUsable;
			let i;
			for (i = 0; i < hits && target.hp && pokemon.hp; i++) {
				if (pokemon.status === 'slp' && !isSleepUsable) break;

				if (move.multiaccuracy && i > 0) {
					accuracy = move.accuracy;
					if (accuracy !== true) {
						if (!move.ignoreAccuracy) {
							boosts = this.runEvent('ModifyBoost', pokemon, null, null, Object.assign({}, pokemon.boosts));
							boost = this.clampIntRange(boosts['accuracy'], -6, 6);
							if (boost > 0) {
								accuracy *= boostTable[boost];
							} else {
								accuracy /= boostTable[-boost];
							}
						}
						if (!move.ignoreEvasion) {
							boosts = this.runEvent('ModifyBoost', target, null, null, Object.assign({}, target.boosts));
							boost = this.clampIntRange(boosts['evasion'], -6, 6);
							if (boost > 0) {
								accuracy /= boostTable[boost];
							} else if (boost < 0) {
								accuracy *= boostTable[-boost];
							}
						}
					}
					accuracy = this.runEvent('ModifyAccuracy', target, pokemon, move, accuracy);
					if (!move.alwaysHit) {
						accuracy = this.runEvent('Accuracy', target, pokemon, move, accuracy);
						// @ts-ignore
						if (accuracy !== true && !this.randomChance(accuracy, 100)) break;
					}
				}

				moveDamage = this.moveHit(target, pokemon, move);
				if (moveDamage === false) break;
				if (nullDamage && (moveDamage || moveDamage === 0 || moveDamage === undefined)) nullDamage = false;
				// Damage from each hit is individually counted for the
				// purposes of Counter, Metal Burst, and Mirror Coat.
				damage = (moveDamage || 0);
				// Total damage dealt is accumulated for the purposes of recoil (Parental Bond).
				move.totalDamage += damage;
				if (move.mindBlownRecoil && i === 0) {
					this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.getEffect('Mind Blown'), true);
				}
				this.eachEvent('Update');
			}
			if (i === 0) return false;
			if (nullDamage) damage = false;
			this.add('-hitcount', target, i);
		} else {
			damage = this.moveHit(target, pokemon, move);
			move.totalDamage = damage;
		}

		if (move.recoil && move.totalDamage) {
			this.damage(this.calcRecoilDamage(move.totalDamage, move), pokemon, pokemon, 'recoil');
		}

		if (move.struggleRecoil) {
			// @ts-ignore
			this.directDamage(this.clampIntRange(Math.round(pokemon.maxhp / 4), 1), pokemon, pokemon, {id: 'strugglerecoil'});
		}

		if (target && pokemon !== target) target.gotAttacked(move, damage, pokemon);

		if (move.ohko) this.add('-ohko');

		if (!damage && damage !== 0) return damage;

		this.eachEvent('Update');

		if (target && !move.negateSecondary && !(move.hasSheerForce && pokemon.hasAbility('sheerforce'))) {
			this.singleEvent('AfterMoveSecondary', move, null, target, pokemon, move);
			this.runEvent('AfterMoveSecondary', target, pokemon, move);
		}

		return damage;
	},
	useMoveInner: function (move, pokemon, target, sourceEffect, zMove) {
		if (!sourceEffect && this.effect.id) sourceEffect = this.effect;
		move = this.getMoveCopy(move);
		if (zMove && move.id === 'weatherball') {
			let baseMove = move;
			this.singleEvent('ModifyMove', move, null, pokemon, target, move, move);
			move = this.getZMoveCopy(move, pokemon);
			if (move.type !== 'Normal') sourceEffect = baseMove;
		} else if (zMove || (move.category !== 'Status' && sourceEffect && sourceEffect.isZ && sourceEffect.id !== 'instruct')) {
			move = this.getZMoveCopy(move, pokemon);
		}
		if (this.activeMove) {
			move.priority = this.activeMove.priority;
			if (!move.hasBounced) move.pranksterBoosted = this.activeMove.pranksterBoosted;
		}
		let baseTarget = move.target;
		if (!target && target !== false) target = this.resolveTarget(pokemon, move);
		if (move.target === 'self' || move.target === 'allies') {
			target = pokemon;
		}
		if (sourceEffect) move.sourceEffect = sourceEffect.id;
		let moveResult = false;

		this.setActiveMove(move, pokemon, target);

		this.singleEvent('ModifyMove', move, null, pokemon, target, move, move);
		if (baseTarget !== move.target) {
			// Target changed in ModifyMove, so we must adjust it here
			// Adjust before the next event so the correct target is passed to the
			// event
			target = this.resolveTarget(pokemon, move);
		}
		move = this.runEvent('ModifyMove', pokemon, target, move, move);
		if (baseTarget !== move.target) {
			// Adjust again
			target = this.resolveTarget(pokemon, move);
		}
		if (!move || pokemon.fainted) {
			return false;
		}

		let attrs = '';

		if (move.flags['charge'] && !pokemon.volatiles[move.id]) {
			attrs = '|[still]'; // suppress the default move animation
		}

		let movename = move.name;
		if (move.id === 'hiddenpower') movename = 'Hidden Power';
		if (sourceEffect) attrs += '|[from]' + this.getEffect(sourceEffect);
		if (zMove && move.isZ === true) {
			attrs = '|[anim]' + movename + attrs;
			movename = 'Z-' + movename;
		}
		this.addMove('move', pokemon, movename, target + attrs);

		if (zMove && move.category !== 'Status') {
			this.attrLastMove('[zeffect]');
		} else if (zMove && move.zMoveBoost) {
			// @ts-ignore
			this.boost(move.zMoveBoost, pokemon, pokemon, {id: 'zpower'});
		} else if (zMove && move.zMoveEffect === 'heal') {
			// @ts-ignore
			this.heal(pokemon.maxhp, pokemon, pokemon, {id: 'zpower'});
		} else if (zMove && move.zMoveEffect === 'healreplacement') {
			move.self = {sideCondition: 'healreplacement'};
		} else if (zMove && move.zMoveEffect === 'clearnegativeboost') {
			let boosts = {};
			for (let i in pokemon.boosts) {
				if (pokemon.boosts[i] < 0) {
					boosts[i] = 0;
				}
			}
			pokemon.setBoost(boosts);
			this.add('-clearnegativeboost', pokemon, '[zeffect]');
		} else if (zMove && move.zMoveEffect === 'redirect') {
			// @ts-ignore
			pokemon.addVolatile('followme', pokemon, {id: 'zpower'});
		} else if (zMove && move.zMoveEffect === 'crit2') {
			// @ts-ignore
			pokemon.addVolatile('focusenergy', pokemon, {id: 'zpower'});
		} else if (zMove && move.zMoveEffect === 'curse') {
			if (pokemon.hasType('Psychic')) {
				// @ts-ignore
				this.heal(pokemon.maxhp, pokemon, pokemon, {id: 'zpower'});
			} else {
				// @ts-ignore
				this.boost({atk: 1}, pokemon, pokemon, {id: 'zpower'});
			}
		}

		if (target === false) {
			this.attrLastMove('[notarget]');
			this.add('-notarget');
			if (move.target === 'normal') pokemon.isStaleCon = 0;
			return false;
		}

		let targets = pokemon.getMoveTargets(move, target);

		if (!sourceEffect || sourceEffect.id === 'pursuit') {
			let extraPP = 0;
			for (const source of targets) {
				let ppDrop = this.runEvent('DeductPP', source, pokemon, move);
				if (ppDrop !== true) {
					extraPP += ppDrop || 0;
				}
			}
			if (extraPP > 0) {
				pokemon.deductPP(move, extraPP);
			}
		}

		if (!this.singleEvent('TryMove', move, null, pokemon, target, move) ||
			!this.runEvent('TryMove', pokemon, target, move)) {
			move.mindBlownRecoil = false;
			return false;
		}

		this.singleEvent('UseMoveMessage', move, null, pokemon, target, move);

		if (move.ignoreImmunity === undefined) {
			move.ignoreImmunity = (move.category === 'Status');
		}

		if (move.selfdestruct === 'always') {
			this.faint(pokemon, pokemon, move);
		}

		/**@type {number | false} */
		let damage = false;
		if (move.target === 'all' || move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') {
			damage = this.tryMoveHit(target, pokemon, move);
			if (damage || damage === 0 || damage === undefined) moveResult = true;
		} else if (move.target === 'allAdjacent' || move.target === 'allAdjacentFoes') {
			if (!targets.length) {
				this.attrLastMove('[notarget]');
				this.add('-notarget');
				return false;
			}
			if (targets.length > 1) move.spreadHit = true;
			let hitTargets = [];
			for (const source of targets) {
				let hitResult = this.tryMoveHit(source, pokemon, move);
				if (hitResult || hitResult === 0 || hitResult === undefined) {
					moveResult = true;
					hitTargets.push(source.toString().substr(0, 3));
				}
				if (damage !== false) {
					damage += hitResult || 0;
				} else {
					damage = hitResult;
				}
			}
			if (move.spreadHit) this.attrLastMove('[spread] ' + hitTargets.join(','));
		} else {
			target = targets[0];
			let lacksTarget = target.fainted;
			if (!lacksTarget) {
				if (move.target === 'adjacentFoe' || move.target === 'adjacentAlly' || move.target === 'normal' || move.target === 'randomNormal') {
					lacksTarget = !this.isAdjacent(target, pokemon);
				}
			}
			if (lacksTarget && (!move.flags['charge'] || pokemon.volatiles['twoturnmove'])) {
				this.attrLastMove('[notarget]');
				this.add('-notarget');
				if (move.target === 'normal') pokemon.isStaleCon = 0;
				return false;
			}
			damage = this.tryMoveHit(target, pokemon, move);
			if (damage || damage === 0 || damage === undefined) moveResult = true;
		}
		// @ts-ignore
		if (move.selfBoost && moveResult) this.moveHit(pokemon, pokemon, move, move.selfBoost, false, true);
		if (!pokemon.hp) {
			this.faint(pokemon, pokemon, move);
		}

		if (!moveResult) {
			this.singleEvent('MoveFail', move, null, target, pokemon, move);
			return false;
		}

		if (!move.negateSecondary && !(move.hasSheerForce && pokemon.hasAbility('sheerforce'))) {
			this.singleEvent('AfterMoveSecondarySelf', move, null, pokemon, target, move);
			this.runEvent('AfterMoveSecondarySelf', pokemon, target, move);
		}
		return true;
	},
};
