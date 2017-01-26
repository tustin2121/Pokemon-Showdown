// discord.js
// Home of the Discord bot class

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
				// 'MESSAGE_REACTION_ADD',
				// 'MESSAGE_REACTION_REMOVE',
				// 'MESSAGE_REACTION_REMOVE_ALL',
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
		if (!message) return;
		message = this.filter(message);
		let channel = this.client.channels.get(roomid);
		channel.sendMessage(message, {
			disableEveryone: true,
		});
		
		//TODO logging, when it is needed
	}
	
	announceBattle(format, p1, p2, roomid) {
		this.defaultRoom.sendMessage(
			`${Tools.getFormat(format)} battle started between **${p1.getIdentity()}** and **${p2.getIdentity()}**`,
			{
				disableEveryone: true,
				embed: {
					title: `${p1.getIdentity()} vs ${p2.getIdentity()}`,
					type: 'rich',
					description: `A ${Tools.getFormat(format)} battle on the TPPLeague server.`,
					url: `https://tppleague.me/${roomid}`,
					timestamp: new Date(),
				},
			}
		);
	}
	
	announce(message) {
		if (!message) return;
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