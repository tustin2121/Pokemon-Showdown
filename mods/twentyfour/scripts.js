'use strict';

exports.BattleScripts = {
	init: function () {
		// +5 PP to every move
		for (let moveid in this.data.Movedex) {
			let move = this.modData('Movedex', moveid);
			if (move.pp !== 1) move.pp += 5;
		}
	},
	runMegaEvo: function (pokemon) {
		const templateid = pokemon.canMegaEvo || pokemon.canUltraBurst;
		if (!templateid) return false;
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot mega evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		pokemon.formeChange(templateid, pokemon.getItem(), true);

		/*
		// Limit one mega evolution
		let wasMega = pokemon.canMegaEvo;
		for (const ally of side.pokemon) {
			if (wasMega) {
				ally.canMegaEvo = null;
			} else {
				ally.canUltraBurst = null;
			}
		}
		*/
		
		pokemon.canMegaEvo = null;

		this.runEvent('AfterMega', pokemon);
		return true;
	},
};