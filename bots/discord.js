// discord.js
// Home of the Discord bot class
/* global Tools, Users, LeagueSetup */

const { Bot } = require('./bot.js');
const discord = require('discord.js');

class DiscordBot extends Bot {
	constructor(opts) {
		if (!opts.token) throw new Error("Invalid Discord configuration!");
		super(opts);
		this.announceChannel = opts.announceChannel || null;
		
		this.client = new discord.Client({
			disabledEvents: [ //Events we completely ignore entirely
				// 'GUILD_CREATE',
				// 'GUILD_DELETE',
				// 'GUILD_UPDATE',
				// 'GUILD_MEMBER_ADD',
				// 'GUILD_MEMBER_REMOVE',
				'MESSAGE_REACTION_ADD',
				'MESSAGE_REACTION_REMOVE',
				'MESSAGE_REACTION_REMOVE_ALL',
				'VOICE_STATE_UPDATE',
				'TYPING_START',
				'VOICE_SERVER_UPDATE',
				// 'RELATIONSHIP_ADD',
				// 'RELATIONSHIP_REMOVE',
			],
		});
		this.client.on('error', (err)=>{
			// this.client.say('ERROR! Please see output.');
			console.error('DISCORD BOT ERROR: '+require("util").inspect(err));
			console.error('DISCORD BOT ERROR: '+err.stack);
		});
		this.client.on('warn', (err)=>{
			console.error('DISCORD BOT WARNING: '+err);
		});
		this.client.on('ready', ()=>{
			console.log('Discord bot has connected and is ready.');
		});
		this.client.on('message', (msg)=>{
			if (msg.author.id === this.client.user.id) return; //Don't rspond to own message
			if (msg.channel.type === 'text') {
				this.onMessage(msg.author.id, msg.content, msg.channel.id);
			} else if (msg.channel.type === 'dm') {
				this.onPrivateMessage(msg.author.id, msg.content, msg.reply.bind(msg));
			} else if (msg.channel.type === 'group') {
				this.onPrivateMessage(msg.author.id, msg.content, msg.reply.bind(msg));
			}
		});
		this.client.on('messageUpdate', (oldMsg, newMsg)=>{
			
		});
		this.client.login(opts.token);
	}
	
	destroy() {
		this.client.destroy();
		super.destroy();
	}
	
	get defaultRoom() {
		let chan = this.client.channels.find(c => c.name === this.announceChannel);
		if (!chan) chan = this.client.channels.filter(c=>c.type === 'text').first();
		if (chan) return chan;
		else {
			console.error('DISCORD BOT ERROR: Cannot find channel to send announcement to!');
			return null;
		}
	}
	
	say(roomid, message) {
		// console.log(`DISCORD BOT PRE: [${roomid}] [${message}]`);
		message = this.filter(message);
		// console.log(`DISCORD BOT SAY: [${roomid}] [${message}]`);
		if (!message) return;
		let channel = this.client.channels.get(roomid);
		channel.sendMessage(message, {
			disableEveryone: true,
		});
		
		//TODO logging, when it is needed
	}
	
	announceBattle(format, p1, p2, roomid) {
		let f = Tools.getFormat(format);
		f += /battle$/i.test(f)?"":" battle";
		
		let msg = `${f} started between **${p1.getIdentity().slice(1)}** and **${p2.getIdentity().slice(1)}**`;
		
		if (format.slice(0,9) === 'tppleague') {
			let f = Tools.getFormat(format);
			let gym;
			switch (format.slice(9)) {
				case 'gym':
					gym = LeagueSetup.gyms[p1.userid];
					if (!gym) break;
					msg = `A Gym battle has started: **${p2.getIdentity().slice(1)}** is challenging ${(gym.battletype==='trial')?"Captain":"Leader"} **${p1.getIdentity().slice(1)}** of the ${gym.name} ${(gym.battletype==='trial')?"Trial":"Gym"}!`;
					break;
				case 'elitefour':
					gym = LeagueSetup.elites[p1.userid];
					if (!gym) break;
					msg = `An Elite Four battle has started: **${p2.getIdentity().slice(1)}** is challenging "${gym.name}" **${p1.getIdentity().slice(1)}** of the Elite Four!`;
					break;
				case 'champion':
					gym = LeagueSetup.elites[p1.userid];
					if (!gym) break;
					msg = `@everyone A Champion battle has started: **${p2.getIdentity().slice(1)}** is challenging the Champion, "${gym.name}" **${p1.getIdentity().slice(1)}**!!`;
					break;
				default: break;
			}
		}
		
		this.battleData[roomid] = this.defaultRoom.sendMessage(
			msg,
			{
				disableEveryone: true,
				embed: {
					title: `${p1.getIdentity()} vs ${p2.getIdentity()}`,
					type: 'rich',
					description: `${f}!`,
					url: `https://tppleague.me/${roomid}`,
					// timestamp: new Date(),
				},
			}
		);
		this.battleData[roomid]._p1 = p1.userid;
		this.battleData[roomid]._p2 = p2.userid;
	}
	announceBattleFinished(roomid, winnerid) {
		if (!this.battleData[roomid]) return;
		let bd = this.battleData[roomid];
		bd.then(msg => {
			let e = {
				title: msg.embeds[0].title, 
				type: msg.embeds[0].type,
				description: msg.embeds[0].description, 
				url: `https://tppleague.me/replay/${roomid.slice(7)}`, 
				// timestamp: msg.embeds[0].timestamp || new Date(), 
			};
			let txt = msg.content.replace('started', 'finished');
			if (winnerid) {
				if (winnerid === bd._p1) {
					txt = txt.replace('is challenging', 'has lost against');
				} else if (winnerid === bd._p2) {
					txt = txt.replace('is challenging', 'has defeated');
				}
			}
			msg.edit(txt,
			{
				embed: e,
			});
		});
		delete this.battleData[roomid];
	}
	
	announceTourny(format, roomid, state, etc) {
		let data = this.tournyData[`${roomid}/${format}`];
		switch (state) {
			case 'create': {
				data = this.tournyData[`${roomid}/${format}`] = {};
				data.format = format;
				data.roomid = roomid;
				data.isOpen = true;
				data.players = [];
				data.message = this.defaultRoom.sendMessage(
					`A ${Tools.getFormat(format)} tournament has been created (by ${etc.creator})!`,
					{
						disableEveryone: true,
						embed: {
							title: `Tournament on the TPPLeague server!`,
							type: 'rich',
							url: `https://tppleague.me/#${roomid}`,
							// timestamp: new Date(),
						}
					}
				);
			} break;
			case 'update': {
				if (!data) return;
				data.players = etc.players.map(p => Users.get(p).getIdentity());
				data.isOpen = etc.open;
				if (data.isOpen) {
					data.message.then(m=>{
						m.edit(`A ${Tools.getFormat(format)} tournament is open on the server, with ${data.players.join(', ') || 'nobody yet'} joined. **Come join in!**`);
					});
				} else {
					data.message.then(m=>{
						m.edit(`A ${Tools.getFormat(format)} tournament is underway on the server, with ${data.players.join(', ') || 'nobody'} playing!`);
					});
				}
			} break;
			case 'ended': {
				if (!data) return;
				data.message.then(m=>{
					m.edit(`A ${Tools.getFormat(format)} tournament finished on the server, with ${arrayToPhrase(etc.results[0])} emerging victorious!`);
				});
				delete this.tournyData[`${roomid}/${format}`];
			} break;
			case 'forceended': {
				if (!data) return;
				data.message.then(m=>{
					m.edit(`The ${Tools.getFormat(format)} tournament has been cancelled by ${etc.by}!`);
				});
				delete this.tournyData[`${roomid}/${format}`];
			} break;
		}
		
		return;
		function arrayToPhrase(array, finalSeparator) {
			if (array.length <= 1)
				return array.join();
			finalSeparator = finalSeparator || "and";
			return array.slice(0, -1).join(", ") + " " + finalSeparator + " " + array.slice(-1)[0];
		}
	}
	
	announce(message) {
		if (!message) return;
		if (message === `TPPLeague Champion Battle will be beginning soon!`) return; //already handled
		message = this.filter(message);
		
		this.defaultRoom.sendMessage(`@everyone ${message}`);
	}
	
	verifyParts(parts) {
		if (parts.join('\n').length > 2000) { // Discord single message limit: 2000 characters
			return false;
		}
		return true;
	}
	
	formatRaw(message) {
		return message
			.replace(/<font color="?#\d{6}"?>Super Effective<\/font><\/b>/g, "***Super Effective***")
			.replace(/<a [^>]*room=[^>]*>(.*?)<\/a>/g, "$1")
			.replace(/<a href="(.+?)">(.*?)<\/a>/g, "[$2]($1)")
			.replace(/<li>/g, "\n  • ")
			.replace(/<\/?(?:ul|font size|div)[^>]*?>/g, "")
			.replace(/<small style="display:none">.*?<\/small>/g, "")
			.replace(/<\/?(?:b|strong)(?: class="username")?>/g, "**")
			.replace(/<\/?em>/g, "*")
			.replace(/<(?:\/span)>/g, "*")
			.replace(/<span class="message-effect-weak">/g, "*")
			.replace(/<span class="message-effect-resist">/g, "*")
			.replace(/<span class="message-effect-immune">/g, "*")
			.replace(/<span class="message-learn-canlearn">/g, "*")
			.replace(/<span class="message-learn-cannotlearn">/g, "*")
			.replace(/<font color="?#[0-9a-f]{3,6}"?>/g, "**")
			.replace(/<\/font>/g, "**")
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
	
	//TODO: /eval BotManager.botList[1].defaultRoom.sendMessage('test', {embed:{title:'test', type:'rich', image:{url:'https://tppleague.me/sprites/bw/jigglypuff.png', width:80, height:80}, fields:[ {name:'Name', value:'Jigglypuff', inline:true}, {name:'Type', value: 'Fairy', inline: true}, {name:'Something', value:'random', inline:true} ]}});
	// https://images.discordapp.net/.eJwFwdENhCAMANBdGIAWKipuQ5CgUVsCNfdxud3vva95-202c6i2sQHs58jSdztUeqrFVpF6l9TOYbM8kFRTPp7COsDF1UWiOFF0GGZaA_iFyCFiQCT080QeXr5YPmwbV_P7AwXnIsQ.S0ilxXt-olpf6_ryDktuEqfn-H0?width=511&height=481
}

module.exports = { DiscordBot };