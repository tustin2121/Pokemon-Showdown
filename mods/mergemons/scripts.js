'use strict';

exports.BattleScripts = {
	init: function () {
		let learnsets = Object.assign({}, this.data.Learnsets);
		let dex = [];
		for (let i in this.data.Pokedex) {
			if (this.data.Pokedex[i].num <= 0) continue;
			if (this.data.Pokedex[i].num >= 9000) continue;
			if (this.data.Pokedex[i].evos) continue;
			if (this.data.Pokedex[i].baseSpecies && this.data.Pokedex[i].forme !== 'Alola') continue;
			if (!learnsets[i]) continue;
			if (this.data.FormatsData[i].isUnreleased) continue;
			if (this.data.FormatsData[i].tier && this.data.FormatsData[i].tier === 'Illegal') continue;
			
			// if (this.data.FormatsData[i].doublesTier) {
				// if (this.data.FormatsData[i].doublesTier === 'DUber') continue;
			// }
			// else if (this.data.FormatsData[i].tier) {
			// 	if (this.data.FormatsData[i].tier === 'Uber') continue;
			// }
			dex.push(i);
		}
		for (let i = 0; i < dex.length; i++) {
			let pokemon = dex[i];
			if (this.data.FormatsData[pokemon].doublesTier) {
				if (this.data.FormatsData[pokemon].doublesTier === 'DUber') continue;
			}
			while (this.data.Pokedex[pokemon].prevo) {
				pokemon = this.data.Pokedex[pokemon].prevo;
			}
			if (i === 0) console.log('-----', pokemon);
			let target = dex[(i === 0 ? dex.length - 1 : i - 1)];
			if (i === 0) console.log('++', target);
			let merge = false;
			do {
				let learnset = learnsets[target].learnset;
				for (let move in learnset) {
					if (move === 'shellsmash') continue; //shellsmash ban
					let source = learnset[move][0].charAt(0) + 'L0';
					if (!(move in learnsets[pokemon].learnset)) this.modData('Learnsets', pokemon).learnset[move] = [source];
				}
				if (this.data.Pokedex[target].prevo) {
					target = this.data.Pokedex[target].prevo;
				} else if (!merge) {
					merge = true;
					target = dex[(i === dex.length - 1 ? 0 : i + 1)];
				} else {
					target = null;
				}
				if (i === 0) console.log('++', target);
			} while (target && learnsets[target]);
		}
	},
};