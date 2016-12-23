"use strict";

exports.BattleStatuses = {
	totemaura: {
		// this is a volatile status
		onStart: function (target, source, sourceEffect) {
			// this.add('message', `Totem ${target.name}'s aura flared to life!`);
			this.add('-start', target, 'Totem Aura'); //Totem ${target.name}'s aura flared to life!
			
			let boosts = target.totemboost;
			if (!boosts) boosts = {def:1};
			this.boost(boosts);
		},
		
		onTrapPokemonPriority: -100, //run after all other effects
		onTrapPokemon: function (pokemon) {
			// Totem pokemon cannot switch out
			pokemon.trapped = true;
		},
		
		onFaint: function(pokemon) {
			let side = pokemon.side;
			// Manaully faint all inactive pokemon on the Totem player's side
			side.pokemon.forEach(p=>{
				if (side.active.includes(p)) return; //skip active pokemon
				if (p.fainted || !p.hp) return; //skip pokemon already fainted
				p.hp = 0;
				p.fainted = true;
				p.isActive = false;
				p.isStarted = false;
				side.pokemonLeft--;
			});
			// The faint messages and all the rest should be handled by the already-running faintMessages fn
		},
	},
};