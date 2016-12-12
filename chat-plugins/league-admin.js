/**
 * TPPLeague Admin Commands
 * TPPLeague - https://tppleague.me/
 *
 * This command namespace is used internally by the client to communicate
 * for the Adventure Builder / TPPLeague Administration room(s).
 *
 * For the API, see chat-plugins/COMMANDS.md
 *
 * @license MIT license
 */
 /* global Rooms */
 
'use strict';

const proxy = require("../save-proxy.js");

const LEAGUE_CONFIG_FILE = require.resolve("../config/league/league_setup.json");
const DEL_TIMEOUT = 1000*60*2;

var delConfirm = {};

if (!global.LeagueSetup) global.LeagueSetup = proxy(LEAGUE_CONFIG_FILE, '\t');
/* global LeagueSetup */

const alpha = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function createToken() {
	let id = "";
	for (let i = 0; i < 11; i++) {
		id += alpha[Math.floor(Math.random()*alpha.length)];
	}
	return id;
}
function confirmToken(token) {
	// If we have a confirmation token
	// console.log(`confirmToken(${token}) => delConfirm[]=${delConfirm[token]} => ${delConfirm[token] + DEL_TIMEOUT} > ${Date.now()} => ${delConfirm[token] + DEL_TIMEOUT > Date.now()}`);
	if (token) {
		// If the confirmation token is valid and is in date
		if (delConfirm[token] && delConfirm[token] + DEL_TIMEOUT > Date.now()) {
			// Allow the deletion to go through
			delete delConfirm[token];
			return true;
		}
		if (delConfirm[token] + DEL_TIMEOUT > Date.now()) {
			delete delConfirm[token];
		}
	}
	return false;
}

function commandCheck(ctx) {
	if (ctx.cmdToken === '!') { ctx.errorReply("You cannot broadcast this command."); return false; }
	if (Rooms.global.lockdown) { ctx.connection.send(`|queryresponse|adventbuilder|{"err":"lockdown"}`); return false; }
	if (!ctx.user.registered) { ctx.connection.send(`|queryresponse|adventbuilder|{"err":"unregistered"}`); return false; }
	return true;
}

function createTrainerID() {
	let id = require("crypto").randomBytes(4);
	let secretId = id.readUInt16LE(0);
	let trainerId = id.readUInt16LE(2);
	return [secretId, trainerId];
}

// function sendFormats(){
// 	let list = [
// 		// ValidatorRules
// 		'Nickname Clause','Item Clause','Ability Clause','-ate Clause','OHKO Clause',
// 		'Evasion Abilities Clause','Evasion Moves Clause','Moody Clause','Swagger Clause',
// 		'Baton Pass Clause','Baton Pass Speed Clause',
// 		// Battle Rules
// 		'Endless Battle Clause','Sleep Clause Mod','Freeze Clause Mod','Same Type Clause',
// 		'Mega Rayquaza Clause',
// 		'HP Percentage Mod','Exact HP Mod',
// 		//'Groundsource Mod',
// 	];
// 	this.sendReply(`|adventbuilder|league-extra-formats|${JSON.stringify()}`);
// }
function getGymInfo(json){
	json = json || {};
	json.elites = {};
	json.gyms = {};
	Object.keys(LeagueSetup.elites).forEach((key)=>{
		if (LeagueSetup.elites[key].isHidden) return;
		json.elites[key] = {
			name: LeagueSetup.elites[key].name,
			types: LeagueSetup.elites[key].types,
			battletype: LeagueSetup.elites[key].battletype,
			avatar:  LeagueSetup.elites[key].avatar,
			isChamp: LeagueSetup.elites[key].isChamp,
			banlist: LeagueSetup.elites[key].banlist,
		};
	});
	Object.keys(LeagueSetup.gyms).forEach((key)=>{
		if (LeagueSetup.gyms[key].isHidden) return;
		json.gyms[key] = {
			name: LeagueSetup.gyms[key].name,
			types: LeagueSetup.gyms[key].types,
			battletype: LeagueSetup.gyms[key].battletype,
			avatar:  LeagueSetup.gyms[key].avatar,
			badge: LeagueSetup.gyms[key].badge,
			banlist: LeagueSetup.gyms[key].banlist,
		};
	});
	return json;
}

exports.commands = {
	adventbuilder : {
		reload : function() {
			if (!this.can('hotpatch')) return false;
			try {
				let setup = proxy(LEAGUE_CONFIG_FILE, '\t');
				LeagueSetup.dispose();
				global.LeagueSetup = setup;
			} catch (e) {
				if (e.name === 'SyntaxError') {
					this.errorReply("League Setup file is malformatted! Fix your JSON!");
					this.errorReply(e.message);
				} else {
					this.errorReply("Unexpected error while reloading league setup: "+e.message);
				}
				return;
			}
			return this.sendReply("The TPPLeague setup has been reloaded from disk.");
		},
		request : {
			// /adventbuilder request options
			options : function(target, room, user) {
				if (!commandCheck(this)) return;
				
				let opts = [];
				if (LeagueSetup.admins.includes(user.userid)) {
					opts.push("league-admin");
				}
				opts.push("view-league");
				if (LeagueSetup.elites[user.userid]) {
					if (LeagueSetup.elites[user.userid].isChamp) {
						opts.push("league-champ");
					} else {
						opts.push("league-elite");
					}
				}
				if (LeagueSetup.gyms[user.userid]) {
					opts.push("league-gym");
				}
				if (LeagueSetup.challengers[user.userid]) {
					opts.push("league-challenge");
				} else {
					opts.push("league-challenge:new");
				}
				this.connection.send(`|queryresponse|adventbuilder|${JSON.stringify( {screen:"opts", info:opts} )}`);
			},
			'league-admin': function(target, room, user) {
				if (!commandCheck(this)) return;
				if (!LeagueSetup.admins.includes(this.user.userid)) return this.connection.send(`|queryresponse|adventbuilder|{"err":"unauthed"}`);
				
				let resp = {
					screen: 'league-admin',
					info: getGymInfo({challengers : {}}),
				};
				Object.keys(LeagueSetup.challengers).forEach((key)=>{
					resp.info.challengers[key] = {
						trainerid: LeagueSetup.challengers[key].trainerid,
						badges: LeagueSetup.challengers[key].badges,
					};
				});
				this.connection.send(`|queryresponse|adventbuilder|${JSON.stringify( resp )}`);
			},
			'league-champ': 'league-elite',
			'league-elite': function(target, room, user) {
				if (!commandCheck(this)) return;
				if (!LeagueSetup.elites[user.userid]) return this.connection.send(`|queryresponse|adventbuilder|{"err":"unauthed"}`);
				
				let resp = {
					screen: 'league-elite',
					info: LeagueSetup.elites[user.userid],
					user: {
						name: this.user.name,
						avatar: this.user.avatar,
					},
				};
				this.connection.send(`|queryresponse|adventbuilder|${JSON.stringify(resp)}`);
			},
			'league-gym': function(target, room, user) {
				if (!commandCheck(this)) return;
				if (!LeagueSetup.gyms[user.userid]) return this.connection.send(`|queryresponse|adventbuilder|{"err":"unauthed"}`);
				
				let resp = {
					screen: 'league-gym',
					info: LeagueSetup.gyms[user.userid],
					user: {
						name: this.user.name,
						avatar: this.user.avatar,
					},
				};
				this.connection.send(`|queryresponse|adventbuilder|${JSON.stringify(resp)}`);
			},
			'view-league': function(target, room, user) {
				if (this.cmdToken === '!') { this.errorReply("You cannot broadcast this command."); return false; }
				
				let resp = {
					screen: 'view-league',
					league: getGymInfo(),
				};
				this.connection.send(`|queryresponse|adventbuilder|${JSON.stringify(resp)}`);
			},
			'league-challenge': function(target, room, user) {
				if (!commandCheck(this)) return;
				if (!LeagueSetup.challengers[user.userid]) return this.connection.send(`|queryresponse|adventbuilder|{"err":"unauthed"}`);
				
				let resp = {
					screen: 'league-challenge',
					//must clone this, so we don't modify the original below
					info: Object.assign({}, LeagueSetup.challengers[user.userid]), 
					league: getGymInfo(),
					user: {
						name: this.user.name,
						avatar: this.user.avatar,
					},
				};
				// Gen 7 trainer ids: secretid + trainerid * 65536, last 6 digits
				let trid = resp.info.trainerid;
				resp.info.trainerid = String(trid[0] + trid[1] * 65536).substr(-6);
				this.connection.send(`|queryresponse|adventbuilder|${JSON.stringify(resp)}`);
			},
		}, 
		'new' : {
			// /adventbuilder new league-challenge - Creates a new league challenge for this user
			'league-challenge': function(target, room, user) {
				if (!commandCheck(this)) return;
				if (LeagueSetup.challengers[this.user.userid]) return this.connection.send(`|queryresponse|adventbuilder|{"err":"League Challenge already exists for this user."}`);
				
				LeagueSetup.challengers[user.userid] = {
					teams : {},
					badges: {},
					trainerid: createTrainerID(),
					startdate: Date.now(),
				};
				LeagueSetup.markDirty();
				
				let resp = {
					welcome: "league-challenge",
				};
				this.connection.send(`|queryresponse|adventbuilder|${JSON.stringify(resp)}`);
				this.parse('/adventbuilder request league-challenge');
			},
		},
		'del' : {
			// /adventbuilder del league-challenge [confirmtoken] - Deletes the user's league challenge
			'league-challenge': function(target) {
				if (!commandCheck(this)) return;
				if (!LeagueSetup.challengers[this.user.userid]) return this.connection.send(`|queryresponse|adventbuilder|{"err":"unauthed"}`);
				
				if (!confirmToken(target)) {
					let confirmid = createToken();
					delConfirm[confirmid] = Date.now();
					return this.connection.send(`|queryresponse|adventbuilder|${JSON.stringify({ confirm:confirmid, cmd:this.message })}`);
				}
				delete LeagueSetup.challengers[this.user.userid];
				LeagueSetup.markDirty();
				this.connection.send(`|queryresponse|adventbuilder|{"success":"League Challenge has been forfeited successfully."}`);
				this.parse('/adventbuilder request options');
			},
		},
		// /adventbuilder teamcommit [type]|[oldid]|[newid]|[teamstring] - Commits a saved team.
		teamcommit : function(target, room, user) {
			if (!commandCheck(this)) return;
				
			target = target.split('|');
			let type;
			switch (target[0]) {
				case 'elite': type = "elites"; break;
				case 'gym': type = "gyms"; break;
				case 'trainer': type = "challengers"; break;
			}
			if (!LeagueSetup[type][user.userid]) return this.errorReply("Cannot commit team: unauthorized access.");
			let save = LeagueSetup[type][user.userid];
			let oldid = target[1];
			let newid = target[2];
			if (newid != oldid) {
				delete save.teams[oldid];
			}
			save.teams[newid] = target.slice(3).join('|');
			LeagueSetup.markDirty();
		},
		commit : {
			// /adventbuilder commit rmchal [username] [confirmtoken] - Sent by the Admin screen to remove a challenger
			rmchal : function(target){
				if (!commandCheck(this)) return;
				if (!LeagueSetup.admins.includes(this.user.userid)) return this.connection.send(`|queryresponse|adventbuilder|{"err":"unauthed"}`);
				
				target = target.split(" ");
				let other = Users.get(target[0]) || { userid: toId(target[0]), name: target[0] };
				if (!LeagueSetup.challengers[other.userid]) return this.connection.send(`|queryresponse|adventbuilder|{"err":"There is no Challenger profile for '${other.name}'"}`);
				
				if (!confirmToken(target[1])) {
					let confirmid = createToken();
					delConfirm[confirmid] = Date.now();
					return this.connection.send(`|queryresponse|adventbuilder|${JSON.stringify({ confirm:confirmid, cmd:this.message })}`);
				}
				delete LeagueSetup.challengers[other.userid];
				LeagueSetup.markDirty();
				this.connection.send(`|queryresponse|adventbuilder|{"success":"Challenger profile for '${other.name}' deleted!"}`);
				this.parse('/adventbuilder request league-admin');
			},
			// /adventbuilder commit addgym [username] - Sent by the Admin screen to add a new gymleader
			addgym : function(target){
				if (!commandCheck(this)) return;
				if (!LeagueSetup.admins.includes(this.user.userid)) return this.connection.send(`|queryresponse|adventbuilder|{"err":"unauthed"}`);
				
				let other = Users.get(target) || { userid: toId(target), name: target };
				if (LeagueSetup.gyms[other.userid]) return this.connection.send(`|queryresponse|adventbuilder|{"err":"Gym already exists for user ${other.name}."}`);
				LeagueSetup.gyms[other.userid] = {
					name: other.name,
					types: [],
					battletype: 'singles',
					avatar: 167, // Questionmark Napoleon
					pending: [],
				};
				LeagueSetup.markDirty();
				this.connection.send(`|queryresponse|adventbuilder|{"success":"Gym for '${other.name}' added!"}`);
				this.parse('/adventbuilder request league-admin');
			},
			// /adventbuilder commit rmgym [username] [confirmtoken] - Sent by the Admin screen to remove a gymleader
			rmgym : function(target){
				if (!commandCheck(this)) return;
				if (!LeagueSetup.admins.includes(this.user.userid)) return this.connection.send(`|queryresponse|adventbuilder|{"err":"unauthed"}`);
				
				target = target.split(" ");
				let other = Users.get(target[0]) || { userid: toId(target[0]), name: target[0] };
				if (!LeagueSetup.gyms[other.userid]) return this.connection.send(`|queryresponse|adventbuilder|{"err":"There is no Gym for '${other.name}'"}`);
				
				if (!confirmToken(target[1])) {
					let confirmid = createToken();
					delConfirm[confirmid] = Date.now();
					return this.connection.send(`|queryresponse|adventbuilder|${JSON.stringify({ confirm:confirmid, cmd:this.message })}`);
				}
				delete LeagueSetup.gyms[other.userid];
				LeagueSetup.markDirty();
				this.connection.send(`|queryresponse|adventbuilder|{"success":"Gym for '${other.name}' deleted!"}`);
				this.parse('/adventbuilder request league-admin');
			},
			// /adventbuilder commit addelite [username] - Sent by the Admin screen to add a new elite member
			addelite : function(target){
				if (!commandCheck(this)) return;
				if (!LeagueSetup.admins.includes(this.user.userid)) return this.connection.send(`|queryresponse|adventbuilder|{"err":"unauthed"}`);
				
				let other = Users.get(target) || { userid: toId(target), name: target };
				if (LeagueSetup.elites[other.userid]) return this.connection.send(`|queryresponse|adventbuilder|{"err":"Elite settings already exist for user ${other.name}."}`);
				LeagueSetup.elites[other.userid] = {
					isChamp: false,
					types: [],
					battletype: 'singles',
					name: "",
					avatar: 167, // Questionmark Napoleon
					pending: [],
				};
				LeagueSetup.markDirty();
				this.connection.send(`|queryresponse|adventbuilder|{"success":"Elite for '${other.name}' added!"}`);
				this.parse('/adventbuilder request league-admin');
			},
			// /adventbuilder commit rmelite [username] [confirmtoken] - Sent by the Admin screen to remove an elite member
			rmelite : function(target){
				if (!commandCheck(this)) return;
				if (!LeagueSetup.admins.includes(this.user.userid)) return this.connection.send(`|queryresponse|adventbuilder|{"err":"unauthed"}`);
				
				target = target.split(" ");
				let other = Users.get(target[0]) || { userid: toId(target[0]), name: target[0] };
				if (!LeagueSetup.elites[other.userid]) return this.connection.send(`|queryresponse|adventbuilder|{"err":"There is no Elite settings for '${other.name}'"}`);
				
				if (!confirmToken(target[1])) {
					let confirmid = createToken();
					delConfirm[confirmid] = Date.now();
					return this.connection.send(`|queryresponse|adventbuilder|${JSON.stringify({ confirm:confirmid, cmd:this.message })}`);
				}
				delete LeagueSetup.elites[other.userid];
				LeagueSetup.markDirty();
				this.connection.send(`|queryresponse|adventbuilder|{"success":"Elite for '${other.name}' deleted!"}`);
				this.parse('/adventbuilder request league-admin');
			},
			// /adventbuilder commit promotechamp [username] - Sent by the Admin screen to set an elite member as chamption
			promotechamp : function(target){
				if (!commandCheck(this)) return;
				if (!LeagueSetup.admins.includes(this.user.userid)) return this.connection.send(`|queryresponse|adventbuilder|{"err":"unauthed"}`);
				
				let other = Users.get(target) || { userid: toId(target), name: target };
				if (!LeagueSetup.elites[other.userid]) return this.connection.send(`|queryresponse|adventbuilder|{"err":"There is no Elite settings for '${other.name}"}'`);
				LeagueSetup.elites[other.userid].isChamp = true;
				LeagueSetup.markDirty();
				this.connection.send(`|queryresponse|adventbuilder|{"success":"Elite '${other.name}' has been promoted to Champion!"}`);
				this.parse('/adventbuilder request league-admin');
			},
			// /adventbuilder commit demotechamp [username] - Sent by the Admin screen to unset am elite member as champion
			demotechamp : function(target){
				if (!commandCheck(this)) return;
				if (!LeagueSetup.admins.includes(this.user.userid)) return this.connection.send(`|queryresponse|adventbuilder|{"err":"unauthed"}`);
				
				let other = Users.get(target) || { userid: toId(target), name: target };
				if (!LeagueSetup.elites[other.userid]) return this.connection.send(`|queryresponse|adventbuilder|{"err":"There is no Elite settings for '${other.name}"}'`);
				LeagueSetup.elites[other.userid].isChamp = false;
				LeagueSetup.markDirty();
				this.connection.send(`|queryresponse|adventbuilder|{"success":"Elite '${other.name}' has been demoted to Elite Four member!"}`);
				this.parse('/adventbuilder request league-admin');
			},
			// /adventbuilder commit elite {json} - Sent by the Elite settings screen to commit changed made by the screen
			elite : function(target) {
				if (!commandCheck(this)) return;
				if (!LeagueSetup.elites[this.user.userid]) return this.connection.send(`|queryresponse|adventbuilder|{"err":"unauthed"}`);
				
				try {
					let obj = JSON.parse(target);
					let save = LeagueSetup.elites[this.user.userid];
					// Limit the values we save, and validate them on the way in.
					if (obj.name) {
						save.name = Chat.escapeHTML(obj.name.substr(0, 32));
					}
					if (obj.types) {
						let val = obj.types
						//TODO validate
						save.types = val; 
					}
					if (obj.bgimg) {
						let val = obj.bgimg;
						save.bgimg = Config.stadium.background().convertToId(val);
					}
					if (obj.bgmusic) {
						let val = obj.bgmusic;
						if (Config.stadium.music().isValidBattle(val)) {
							save.bgmusic = val;
						}
					}
					if (obj.battletype) {
						let val = obj.battletype;
						if (/singles|doubles|triples/.test(val)) {
							save.battletype = val;
						}
					}
					if (obj.ruleset) {
						let val = obj.ruleset;
						if (Array.isArray(val) && val.every(x => typeof x == 'string')) {
							save.ruleset = val;
						}
					}
					if (obj.banlist) {
						let val = obj.banlist;
						if (Array.isArray(val) && val.every(x => typeof x == 'string')) {
							save.banlist = val;
						}
					}
					save.avatar = this.user.avatar; //Save off the avatar for later use by others
					LeagueSetup.markDirty();
				} catch (e) {
					console.log("Illegal commit: "+target);
					console.log("Error: ", e);
					return this.popupReply('Illegal commit. Please use the "TPPLeague" tab. If you were using that tab, please report this error to Tustin2121.');
				}
				
				this.connection.send(`|queryresponse|adventbuilder|{"success":"Settings saved!!"}`);
				this.parse('/adventbuilder request league-elite');
			},
			// /adventbuilder commit gym {json} - Sent by the Gym settings screen to commit changed made by the screen
			gym : function(target) {
				if (!commandCheck(this)) return;
				if (!LeagueSetup.gyms[this.user.userid]) return this.connection.send(`|queryresponse|adventbuilder|{"err":"unauthed"}`);
				
				try {
					let obj = JSON.parse(target);
					let save = LeagueSetup.gyms[this.user.userid];
					// Limit the values we save
					// Limit the values we save, and validate them on the way in.
					if (obj.name) {
						save.name = Chat.escapeHTML(obj.name.substr(0, 16));
					}
					if (obj.badge) {
						var val = obj.badge;
						if (val === 'undefined' || val === '') val = undefined;
						else val = val.replace(/[^a-zA-Z- ]/, "").substr(0, 32)
						save.badge = val;
					}
					if (obj.types) {
						let val = obj.types
						//TODO validate
						save.types = val; 
					}
					if (obj.bgimg) {
						let val = obj.bgimg;
						save.bgimg = Config.stadium.background().convertToId(val);
					}
					if (obj.bgmusic) {
						let val = obj.bgmusic;
						if (Config.stadium.music().isValidBattle(val)) {
							save.bgmusic = val;
						}
					}
					if (obj.battletype) {
						let val = obj.battletype;
						if (/singles|doubles|triples|trial/.test(val)) {
							save.battletype = val;
						}
					}
					if (obj.ruleset) {
						let val = obj.ruleset;
						if (Array.isArray(val) && val.every(x => typeof x == 'string')) {
							save.ruleset = val;
						}
					}
					if (obj.banlist) {
						let val = obj.banlist;
						if (Array.isArray(val) && val.every(x => typeof x == 'string')) {
							save.banlist = val;
						}
					}
					save.avatar = this.user.avatar; //Save off the avatar for later use by others
					LeagueSetup.markDirty();
				} catch (e) {
					console.log("Illegal commit: "+target);
					console.log("Error: ", e);
					return this.popupReply('Illegal commit. Please use the "TPPLeague" tab. If you were using that tab, please report this error to Tustin2121.');
				}
				
				this.connection.send(`|queryresponse|adventbuilder|{"success":"Settings saved!!"}`);
				this.parse('/adventbuilder request league-gym');
			},
		},
	},
	adventbuilderhelp : [
		'/adventbuilder - Command used internally by the Adventure Builder. Use the "TPPLeague" tab instead.',
	],
	
	pendingchallenges : function(target) {
		if (this.cmdToken === '!') return this.errorReply('You cannot broadcast this command.');
		if (Rooms.global.lockdown) return this.errorReply('The server is in lockdown. You cannot hand out badges at this time.');
		if (!this.user.registered) return this.errorReply('Please log in first.');
		
		let silent = (target === 'silent');
		
		let gym = LeagueSetup.gyms[this.user.userid];
		if (gym) {
			if (gym.pending.length) {
				this.sendReply("Challengers waiting to fight your gym: "+gym.pending.join(","));
			} else if (!silent) {
				this.sendReply("There are no challengers waiting to fight your gym right now.");
			}
		}
		
		gym = LeagueSetup.elites[this.user.userid];
		if (gym) {
			if (gym.pending.length) {
				this.sendReply("Challengers waiting to fight your E4 team: "+gym.pending.join(","));
			} else if (!silent) {
				this.sendReply("There are no challengers waiting to fight your E4 team right now.");
			}
		}
	},
	pendingchallengeshelp : [
		'/pendingchallenges - Show any pending challenges you have.',
	],
	
	givebadge : function(target) {
		if (this.cmdToken === '!') return this.errorReply('You cannot broadcast this command.');
		if (Rooms.global.lockdown) return this.errorReply('The server is in lockdown. You cannot hand out badges at this time.');
		if (!this.user.registered) return this.errorReply('Please log in first.');
		
		let gym = LeagueSetup.gyms[this.user.userid];
		if (!gym && !LeagueSetup.admins.includes(this.user.userid)) {
			return this.errorReply("You are not a registered gym leader.");
		}
		let badge = gym.badge;
		let other = null;
		if (this.room.battle) {
			if (!this.room.battle.ended) return this.errorReply(`But the battle in this room isn't finished!`);
			if (this.room.battle.format === 'tppleaguegym' && this.room.battle.p1 === this.user) {
				other = this.room.battle.p2;
			}
		}
		if (!other) {
			if (!target) return this.errorReply(`No target user.`);
			let b = this.splitTarget(target);
			if (!this.targetUser) return this.errorReply(`User is not online to recieve their badge.`);
			other = this.targetUser;
			if (b) {
				if (LeagueSetup.admins.includes(this.user.userid)) {
					badge = b;
				} else {
					return this.errorReply("Only League Administrators can hand out arbitrary badges.");
				}
			}
		}
		if (!badge) {
			return this.errorReply(`You have not defined a badge for your gym.`);
		}
		if (other === this.user || other.userid === this.user.userid) {
			return this.errorReply('You cannot give your own badge to yourself, cheater.');
		}
		
		let challenge = LeagueSetup.challengers[other.userid];
		if (!challenge) {
			// other.sendTo(this.room, `|html|<div class="message-error">${this.user.name} is attempting to give you a TPPLeague badge, but you do not have a TPPLeague challenge set up to recieve the badge. If you wish to recieve this badge, please user the TPPLeague button on the main menu to begin a league challenge.</div>`);
			return this.errorReply(`${other.name} does not have a TPPLeague challenge set up. Cannot give badge.`);
		}
		if (challenge.badges[badge]) {
			return this.errorReply(`${other.name} already owns the ${badge} Badge.`);
		}
		challenge.badges[badge] = 1;
		LeagueSetup.markDirty();
		this.add(`|html|<div class="infobox badgeget" for="${other.userid}" style="text-align:center;"><p style='font-weight:bold;'>${this.user.name} presents ${other.name} with the ${badge} Badge!</p><img src="/badges/${badge}.png" width="80" height="80"/></div>`);
		other.send(`|badgeget|${badge}`);
		
		setTimeout(()=>this.parse('/savereplay silent', this, this.user, this.user.connections[0]), 30*1000); //30 seconds
	},
	givebadgehelp: [
		'/givebadge [user] - If you are a gym leader, gives your gym badge to the named user. User must be present.',
	],
};