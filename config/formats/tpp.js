//
const fs = require("fs");

// The global in the battle sim is not the same global object that the main server has.
// Thus global.LeagueSetup is undefined, so we need to read it ourselves.
function loadLeague() {
	try {
		return JSON.parse(fs.readFileSync(require.resolve("../league/league_setup.json")));
	} catch (e) {
		console.log(e);
		return null;
	}
}


/* global toId */
exports.Sections = {
	"TPP":			{ column: 5, sort: 1, },
};
exports.Formats = [];

function create(base, mod) {
	exports.Formats.push(Object.assign({}, base, mod));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// TPP League Formats
let leagueFormat = {
	name: "TPPLeague",
	desc: ["The Format used by TPPLeague for normal and test fights."],
	section: "TPP",
	team: undefined,
	searchShow: false,
	challengeShow: true,
	tournamentShow: false,
	
	mod: 'tppleague',
	ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview', 'Mega Rayquaza Clause'],
	
	onBegin: function() {
		this.add('error','This format is for general fights (like to test out your teams). Please don\'t use this format for gym, elite four, or champion battles.');
		// This format is also used by the validator to validate teams.
	},
};
create(leagueFormat, {
	searchShow: true,
	challengeShow: true,
	tournamentShow: true,
});

create(leagueFormat, {
	name: "TPPLeague (Gym)",
	desc: ["The Format used by TPPLeague Gym and Trial fights."],
	
	// Custom PseudoEvent called before anything is sent to the client (save for join messages)
	onPreSetup : function() {
		let LeagueSetup = loadLeague();
		if (!LeagueSetup) return this.add('error', 'Fatal: Could not load league settings. Defaulting to Standard Battle.');
		
		let gym = LeagueSetup.gyms[toId(this.p1.name)];
		if (!gym) {
			this.add('error', `Player 1 (${this.p1.name}) has no defined gym! Please forfeit this match and have the challenger challenge the leader, so that the leader is player 1.`);
			return this.denyBattle("Invalid Gym Setup.");
		}
		
		this.applyGymSettings(gym);
	},
	
	// Standard PseudoEvent
	onBegin: function() {
		let LeagueSetup = loadLeague();
		if (!LeagueSetup) return;
		let gym = LeagueSetup.gyms[ toId(this.p1.name) ];
		if (!gym) return;
		
		let bgmindex = Config.stadium.music();
		let bgiindex = Config.stadium.background();
		let randlist = bgiindex[6].filter((i)=>i.startsWith("~bg-leader")).map((i)=>i.substr(1));
		
		let pre = (gym.battletype==="trial")?"sm-kahuna":"oras-gym-building";
		let bgm = gym.bgmusic || bgmindex.randInCategory("gym");
		let img = bgiindex.convertToId(gym.bgimg || randlist[Math.floor(Math.random()*randlist.length)]);
		
		this.add('-tppgym', this.p1, (gym.battletype==='trial')?'Captain':'Leader');
		this.add('-stadium', '[norequest]', `[bg] ${img}`, `[music] ${bgm}`, `[premusic] ${pre}`);
		this.add('title', `${this.p2.name} vs. The ${gym.name} ${(gym.battletype==='trial')?'Trial':'Gym'}`);
	},
	
	// Custom Event sent just after the win messages are sent
	onBattleFinished: function(sideWon) {
		if (sideWon === this.p2) {
			this.add('raw', `<div class="broadcast-blue">Gym Leader: Remember to use the <code>/givebadge ${this.p2.name}</code> command to give the challenger a badge (if applicable at this time).</div>`);
		}
	},
});

create(leagueFormat, {
	name: "TPPLeague (Elite Four)",
	desc: ["The Format used by TPPLeague Elite Four fights."],
	
	// Custom PseudoEvent called before anything is sent to the client (save for join messages)
	onPreSetup : function() {
		let LeagueSetup = loadLeague();
		if (!LeagueSetup) return this.add('error', 'Fatal: Could not load league settings. Defaulting to Standard Battle.');
		
		let gym = LeagueSetup.elites[toId(this.p1.name)];
		if (!gym) {
			this.add('error', `Player 1 (${this.p1.name}) has no defined Elite settings! Please forfeit this match and have the challenger challenge the E4 member, so that the E4 member is player 1.`);
			return this.denyBattle("Invalid Elite Setup");
		}
		
		this.applyGymSettings(gym);
	},
	
	// Standard PseudoEvent
	onBegin: function() {
		let LeagueSetup = loadLeague();
		if (!LeagueSetup) return;
		let gym = LeagueSetup.elites[ toId(this.p1.name) ];
		if (!gym) return;
		
		let bgmindex = Config.stadium.music();
		let bgiindex = Config.stadium.background();
		let randlist = bgiindex[6].filter((i)=>i.startsWith("~bg-e4")).map((i)=>i.substr(1));
		
		let pre = "bw-pkmn-league";
		let bgm = gym.bgmusic || bgmindex.randInCategory("e4");
		let img = bgiindex.convertToId(gym.bgimg || randlist[Math.floor(Math.random()*randlist.length)]);
		
		this.add('-tppgym', this.p1, gym.name || 'Elite Four');
		this.add('-stadium', '[norequest]', `[bg] ${img}`, `[music] ${bgm}`, `[premusic] ${pre}`);
		this.add('title', `${this.p2.name} vs. ${(gym.name || 'Elite Four')} ${this.p1.name}`);
	},
});

create(leagueFormat, {
	name: "TPPLeague (Champion)",
	desc: ["The Format used by TPPLeague Champion fights."],
	
	// Custom PseudoEvent called before anything is sent to the client (save for join messages)
	onPreSetup : function() {
		let LeagueSetup = loadLeague();
		if (!LeagueSetup) return this.add('error', 'Fatal: Could not load league settings.');
		
		let gym = LeagueSetup.elites[ toId(this.p1.name) ];
		if (!gym) {
			this.add('error', `Player 1 (${this.p1.name}) has no defined Elite settings! Please forfeit this match and have the challenger challenge the Champion, so that the Champion is player 1.`);
			return this.denyBattle("Illegal Champion.");
		}
		if (!gym.isChamp) {
			this.add('error', `Player 1 (${this.p1.name}) is not a champion. Get out and play a format you're allowed to use.`);
			return this.denyBattle("Illegal Champion, imo.");
		}
		
		this.applyGymSettings(gym);
	},
	
	// Standard PseudoEvent
	onBegin: function() {
		let LeagueSetup = loadLeague();
		if (!LeagueSetup) return;
		let gym = LeagueSetup.elites[ toId(this.p1.name) ];
		if (!gym) return;
		
		let bgmindex = Config.stadium.music();
		let bgiindex = Config.stadium.background();
		let randlist = bgiindex[6].filter((i)=>i.startsWith("~bg-champion")).map((i)=>i.substr(1));
		
		let pre = "dpp-cynthia-piano";
		let bgm = gym.bgmusic || bgmindex.randInCategory("champ");
		let img = bgiindex.convertToId(gym.bgimg || randlist[Math.floor(Math.random()*randlist.length)]);
		
		this.add('-tppgym', this.p1, gym.name || 'Champion');
		this.add('-stadium', '[norequest]', `[bg] ${img}`, `[music] ${bgm}`, `[premusic] ${pre}`);
		this.add('title', `${this.p2.name} vs. ${(gym.name || 'Champion')} ${this.p1.name}`);
		this.send('champion', 'prep');
	},
	
	onResidualOrder: 100,
	onResidual: function () {
		if (this.turn === 1) {
			this.send('champion', 'begin');
			return;
		}
		if (this.turn % 10 === 0) {
			this.send('champion', 'ongoing');
			return;
		}
	},
	
	// Custom Event sent just after the win messages are sent
	onBattleFinished: function(sideWon) {
		this.send('champion', 'finished');
	},
});
	
////////////////////////////////////////////////////////////////////////////////////////////////////
// TPP League Adventures
	
let tppla = {
	name: "TPPLA",
	section: "TPP",
	mod: 'tppla',
	column: 4,

	ruleset: ['Custom Game', 'Sleep Clause Mod', 'HP Percentage Mod', 'Mix and Mega Mod', 'Stadium Selection'],
};
create(tppla);

create(tppla, {
	name: "TPPLA Doubles",
	gameType: 'doubles',
});

create(tppla, {
	name: "TPPLA Triples",
	gameType: 'triples',
});
	
create({
	name: 'Snowball Fight',
	section: 'TPP',
	column: 4,
	ruleset: ['Ubers'],
	banlist: [],
	mod: 'snowballfight',
	onValidateSet: function (set) {
		set.moves.push('fling');
	},
	onBeforeTurn: function () {
		if (!this.p1.snowballs) {
			this.p1.snowballs = 0;
		}
		if (!this.p2.snowballs) {
			this.p2.snowballs = 0;
		}
	},
	onFaintPriority: 100,
	onFaint: function (pokemon) {
		if (pokemon.side.pokemonLeft === 1) {
			if (this.p1.snowballs > this.p2.snowballs) {
				this.win(this.p1);
			} else if (this.p2.snowballs > this.p1.snowballs) {
				this.win(this.p2);
			}
		}
	},
});
