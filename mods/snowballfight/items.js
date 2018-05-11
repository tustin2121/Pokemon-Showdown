"use strict";

exports.BattleItems = {
	"snowball": {
		inherit: true,
		fling: {
			basePower: 30,
			effect: function(target, source, move) { // turns into move.onHit when flung
				let scores = true;
				if (target.volatiles['substitute'] && target.volatiles['substitute'].hp > 0 && source.ability !== 'infiltrator') {
					scores = false;
				}
				if (scores) {
					source.side.snowballs++;
					this.add('message', "Ding! " + source.side.name + " scored a point!");
					this.add('-message', 'Total Score: ' + source.side.name + ': ' + source.side.snowballs + ', ' + target.side.name + ': ' + target.side.snowballs);
				}
			},
		},
	},
};