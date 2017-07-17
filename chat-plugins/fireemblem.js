/**
 * Fire Emblem Room Commands
 * TPP League - https://tppleague.me/
 *
 * These are informational commands for Fire Emblem Heroes. 
 *
 * For the API, see chat-plugins/COMMANDS.md
 *
 */

'use strict';

const path = require('path');

exports.commands = {

	'!fcalc': true,
	fcalculator: 'fcalc',
	fsim: 'fcacl',
	fsimulator: 'fcalc',
	fbattlesimulator: 'fcalc',
	fbattlesim: 'fcalc',
	fcalc: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (room.id !== 'fireemblem') return this.errorReply("This command can only be used in the Fire Emblem room.");
		this.sendReplyBox(
			"Fire Emblem Heroes Battle Simulator. (Courtesy of Winsomniak and rocketMo)<br />" +
			"- <a href=\"https://kagerochart.com/damage-calc\">Battle Simulator</a>"
		);
	},
	fcalchelp: ["/fcalc - Provides a link to a mass duel simulator",
		"!fcalc - Shows everyone a link to a battle simulator. Requires: + % @ * # & ~"],

	'!ftier': true,
	ftierlist: 'ftier',
	ftier: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (room.id !== 'fireemblem') return this.errorReply("This command can only be used in the Fire Emblem room.");
		this.sendReplyBox(
			"Fire Emblem Heroes Tier Lists:<br />" +
			"- <a href=\"https://feheroes.gamepedia.com/Tier_List\">Pre-Inheritance Tier List</a><br />" +
			"- <a href=\"https://feheroes.gamepedia.com/Inheritance_Tier_List\">Inheritance Tier List</a>"
		);
	},
	ftierhelp: ["/ftier - Provides links to FEH tier lists.",
		"!ftier - Shows everyone links to FEH tier lists. Requires: + % @ * # & ~"],

	'!fstats': true,
	fstats: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (room.id !== 'fireemblem') return this.errorReply("This command can only be used in the Fire Emblem room.");
		this.sendReplyBox(
			"FEH Hero Stat Chart:<br />" +
			"- <a href=\"http://feheroes.gamepedia.com/Stats_Table\">5* Neutral Max Stats</a>"
		);
	},
	fstatshelp: ["/fstats - Provides a link to FEH max stat chart.",
		"!fstats - Shows everyone a link to FEH max stat chart. Requires: + % @ * # & ~"],

	'!fskills': true,
	fbaseskills: 'fskills',
	fskills4: 'fskills',
	f4skills: 'fskills',
	fskills: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (room.id !== 'fireemblem') return this.errorReply("This command can only be used in the Fire Emblem room.");
		this.sendReplyBox(
			"FEH Hero Skill Charts:<br />" +
			"- <a href=\"http://feheroes.gamepedia.com/Skills_Table\">Hero Base Skills Chart</a><br />" +
			"- <a href=\"http://feheroes.gamepedia.com/Skill_Chains_4_Stars_List\">4* Skill Availability Chart</a>"
		);
	},
	fskillshelp: ["/fskills - Provides a link to FEH skill charts.",
		"!fskills - Shows everyone a link to FEH skill charts. Requires: + % @ * # & ~"],	

};
