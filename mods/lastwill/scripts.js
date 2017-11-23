'use strict';

exports.BattleScripts = {
	pokemon: {
		faint(source, effect) {
			if (this.fainted || this.faintQueued) return 0;
			let d = this.hp;
			this.hp = 0;
			this.switchFlag = false;
			this.faintQueued = true;
			this.battle.faintQueue.push({
				target: this,
				source: source,
				effect: effect,
			});
			
			// The meta's changes start here
			if ( !(this.baseTemplate.tier in { Uber:1 }) ) {
				// Ubers may not do this.
				this.battle.add('-hint', `${this.name || this.species}'s Last Will made it get off one last move!`);
				this.battle.useMove(this.moves[this.moves.length - 1], this);
			} else {
				this.battle.add('-hint', `${this.name || this.species} tried to invoke its Last Will... but it failed!`);
			}
			return d;
		},
	},
};