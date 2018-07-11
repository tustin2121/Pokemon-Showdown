'use strict';

exports.BattleItems = {
	"airballoon": {
		id: "airballoon",
		name: "Air Balloon",
		spritenum: 6,
		fling: {
			basePower: 10,
		},
		onStart: function (target) {
			if (!target.ignoringItem() && !this.getPseudoWeather('gravity')) {
				this.add('-item', target, 'Air Balloon');
			}
		},
		// airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
		onAfterDamage: function (damage, target, source, effect) {
			this.debug('effect: ' + effect.id);
			if (effect.effectType === 'Move' && effect.id !== 'confused') {
				this.add('-enditem', target, 'Air Balloon');
				target.item = '';
				this.itemData = {id: '', target: this};
				this.runEvent('AfterUseItem', target, null, null, 'airballoon');
			}
		},
		onAfterSubDamage: function (damage, target, source, effect) {
			this.debug('effect: ' + effect.id);
			if (effect.effectType === 'Move' && effect.id !== 'confused') {
				this.add('-enditem', target, 'Air Balloon');
				target.item = '';
				this.itemData = {id: '', target: this};
				this.runEvent('AfterUseItem', target, null, null, 'airballoon');
			}
		},
		num: 541,
		gen: 5,
		desc: "Holder is immune to Fighting-type attacks. Pops when holder is hit.",
	},
	"blacksludge": {
		id: "blacksludge",
		name: "Black Sludge",
		spritenum: 34,
		fling: {
			basePower: 30,
		},
		onResidualOrder: 5,
		onResidualSubOrder: 2,
		onResidual: function (pokemon) {
			if (this.isTerrain('grassyterrain')) return;
			if (pokemon.hasType('Psychic')) {
				this.heal(pokemon.maxhp / 16);
			} else {
				this.damage(pokemon.maxhp / 8);
			}
		},
		onTerrain: function (pokemon) {
			if (!this.isTerrain('grassyterrain')) return;
			if (pokemon.hasType('Psychic')) {
				this.heal(pokemon.maxhp / 16);
			} else {
				this.damage(pokemon.maxhp / 8);
			}
		},
		num: 281,
		gen: 4,
		desc: "Each turn, if holder is a Psychic type, restores 1/16 max HP; loses 1/8 if not.",
	},
	"bugmemory": {
		id: "bugmemory",
		name: "Bug Memory",
		spritenum: 673,
		onMemory: 'Grass',
		onTakeItem: function (item, pokemon, source) {
			if ((source && source.baseTemplate.num === 773) || pokemon.baseTemplate.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Bug",
		num: 909,
		gen: 7,
		desc: "Holder's Multi-Attack is Grass type.",
	},
	"chilldrive": {
		id: "chilldrive",
		name: "Chill Drive",
		spritenum: 67,
		onTakeItem: function (item, pokemon, source) {
			if ((source && source.baseTemplate.num === 649) || pokemon.baseTemplate.num === 649) {
				return false;
			}
			return true;
		},
		onDrive: 'Water',
		forcedForme: "Genesect-Chill",
		num: 119,
		gen: 5,
		desc: "Holder's Techno Blast is Water type.",
	},
	"flyingmemory": {
		id: "flyingmemory",
		name: "Flying Memory",
		spritenum: 669,
		onMemory: 'Normal',
		onTakeItem: function (item, pokemon, source) {
			if ((source && source.baseTemplate.num === 773) || pokemon.baseTemplate.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Flying",
		num: 905,
		gen: 7,
		desc: "Holder's Multi-Attack is Normal type.",
	},
	"ghostmemory": {
		id: "ghostmemory",
		name: "Ghost Memory",
		spritenum: 674,
		onMemory: 'Psychic',
		onTakeItem: function (item, pokemon, source) {
			if ((source && source.baseTemplate.num === 773) || pokemon.baseTemplate.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Ghost",
		num: 910,
		gen: 7,
		desc: "Holder's Multi-Attack is Psychic type.",
	},
	"griseousorb": {
		id: "griseousorb",
		name: "Griseous Orb",
		spritenum: 180,
		fling: {
			basePower: 60,
		},
		onBasePowerPriority: 6,
		onBasePower: function (basePower, user, target, move) {
			if (user.baseTemplate.num === 487 && (move.type === 'Psychic' || move.type === 'Dragon')) {
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onTakeItem: function (item, pokemon, source) {
			if ((source && source.baseTemplate.num === 487) || pokemon.baseTemplate.num === 487) {
				return false;
			}
			return true;
		},
		forcedForme: "Giratina-Origin",
		num: 112,
		gen: 4,
		desc: "If held by a Giratina, its Psychic- and Dragon-type attacks have 1.2x power.",
	},
	"groundmemory": {
		id: "groundmemory",
		name: "Ground Memory",
		spritenum: 671,
		onMemory: 'Fighting',
		onTakeItem: function (item, pokemon, source) {
			if ((source && source.baseTemplate.num === 773) || pokemon.baseTemplate.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Ground",
		num: 907,
		gen: 7,
		desc: "Holder's Multi-Attack is Fighting type.",
	},
	"icememory": {
		id: "icememory",
		name: "Ice Memory",
		spritenum: 681,
		onMemory: 'Water',
		onTakeItem: function (item, pokemon, source) {
			if ((source && source.baseTemplate.num === 773) || pokemon.baseTemplate.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Ice",
		num: 917,
		gen: 7,
		desc: "Holder's Multi-Attack is Water type.",
	},
	"ironball": {
		id: "ironball",
		name: "Iron Ball",
		spritenum: 224,
		fling: {
			basePower: 130,
		},
		onEffectiveness: function (typeMod, target, type, move) {
			// @ts-ignore
			if (target.volatiles['ingrain'] || target.volatiles['smackdown'] || this.getPseudoWeather('gravity')) return;
			// @ts-ignore
			if (move.type === 'Fighting' && target.hasType('Normal')) return 0;
		},
		// airborneness negation implemented in sim/pokemon.js:Pokemon#isGrounded
		onModifySpe: function (spe) {
			return this.chainModify(0.5);
		},
		num: 278,
		gen: 4,
		desc: "Holder is grounded, Speed halved. If Normal type, takes neutral Fighting damage.",
	},
	"poisonmemory": {
		id: "poisonmemory",
		name: "Poison Memory",
		spritenum: 670,
		onMemory: 'Psychic',
		onTakeItem: function (item, pokemon, source) {
			if ((source && source.baseTemplate.num === 773) || pokemon.baseTemplate.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Poison",
		num: 906,
		gen: 7,
		desc: "Holder's Multi-Attack is Psychic type.",
	},
	"rockmemory": {
		id: "rockmemory",
		name: "Rock Memory",
		spritenum: 672,
		onMemory: 'Fighting',
		onTakeItem: function (item, pokemon, source) {
			if ((source && source.baseTemplate.num === 773) || pokemon.baseTemplate.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Rock",
		num: 908,
		gen: 7,
		desc: "Holder's Multi-Attack is Fighting type.",
	},
	"snowball": {
		id: "snowball",
		name: "Snowball",
		spritenum: 606,
		fling: {
			basePower: 30,
		},
		onAfterDamage: function (damage, target, source, move) {
			if (move.type === 'Water' && target.useItem()) {
				this.boost({atk: 1});
			}
		},
		num: 649,
		gen: 6,
		desc: "Raises holder's Attack by 1 if hit by an Water-type attack. Single use.",
	},
};
