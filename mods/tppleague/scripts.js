"use strict";

const clone = require('clone');

exports.BattleScripts = {
	inherit: 'gen7',
	gen: 7,
	
	// Stores off a copy of the format, so we can modify it without affecting the global format.
	getFormat: function() {
		if (!this.__moddedFormat) {
			this.__moddedFormat = clone(this.getEffect(this.format));
		}
		return this.__moddedFormat;
	},
	
	applyGymSettings: function(gym) {
		// Note: the TPPLeague mod makes it so we can edit the format without affecting the global format
		//		 Don't try this anywhere else
		let format = this.getFormat();
		// Change battle type. Because the players are already created, we have to adjust.
		if (gym.battletype) {
			switch (gym.battletype) {
				case 'singles': break; //default is fine
				case 'doubles':
					this.gameType = format.gameType = gym.battletype;
					this.p1.active = [null, null];
					this.p2.active = [null, null];
					break;
				case 'triples':
					this.gameType = format.gameType = gym.battletype;
					this.p1.active = [null, null, null];
					this.p2.active = [null, null, null];
					break;
				case 'trial':
					// TODO
					// format.gameType = gym.battletype;
					break; 
			}
		}
		// Append more standard rules to the format's rulesets
		if (format.additionalRulesets) {
			let addRules = format.additionalRulesets[this.gameType] || [];
			format.ruleset.push(...addRules);
		}
		
		// Append new rulesets to the format's rulesets.
		if (Array.isArray(gym.rulesets)) {
			for (let i = 0; i < gym.rulesets.length; i++) {
				//TODO allow the user to disable certain rules by checking for a "!" at the front?
				format.ruleset.push(gym.rulesets[i]);
			}
		}
	},
	
	denyBattle : function(msg) {
		this.p1.isActive = false;
		this.p2.isActive = false;
		this.p1.choiceData = { decisions: true };
		this.p2.choiceData = { decisions: true };
		this.tie();
		return false;
	},
};

