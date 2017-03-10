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
			try { bot.say(bot.defaultRoom, message); } catch (e) { console.error('BOT ERROR'+e.stack); }
		});
	}
	
	announceBattle(format, p1, p2, roomid) {
		if (Config.reportbattlesBotFilter && Config.reportbattlesBotFilter(Tools.getFormat(format)) === false) return;
		this.botList.forEach((bot)=>{
			try { bot.announceBattle(format, p1, p2, roomid);  } catch (e) { console.error('BOT ERROR'+e.stack); }
		});
	}
	announceBattleFinished(roomid, winnerid) {
		this.botList.forEach((bot)=>{
			try { bot.announceBattleFinished(roomid, winnerid); } catch (e) { console.error('BOT ERROR'+e.stack); }
		});
	}
	
	announceTourny(format, roomid, state, etc) {
		this.botList.forEach((bot)=>{
			try { bot.announceTourny(format, roomid, state, etc);  } catch (e) { console.error('BOT ERROR'+e.stack); }
		});
	}
	
	announce(message) {
		this.botList.forEach((bot)=>{
			try { bot.announce(message); } catch (e) { console.error('BOT ERROR'+e.stack); }
		});
	}
	announceNotify(message) {
		this.botList.forEach((bot)=>{
			try { bot.announceNotify(message); } catch (e) { console.error('BOT ERROR'+e.stack); }
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
