// This is a list of categories in Showdown's formats file. We include this
// first to override showdown's formats lists, so as to keep the showdown formats 
// properly organized and all that jazz.

exports.Columns = {
	1: { name: "Gen 7", style:'-' },
	2: { name: "Past Gens", style:'-' },
	3: { name: "Other Metas", style:'-' },
	4: { name: "TPP", style:'=' },
	5: { name: "Kappa Cup", style:'+' },
};

exports.Sections = {
	"SM Singles": { column: 1, sort: 1, },
	"SM Doubles": { column: 1, sort: 2, },
	
	"ORAS Singles":			{ column: 2, sort: 1, },
	"ORAS Doubles/Triples":	{ column: 2, sort: 2, },
	"OR/AS Singles":		{ column: 2, sort: 1, },
	"OR/AS Doubles/Triples":{ column: 2, sort: 2, },
	
	"BW2 Singles":		{ column: 2, sort: 5, },
	"BW2 Doubles":		{ column: 2, sort: 6, },
	"B2/W2 Singles":	{ column: 2, sort: 5, },
	"B2/W2 Doubles":	{ column: 2, sort: 6, },
	"Past Gens OU":		{ column: 2, sort: 9, },
	"Past Generations":	{ column: 2, sort: 10, },
	"RoA Spotlight":	{ column: 2, sort: 10, },
	"Randomized Past Gens":	{ column: 2, sort: 11, },
	
	"OM of the Month":	{ column: 3, sort: 1, },
	"Mix and Mega":		{ column: 3, sort: 2, },
	"Randomized Metas":	{ column: 3, sort: 3, },
	"Other Metagames":	{ column: 3, sort: 4, },
	
};
exports.Formats = [];
