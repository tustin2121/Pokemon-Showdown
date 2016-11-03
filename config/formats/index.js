// This is the NEW formats file, which pulls in formats from disparate files
// in this folder and joins them together into a Formats array like showdown
// wants.

// This object will hold all of the formats and make sure no collisions
// happen, so we don't lock up the server entirely in case of a name collision.
let formatList = {};
let sectionList = {};

if (!global.toId) {
	// Copied from Tools.getId, which isn't defined yet when this is first included
	global.toId = function (text) {
		if (text && text.id) {
			text = text.id;
		} else if (text && text.userid) {
			text = text.userid;
		}
		if (typeof text !== 'string' && typeof text !== 'number') return '';
		return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
	};
}

function tryRequire(filePath) {
	try {
		let ret = require(filePath);
		if (!ret) console.error(`Required formats file '${filePath}' is empty!`);
		if (!ret.Formats || !Array.isArray(ret.Formats)){
			console.error(`Required formats file '${filePath}' provides no formats array!`);
			return null;
		} 
		return ret;
	} catch (e) {
		if (e.code !== 'MODULE_NOT_FOUND') throw e;
		console.error(`Required formats file '${filePath}' does not exist!`);
		return null;
	}
}

// Note: Order is important: items lower in the list override higher items
let sublists = [
	'showdowncats.js',
	'../formats.js', //Showdown's format list
	'othermetas.js',
	'tpp.js',
	'stpplb.js',
	'kappacup3.js',
];

for (let i = 0; i < sublists.length; i++) {
	console.log(`Loading formats from '${sublists[i]}'...`);
	let info = tryRequire("./"+sublists[i]);
	if (!info) continue;
	
	if (info.Sections) {
		sectionList = Object.assign(sectionList, info.Sections);
	}
	// For each format in the list
	for (let f = 0; f < info.Formats.length; f++) {
		let format = info.Formats[f];
		if (!format) continue;
		if (!format.name) {
			console.error(`Format #${f} in file '${sublists[i]}' has no name! Skipping!`);
			continue;
		}
		let id = toId(format.name);
		if (formatList[id]) {
			console.warn(`Format "${format.name}" in file '${sublists[i]}' is overriding an existing format from file '${formatList[id].__source}'`);
		}
		formatList[id] = format;
		format.__source = sublists[i];
		if (format.section && sectionList[format.section]) {
			format.column = sectionList[format.section].column;
			format.__sectionSort = sectionList[format.section].sort;
		}
		if (!format.__subsort) format.__subsort = f;
		if (typeof format.__subsort === 'function') format.__subsort = format.__subsort(formatList);
	}
}

// Finally, showdown expects these to be in an array, so let's build that 
// now that we have everything we need.
exports.Formats = Object.keys(formatList)
	.map(id => formatList[id])
	.sort((a, b)=>{
		let comp = a.column - b.column;
		if (comp === 0) comp = a.__sectionSort - b.__sectionSort;
		if (comp === 0) comp = a.__subsort - b.__subsort;
		return comp;
	});