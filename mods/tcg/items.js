'use strict';

exports.BattleItems = {
	"snowball": {
		inherit: true,
		onAfterDamage: function (damage, target, source, move) {
			if (move.type === 'Water' && target.useItem()) {
				this.boost({atk: 1});
			}
		},
		desc: "Raises holder's Attack by 1 if hit by a Water-type attack. Single use.",
	},
};
