// This is a list of categories in Showdown's formats file. We include this
// first to override showdown's formats lists, so as to keep the showdown formats 
// properly organized and all that jazz.

exports.Columns = {
	1: { name: "Gen 7", style:'+' },
	2: { name: "Gen 6", style:'+' },
	3: { name: "Past Gens", style:'-' },
	4: { name: "Other Metas", style:'-' },
	5: { name: "TPP", style:'=' },
	6: { name: "Kappa Cup", style:'+' },
};

exports.Sections = {
	"SM Singles": { column: 1, sort: 1, },
	"SM Doubles": { column: 1, sort: 2, },
	
	"ORAS Singles":			{ column: 2, sort: 1, },
	"ORAS Doubles/Triples":	{ column: 2, sort: 1, },
	
	"BW2 Singles":		{ column: 3, sort: 5, },
	"BW2 Doubles":		{ column: 3, sort: 6, },
	"Past Generations":	{ column: 3, sort: 10, },
	
	"OM of the Month":	{ column: 4, sort: 1, },
	"Other Metagames":	{ column: 4, sort: 2, },
	"Randomized Metas":	{ column: 4, sort: 3, },
	
};
exports.Formats = [];
