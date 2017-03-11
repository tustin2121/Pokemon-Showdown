/**
 * Pokemon 20 questions chat game
 * By Tustin2121. Adapted from his bot.
 */
 
/* global Rooms */
'use strict';

const EventEmitter = require("events");

class Q20Pokemon extends Rooms.RoomGame {
	constructor(room, opts = {}) {
		super(room);
		
		if (room.gameNumber) {
			room.gameNumber++;
		} else {
			room.gameNumber = 1;
		}
		
		this.room = room;
		this.gameid = 'q20';
		this.title = 'Pokemon 20 Questions';
		this.disqual = new Set();
		
		this.noTypes = opts.notypes || false;
		this.noDexsearch = !opts.allowds;
		this.pkmn = null;
		if (opts.pkmn) {
			this.pkmn = opts.pkmn;
			this.disqual.add(opts.requester);
		} else {
			require('./datasearch.js').PM.send({
				target: 'random1',
				cmd: 'randpoke',
				canAll: true,
				message: "",
			}).then(res => {
				this.pkmn = res.dt;
				if (!this.pkmn) throw new Error('Something went wrong retrieving a random pokemon!!');
			});
		}
		
		if (this.noDexsearch) {
			room.noDexsearchBroadcast = true;
		}
	}
	
	parseQuestion(txt, user, cmdp) {
		if (this.disqual.has(user.userid)) {
			cmdp.errorReply('You are not allowed to ask any questions: you been disqualified from this game.');
			return;
		}
		if (!txt) return;
		if (!this.pkmn) {
			
		}
	}
	
	end() {
		if (this.noDexsearch) {
			this.room.noDexsearchBroadcast = false;
		}
	}
	
	usedDexsearch(user) {
		if (!this.noDexsearch) return;
		this.disqual.add(user.userid);
	}
}

if (!global.AntiCheat) global.AntiCheat = new EventEmitter();
AntiCheat.on('dexsearch', function(target, room, user){
	if (!user.inRooms) return;
	user.inRooms.forEach(roomid => {
		if (Rooms(roomid).game instanceof Q20Pokemon) {
			Rooms(roomid).game.usedDexsearch(user);
		}
	});
});

let exampleQuestions = [
	'Is it a Magikarp?', 
	'Can it have sturdy?', 'Could it have the ability water absorbe?',
	'Does it learn Flamethrower?', 
	'Is it grass type?', 'Is it weak to Ice?', 'Is it dual typed?',
	'Is it part of the Eevee family?', 
	'Is it taller than 2 meters?', 'Is it smaller than a Pikachu?', 
	'Is it a legendary pokemon?',
	'Is it red?', 'Does it evolve?', 'Is it in the Johto Pokedex?',
	// 'Is it heavier than 100kg?',
	// 'Is it part of the monster egg group?',
	// 'Can it mate with a skitty?',
	// 'Does it have wings?', 'Does it have legs?',
];

exports.commands = {
	'20q': 'q20',
	'20questions': 'q20',
	q20pokemon: 'q20',
	q20: {
		create: 'start',
		'new': 'start',
		start: function(target, room, user) {
			let params = target.split(',');
			
			if (!this.can('minigame', null, room)) return false;
			if (room.q20Disabled) return this.errorReply('20 Questions is disabled for this room.');
			if (!this.canTalk()) return;
			if (room.game) return this.errorReply(`There is already a game of ${room.game.title} in progress in this room.`);
			
			let invalid = false;
			let opts = {};
			params.forEach((p)=>{
				// test our parameters
				if (p.toLowerCase() === 'notypes') {
					opts.notypes = true; return;
				}
				if (p.toLowerCase() in {allowds:1, allowdex:1, allowdexsearch:1}) {
					opts.allowds = true; return;
				}
				
				let pkmn = Tools.getTemplate(p);
				if (!pkmn.exists) invalid = 'Unknown pokemon requested.';
				if (pkmn.species !== pkmn.baseSpecies) invalid = 'Cannot request a specific pokemon forme.';
				opts.pkmn = pkmn.baseSpecies;
				opts.requester = user.userid;
			});
			if (invalid) return this.errorReply(invalid);
			
			room.game = new Q20Pokemon(room, opts);
			room.game.display();
			
			return this.privateModCommand(`(A game of Q20 was started by ${user.name}.)`);
		},
		starthelp: ['/q20 start [options] - Makes a new game of 20 questions. Requires: % @ * # & ~'],
		
		ask: function(target, room, user) {
			if (!target) return this.parse('/help ask');
			if (!room.game || room.game.gameid !== 'q20pokemon') return this.errorReply("There is no game of 20 questions running in this room.");
			if (!this.canTalk()) return;
			if (!this.canBroadcast('Q20> '+target)) return this.errorReply('Questions in the Q20 game are always broadcast to the room.');
			
			room.game.parseQuestion(target, user, this);
		},
		askhelp: [
			'/q20 ask [question] - Asks a question for the 20 Questions game.',
			"Example questions: "+exampleQuestions.join(' '),
		],
		
		disable: function (target, room, user) {
			if (!this.can('gamemanagement', null, room)) return;
			if (room.hangmanDisabled) {
				return this.errorReply("Pokemon 20 Questions is already disabled.");
			}
			room.q20PokemonDisabled = true;
			if (room.chatRoomData) {
				room.chatRoomData.q20PokemonDisabled = true;
				Rooms.global.writeChatRoomData();
			}
			return this.sendReply("Pokemon 20 Questions has been disabled for this room.");
		},

		enable: function (target, room, user) {
			if (!this.can('gamemanagement', null, room)) return;
			if (!room.q20PokemonDisabled) {
				return this.errorReply("Pokemon 20 Questions is already enabled.");
			}
			delete room.q20PokemonDisabled;
			if (room.chatRoomData) {
				delete room.chatRoomData.q20PokemonDisabled;
				Rooms.global.writeChatRoomData();
			}
			return this.sendReply("Pokemon 20 Questions has been enabled for this room.");
		},
		
		'': function (target, room, user) {
			return this.parse('/help q20');
		},
	},
	q20help: [
		"/q20 allows users to play 20 questions, where the players try to guess a randomly selected pokemon.",
		"Accepts the following commands:",
		"/q20 start [options] - Makes a new 20 questions game. Requires: % @ * # & ~",
		"/q20 ask [question] - Asks a question in the game.",
		"/q20 [enable/disable] - Enables or disabled 20 questions from starting in this room. Requires: # & ~",
		"Options include:",
		"notypes - Cannot ask questions directly or indirectly about the pokemon's types, for a tougher challenge.",
		"allowds - By default, using the /dexsearch command disqualifies players from asking any more questions. This option allows it.",
		"[pokemon] - By default, the game chooses a random pokemon. But you can request a pokemon, if you wish. You will not be able to ask questions.",
		"Example questions: "+exampleQuestions.join(' '),
	],
	
	ask: function(target, room, user) {
		
	},
	askhelp: [
		'/ask [question] - Shortcut for /q20 ask.',
		'/q20 ask [question] - Asks a question for the 20 Questions game.',
		"Example questions: "+exampleQuestions.join(' '),
	],
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// Natural Language Processing Code:

class QuestionParser {
	constructor(message) {
		
	}
	
}

