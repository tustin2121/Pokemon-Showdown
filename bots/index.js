// bot/index.js

/* global Tools, Chat, Config */

const { Bot } = require('./bot.js');
const { IrcBot } = require('./irc.js');
const { DiscordBot } = require('./discord.js');

class BotManager {
	constructor() {
		this.botList = [];
	}
	
	addBot(bot) {
		if (!(bot instanceof Bot)) throw new Error('Cannot add bot! This is not a Bot class!');
		this.botList.push(bot);
	}
	
	destroy() {
		this.botList.forEach((bot)=>{
			bot.destroy();
		});
		this.botList = null;
	}
	
	say(message) {
		this.botList.forEach((bot)=>{
			bot.say(bot.defaultRoom, message);
		});
	}
	
	announceBattle(format, p1, p2, roomid) {
		if (Config.reportbattlesBotFilter && Config.reportbattlesBotFilter(Tools.getFormat(format)) === false) return;
		this.botList.forEach((bot)=>{
			bot.announceBattle(format, p1, p2, roomid);
		});
	}
	
	announceNotify(message) {
		this.botList.forEach((bot)=>{
			bot.announce(message);
		});
	}
}

let b = module.exports = new BotManager();
if (Config.botConfig) {
	Config.botConfig.forEach((config)=>{
		switch (config.type) {
			case 'irc': return b.addBot(new IrcBot(config));
			case 'discord': return b.addBot(new DiscordBot(config));
			default:
				console.error('ERROR: Invalid bot config type: '+config.type);
				break;
		}
	});
}
