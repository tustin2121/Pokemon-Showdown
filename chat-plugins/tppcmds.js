/**
 * TPP Custom Commands
 */
 
'use strict';

exports.commands = {
	
	rollpkmn: 'rollpokemon',		
	rollpokemon: function(target, room, user) {		
		let number = Math.floor(Math.random() * 721) + 1;		
		return this.parse("/dt "+number);		
	},		
	rollpokemonhelp: ["/rollpokemon - Randomly picks a pokemon from all possible pokemon, and displays its stats. The equivilant of '/roll 721', then '/dt <result>'."],
	
	news: function (target, room, user) {		
		if (this.cmdToken === '!') {		
			if (!this.can('declare', null, room)) return;		
			if (!this.runBroadcast("#NEWSNEWSNEWS TriHard")) return;		
		}
		if (this.broadcasting) {		
			// Using this.send => don't want it in the history		
			// this.send(`|html|<div class="infobox">#NEWSNEWSNEWS <img src="/fx/emotes/TriHard.png" width=" alt "TriHard" title="TriHard" class="emote"></div>`);		
			this.send("|news|refreshall");		
		} else {		
			this.sendReply("|news|refresh");		
			this.sendReply("News has been refreshed.");		
		}		
		this.user.broadcasting = false;		
	},		
	newshelp: ["/news Updates the news sidebar. Broadcasting it will update it for everyone."],
};