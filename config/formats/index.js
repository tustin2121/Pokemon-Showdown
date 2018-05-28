// This is the NEW formats file, which pulls in formats from disparate files
// in this folder and joins them together into a Formats array like showdown
// wants.

// This object will hold all of the formats and make sure no collisions
// happen, so we don't lock up the server entirely in case of a name collision.
let formatList = {};
let sectionList = {};
let columnList = {};

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
	'mixandmega.js',
	'othermetas.js',
	'tpp.js',
	'stpplb.js',
	'kappacup5.js',
];

for (let i = 0; i < sublists.length; i++) {
	console.log(`Loading formats from '${sublists[i]}'...`);
	let info = tryRequire("./"+sublists[i]);
	if (!info) continue;
	
	if (info.Sections) {
		sectionList = Object.assign(sectionList, info.Sections);
	}
	if (info.Columns) {
		columnList = Object.assign(columnList, info.Columns);
	}
	// For each format in the list
	let section = '';
	let column = 1;
	let order = 1;
	for (let f = 0; f < info.Formats.length; f++) {
		let format = info.Formats[f];
		if (!format) continue;
		if (!format.name) {
			if (format.section) {
				section = format.section;
				if (!sectionList[section]) {
					sectionList[section] = {
						column: format.column || 1,
						sort: order,
					};
					if (column == format.column) { order++; }
					else { column = format.column; order = 1; }
				}
			} else {
				console.error(`Format #${f} in file '${sublists[i]}' has no name! Skipping!`);
			}
			continue;
		}
		let id = toId(format.name);
		
		if (format.overrides) {
			let baseformat = formatList[id];
			if (format.overrides === true) {
				if (!baseformat) console.warn(`Format "${format.name}" in file '${sublists[i]}' intends to override an existing format, but one no longer exists.`);
				format.__source = sublists[i];
			} 
			else if (format.overrides === 'ensure') {
				if (baseformat) continue; // If the format exists, ignore this format
				console.log(`Format "${format.name}" has been orphaned from the main list.`);
				format.__source = sublists[i];
			} 
			else if (format.overrides === 'section') {
				if (!baseformat) {
					console.warn(`Format "${format.name}" in file '${sublists[i]}' is overriding the section of a nonexistent format!`);
					continue;
				}
				baseformat.section = format.section;
				baseformat.__sectionSort = format.__sectionSort;
				baseformat.__subsort = format.__subsort;
				// continue;
			} 
			else {
				console.warn(`Format "${format.name}" in file '${sublists[i]}' has unknown "overrides" directive.`);
				format.__source = sublists[i];
			}
		} else if (formatList[id]) {
			console.warn(`Format "${format.name}" in file '${sublists[i]}' is overriding an existing format from file '${formatList[id].__source}'`);
			format.__source = sublists[i];
		}
		formatList[id] = format;
		
		if (format.section && sectionList[format.section]) {
			format.column = sectionList[format.section].column;
			format.__sectionSort = sectionList[format.section].sort;
		} else if (sectionList[section]) {
			format.section = section;
			format.column = sectionList[section].column;
			format.__sectionSort = sectionList[section].sort;
		}
		if (format.column) format.columnName = `${columnList[format.column].name}${columnList[format.column].style}`;
		if (!format.__subsort) format.__subsort = f;
		if (typeof format.__subsort === 'function') {
			let subSortOf = (b)=>{ 
				let a = formatList[toId(b)];
				return (a)? a.__subsort : f;  
			};
			format.__subsort = format.__subsort(subSortOf);
		}
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

// console.log(exports.Formats.map(x=>`FORMAT: ${x.name} | ${x.column} | ${x.__sectionSort} | ${x.__subsort}`).join('\n'));
