'use strict';

exports.BattleTypeChart = {
	"Dark": {
		damageTaken: {
			"Dark": 2,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 1,
			"Fighting": 1,
			"Fire": 0,
			"Grass": 0,
			"Normal": 0,
			"Psychic": 3,
			"Steel": 0,
			"Water": 0,
		},
		HPivs: {}
	},
	"Dragon": {
		damageTaken: {
			"Dark": 0,
			"Dragon": 1,
			"Electric": 2,
			"Fairy": 1,
			"Fighting": 0,
			"Fire": 2,
			"Grass": 2,
			"Normal": 0,
			"Psychic": 0,
			"Steel": 0,
			"Water": 2,
		},
		HPivs: {"atk":30}
	},
	"Electric": {
		damageTaken: {
			par: 3,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 2,
			"Fairy": 0,
			"Fighting": 0,
			"Fire": 0,
			"Grass": 0,
			"Normal": 0,
			"Psychic": 0,
			"Steel": 2,
			"Water": 0,
		},
		HPivs: {"spa":30}
	},
	"Fairy": {
		damageTaken: {
			"Dark": 2,
			"Dragon": 3,
			"Electric": 0,
			"Fairy": 0,
			"Fighting": 2,
			"Fire": 0,
			"Grass": 0,
			"Normal": 0,
			"Psychic": 0,
			"Steel": 1,
			"Water": 0,
		}
	},
	"Fighting": {
		damageTaken: {
			sandstorm: 3,
			"Dark": 2,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 1,
			"Fighting": 0,
			"Fire": 0,
			"Grass": 0,
			"Normal": 0,
			"Psychic": 1,
			"Steel": 0,
			"Water": 0,
		},
		HPivs: {"def":30, "spa":30, "spd":30, "spe":30}
	},
	"Fire": {
		damageTaken: {
			brn: 3,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 2,
			"Fighting": 0,
			"Fire": 2,
			"Grass": 2,
			"Normal": 0,
			"Psychic": 0,
			"Steel": 2,
			"Water": 1,
		},
		HPivs: {"atk":30, "spa":30, "spe":30}
	},
	"Grass": {
		damageTaken: {
			powder: 3,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 2,
			"Fairy": 0,
			"Fighting": 0,
			"Fire": 1,
			"Grass": 2,
			"Normal": 0,
			"Psychic": 0,
			"Steel": 0,
			"Water": 2,
		},
		HPivs: {"atk":30, "spa":30}
	},
	"Normal": {
		damageTaken: {
			"Dark": 0,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 0,
			"Fighting": 1,
			"Fire": 0,
			"Grass": 0,
			"Normal": 0,
			"Psychic": 0,
			"Steel": 0,
			"Water": 0,
		}
	},
	"Psychic": {
		damageTaken: {
			psn: 3,
			tox: 3,
			trapped: 3,
			"Dark": 1,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 0,
			"Fighting": 2,
			"Fire": 0,
			"Grass": 0,
			"Normal": 0,
			"Psychic": 2,
			"Steel": 0,
			"Water": 0,
		},
		HPivs: {"atk":30, "spe":30}
	},
	"Steel": {
		damageTaken: {
			psn: 3,
			tox: 3,
			sandstorm: 3,
			"Dark": 0,
			"Dragon": 2,
			"Electric": 0,
			"Fairy": 2,
			"Fighting": 1,
			"Fire": 1,
			"Grass": 2,
			"Normal": 2,
			"Psychic": 2,
			"Steel": 2,
			"Water": 0,
		},
		HPivs: {"spd":30}
	},
	"Water": {
		damageTaken: {
			frz: 3,
			hail: 3,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 1,
			"Fairy": 0,
			"Fighting": 0,
			"Fire": 2,
			"Grass": 1,
			"Normal": 0,
			"Psychic": 0,
			"Steel": 2,
			"Water": 2,
		},
		HPivs: {"atk":30, "def":30, "spa":30}
	}
};
