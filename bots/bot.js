// bot/bot.js
/* globals Chat, Rooms */

// Postgress Database Connection handling:
const Pool = require('generic-pool');
const Client = require('pg-native');

/** Postgress database connection pool. */
const pgpool = Pool.createPool({
	create: function () {
		return new Promise(function(resolve, reject){
			let client = new Client();
			client.connect(function (err) {
				if (err) return reject(err);
				resolve(client);
			});
		});
	},
	destroy: function (client) {
		return new Promise(function(resolve, reject){
			client.end(resolve);
		});
	},
}, {
	max: 5,
	idleTimeoutMillis: 30000,
});

// Data parsing
const dataParsers = {
	pokemon: function (specie) {
		let specieData = Tools.getTemplate(specie);
		let result = [];
		let tier = specieData.tier;
		if (!require('../data/tpp').BattleTPP[specieData.id] && !specieData.isNonstandard && !specieData.isUnreleased) {
			tier = 'T-Rule ' + tier;
		}
		result.push(tier);
		result.push(specieData.species);
		result.push(specieData.types.join("/") + '-type');

		let baseStats = [];
		let bst = 0;
		let stats = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
		let statsLength = stats.length;
		let i;
		for (i = 0; i < statsLength; i++) {
			let stat = stats[i];
			let statValue = specieData.baseStats[toId(stat)];
			bst += statValue;
			baseStats.push('<font color="#dddddd">' + stat + ':</font> ' + statValue);
		}
		baseStats.push('<font color="#dddddd">BST:</font> ' + bst);
		result.push(baseStats.join(', '));

		let abilityData = specieData.abilities;
		let abilityOrder = [0, 1, 'H'];
		let abilityOrderLength = abilityOrder.length;
		let abilities = [];

		for (i = 0; i < abilityOrderLength; i++) {
			let abilityPosition = abilityOrder[i];
			let ability = abilityData[abilityPosition];
			if (ability) {
				if (abilityPosition === 'H') {
					ability = '<em>' + ability + '</em>';
				}
				abilities.push(ability);
			}
		}
		result.push('<font color="#dddddd">Abilities:</font> ' + abilities.join(', '));

		return result.join(' | ');
	},
	item: function (item) {
		let itemData = Tools.getItem(item);
		return [itemData.name, itemData.desc].join(' | ');
	},
	ability: function (ability) {
		let abilityData = Tools.getAbility(ability);
		return [abilityData.name, abilityData.shortDesc].join(' | ');
	},
	move: function (move) {
		let moveData = Tools.getMove(move);

		let result = [];
		result.push(moveData.name);
		result.push(moveData.category);
		result.push(moveData.type + '-type');

		if (moveData.category !== 'Status') {
			if (moveData.basePower) {
				result.push('<font color="#dddddd">Power:</font> ' + moveData.basePower + ' BP');
			} else {
				result.push('<font color="#dddddd">Power:</font> —');
			}
		}

		if (moveData.accuracy === true) {
			result.push('<font color="#dddddd">Accuracy:</font> —');
		} else {
			result.push('<font color="#dddddd">Accuracy:</font> ' + moveData.accuracy + '%');
		}

		result.push('<font color="#dddddd">PP:</font> ' + moveData.pp * 8 / 5);
		result.push(moveData.shortDesc);

		return result.join(' | ');
	},
};

// Remote command parsing:
const remoteCommands = {
	dexsearch:1, movesearch:1, itemsearch:1, learn:1, randompokemon:1,
	data:1, details:1, weakness:1, effectiveness:1, coverage:1, statcalc:1, 
	uptime:1, servertime:1, calc:1, pickrandom:1, 
};

// Conforms to classes in users.js
class BotConnection {
	constructor(reply) {
		this.send = reply;
	}
	sendTo(roomid, data) {
		this.send(data);
	}
	destroy(){}
	onDisconnect(){}
	popup(){}
	joinRoom(){}
	leaveRoom(){}
}
class BotUser {
	constructor(reply) {
		this.name = 'YayBot';
		this.userid = 'YAYBOT';
		this.named = false;
		this.registered = false;
		this.group = ' ';
		
		this.connections = [new BotConnection(reply)];
	}
	can() { return false; }
	sendTo(roomid, data) {
		this.connections[0].send(data);
	}
	popup(){}
	resetName(){}
	tryJoinRoom(){}
	leaveRoom(){}
}

/** Base class for remote-reach bots, like those for IRC and Discord */
class Bot {
	constructor({ loggerId, nickname }) {
		this.loggerId = loggerId || 0;
		this.isAnnouncing = true;
		this.isListening = true;
		this.nickname = nickname;
	}
	
	destroy() { // Must Override
		this.loggerId = 0;
		this.isAnnouncing = false;
		this.isListening = false;
	}
	
	get isLogging() {
		return !!this.loggerId;
	}
	
	get defaultRoom() {
		return ''; // Must Override!
	}
	
	/** Say a message into the remote room, like a normal person. */
	say(room, message) {
		// Must Override
	}
	
	/** Announce a message into the remote room, no notification. */
	announceBattle(format, p1, p2, roomid) {
		
	}
	
	/** Announce a message to everyone in the room, notifying everyone. */
	announce(message) {
		// Must Override
		if (message.indexOf('\n') > -1) throw new Error('Notices cannot have newlines!');
	}
	
	///// Response Cleanup //////
	filter(rawMsg) {
		let parts = rawMsg.split(/\n/);
		let finalParts = [];
		
		parts.forEach((part)=>{
			let signal = '|raw|';
			if (part.startsWith(signal)) {
				finalParts.push(...this.formatRaw(part.slice(signal.length)));
				return;
			}
			signal = '|c|~|/data-';
			if (part.startsWith(signal)) {
				let msg = part.slice(signal.length);
				let splitter = msg.indexOf(' ');
				let type = msg.slice(0, splitter);
				let what = msg.slice(splitter + 1);
				finalParts.push(...this.formatRaw(dataParsers[type](what)));
				return;
			}
			signal = '|html|<div class="message-error">';
			if (!part.startsWith(signal)) {
				finalParts.push(part);
				return;
			}
		});
		if (!this.verifyParts(finalParts)) return "Response too long.";
		return finalParts.join("\n");
	}
	
	formatRaw(rawMsg) {
		// Must Override
		return rawMsg.split(/<br>\s*\/?/);
	}
	
	verifyParts(parts) {
		// Must Override
		return true;
	}
	
	/** Process a simple message sent to the room. This does not have enough info for logging. */
	onMessage(sender, text, room) {
		if (!this.isListening) return;
		
		if (/\byay\b/i.test(text)) {
			this.say(room, 'Y+A+Y');
		}
		
		if (text.slice(0,2) === '!?') return;
		if (text.charAt(0) !== '!') return;
		let res = this.parseCommand('/'+text.slice(1), this.say.bind(this, room));
		console.log(res);
	}
	
	onPrivateMessage(sender, text, reply) {
		if (text.charAt(0) === '!' || text.charAt(0) === '/') text = text.slice(1);
		let res = this.parseCommand('/'+text, reply)
		if (res) { reply(res); }
	}
	
	///// Command Parsing /////
	parseCommand(msg, reply) {
		let user = new BotUser(reply);
		let cmd = new Chat.CommandContext({
			message: msg,
			room: Rooms.global,
			user: user,
			connection: user.connections[0],
		});
		let handler = cmd.splitCommand();
		if (handler === '!' || !remoteCommands[cmd.cmdName]) {
			return `I cannot run that command remotely. Please log into the server to use that command.`;
		}
		if (typeof handler !== 'function') {
			return `I beg pardon?`;
		}
		let res = cmd.run(handler);
		console.log('parseCommand: '+res);
		if (res && res !== true && typeof res.then !== 'function') {
			reply(res);
		}
	}
	
	///// Logging //////
	log(type, user, message) {
		if (!this.loggerId) return;
		pgpool.acquire().then((db)=>{
			db.query('SELECT insert_row($1, $2, $3, $4)', [this.loggerId, type, user, message], function (err, result) {
				pgpool.release(db);
				if (err) throw err;
			});
		}).catch((err)=>{
			console.error('Bot is unable to log to the database! '+err.stack);
		});
	}
}

module.exports = { Bot, BotConnection, BotUser };