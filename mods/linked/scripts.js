'use strict';

exports.BattleScripts = {
	runMove: function (move, pokemon, target, sourceEffect) { ///Overridden
		if (!sourceEffect && toId(move) !== 'struggle') {
			let changedMove = this.runEvent('OverrideDecision', pokemon, target, move);
			if (changedMove && changedMove !== true) {
				move = changedMove;
				target = null;
			}
		}
		move = this.getMove(move);
		if (!target && target !== false) target = this.resolveTarget(pokemon, move);

		this.setActiveMove(move, pokemon, target);
		
		/// BEGIN CHANGE ///
		// Linked: Pokemon can move more than once per turn: this is commended out
		/* if (pokemon.moveThisTurn) {
			// THIS IS PURELY A SANITY CHECK
			// DO NOT TAKE ADVANTAGE OF THIS TO PREVENT A POKEMON FROM MOVING;
			// USE this.cancelMove INSTEAD
			this.debug('' + pokemon.id + ' INCONSISTENT STATE, ALREADY MOVED: ' + pokemon.moveThisTurn);
			this.clearActiveMove(true);
			return;
		}*/
		/// END CHANGE ///
		if (!this.runEvent('BeforeMove', pokemon, target, move)) {
			// Prevent invulnerability from persisting until the turn ends
			pokemon.removeVolatile('twoturnmove');
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
		let lockedMove = this.runEvent('LockMove', pokemon);
		if (lockedMove === true) lockedMove = false;
		if (!lockedMove) {
			if (!pokemon.deductPP(move, null, target) && (move.id !== 'struggle')) {
				this.add('cant', pokemon, 'nopp', move);
				let gameConsole = [null, 'Game Boy', 'Game Boy', 'Game Boy Advance', 'DS', 'DS'][this.gen] || '3DS';
				this.add('-hint', "This is not a bug, this is really how it works on the " + gameConsole + "; try it yourself if you don't believe us.");
				this.clearActiveMove(true);
				return;
			}
		} else {
			sourceEffect = this.getEffect('lockedmove');
		}
		pokemon.moveUsed(move);
		this.useMove(move, pokemon, target, sourceEffect);
		this.singleEvent('AfterMove', move, null, pokemon, target, move);
	},
	resolvePriority: function (decision) { /// Overridden
		if (decision) {
			if (!decision.side && decision.pokemon) decision.side = decision.pokemon.side;
			if (!decision.choice && decision.move) decision.choice = 'move';
			if (!decision.priority && decision.priority !== 0) {
				let priorities = {
					'beforeTurn': 100,
					'beforeTurnMove': 99,
					'switch': 7,
					'runUnnerve': 7.3,
					'runSwitch': 7.2,
					'runPrimal': 7.1,
					'instaswitch': 101,
					'megaEvo': 6.9,
					'residual': -100,
					'team': 102,
					'start': 101,
				};
				if (decision.choice in priorities) {
					decision.priority = priorities[decision.choice];
				}
			}
			if (decision.choice === 'move') {
				if (this.getMove(decision.move).beforeTurnCallback) {
					this.addQueue({choice: 'beforeTurnMove', pokemon: decision.pokemon, move: decision.move, targetLoc: decision.targetLoc});
				}
				/// BEGIN CHANGE ///
				var linkedMoves = decision.pokemon.getLinkedMoves();
				if (linkedMoves.length && !linkedMoves.disabled) {
					var decisionMove = toId(decision.move);
					var index = linkedMoves.indexOf(decisionMove);
					if (index !== -1) {
						// flag the move as linked here
						decision.linked = linkedMoves;
						if (this.getMove(linkedMoves[1 - index]).beforeTurnCallback) {
							this.addQueue({
								choice: 'beforeTurnMove', 
								pokemon: decision.pokemon, 
								move: linkedMoves[1 - index], 
								// move: this.getMoveCopy(linkedMoves[1 - index]),
								targetLoc: decision.targetLoc
							}, true);
						}
					}
				}
				/// END CHANGE ///
			} else if (decision.choice === 'switch' || decision.choice === 'instaswitch') {
				if (decision.pokemon.switchFlag && decision.pokemon.switchFlag !== true) {
					decision.pokemon.switchCopyFlag = decision.pokemon.switchFlag;
				}
				decision.pokemon.switchFlag = false;
				if (!decision.speed && decision.pokemon && decision.pokemon.isActive) decision.speed = decision.pokemon.speed;
			}
			if (decision.move) {
				let target;

				if (!decision.targetPosition) {
					target = this.resolveTarget(decision.pokemon, decision.move);
					decision.targetSide = target.side;
					decision.targetPosition = target.position;
				}

				decision.move = this.getMoveCopy(decision.move);
				if (!decision.priority) {
					let priority = decision.move.priority;
					priority = this.runEvent('ModifyPriority', decision.pokemon, target, decision.move, priority);
					
					/// BEGIN CHANGE ///
					// Linked: if two moves are linked, the effective priority is minimized
					var linkedMoves = decision.pokemon.getLinkedMoves();
					if (linkedMoves.length && !linkedMoves.disabled) {
						var decisionMove = toId(decision.move);
						var index = linkedMoves.indexOf(decisionMove);
						if (index !== -1) {
							var altMove = this.getMoveCopy(linkedMoves[1 - index]);
							var altPriority = altMove.priority;
							altPriority = this.runEvent('ModifyPriority', decision.pokemon, target, altMove, altPriority);
							priority = Math.min(priority, altPriority);
						}
					}
					/// END CHANGE ///
					
					decision.priority = priority;
					// In Gen 6, Quick Guard blocks moves with artificially enhanced priority.
					if (this.gen > 5) decision.move.priority = priority;
				}
			}
			if (!decision.pokemon && !decision.speed) decision.speed = 1;
			if (!decision.speed && (decision.choice === 'switch' || decision.choice === 'instaswitch') && decision.target) decision.speed = decision.target.speed;
			if (!decision.speed) decision.speed = decision.pokemon.speed;
		}
	},
	runDecision: function (decision) { ///Overridden
		// returns whether or not we ended in a callback
		switch (decision.choice) {
		case 'start': {
			// I GIVE UP, WILL WRESTLE WITH EVENT SYSTEM LATER
			let format = this.getFormat();

			// Remove Pokémon duplicates remaining after `team` decisions.
			this.p1.pokemon = this.p1.pokemon.slice(0, this.p1.pokemonLeft);
			this.p2.pokemon = this.p2.pokemon.slice(0, this.p2.pokemonLeft);

			if (format.teamLength && format.teamLength.battle) {
				// Trim the team: not all of the Pokémon brought to Preview will battle.
				this.p1.pokemon = this.p1.pokemon.slice(0, format.teamLength.battle);
				this.p1.pokemonLeft = this.p1.pokemon.length;
				this.p2.pokemon = this.p2.pokemon.slice(0, format.teamLength.battle);
				this.p2.pokemonLeft = this.p2.pokemon.length;
			}

			this.add('start');
			for (let pos = 0; pos < this.p1.active.length; pos++) {
				this.switchIn(this.p1.pokemon[pos], pos);
			}
			for (let pos = 0; pos < this.p2.active.length; pos++) {
				this.switchIn(this.p2.pokemon[pos], pos);
			}
			for (let pos = 0; pos < this.p1.pokemon.length; pos++) {
				let pokemon = this.p1.pokemon[pos];
				this.singleEvent('Start', this.getEffect(pokemon.species), pokemon.speciesData, pokemon);
			}
			for (let pos = 0; pos < this.p2.pokemon.length; pos++) {
				let pokemon = this.p2.pokemon[pos];
				this.singleEvent('Start', this.getEffect(pokemon.species), pokemon.speciesData, pokemon);
			}
			this.midTurn = true;
			break;
		}

		case 'move':
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			/// BEGIN CHANGE ///
			if (decision.linked) {
				var linkedMoves = decision.linked;
				var decisionMove = toId(decision.move);
				for (var i = linkedMoves.length - 1; i >= 0; i--) {
					var pseudoDecision = {
						choice: 'move', 
						// move: linkedMoves[i], 
						move: this.getMoveCopy(linkedMoves[i]), 
						targetLoc: decision.targetLoc, 
						pokemon: decision.pokemon,
						targetPosition: decision.targetPosition, 
						targetSide: decision.targetSide
					};
					this.queue.unshift(pseudoDecision);
				}
				return;
			}
			/// END CHANGE ///
			this.runMove(decision.move, decision.pokemon, this.getTarget(decision), decision.sourceEffect);
			// decision.choice += "_done"; //make the case no longer match any in Battle.prototype.runDecision, so it doesn't run the case again.
			break;
		case 'megaEvo':
			if (decision.pokemon.canMegaEvo) this.runMegaEvo(decision.pokemon);
			break;
		case 'beforeTurnMove': {
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			this.debug('before turn callback: ' + decision.move.id);
			let target = this.getTarget(decision);
			if (!target) return false;
			decision.move.beforeTurnCallback.call(this, decision.pokemon, target);
			break;
		}

		case 'event':
			this.runEvent(decision.event, decision.pokemon);
			break;
		case 'team': {
			decision.side.pokemon.splice(decision.index, 0, decision.pokemon);
			decision.pokemon.position = decision.index;
			// we return here because the update event would crash since there are no active pokemon yet
			return;
		}

		case 'pass':
			if (!decision.priority || decision.priority <= 101) return;
			if (decision.pokemon) {
				decision.pokemon.switchFlag = false;
			}
			break;
		case 'instaswitch':
		case 'switch':
			if (decision.choice === 'switch' && decision.pokemon.status && this.data.Abilities.naturalcure) {
				this.singleEvent('CheckShow', this.data.Abilities.naturalcure, null, decision.pokemon);
			}
			if (decision.pokemon.hp) {
				decision.pokemon.beingCalledBack = true;
				let lastMove = this.getMove(decision.pokemon.lastMove);
				if (lastMove.selfSwitch !== 'copyvolatile') {
					this.runEvent('BeforeSwitchOut', decision.pokemon);
					if (this.gen >= 5) {
						this.eachEvent('Update');
					}
				}
				if (!this.runEvent('SwitchOut', decision.pokemon)) {
					// Warning: DO NOT interrupt a switch-out
					// if you just want to trap a pokemon.
					// To trap a pokemon and prevent it from switching out,
					// (e.g. Mean Look, Magnet Pull) use the 'trapped' flag
					// instead.

					// Note: Nothing in BW or earlier interrupts
					// a switch-out.
					break;
				}
			}
			decision.pokemon.illusion = null;
			this.singleEvent('End', this.getAbility(decision.pokemon.ability), decision.pokemon.abilityData, decision.pokemon);
			if (!decision.pokemon.hp && !decision.pokemon.fainted) {
				// a pokemon fainted from Pursuit before it could switch
				if (this.gen <= 4) {
					// in gen 2-4, the switch still happens
					decision.priority = -101;
					this.queue.unshift(decision);
					this.add('-hint', 'Pursuit target fainted, switch continues in gen 2-4');
					break;
				}
				// in gen 5+, the switch is cancelled
				this.debug('A Pokemon can\'t switch between when it runs out of HP and when it faints');
				break;
			}
			if (decision.target.isActive) {
				this.add('-hint', 'Switch failed; switch target is already active');
				break;
			}
			if (decision.choice === 'switch' && decision.pokemon.activeTurns === 1) {
				let foeActive = decision.pokemon.side.foe.active;
				for (let i = 0; i < foeActive.length; i++) {
					if (foeActive[i].isStale >= 2) {
						decision.pokemon.isStaleCon++;
						decision.pokemon.isStaleSource = 'switch';
						break;
					}
				}
			}

			this.switchIn(decision.target, decision.pokemon.position);
			break;
		case 'runUnnerve':
			this.singleEvent('PreStart', decision.pokemon.getAbility(), decision.pokemon.abilityData, decision.pokemon);
			break;
		case 'runSwitch':
			this.runEvent('SwitchIn', decision.pokemon);
			if (this.gen <= 2 && !decision.pokemon.side.faintedThisTurn && decision.pokemon.draggedIn !== this.turn) this.runEvent('AfterSwitchInSelf', decision.pokemon);
			if (!decision.pokemon.hp) break;
			decision.pokemon.isStarted = true;
			if (!decision.pokemon.fainted) {
				this.singleEvent('Start', decision.pokemon.getAbility(), decision.pokemon.abilityData, decision.pokemon);
				decision.pokemon.abilityOrder = this.abilityOrder++;
				this.singleEvent('Start', decision.pokemon.getItem(), decision.pokemon.itemData, decision.pokemon);
			}
			delete decision.pokemon.draggedIn;
			break;
		case 'runPrimal':
			if (!decision.pokemon.transformed) this.singleEvent('Primal', decision.pokemon.getItem(), decision.pokemon.itemData, decision.pokemon);
			break;
		case 'shift': {
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			decision.pokemon.activeTurns--;
			this.swapPosition(decision.pokemon, 1);
			let foeActive = decision.pokemon.side.foe.active;
			for (let i = 0; i < foeActive.length; i++) {
				if (foeActive[i].isStale >= 2) {
					decision.pokemon.isStaleCon++;
					decision.pokemon.isStaleSource = 'switch';
					break;
				}
			}
			break;
		}

		case 'beforeTurn':
			this.eachEvent('BeforeTurn');
			break;
		case 'residual':
			this.add('');
			this.clearActiveMove(true);
			this.updateSpeed();
			this.residualEvent('Residual');
			break;

		case 'skip':
			throw new Error("Decision illegally skipped!");
		}

		// phazing (Roar, etc)
		for (let i = 0; i < this.p1.active.length; i++) {
			let pokemon = this.p1.active[i];
			if (pokemon.forceSwitchFlag) {
				if (pokemon.hp) this.dragIn(pokemon.side, pokemon.position);
				pokemon.forceSwitchFlag = false;
			}
		}
		for (let i = 0; i < this.p2.active.length; i++) {
			let pokemon = this.p2.active[i];
			if (pokemon.forceSwitchFlag) {
				if (pokemon.hp) this.dragIn(pokemon.side, pokemon.position);
				pokemon.forceSwitchFlag = false;
			}
		}

		this.clearActiveMove();

		// fainting

		this.faintMessages();
		if (this.ended) return true;

		// switching (fainted pokemon, U-turn, Baton Pass, etc)

		if (!this.queue.length || (this.gen <= 3 && this.queue[0].choice in {move:1, residual:1})) {
			// in gen 3 or earlier, switching in fainted pokemon is done after
			// every move, rather than only at the end of the turn.
			this.checkFainted();
		} else if (decision.choice === 'pass') {
			this.eachEvent('Update');
			return false;
		}

		let p1switch = this.p1.active.some(mon => mon && mon.switchFlag);
		let p2switch = this.p2.active.some(mon => mon && mon.switchFlag);

		if (p1switch && !this.canSwitch(this.p1)) {
			for (let i = 0; i < this.p1.active.length; i++) {
				this.p1.active[i].switchFlag = false;
			}
			p1switch = false;
		}
		if (p2switch && !this.canSwitch(this.p2)) {
			for (let i = 0; i < this.p2.active.length; i++) {
				this.p2.active[i].switchFlag = false;
			}
			p2switch = false;
		}

		if (p1switch || p2switch) {
			if (this.gen >= 5) {
				this.eachEvent('Update');
			}
			this.makeRequest('switch');
			return true;
		}

		this.eachEvent('Update');

		return false;
	},
	comparePriority: function (a, b) { // I don't know why this is in here. Nothing in it changed...
		a.priority = a.priority || 0;
		a.subPriority = a.subPriority || 0;
		a.speed = a.speed || 0;
		b.priority = b.priority || 0;
		b.subPriority = b.subPriority || 0;
		b.speed = b.speed || 0;
		if ((typeof a.order === 'number' || typeof b.order === 'number') && a.order !== b.order) {
			if (typeof a.order !== 'number') {
				return -1;
			}
			if (typeof b.order !== 'number') {
				return 1;
			}
			if (b.order - a.order) {
				return -(b.order - a.order);
			}
		}
		if (b.priority - a.priority) {
			return b.priority - a.priority;
		}
		if (b.speed - a.speed) {
			return b.speed - a.speed;
		}
		if (b.subOrder - a.subOrder) {
			return -(b.subOrder - a.subOrder);
		}
		return Math.random() - 0.5;
	},
	pokemon: {
		moveUsed: function (move) { // overrided
			var lastMove = this.moveThisTurn ? [this.moveThisTurn, this.battle.getMove(move).id] : this.battle.getMove(move).id;
			this.lastMove = lastMove;
			this.moveThisTurn = lastMove;
		},
		getLastMoveAbsolute: function () { // used
			if (Array.isArray(this.lastMove)) return this.lastMove[1];
			return this.lastMove;
		},
		checkMoveThisTurn: function (move) {
			move = toId(move);
			if (Array.isArray(this.moveThisTurn)) return this.moveThisTurn.indexOf(move) >= 0;
			return this.moveThisTurn === move;
		},
		getLinkedMoves: function () {
			var linkedMoves = this.moveset.slice(0, 2);
			if (linkedMoves.length !== 2 || linkedMoves[0].pp <= 0 || linkedMoves[1].pp <= 0) return [];
			var ret = [toId(linkedMoves[0]), toId(linkedMoves[1])];

			// Disabling effects which won't abort execution of moves already added to battle event loop.
			if (!this.ateBerry && ret.indexOf('belch') >= 0) {
				ret.disabled = true;
			} else if (this.hasItem('assaultvest') && (this.battle.getMove(ret[0]).category === 'Status' || this.battle.getMove(ret[1]).category === 'Status')) {
				ret.disabled = true;
			}
			return ret;
		},
		hasLinkedMove: function (move) {
			move = toId(move);
			var linkedMoves = this.getLinkedMoves();
			if (!linkedMoves.length) return;

			return linkedMoves[0] === move || linkedMoves[1] === move;
		}
	}
};
