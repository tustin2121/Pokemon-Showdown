// This code is awful, and I know it.
"use strict";
let config = Config.ircconfig;

exports.report = function report(message) {
	if (!config) {
		return;
	}
	let room = config.reportroom;
	if (room) {
		say(room, message);
	}
};

if (!config) {
	return;
}

let irc = require('irc');
let Pool = require('generic-pool').Pool;
let Client = require('pg-native');

let pool = new Pool({
	create: function (callback) {
		let client = new Client();
		client.connect(function (err) {
			if (err) {
				callback(err, null);
				return;
			}
			callback(null, client);
		});
	},
	destroy: function (client) {
		client.end();
	},
	max: 5,
	idleTimeoutMillis: 30000,
});

let connection = exports.connection = new irc.Client(config.server, config.nickname, config);

function say(room, message) {
	if (!message) return;
	connection.say(room, message);
	if (!config.loggerid) return;
	let messages = message.split("\n");
	for (let i = 0; i < messages.length; i++) {
		log(config.loggerid, 1, config.nickname, messages[i]);
	}
}

function log(bufferid, type, user, message) {
	pool.acquire(function (err, client) {
		if (err) throw err;
		client.query('SELECT insert_row($1, $2, $3, $4)', [bufferid, type, user, message], function (err, result) {
			pool.release(client);
			if (err) throw err;
		});
	});
}

function listenForLogs(socket, channel, bufferid) {
	socket.on('join' + channel, function join(nick, message) {
		log(bufferid, 32, message.prefix, channel);
	});

	socket.on('part' + channel, function part(nick, reason, message) {
		log(bufferid, 64, message.prefix, reason);
	});

	socket.on('quit', function quit(nick, reason, channels, message) {
		if (channels.indexOf(channel) === -1) return;

		log(bufferid, 128, message.prefix, reason);
	});

	socket.on('kick' + channel, function kick(nick, by, reason, message) {
		log(bufferid, 256, message.prefix, nick + ' ' + reason);
	});

	socket.on('action', function action(nick, to, actionMessage, message) {
		log(bufferid, 4, message.prefix, actionMessage);
	});

	socket.on('notice', function notice(nick, to, text, message) {
		if (to !== channel) return;
		log(bufferid, 2, message.prefix, text);
	});

	socket.on('nick', function nick(oldnick, newnick, channels, message) {
		if (channels.indexOf(channel) === -1) return;

		log(bufferid, 8, message.prefix, newnick);
	});

	socket.on('topic', function topic(to, newTopic, nick, message) {
		if (to !== channel) return;
		// Initial message
		if (/!/.test(nick)) {
			log(bufferid, 16384, "", 'Topic for ' + to + ' is "' + newTopic + '"');
		} else {
			log(bufferid, 16384, "", nick + ' has changed topic for ' + to + ' to: "' + newTopic + '"');
		}
	});

	// Mode messages in IRC framework are way too clever.
	socket.on('raw', function (message) {
		if (message.command !== 'MODE' || message.args[0] !== channel) return;
		log(bufferid, 16, message.prefix, message.args.join(' '));
	});
}

function identity(value) {
	return function identityFunction() {
		return value;
	};
}

function parseRaw(message) {
	return message
		.replace(/<font color="?#\d{6}"?>Super Effective<\/font><\/b>/g, "\x033Super Effective\x0F")
		.replace(/<a [^>]*room=[^>]*>(.*?)<\/a>/g, "$1")
		.replace(/<a href="(.+?)">(.*?)<\/a>/g, "[$2]($1)")
		.replace(/<li>/g, "\n  • ")
		.replace(/<\/?(?:ul|font size|div)[^>]*?>/g, "")
		.replace(/<small style="display:none">.*?<\/small>/g, "")
		.replace(/<\/?(?:b|strong)(?: class="username")?>/g, "\x02")
		.replace(/<\/?em>/g, "\x1D")
		.replace(/<(?:\/span|\/font|font color=\w+)>/g, "\x0F")
		.replace(/<span class="message-effect-weak">/g, "\x02\x034")
		.replace(/<span class="message-effect-resist">/g, "\x02\x0312")
		.replace(/<span class="message-effect-immune">/g, "\x02\x0314")
		.replace(/<span class="message-learn-canlearn">/g, "\x02\x1F\x033")
		.replace(/<span class="message-learn-cannotlearn">/g, "\x02\x1F\x034")
		.replace(/<font color="?#\d{6}"?>/g, "\x0314")
		.replace(/<\/font>/g, "\x0F")
		.replace(/&nbsp;|&ThickSpace;| +/g, " ")
		.replace(/&#10003;/g, "✓")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&#x2f;/g, "/")
		.replace(/&eacute;/g, "é")
		.replace(/&amp;/g, "&")
		.split(/<br\s*\/?>/);
}

function verifyParts(parts) {
	if (parts.length > 6) {
		return false;
	}
	for (let i = 0; i < parts.length; i++) {
		let part = parts[i];
		if (part.length > 440) {
			return false;
		}
	}
	return true;
}

let dataParsers = {
	pokemon: function (specie) {
		let specieData = Tools.getTemplate(specie);
		let result = [];
		let tier = specieData.tier;
		if (!require('./data/tpp').BattleTPP[specieData.id] && !specieData.isNonstandard && !specieData.isUnreleased) {
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
			baseStats.push('\x0314' + stat + ':\x0F ' + statValue);
		}
		baseStats.push('\x0314BST:\x0F ' + bst);
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
					ability = '\x1D' + ability + '\x1D';
				}
				abilities.push(ability);
			}
		}
		result.push('\x0314Abilities:\x0F ' + abilities.join(', '));

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
				result.push('\x0314Power:\x0F ' + moveData.basePower + ' BP');
			} else {
				result.push('\x0314Power:\x0F —');
			}
		}

		if (moveData.accuracy === true) {
			result.push('\x0314Accuracy:\x0F —');
		} else {
			result.push('\x0314Accuracy:\x0F ' + moveData.accuracy + '%');
		}

		result.push('\x0314PP:\x0F ' + moveData.pp * 8 / 5);
		result.push(moveData.shortDesc);

		return result.join(' | ');
	},
};

function filter(rawMessage) {
	let parts = rawMessage.split(/\n/);
	let rawSignal = '|raw|';
	let dataSignal = '|c|~|/data-';
	let errorSignal = '|html|<div class="message-error">';
	let finalParts = [];
	for (let i = 0; i < parts.length; i++) {
		let part = parts[i];
		let message;
		if (part.slice(0, rawSignal.length) === rawSignal) {
			message = part.slice(rawSignal.length);
			Array.prototype.push.apply(finalParts, parseRaw(message));
		} else if (part.slice(0, dataSignal.length) === dataSignal) {
			message = part.slice(dataSignal.length);
			let splitter = message.indexOf(' ');
			let type = message.slice(0, splitter);
			let what = message.slice(splitter + 1);
			finalParts.push(dataParsers[type](what));
		} else if (part.slice(0, errorSignal.length) !== errorSignal) {
			finalParts.push(part);
		}
	}
	if (!verifyParts(finalParts)) return "Response too long.";
	return finalParts.join("\n");
}

function FakeRoom(id) {
	this.id = id;
}
FakeRoom.prototype.isMuted = identity(false);
FakeRoom.prototype.users = {};

let ircUser = {
	named: false,
	can: identity(false),
	resetName: identity(),
	tryJoinRoom: identity(null),
	leaveRoom: identity(),
	group: ' ',
};

let ircConnection = {
	sendTo: function (room, message) {
		say(room.id, filter(message));
	},
	popup: identity(),
};

connection.on('message', function parseMessage(from, to, text, message) {
	if (config.loggerid && to === (config.reportroom || config.channels[0])) {
		log(config.loggerid, 1, message.prefix, text);
	}
	if (to.charAt(0) !== '#') {
		to = from;
	}
	if (/\byay\b/i.test(text)) {
		connection.say(to, 'Y+A+Y');
	}
	// DootBot conflict
	if (text.slice(0, 2) === '!?') return;
	if (text.charAt(0) !== '!' && text.charAt(0) !== '/') return;
	CommandParser.parse('/' + text.slice(1), new FakeRoom(to), ircUser, ircConnection);
});

if (config.loggerid) {
	let room = config.reportroom || config.channels[0];
	listenForLogs(connection, room, config.loggerid);
	setInterval(function () {
		connection.join(room);
	}, 120000);
}
