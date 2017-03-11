"use strict";

const Tools = require('../../tools');

exports.BattleScripts = {
	inherit: 'gen7',
	
	receive: function(data, more) {
		this.messageLog.push(data.join(' '));
		let logPos = this.log.length;
		let alreadyEnded = this.ended;
		switch (data[1]) {
		case 'join': {
			let team = '';
			try {
				if (more) team = Tools.fastUnpackTeam(more);
				
				// Unencode totem boosts
				for (let i = 0; i < team.length; i++) {
					let set = team[i];
					if (set.gender && set.gender.length > 1) {
						let gen = set.gender;
						let tb = {};
						console.log("TOTEM gen="+gen);
						if (/[FMN]/.test(gen.charAt(0))) {
							set.gender = gen.charAt(0);
							gen = gen.substr(1);
						} else {
							set.gender = undefined;
						}
						let it = 0;
						while (gen.length > 0) {
							tb[gen.slice(0,3)] = (tb[gen.slice(0,3)] || 0)+1;
							gen = gen.substr(3);
							if (++it > 1000) throw new Error("GOOD JOB MAKING THE SERVER HANG AGAIN, NITWIT!");
							console.log("TOTEM it="+it+" gen="+gen);
						}
						set.totemboost = tb;
					}
				}
				
			} catch (e) {
				console.log('TEAM PARSE ERROR: ' + more);
				console.log('ERROR: ', e);
				team = null;
			}
			this.join(data[2], data[3], data[4], team);
			break;
		}

		case 'rename':
			this.rename(data[2], data[3], data[4]);
			break;

		case 'leave':
			this.leave(data[2]);
			break;

		case 'chat':
			this.add('chat', data[2], more);
			break;

		case 'win':
		case 'tie':
			this.win(data[2]);
			break;

		case 'choose':
			this.choose(data[2], data[3], data[4]);
			break;

		case 'undo':
			this.undoChoice(data[2], data[3]);
			break;
		
		case 'stadium':
			this.runEvent('StadiumRequest', null, null, null, data.slice(3));
			break;
		
		case 'eval': {
			/* eslint-disable no-eval, no-unused-vars */
			let battle = this;
			let p1 = this.p1;
			let p2 = this.p2;
			let p1active = p1 ? p1.active[0] : null;
			let p2active = p2 ? p2.active[0] : null;
			let target = data.slice(2).join('|').replace(/\f/g, '\n');
			this.add('', '>>> ' + target);
			try {
				this.add('', '<<< ' + eval(target));
			} catch (e) {
				this.add('', '<<< error: ' + e.message);
			}
			/* eslint-enable no-eval, no-unused-vars */
			break;
		}

		default:
		// unhandled
		}

		this.sendUpdates(logPos, alreadyEnded);
	},
	
};