'use strict';

exports.BattleScripts = {
	
	// Copied from data/scripts.js
	runMove: function (move, pokemon, targetLoc, sourceEffect, zMove, externalMove) {
		let target = this.getTarget(pokemon, zMove || move, targetLoc);
		if (!sourceEffect && toId(move) !== 'struggle' && !zMove) {
			let changedMove = this.runEvent('OverrideDecision', pokemon, target, move);
			if (changedMove && changedMove !== true) {
				move = changedMove;
				target = null;
			}
		}
		let baseMove = this.getMove(move);
		move = zMove ? this.getZMoveCopy(move, pokemon) : baseMove;
		if (!target && target !== false) target = this.resolveTarget(pokemon, move);

		// copy the priority for Quick Guard
		if (zMove) move.priority = baseMove.priority;
		move.isExternal = externalMove;

		this.setActiveMove(move, pokemon, target);

		/* if (pokemon.moveThisTurn) {
			// THIS IS PURELY A SANITY CHECK
			// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
			// USE this.cancelMove INSTEAD
			this.debug('' + pokemon.id + ' INCONSISTENT STATE, ALREADY MOVED: ' + pokemon.moveThisTurn);
			this.clearActiveMove(true);
			return;
		} */
		if (!this.runEvent('BeforeMove', pokemon, target, move)) {
			this.runEvent('MoveAborted', pokemon, target, move);
			// Prevent Pursuit from running again against a slower U-turn/Volt Switch/Parting Shot
			pokemon.moveThisTurn = true;
			this.clearActiveMove(true);
			return;
		}
		if (move.beforeMoveCallback) {
			if (move.beforeMoveCallback.call(this, pokemon, target, move)) {
				this.clearActiveMove(true);
				return;
			}
		}
		pokemon.lastDamage = 0;
		let lockedMove;
		if (!externalMove) {
			lockedMove = this.runEvent('LockMove', pokemon);
			if (lockedMove === true) lockedMove = false;
			if (!lockedMove) {
				if (!pokemon.deductPP(baseMove, null, target) && (move.id !== 'struggle')) {
					this.add('cant', pokemon, 'nopp', move);
					let gameConsole = [null, 'Game Boy', 'Game Boy', 'Game Boy Advance', 'DS', 'DS'][this.gen] || '3DS';
					this.add('-hint', "This is not a bug, this is really how it works on the " + gameConsole + "; try it yourself if you don't believe us.");
					this.clearActiveMove(true);
					return;
				}
			} else {
				sourceEffect = this.getEffect('lockedmove');
			}
			pokemon.moveUsed(move, targetLoc);
		}

		// Dancer Petal Dance hack
		// TODO: implement properly
		let noLock = externalMove && !pokemon.volatiles.lockedmove;

		if (zMove) {
			if (pokemon.illusion) {
				this.singleEvent('End', this.getAbility('Illusion'), pokemon.abilityData, pokemon);
			}
			// BEGIN EDIT
			this.add('-zpower', pokemon);
			pokemon.getMoveData(baseMove).zMoveUsed = true;
			// END EDIT
		}
		this.useMove(baseMove, pokemon, target, sourceEffect, zMove);
		this.singleEvent('AfterMove', move, null, pokemon, target, move);
		this.runEvent('AfterMove', pokemon, target, move);
		if (noLock && pokemon.volatiles.lockedmove) delete pokemon.volatiles.lockedmove;
	},
	
	
	zMoveTable: {
		Poison: "Acid Downpour",
		Fighting: "All-Out Pummeling",
		Dark: "Black Hole Eclipse",
		Grass: "Bloom Doom",
		Normal: "Breakneck Blitz",
		Rock: "Continental Crush",
		Steel: "Corkscrew Crash",
		Dragon: "Devastating Drake",
		Electric: "Gigavolt Havoc",
		Water: "Hydro Vortex",
		Fire: "Inferno Overdrive",
		Ghost: "Never-Ending Nightmare",
		Bug: "Savage Spin-Out",
		Psychic: "Shattered Psyche",
		Ice: "Subzero Slammer",
		Flying: "Supersonic Skystrike",
		Ground: "Tectonic Rage",
		Fairy: "Twinkle Tackle",
	},

	getZMove: function (move, pokemon, skipChecks) {
		let item = pokemon.getItem();
		if (!skipChecks) {
			// removed side check here
			if (!item.zMove) return;
			let moveData = pokemon.getMoveData(move);
			if (!moveData || !moveData.pp || moveData.zMoveUsed) return; // Draining the PP of the base move prevents the corresponding Z-move from being used.
		}

		if (item.zMove) {
			if (item.zMoveFrom && item.zMoveUser && item.zMoveUser.includes(pokemon.template.species)) {
				if (move.name === item.zMoveFrom) return item.zMove;
			}
			// if (move.id.startsWith('hiddenpower')) return this.zMoveTable["Normal"];
			if (move.category === "Status") {
				return move.name;
			} else if (move.zMovePower) {
				return this.zMoveTable[move.type];
			}
		}
	},

/*  // No changes
	getZMoveCopy: function (move, pokemon) {
		move = this.getMove(move);
		let zMove;
		if (pokemon) {
			let item = pokemon.getItem();
			if (move.name === item.zMoveFrom) {
				return this.getMoveCopy(item.zMove);
			}
		}

		if (move.category === 'Status') {
			zMove = this.getMoveCopy(move);
			zMove.isZ = true;
			return zMove;
		}
		zMove = this.getMoveCopy(this.zMoveTable[move.type]);
		zMove.basePower = move.zMovePower;
		zMove.category = move.category;
		return zMove;
	},
*/
	canZMove: function (pokemon) {
		// Removed side moved check
		let item = pokemon.getItem();
		if (!item.zMove) return;
		if (item.zMoveUser && !item.zMoveUser.includes(pokemon.template.species)) return;
		let atLeastOne = false;
		let zMoves = [];
		for (let i = 0; i < pokemon.moves.length; i++) {
			if (pokemon.moveset[i].pp <= 0) {
				zMoves.push(null);
				continue;
			}
			// Add check to see if z move has been used for the given move
			if (pokemon.moveset[i].zMoveUsed) {
				zMoves.push(null);
				continue;
			}
			let move = this.getMove(pokemon.moves[i]);
			let zMoveName = this.getZMove(move, pokemon, true) || '';
			if (zMoveName) {
				let zMove = this.getMove(zMoveName);
				if (!zMove.isZ && zMove.category === 'Status') zMoveName = "Z-" + zMoveName;
				zMoves.push({move: zMoveName, target: zMove.target});
			} else {
				zMoves.push(null);
			}
			if (zMoveName) atLeastOne = true;
		}
		if (atLeastOne) return zMoves;
	},
};