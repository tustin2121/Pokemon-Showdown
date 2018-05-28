'use strict';

exports.BattleAbilities = {
	trace: {
		inherit: true,
		onUpdate: function(pokemon) {
			if (!pokemon.isStarted) return;
			let possibleTargets = pokemon.side.foe.active.filter(foeActive => foeActive && !foeActive.fainted && this.isAdjacent(pokemon, foeActive));
			let possibleInnates = [];
			for (let target of possibleTargets) {
				possibleInnates.push(...target.innates.filter(x=>x.startsWith('ability:')).map(x=>({ ability: x.slice(8), target })));
				possibleInnates.push({ ability:target.ability, target });
			}
			const bannedAbilities = ['battlebond', 'comatose', 'disguise', 'flowergift', 'forecast', 'illusion', 'imposter', 'multitype', 'powerconstruct', 'powerofalchemy', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'zenmode'];
			while (possibleInnates.length) {
				let rand = 0;
				if (possibleInnates.length > 1) rand = this.random(possibleInnates.length);
				let sel = possibleInnates[rand];
				if (bannedAbilities.includes(sel.ability)) {
					possibleInnates.splice(rand, 1);
					continue;
				}
				let ability = this.getAbility(sel.ability);
				this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + sel.target);
				if (pokemon.ability === 'trace') {
					pokemon.setAbility(ability);
				} else {
					pokemon.removeVolatile('ability:trace', pokemon);
					pokemon.addVolatile('ability:'+sel.ability, pokemon);
				}
				return;
			}
		}
	},
};