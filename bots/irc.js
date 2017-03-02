// irc.js
// Home of the IRC bot class
/* global Tools, LeagueSetup */

const { Bot } = require('./bot.js');
const irc = require('irc');


class IrcBot extends Bot {
	constructor(opts) {
		if (!opts.server || !opts.channels || !opts.nickname) throw new Error("Invalid IRC configuration!");
		super(opts);
		this.connection = new irc.Client(opts.server, opts.nickname, opts);
		this.channels = opts.channels;
		this.reportRoom = opts.reportroom || this.channels[0];
		if (this.loggerId) {
			this.setupLogging();
			this._logJoinInt = setInterval(()=> this.connection.join(this.reportRoom), 120000);
		}
		
		this.connection.on('error', (err)=>{
			this.connection.say('#tppleague', 'ERROR! Please see output.')
			console.error('IRC BOT ERROR: '+require("util").inspect(err));
			console.error('IRC BOT ERROR: '+err.stack);
		});
		this.connection.on('message', (from, to, txt, message)=>{
			if (to === this.reportRoom) this.log(1, message.prefix, txt);
			if (to.startsWith('#')) {
				this.onMessage(from, txt, to);
			} else {
				this.onPrivateMessage(from, txt, this.say.bind(this, from));
			}
		});
	}
	
	get defaultRoom() {
		return this.reportRoom;
	}
	
	destroy() {
		clearInterval(this._logJoinInt);
		this.connection.disconnect();
		this.connection = null;
		super.destroy();
	}
	
	/** Say a message into the remote room, like a normal person. */
	say(room, message) {
		if (!message) return;
		message = this.filter(message);
		console.log(`SENDTO [${room}]: ${message}`);
		this.connection.say(room, message);
		
		if (!this.isLogging || room !== this.reportRoom) return;
		message.split('\n').forEach((m)=>{
			this.log(1, this.nickname, m);
		});
	}
	
	/** Announce a message into the remote room, no notification. */
	announceBattle(format, p1, p2, roomid) {
		let f = Tools.getFormat(format);
		f += /battle$/i.test(f)?"":" battle";
		let msg = `${f} started between ${p1.getIdentity()} and ${p2.getIdentity()}`;
		
		if (format.slice(0,9) === 'tppleague') {
			let f = Tools.getFormat(format);
			let gym;
			switch (format.slice(9)) {
				case 'gym':
					gym = LeagueSetup.gyms[p1.userid];
					if (!gym) break;
					msg = `A Gym battle has started: ${p2.getIdentity().slice(1)} is challenging ${(gym.battletype==='trial')?"Captain":"Leader"} ${p1.getIdentity().slice(1)} of the ${gym.name} ${(gym.battletype==='trial')?"Trial":"Gym"}!`;
					break;
				case 'elitefour':
					gym = LeagueSetup.elites[p1.userid];
					if (!gym) break;
					msg = `An Elite Four battle has started: ${p2.getIdentity().slice(1)} is challenging "${gym.name}" ${p1.getIdentity().slice(1)} of the Elite Four!`;
					break;
				case 'champion':
					gym = LeagueSetup.elites[p1.userid];
					if (!gym) break;
					msg = `A Champion battle has started: ${p2.getIdentity().slice(1)} is challenging the Champion, "${gym.name}" ${p1.getIdentity().slice(1)}!`;
					break;
				default: break;
			}
		}
		msg += ` -- tppleague.me/${roomid}`;
		this.say(this.reportRoom, msg);
	}
	
	announceTourny(format, roomid, state, etc) {
		if (state === 'created') {
			let msg = `A ${Tools.getFormat(format)} tournament has been created by ${etc.creator} -- tppleague.me/#${roomid}`;
			this.say(this.reportRoom, msg);
		}
	}
	
	/** Announce a message to everyone in the room, notifying everyone. */
	announce(message) {
		if (!message) return;
		if (!this.reportRoom) return; // Can't announce when there's nothing set up to announce to...
		message = this.filter(message);
		if (message.indexOf('\n') > -1) throw new Error('Notices cannot have newlines!');
		this.connection.send('NOTICE', this.reportRoom, message);
		
		if (!this.isLogging) return;
		this.log(2, this.nickname, message);
	}
	
	verifyParts(parts) {
		if (parts.length > 6) {
			return false;
		}
		for (let i = 0; i < parts.length; i++) {
			let part = parts[i];
			if (part.length > 440) { // IRC signle message limit: 440 characters
				return false;
			}
		}
		return true;
	}
	
	formatRaw(message) {
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
			.replace(/<font color="?#[0-9a-f]{3,6}"?>/g, "\x0314")
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
	
	setupLogging() {
		this.connection.on('join' + this.reportRoom, (nick, message) => {
			this.log(32, message.prefix, this.reportRoom);
		});
	
		this.connection.on('part' + this.reportRoom, (nick, reason, message) => {
			this.log(64, message.prefix, reason);
		});
	
		this.connection.on('quit', (nick, reason, channels, message) => {
			if (channels.indexOf(this.reportRoom) === -1) return;
			this.log(128, message.prefix, reason);
		});
	
		this.connection.on('kick' + this.reportRoom, (nick, by, reason, message) => {
			this.log(256, message.prefix, nick + ' ' + reason);
		});
	
		this.connection.on('action', (nick, to, actionMessage, message) => {
			this.log(4, message.prefix, actionMessage);
		});
	
		this.connection.on('notice', (nick, to, text, message) => {
			if (to !== this.reportRoom) return;
			this.log(2, message.prefix, text);
		});
	
		this.connection.on('nick', (oldnick, newnick, channels, message) => {
			if (channels.indexOf(this.reportRoom) === -1) return;
			this.log(8, message.prefix, newnick);
		});
	
		this.connection.on('topic', (to, newTopic, nick, message) => {
			if (to !== this.reportRoom) return;
			// Initial message
			if (/!/.test(nick)) {
				this.log(16384, "", 'Topic for ' + to + ' is "' + newTopic + '"');
			} else {
				this.log(16384, "", nick + ' has changed topic for ' + to + ' to: "' + newTopic + '"');
			}
		});
	
		// Mode messages in IRC framework are way too clever.
		this.connection.on('raw', (message) => {
			if (message.command !== 'MODE' || message.args[0] !== this.reportRoom) return;
			this.log(16, message.prefix, message.args.join(' '));
		});
	}
}

module.exports = { IrcBot };