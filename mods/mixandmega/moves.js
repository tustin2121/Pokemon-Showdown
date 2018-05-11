// https://github.com/urkerab/Pokemon-Showdown/blob/rom.psim.us/mods/mixandmega/moves.js
'use strict';

exports.BattleMovedex = {
	"darkvoid": {
		inherit: true,
		onTryMove: function (pokemon) {
			if (pokemon.template.baseSpecies === 'Darkrai') {
				return;
			}
			this.add('-hint', "Only a Pokemon whose form is Darkrai can use this move.");
			this.add('-fail', pokemon, 'move: Dark Void'); // TODO: client-side
			return null;
		},
	},
};