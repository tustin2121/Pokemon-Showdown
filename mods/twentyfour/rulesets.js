'use strict';

exports.BattleFormats = {
	pokemon: {
		inherit: true,
		onValidateTeam(team, format) {
			let problems = [];
			// if (team.length > 6) problems.push('Your team has more than six Pok\u00E9mon.');
			// ----------- legality line ------------------------------------------
			if (!format || !this.getRuleTable(format).has('-illegal')) return problems;
			// everything after this line only happens if we're doing legality enforcement
			let kyurems = 0;
			let ndm = 0;
			let ndw = 0;
			for (const set of team) {
				if (set.species === 'Kyurem-White' || set.species === 'Kyurem-Black') {
					if (kyurems > 0) {
						problems.push('You cannot have more than one Kyurem-Black/Kyurem-White.');
						break;
					}
					kyurems++;
				}
				if (set.species === 'Necrozma-Dusk-Mane') {
					if (ndm > 0) {
						problems.push('You cannot have more than one Necrozma-Dusk-Mane.');
						break;
					}
					ndm++;
				}
				if (set.species === 'Necrozma-Dawn-Wings') {
					if (ndw > 0) {
						problems.push('You cannot have more than one Necrozma-Dawn-Wings.');
						break;
					}
					ndw++;
				}
			}
			return problems;
		},
	}
};