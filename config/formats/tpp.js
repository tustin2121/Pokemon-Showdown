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
	ruleset: ['Pokemon', 'Standard Doubles', 'Team Preview'], //'Mega Rayquaza Clause'
	
	additionalRulesets: {
		'singles': ['Swagger Clause', 'Sleep Clause Mod',],
		'doubles': [],
		'triples:': [],
		'trial': [],
	},
	
	onValidateSet: function(set, format, setHas, teamHas) {
		let pkmn = toId(set.species);
		let isArceusTier = ()=>{
			if (pkmn === 'arceus') return true;
			if (pkmn === 'xerneas') return true;
			
			if (pkmn === 'rayquaza' && setHas[toId('Dragon Ascent')]) return true;
			if (pkmn === 'rayquazamega') return true;
			
			if (pkmn === 'groudonprimal') return true;
			if (pkmn === 'groudon' && setHas[toId('Red Orb')]) return true;
			
			if (pkmn === 'mewtwomegax') return true;
			if (pkmn === 'mewtwomegay') return true;
			if (pkmn === 'mewtwo' && (setHas[toId('Mewtwonite X')] || setHas[toId('Mewtwonite Y')])) return true;
			return false;
		}
		teamHas['arceusTier'] = (teamHas['arceusTier'] || 0) + (isArceusTier()? 1 : 0);
		
		if (setHas[toId('Extreme Evoboost')] && setHas[toId('Baton Pass')]) {
			teamHas['EEBST + BP'] = (teamHas['EEBST + BP'] || 0) + 1;
		}
		
		return [];
	},
	
	onValidateTeam: function(team, format, teamHas) {
		let problems = [];
		if (teamHas['arceusTier'] > 1) {
			problems.push('You are allowed only 1 "Arceus Tier" mon.');
		}
		// if (teamHas['arceusTier'] && (teamHas['Uber'] || teamHas['OU'] || teamHas['UU'])) {
		// 	problems.push('If you use an "Arceus Tier" TPP mon (see the list of TPP pokemon below), then you can only use un-tiered NFE and LC mons on your team to accompany that Arceus Tier mon.');
		// }
		if (teamHas['arceusTier'] && teamHas[toId('EEBST + BP')]) {
			problems.push('Extreme Evoboost + Baton Pass is banned on Arceus tier teams.');
		}
		return problems;
	},
	/**
	 &BigFatMantis: I want to add two new rules to the meta
[23:29:03] &BigFatMantis: can we implement them?
[23:29:08] ~tustin2121: what are they?
[23:29:15] &BigFatMantis: * Mega Rayquaza is unbanned for Arceus tier teams, meaning it can be used in league play.
[23:29:15] &BigFatMantis: * Extreme Evoboost + Baton Pass is banned on Arceus tier teams.
[23:30:17] ~tustin2121: um, yes, they can be implemented
[23:30:30] &BigFatMantis: I mean the first one is easy
[23:30:33] ~tustin2121: if it was without the arceus team conditions, it would be simple to add the evo rule
[23:30:34] &BigFatMantis: not sure how easy the other one was
[23:30:56] &BigFatMantis: I guess you can do something like
[23:31:04] ~tustin2121: well, ok, what makes an "arceus tier team"?
[23:31:12] &BigFatMantis: if P-Groudon or MegaRay or Xerneas or Arceus etc exit, then no EEBST + BP
[23:31:18] ~tustin2121: or rather, what makes a team arceus tier
[23:31:28] &BigFatMantis: If you use an "Arceus Tier" TPP mon (see the list of TPP pokemon below), then you can only use un-tiered NFE and LC mons on your team to accompany that Arceus Tier mon. As of this post, the only "Arceus Tier" Pokemon are Arceus, Primal Groudon, Mega Rayquaza, Xerneas, and Mega Mewtwo X/Y.
	 */
	
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
	
	// Custom Event sent just after the win messages are sent
	onBattleFinished: function(sideWon) {
		if (this.turn === 0) return; //If this is before a fight even begins, ignore it.
		if (sideWon === this.p2) {
			// Challenger won
			this.send('e4fight', 'advance');
		} else if (sideWon === this.p1) {
			// Challenger lost
			this.send('e4fight', 'restart');
		} else {
			// Draw
			
		}
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
		if (this.turn === 0) return; //If this is before a fight even begins, ignore it.
		if (sideWon === this.p2) {
			// Challenger won
			let team = this.p2.pokemon.map(x => `${x.name}|${x.species}|${x.gender||"N"}${x.set.shiny?"*":""}`).join('[');
			this.send('champion', 'finished');
			this.send('e4fight', ['complete', this.gameType, team]);
		} else if (sideWon === this.p1) {
			// Challenger lost
			this.send('champion', 'finished-lose');
			this.send('e4fight', 'restart');
		} else {
			// Draw
			this.send('champion', 'finished');
		}
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
		if (pokemon.side.pokemonLeft === 0) {
			if (this.p1.snowballs > this.p2.snowballs) {
				this.win(this.p1);
			} else if (this.p2.snowballs > this.p1.snowballs) {
				this.win(this.p2);
			}
		}
	},
});
