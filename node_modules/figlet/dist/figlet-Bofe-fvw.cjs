//#region src/figlet-types.ts
var LAYOUT = {
	FULL_WIDTH: 0,
	FITTING: 1,
	SMUSHING: 2,
	CONTROLLED_SMUSHING: 3
};
var FigletFont = class {
	constructor() {
		this.comment = "";
		this.numChars = 0;
		this.options = {};
	}
};
//#endregion
//#region src/font-list.ts
var fontList = [
	"1Row",
	"3-D",
	"3D Diagonal",
	"3D-ASCII",
	"3x5",
	"4Max",
	"5 Line Oblique",
	"AMC 3 Line",
	"AMC 3 Liv1",
	"AMC AAA01",
	"AMC Neko",
	"AMC Razor",
	"AMC Razor2",
	"AMC Slash",
	"AMC Slider",
	"AMC Thin",
	"AMC Tubes",
	"AMC Untitled",
	"ANSI Compact",
	"ANSI Regular",
	"ANSI Shadow",
	"ASCII 12",
	"ASCII 9",
	"ASCII New Roman",
	"Acrobatic",
	"Alligator",
	"Alligator2",
	"Alpha",
	"Alphabet",
	"Arrows",
	"Avatar",
	"B1FF",
	"Babyface Lame",
	"Babyface Leet",
	"Banner",
	"Banner3-D",
	"Banner3",
	"Banner4",
	"Barbwire",
	"Basic",
	"Bear",
	"Bell",
	"Benjamin",
	"Big ASCII 12",
	"Big ASCII 9",
	"Big Chief",
	"Big Money-ne",
	"Big Money-nw",
	"Big Money-se",
	"Big Money-sw",
	"Big Mono 12",
	"Big Mono 9",
	"Big",
	"Bigfig",
	"Binary",
	"Block",
	"Blocks",
	"Bloody",
	"BlurVision ASCII",
	"Bolger",
	"Braced",
	"Bright",
	"Broadway KB",
	"Broadway",
	"Bubble",
	"Bulbhead",
	"Caligraphy",
	"Caligraphy2",
	"Calvin S",
	"Cards",
	"Catwalk",
	"Chiseled",
	"Chunky",
	"Circle",
	"Classy",
	"Coder Mini",
	"Coinstak",
	"Cola",
	"Colossal",
	"Computer",
	"Contessa",
	"Contrast",
	"Cosmike",
	"Cosmike2",
	"Crawford",
	"Crawford2",
	"Crazy",
	"Cricket",
	"Cursive",
	"Cyberlarge",
	"Cybermedium",
	"Cybersmall",
	"Cygnet",
	"DANC4",
	"DOS Rebel",
	"DWhistled",
	"Dancing Font",
	"Decimal",
	"Def Leppard",
	"Delta Corps Priest 1",
	"DiamFont",
	"Diamond",
	"Diet Cola",
	"Digital",
	"Doh",
	"Doom",
	"Dot Matrix",
	"Double Shorts",
	"Double",
	"Dr Pepper",
	"Efti Chess",
	"Efti Font",
	"Efti Italic",
	"Efti Piti",
	"Efti Robot",
	"Efti Wall",
	"Efti Water",
	"Electronic",
	"Elite",
	"Emboss 2",
	"Emboss",
	"Epic",
	"Fender",
	"Filter",
	"Fire Font-k",
	"Fire Font-s",
	"Flipped",
	"Flower Power",
	"Font Font",
	"Four Tops",
	"Fraktur",
	"Fun Face",
	"Fun Faces",
	"Future Smooth",
	"Future Thin",
	"Future",
	"Fuzzy",
	"Georgi16",
	"Georgia11",
	"Ghost",
	"Ghoulish",
	"Glenyn",
	"Goofy",
	"Gothic",
	"Graceful",
	"Gradient",
	"Graffiti",
	"Greek",
	"Heart Left",
	"Heart Right",
	"Henry 3D",
	"Hex",
	"Hieroglyphs",
	"Hollywood",
	"Horizontal Left",
	"Horizontal Right",
	"ICL-1900",
	"Impossible",
	"Invita",
	"Isometric1",
	"Isometric2",
	"Isometric3",
	"Isometric4",
	"Italic",
	"Ivrit",
	"JS Block Letters",
	"JS Bracket Letters",
	"JS Capital Curves",
	"JS Cursive",
	"JS Stick Letters",
	"Jacky",
	"Jazmine",
	"Jerusalem",
	"Katakana",
	"Kban",
	"Keyboard",
	"Knob",
	"Konto Slant",
	"Konto",
	"LCD",
	"Larry 3D 2",
	"Larry 3D",
	"Lean",
	"Letter",
	"Letters",
	"Lil Devil",
	"Line Blocks",
	"Linux",
	"Lockergnome",
	"Madrid",
	"Marquee",
	"Maxfour",
	"Merlin1",
	"Merlin2",
	"Mike",
	"Mini",
	"Mirror",
	"Mnemonic",
	"Modular",
	"Mono 12",
	"Mono 9",
	"Morse",
	"Morse2",
	"Moscow",
	"Mshebrew210",
	"Muzzle",
	"NScript",
	"NT Greek",
	"NV Script",
	"Nancyj-Fancy",
	"Nancyj-Improved",
	"Nancyj-Underlined",
	"Nancyj",
	"Nipples",
	"O8",
	"OS2",
	"Octal",
	"Ogre",
	"Old Banner",
	"Pagga",
	"Patorjk's Cheese",
	"Patorjk-HeX",
	"Pawp",
	"Peaks Slant",
	"Peaks",
	"Pebbles",
	"Pepper",
	"Poison",
	"Puffy",
	"Puzzle",
	"Pyramid",
	"Rammstein",
	"Rebel",
	"Rectangles",
	"Red Phoenix",
	"Relief",
	"Relief2",
	"Reverse",
	"Roman",
	"Rot13",
	"Rotated",
	"Rounded",
	"Rowan Cap",
	"Rozzo",
	"RubiFont",
	"Runic",
	"Runyc",
	"S Blood",
	"SL Script",
	"Santa Clara",
	"Script",
	"Serifcap",
	"Shaded Blocky",
	"Shadow",
	"Shimrod",
	"Short",
	"Slant Relief",
	"Slant",
	"Slide",
	"Small ASCII 12",
	"Small ASCII 9",
	"Small Block",
	"Small Braille",
	"Small Caps",
	"Small Isometric1",
	"Small Keyboard",
	"Small Mono 12",
	"Small Mono 9",
	"Small Poison",
	"Small Script",
	"Small Shadow",
	"Small Slant",
	"Small Tengwar",
	"Small",
	"Soft",
	"Speed",
	"Spliff",
	"Stacey",
	"Stampate",
	"Stampatello",
	"Standard",
	"Star Strips",
	"Star Wars",
	"Stellar",
	"Stforek",
	"Stick Letters",
	"Stop",
	"Straight",
	"Stronger Than All",
	"Sub-Zero",
	"Swamp Land",
	"Swan",
	"Sweet",
	"THIS",
	"Tanja",
	"Tengwar",
	"Term",
	"Terrace",
	"Test1",
	"The Edge",
	"Thick",
	"Thin",
	"Thorned",
	"Three Point",
	"Ticks Slant",
	"Ticks",
	"Tiles",
	"Tinker-Toy",
	"Tmplr",
	"Tombstone",
	"Train",
	"Trek",
	"Tsalagi",
	"Tubular",
	"Twisted",
	"Two Point",
	"USA Flag",
	"Univers",
	"Upside Down Text",
	"Varsity",
	"Wavescape",
	"Wavy",
	"Weird",
	"Wet Letter",
	"Whimsy",
	"WideTerm",
	"Wow",
	"miniwi"
];
//#endregion
//#region src/renamed-fonts.js
var renamedFonts = { "ANSI-Compact": "ANSI Compact" };
var getFontName = (name) => {
	return renamedFonts[name] ? renamedFonts[name] : name;
};
//#endregion
//#region src/figlet.ts
function escapeRegExpChar(char) {
	return /[.*+?^${}()|[\]\\]/.test(char) ? "\\" + char : char;
}
var figlet = (() => {
	const { FULL_WIDTH = 0, FITTING, SMUSHING, CONTROLLED_SMUSHING } = LAYOUT;
	const figFonts = {};
	const figDefaults = {
		font: "Standard",
		fontPath: "./fonts",
		fetchFontIfMissing: true
	};
	/**
	* Figures out the end char for a FIGlet line and removes it. Technically there aren't supposed to be white spaces
	* after the end char, but certain TOIlet fonts have this. The FIGlet unix app handles this though so we handle it
	* here too.
	*
	* @param line
	* @param lineNum
	* @param fontHeight
	*/
	function removeEndChar(line, lineNum, fontHeight) {
		const endChar = escapeRegExpChar(line.trim().slice(-1)) || "@";
		const endCharRegEx = lineNum === fontHeight - 1 ? new RegExp(endChar + endChar + "?\\s*$") : new RegExp(endChar + "\\s*$");
		return line.replace(endCharRegEx, "");
	}
	/**
	*  This method takes in the oldLayout and newLayout data from the FIGfont header file and returns
	*  the layout information.
	*
	*/
	function getSmushingRules(oldLayout = -1, newLayout = null) {
		let rules = {};
		let val;
		let codes = [
			[
				16384,
				"vLayout",
				SMUSHING
			],
			[
				8192,
				"vLayout",
				FITTING
			],
			[
				4096,
				"vRule5",
				true
			],
			[
				2048,
				"vRule4",
				true
			],
			[
				1024,
				"vRule3",
				true
			],
			[
				512,
				"vRule2",
				true
			],
			[
				256,
				"vRule1",
				true
			],
			[
				128,
				"hLayout",
				SMUSHING
			],
			[
				64,
				"hLayout",
				FITTING
			],
			[
				32,
				"hRule6",
				true
			],
			[
				16,
				"hRule5",
				true
			],
			[
				8,
				"hRule4",
				true
			],
			[
				4,
				"hRule3",
				true
			],
			[
				2,
				"hRule2",
				true
			],
			[
				1,
				"hRule1",
				true
			]
		];
		val = newLayout !== null ? newLayout : oldLayout;
		for (const [code, rule, value] of codes) if (val >= code) {
			val -= code;
			if (rules[rule] === void 0) rules[rule] = value;
		} else if (rule !== "vLayout" && rule !== "hLayout") rules[rule] = false;
		if (typeof rules["hLayout"] === "undefined") if (oldLayout === 0) rules["hLayout"] = FITTING;
		else if (oldLayout === -1) rules["hLayout"] = FULL_WIDTH;
		else if (rules["hRule1"] || rules["hRule2"] || rules["hRule3"] || rules["hRule4"] || rules["hRule5"] || rules["hRule6"]) rules["hLayout"] = CONTROLLED_SMUSHING;
		else rules["hLayout"] = SMUSHING;
		else if (rules["hLayout"] === SMUSHING) {
			if (rules["hRule1"] || rules["hRule2"] || rules["hRule3"] || rules["hRule4"] || rules["hRule5"] || rules["hRule6"]) rules["hLayout"] = CONTROLLED_SMUSHING;
		}
		if (typeof rules["vLayout"] === "undefined") if (rules["vRule1"] || rules["vRule2"] || rules["vRule3"] || rules["vRule4"] || rules["vRule5"]) rules["vLayout"] = CONTROLLED_SMUSHING;
		else rules["vLayout"] = FULL_WIDTH;
		else if (rules["vLayout"] === SMUSHING) {
			if (rules["vRule1"] || rules["vRule2"] || rules["vRule3"] || rules["vRule4"] || rules["vRule5"]) rules["vLayout"] = CONTROLLED_SMUSHING;
		}
		return rules;
	}
	/**
	*  Rule 1: EQUAL CHARACTER SMUSHING (code value 1)
	*
	*    Two sub-characters are smushed into a single sub-character
	*    if they are the same.  This rule does not smush
	*    hardblanks.  (See rule 6 on hardblanks below)
	*/
	function hRule1_Smush(ch1, ch2, hardBlank = "") {
		if (ch1 === ch2 && ch1 !== hardBlank) return ch1;
		return false;
	}
	/**
	*  Rule 2: UNDERSCORE SMUSHING (code value 2)
	*
	*    An underscore ("_") will be replaced by any of: "|", "/",
	*    "\", "[", "]", "{", "}", "(", ")", "<" or ">".
	*/
	function hRule2_Smush(ch1, ch2) {
		let rule2Str = "|/\\[]{}()<>";
		if (ch1 === "_") {
			if (rule2Str.indexOf(ch2) !== -1) return ch2;
		} else if (ch2 === "_") {
			if (rule2Str.indexOf(ch1) !== -1) return ch1;
		}
		return false;
	}
	/**
	*  Rule 3: HIERARCHY SMUSHING (code value 4)
	*
	*    A hierarchy of six classes is used: "|", "/\", "[]", "{}",
	*    "()", and "<>".  When two smushing sub-characters are
	*    from different classes, the one from the latter class
	*    will be used.
	*/
	function hRule3_Smush(ch1, ch2) {
		let rule3Classes = "| /\\ [] {} () <>";
		let r3_pos1 = rule3Classes.indexOf(ch1);
		let r3_pos2 = rule3Classes.indexOf(ch2);
		if (r3_pos1 !== -1 && r3_pos2 !== -1) {
			if (r3_pos1 !== r3_pos2 && Math.abs(r3_pos1 - r3_pos2) !== 1) {
				const startPos = Math.max(r3_pos1, r3_pos2);
				const endPos = startPos + 1;
				return rule3Classes.substring(startPos, endPos);
			}
		}
		return false;
	}
	/**
	*  Rule 4: OPPOSITE PAIR SMUSHING (code value 8)
	*
	*    Smushes opposing brackets ("[]" or "]["), braces ("{}" or
	*    "}{") and parentheses ("()" or ")(") together, replacing
	*    any such pair with a vertical bar ("|").
	*/
	function hRule4_Smush(ch1, ch2) {
		let rule4Str = "[] {} ()";
		let r4_pos1 = rule4Str.indexOf(ch1);
		let r4_pos2 = rule4Str.indexOf(ch2);
		if (r4_pos1 !== -1 && r4_pos2 !== -1) {
			if (Math.abs(r4_pos1 - r4_pos2) <= 1) return "|";
		}
		return false;
	}
	/**
	*  Rule 5: BIG X SMUSHING (code value 16)
	*
	*    Smushes "/\" into "|", "\/" into "Y", and "><" into "X".
	*    Note that "<>" is not smushed in any way by this rule.
	*    The name "BIG X" is historical; originally all three pairs
	*    were smushed into "X".
	*/
	function hRule5_Smush(ch1, ch2) {
		return {
			"/\\": "|",
			"\\/": "Y",
			"><": "X"
		}[ch1 + ch2] || false;
	}
	/**
	*  Rule 6: HARDBLANK SMUSHING (code value 32)
	*
	*    Smushes two hardblanks together, replacing them with a
	*    single hardblank.  (See "Hardblanks" below.)
	*/
	function hRule6_Smush(ch1, ch2, hardBlank = "") {
		if (ch1 === hardBlank && ch2 === hardBlank) return hardBlank;
		return false;
	}
	/**
	*  Rule 1: EQUAL CHARACTER SMUSHING (code value 256)
	*
	*    Same as horizontal smushing rule 1.
	*/
	function vRule1_Smush(ch1, ch2) {
		if (ch1 === ch2) return ch1;
		return false;
	}
	/**
	*  Rule 2: UNDERSCORE SMUSHING (code value 512)
	*
	*    Same as horizontal smushing rule 2.
	*/
	function vRule2_Smush(ch1, ch2) {
		return hRule2_Smush(ch1, ch2);
	}
	/**
	*  Rule 3: HIERARCHY SMUSHING (code value 1024)
	*
	*    Same as horizontal smushing rule 3.
	*/
	function vRule3_Smush(ch1, ch2) {
		return hRule3_Smush(ch1, ch2);
	}
	/**
	*  Rule 4: HORIZONTAL LINE SMUSHING (code value 2048)
	*
	*    Smushes stacked pairs of "-" and "_", replacing them with
	*    a single "=" sub-character.  It does not matter which is
	*    found above the other.  Note that vertical smushing rule 1
	*    will smush IDENTICAL pairs of horizontal lines, while this
	*    rule smushes horizontal lines consisting of DIFFERENT
	*    sub-characters.
	*/
	function vRule4_Smush(ch1, ch2) {
		if (ch1 === "-" && ch2 === "_" || ch1 === "_" && ch2 === "-") return "=";
		return false;
	}
	/**
	*  Rule 5: VERTICAL LINE SUPERSMUSHING (code value 4096)
	*
	*    This one rule is different from all others, in that it
	*    "supersmushes" vertical lines consisting of several
	*    vertical bars ("|").  This creates the illusion that
	*    FIGcharacters have slid vertically against each other.
	*    Supersmushing continues until any sub-characters other
	*    than "|" would have to be smushed.  Supersmushing can
	*    produce impressive results, but it is seldom possible,
	*    since other sub-characters would usually have to be
	*    considered for smushing as soon as any such stacked
	*    vertical lines are encountered.
	*/
	function vRule5_Smush(ch1, ch2) {
		if (ch1 === "|" && ch2 === "|") return "|";
		return false;
	}
	/**
	*    Universal smushing simply overrides the sub-character from the
	*    earlier FIGcharacter with the sub-character from the later
	*    FIGcharacter.  This produces an "overlapping" effect with some
	*    FIGfonts, wherin the latter FIGcharacter may appear to be "in
	*    front".
	*/
	function uni_Smush(ch1, ch2, hardBlank) {
		if (ch2 === " " || ch2 === "") return ch1;
		else if (ch2 === hardBlank && ch1 !== " ") return ch1;
		else return ch2;
	}
	/**
	* This function takes in two lines of text and returns one of the following:
	* "valid" - These liens can be smushed together given the current smushing rules.
	* "end" - The lines can be smushed, but we're at a stopping point.
	* "invalid" - The two liens cannot be smushed together.
	*
	* @param txt1 Line of text from a character
	* @param txt2 Line of text from a character
	* @param opts FIGlet options array
	*/
	function canVerticalSmush(txt1, txt2, opts) {
		if (opts.fittingRules && opts.fittingRules.vLayout === FULL_WIDTH) return "invalid";
		let ii, len = Math.min(txt1.length, txt2.length), ch1, ch2, endSmush = false, validSmush;
		if (len === 0) return "invalid";
		for (ii = 0; ii < len; ii++) {
			ch1 = txt1.substring(ii, ii + 1);
			ch2 = txt2.substring(ii, ii + 1);
			if (ch1 !== " " && ch2 !== " ") if (opts.fittingRules && opts.fittingRules.vLayout === FITTING) return "invalid";
			else if (opts.fittingRules && opts.fittingRules.vLayout === SMUSHING) return "end";
			else {
				if (vRule5_Smush(ch1, ch2)) {
					endSmush = endSmush || false;
					continue;
				}
				validSmush = false;
				validSmush = opts.fittingRules && opts.fittingRules.vRule1 ? vRule1_Smush(ch1, ch2) : validSmush;
				validSmush = !validSmush && opts.fittingRules && opts.fittingRules.vRule2 ? vRule2_Smush(ch1, ch2) : validSmush;
				validSmush = !validSmush && opts.fittingRules && opts.fittingRules.vRule3 ? vRule3_Smush(ch1, ch2) : validSmush;
				validSmush = !validSmush && opts.fittingRules && opts.fittingRules.vRule4 ? vRule4_Smush(ch1, ch2) : validSmush;
				endSmush = true;
				if (!validSmush) return "invalid";
			}
		}
		if (endSmush) return "end";
		else return "valid";
	}
	function getVerticalSmushDist(lines1, lines2, opts) {
		let maxDist = lines1.length;
		let len1 = lines1.length;
		let subLines1, subLines2, slen;
		let curDist = 1;
		let ii, ret, result;
		while (curDist <= maxDist) {
			subLines1 = lines1.slice(Math.max(0, len1 - curDist), len1);
			subLines2 = lines2.slice(0, Math.min(maxDist, curDist));
			slen = subLines2.length;
			result = "";
			for (ii = 0; ii < slen; ii++) {
				ret = canVerticalSmush(subLines1[ii], subLines2[ii], opts);
				if (ret === "end") result = ret;
				else if (ret === "invalid") {
					result = ret;
					break;
				} else if (result === "") result = "valid";
			}
			if (result === "invalid") {
				curDist--;
				break;
			}
			if (result === "end") break;
			if (result === "valid") curDist++;
		}
		return Math.min(maxDist, curDist);
	}
	function verticallySmushLines(line1, line2, opts) {
		let ii, len = Math.min(line1.length, line2.length);
		let ch1, ch2, result = "", validSmush;
		const fittingRules = opts.fittingRules || {};
		for (ii = 0; ii < len; ii++) {
			ch1 = line1.substring(ii, ii + 1);
			ch2 = line2.substring(ii, ii + 1);
			if (ch1 !== " " && ch2 !== " ") if (fittingRules.vLayout === FITTING) result += uni_Smush(ch1, ch2);
			else if (fittingRules.vLayout === SMUSHING) result += uni_Smush(ch1, ch2);
			else {
				validSmush = false;
				validSmush = fittingRules.vRule5 ? vRule5_Smush(ch1, ch2) : validSmush;
				validSmush = !validSmush && fittingRules.vRule1 ? vRule1_Smush(ch1, ch2) : validSmush;
				validSmush = !validSmush && fittingRules.vRule2 ? vRule2_Smush(ch1, ch2) : validSmush;
				validSmush = !validSmush && fittingRules.vRule3 ? vRule3_Smush(ch1, ch2) : validSmush;
				validSmush = !validSmush && fittingRules.vRule4 ? vRule4_Smush(ch1, ch2) : validSmush;
				result += validSmush;
			}
			else result += uni_Smush(ch1, ch2);
		}
		return result;
	}
	function verticalSmush(lines1, lines2, overlap, opts) {
		let len1 = lines1.length;
		let len2 = lines2.length;
		let piece1 = lines1.slice(0, Math.max(0, len1 - overlap));
		let piece2_1 = lines1.slice(Math.max(0, len1 - overlap), len1);
		let piece2_2 = lines2.slice(0, Math.min(overlap, len2));
		let ii, len, line, piece2 = [], piece3;
		len = piece2_1.length;
		for (ii = 0; ii < len; ii++) {
			if (ii >= len2) line = piece2_1[ii];
			else line = verticallySmushLines(piece2_1[ii], piece2_2[ii], opts);
			piece2.push(line);
		}
		piece3 = lines2.slice(Math.min(overlap, len2), len2);
		return [
			...piece1,
			...piece2,
			...piece3
		];
	}
	function padLines(lines, numSpaces) {
		const padding = " ".repeat(numSpaces);
		return lines.map((line) => line + padding);
	}
	function smushVerticalFigLines(output, lines, opts) {
		let len1 = output[0].length;
		let len2 = lines[0].length;
		let overlap;
		if (len1 > len2) lines = padLines(lines, len1 - len2);
		else if (len2 > len1) output = padLines(output, len2 - len1);
		overlap = getVerticalSmushDist(output, lines, opts);
		return verticalSmush(output, lines, overlap, opts);
	}
	function getHorizontalSmushLength(txt1, txt2, opts) {
		const fittingRules = opts.fittingRules || {};
		if (fittingRules.hLayout === FULL_WIDTH) return 0;
		let ii, len1 = txt1.length, len2 = txt2.length;
		let maxDist = len1;
		let curDist = 1;
		let breakAfter = false;
		let seg1, seg2, ch1, ch2;
		if (len1 === 0) return 0;
		distCal: while (curDist <= maxDist) {
			const seg1StartPos = len1 - curDist;
			seg1 = txt1.substring(seg1StartPos, seg1StartPos + curDist);
			seg2 = txt2.substring(0, Math.min(curDist, len2));
			for (ii = 0; ii < Math.min(curDist, len2); ii++) {
				ch1 = seg1.substring(ii, ii + 1);
				ch2 = seg2.substring(ii, ii + 1);
				if (ch1 !== " " && ch2 !== " ") if (fittingRules.hLayout === FITTING) {
					curDist = curDist - 1;
					break distCal;
				} else if (fittingRules.hLayout === SMUSHING) {
					if (ch1 === opts.hardBlank || ch2 === opts.hardBlank) curDist = curDist - 1;
					break distCal;
				} else {
					breakAfter = true;
					if (!(fittingRules.hRule1 && hRule1_Smush(ch1, ch2, opts.hardBlank) || fittingRules.hRule2 && hRule2_Smush(ch1, ch2) || fittingRules.hRule3 && hRule3_Smush(ch1, ch2) || fittingRules.hRule4 && hRule4_Smush(ch1, ch2) || fittingRules.hRule5 && hRule5_Smush(ch1, ch2) || fittingRules.hRule6 && hRule6_Smush(ch1, ch2, opts.hardBlank))) {
						curDist = curDist - 1;
						break distCal;
					}
				}
			}
			if (breakAfter) break;
			curDist++;
		}
		return Math.min(maxDist, curDist);
	}
	function horizontalSmush(textBlock1, textBlock2, overlap, opts) {
		let ii, jj, outputFig = [], overlapStart, piece1, piece2, piece3, len1, len2, txt1, txt2;
		const fittingRules = opts.fittingRules || {};
		if (typeof opts.height !== "number") throw new Error("height is not defined.");
		for (ii = 0; ii < opts.height; ii++) {
			txt1 = textBlock1[ii];
			txt2 = textBlock2[ii];
			len1 = txt1.length;
			len2 = txt2.length;
			overlapStart = len1 - overlap;
			piece1 = txt1.slice(0, Math.max(0, overlapStart));
			piece2 = "";
			const seg1StartPos = Math.max(0, len1 - overlap);
			let seg1 = txt1.substring(seg1StartPos, seg1StartPos + overlap);
			let seg2 = txt2.substring(0, Math.min(overlap, len2));
			for (jj = 0; jj < overlap; jj++) {
				let ch1 = jj < len1 ? seg1.substring(jj, jj + 1) : " ";
				let ch2 = jj < len2 ? seg2.substring(jj, jj + 1) : " ";
				if (ch1 !== " " && ch2 !== " ") if (fittingRules.hLayout === FITTING || fittingRules.hLayout === SMUSHING) piece2 += uni_Smush(ch1, ch2, opts.hardBlank);
				else {
					const nextCh = fittingRules.hRule1 && hRule1_Smush(ch1, ch2, opts.hardBlank) || fittingRules.hRule2 && hRule2_Smush(ch1, ch2) || fittingRules.hRule3 && hRule3_Smush(ch1, ch2) || fittingRules.hRule4 && hRule4_Smush(ch1, ch2) || fittingRules.hRule5 && hRule5_Smush(ch1, ch2) || fittingRules.hRule6 && hRule6_Smush(ch1, ch2, opts.hardBlank) || uni_Smush(ch1, ch2, opts.hardBlank);
					piece2 += nextCh;
				}
				else piece2 += uni_Smush(ch1, ch2, opts.hardBlank);
			}
			if (overlap >= len2) piece3 = "";
			else piece3 = txt2.substring(overlap, overlap + Math.max(0, len2 - overlap));
			outputFig[ii] = piece1 + piece2 + piece3;
		}
		return outputFig;
	}
	/**
	* Creates new empty ASCII placeholder of given length
	*
	* @param len
	*/
	function newFigChar(len) {
		return new Array(len).fill("");
	}
	/**
	* Return max line of the ASCII Art
	*
	* @param textLines Lines for the text
	*/
	const figLinesWidth = function(textLines) {
		return Math.max(...textLines.map((line) => line.length));
	};
	/**
	* Join words or single characters into a single Fig line
	*
	* @param array Array of ASCII words or single character: {fig: array, overlap: number}
	* @param len Height of the characters (number of rows)
	* @param opts
	*/
	function joinFigArray(array, len, opts) {
		return array.reduce(function(acc, data) {
			return horizontalSmush(acc, data.fig, data.overlap || 0, opts);
		}, newFigChar(len));
	}
	/**
	* Break long words, return leftover characters and line before the break
	*
	* @param figChars List of single ASCII characters in form {fig, overlap}
	* @param len
	* @param opts
	*/
	function breakWord(figChars, len, opts) {
		for (let i = figChars.length - 1; i > 0; i--) {
			const w = joinFigArray(figChars.slice(0, i), len, opts);
			if (figLinesWidth(w) <= opts.width) return {
				outputFigText: w,
				chars: figChars.slice(i)
			};
		}
		if (figChars.length > 0) return {
			outputFigText: joinFigArray([figChars[0]], len, opts),
			chars: figChars.slice(1)
		};
		return {
			outputFigText: newFigChar(len),
			chars: figChars
		};
	}
	function generateFigTextLines(txt, figChars, opts) {
		let charIndex, figChar, overlap = 0, row, outputFigText, len, height = opts.height, outputFigLines = [], maxWidth, nextFigChars = {
			chars: [],
			overlap
		}, figWords = [], char, isSpace, textFigWord, textFigLine, tmpBreak;
		if (typeof height !== "number") throw new Error("height is not defined.");
		outputFigText = newFigChar(height);
		const fittingRules = opts.fittingRules || {};
		if (opts.printDirection === 1) txt = txt.split("").reverse().join("");
		len = txt.length;
		for (charIndex = 0; charIndex < len; charIndex++) {
			char = txt.substring(charIndex, charIndex + 1);
			isSpace = char.match(/\s/);
			figChar = figChars[char.charCodeAt(0)];
			textFigLine = null;
			if (figChar) {
				if (fittingRules.hLayout !== FULL_WIDTH) {
					overlap = 1e4;
					for (row = 0; row < height; row++) overlap = Math.min(overlap, getHorizontalSmushLength(outputFigText[row], figChar[row], opts));
					overlap = overlap === 1e4 ? 0 : overlap;
				}
				if (opts.width > 0) {
					if (opts.whitespaceBreak) {
						textFigWord = joinFigArray(nextFigChars.chars.concat([{
							fig: figChar,
							overlap
						}]), height, opts);
						textFigLine = joinFigArray(figWords.concat([{
							fig: textFigWord,
							overlap: nextFigChars.overlap
						}]), height, opts);
						maxWidth = figLinesWidth(textFigLine);
					} else {
						textFigLine = horizontalSmush(outputFigText, figChar, overlap, opts);
						maxWidth = figLinesWidth(textFigLine);
					}
					if (maxWidth >= opts.width && charIndex > 0) if (opts.whitespaceBreak) {
						outputFigText = joinFigArray(figWords.slice(0, -1), height, opts);
						if (figWords.length > 1) {
							outputFigLines.push(outputFigText);
							outputFigText = newFigChar(height);
						}
						figWords = [];
					} else {
						outputFigLines.push(outputFigText);
						outputFigText = newFigChar(height);
					}
				}
				if (opts.width > 0 && opts.whitespaceBreak) {
					if (!isSpace || charIndex === len - 1) nextFigChars.chars.push({
						fig: figChar,
						overlap
					});
					if (isSpace || charIndex === len - 1) {
						tmpBreak = null;
						while (true) {
							textFigLine = joinFigArray(nextFigChars.chars, height, opts);
							maxWidth = figLinesWidth(textFigLine);
							if (maxWidth >= opts.width) {
								tmpBreak = breakWord(nextFigChars.chars, height, opts);
								nextFigChars = { chars: tmpBreak.chars };
								outputFigLines.push(tmpBreak.outputFigText);
							} else break;
						}
						if (maxWidth > 0) if (tmpBreak) figWords.push({
							fig: textFigLine,
							overlap: 1
						});
						else figWords.push({
							fig: textFigLine,
							overlap: nextFigChars.overlap
						});
						if (isSpace) {
							figWords.push({
								fig: figChar,
								overlap
							});
							outputFigText = newFigChar(height);
						}
						if (charIndex === len - 1) outputFigText = joinFigArray(figWords, height, opts);
						nextFigChars = {
							chars: [],
							overlap
						};
						continue;
					}
				}
				outputFigText = horizontalSmush(outputFigText, figChar, overlap, opts);
			}
		}
		if (figLinesWidth(outputFigText) > 0) outputFigLines.push(outputFigText);
		if (!opts.showHardBlanks) outputFigLines.forEach(function(outputFigText) {
			len = outputFigText.length;
			for (row = 0; row < len; row++) outputFigText[row] = outputFigText[row].replace(new RegExp("\\" + opts.hardBlank, "g"), " ");
		});
		if (txt === "" && outputFigLines.length === 0) outputFigLines.push(new Array(height).fill(""));
		return outputFigLines;
	}
	const getHorizontalFittingRules = function(layout, options) {
		let params;
		const fittingRules = options.fittingRules || {};
		if (layout === "default") params = {
			hLayout: fittingRules.hLayout,
			hRule1: fittingRules.hRule1,
			hRule2: fittingRules.hRule2,
			hRule3: fittingRules.hRule3,
			hRule4: fittingRules.hRule4,
			hRule5: fittingRules.hRule5,
			hRule6: fittingRules.hRule6
		};
		else if (layout === "full") params = {
			hLayout: FULL_WIDTH,
			hRule1: false,
			hRule2: false,
			hRule3: false,
			hRule4: false,
			hRule5: false,
			hRule6: false
		};
		else if (layout === "fitted") params = {
			hLayout: FITTING,
			hRule1: false,
			hRule2: false,
			hRule3: false,
			hRule4: false,
			hRule5: false,
			hRule6: false
		};
		else if (layout === "controlled smushing") params = {
			hLayout: CONTROLLED_SMUSHING,
			hRule1: true,
			hRule2: true,
			hRule3: true,
			hRule4: true,
			hRule5: true,
			hRule6: true
		};
		else if (layout === "universal smushing") params = {
			hLayout: SMUSHING,
			hRule1: false,
			hRule2: false,
			hRule3: false,
			hRule4: false,
			hRule5: false,
			hRule6: false
		};
		else return;
		return params;
	};
	const getVerticalFittingRules = function(layout, options) {
		let params = {};
		const fittingRules = options.fittingRules || {};
		if (layout === "default") params = {
			vLayout: fittingRules.vLayout,
			vRule1: fittingRules.vRule1,
			vRule2: fittingRules.vRule2,
			vRule3: fittingRules.vRule3,
			vRule4: fittingRules.vRule4,
			vRule5: fittingRules.vRule5
		};
		else if (layout === "full") params = {
			vLayout: FULL_WIDTH,
			vRule1: false,
			vRule2: false,
			vRule3: false,
			vRule4: false,
			vRule5: false
		};
		else if (layout === "fitted") params = {
			vLayout: FITTING,
			vRule1: false,
			vRule2: false,
			vRule3: false,
			vRule4: false,
			vRule5: false
		};
		else if (layout === "controlled smushing") params = {
			vLayout: CONTROLLED_SMUSHING,
			vRule1: true,
			vRule2: true,
			vRule3: true,
			vRule4: true,
			vRule5: true
		};
		else if (layout === "universal smushing") params = {
			vLayout: SMUSHING,
			vRule1: false,
			vRule2: false,
			vRule3: false,
			vRule4: false,
			vRule5: false
		};
		else return;
		return params;
	};
	/**
	* Generates the ASCII Art
	*
	* @param fontName Font to use
	* @param options Options to override the defaults
	* @param txt The text to make into ASCII Art
	*/
	const generateText = function(fontName, options, txt) {
		txt = txt.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
		const actualFontName = getFontName(fontName);
		let lines = txt.split("\n");
		let figLines = [];
		let ii, len, output;
		len = lines.length;
		for (ii = 0; ii < len; ii++) figLines = figLines.concat(generateFigTextLines(lines[ii], figFonts[actualFontName], options));
		len = figLines.length;
		output = figLines[0];
		for (ii = 1; ii < len; ii++) output = smushVerticalFigLines(output, figLines[ii], options);
		return output ? output.join("\n") : "";
	};
	function _reworkFontOpts(fontMeta, options) {
		let myOpts;
		if (typeof structuredClone !== "undefined") myOpts = structuredClone(fontMeta);
		else myOpts = JSON.parse(JSON.stringify(fontMeta));
		myOpts.showHardBlanks = options.showHardBlanks || false;
		myOpts.width = options.width || -1;
		myOpts.whitespaceBreak = options.whitespaceBreak || false;
		if (options.horizontalLayout) {
			const params = getHorizontalFittingRules(options.horizontalLayout, fontMeta);
			if (params) Object.assign(myOpts.fittingRules, params);
		}
		if (options.verticalLayout) {
			const params = getVerticalFittingRules(options.verticalLayout, fontMeta);
			if (params) Object.assign(myOpts.fittingRules, params);
		}
		myOpts.printDirection = options.printDirection !== null && options.printDirection !== void 0 ? options.printDirection : fontMeta.printDirection;
		return myOpts;
	}
	/**
	* A short-cut for the figlet.text method
	*
	* @param txt The text to make into ASCII Art.
	* @param optionsOrFontOrCallback Options that will override the current font's default options / a font name to use / the callback function
	* @param callback A callback function, it will contain the outputted ASCII Art.
	*/
	const me = async function(txt, optionsOrFontOrCallback, callback) {
		return me.text(txt, optionsOrFontOrCallback, callback);
	};
	me.text = async function(txt, optionsOrFontOrCallback, callback) {
		txt = txt + "";
		let options, next;
		if (typeof optionsOrFontOrCallback === "function") {
			next = optionsOrFontOrCallback;
			options = { font: figDefaults.font };
		} else if (typeof optionsOrFontOrCallback === "string") {
			options = { font: optionsOrFontOrCallback };
			next = callback;
		} else if (optionsOrFontOrCallback) {
			options = optionsOrFontOrCallback;
			next = callback;
		} else {
			options = { font: figDefaults.font };
			next = callback;
		}
		const fontName = options.font || figDefaults.font;
		try {
			const fontOpts = await me.loadFont(fontName);
			const generatedTxt = fontOpts ? generateText(fontName, _reworkFontOpts(fontOpts, options), txt) : "";
			if (next) next(null, generatedTxt);
			return generatedTxt;
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			if (next) {
				next(error);
				return "";
			}
			throw error;
		}
	};
	/**
	* Synchronous version of figlet.text
	* Accepts the same parameters (sans the callback).
	*
	* @param txt
	* @param options
	*/
	me.textSync = function(txt, options) {
		txt = txt + "";
		if (typeof options === "string") options = { font: options };
		else options = options || {};
		const fontName = options.font || figDefaults.font;
		let fontOpts = _reworkFontOpts(me.loadFontSync(fontName), options);
		return generateText(fontName, fontOpts, txt);
	};
	/**
	* Returns metadata about a specific FIGlet font.
	*
	* @param fontName
	* @param callback
	*/
	me.metadata = async function(fontName, callback) {
		fontName = fontName + "";
		try {
			const fontOpts = await me.loadFont(fontName);
			if (!fontOpts) throw new Error("Error loading font.");
			const actualFontName = getFontName(fontName);
			const font = figFonts[actualFontName] || {};
			const result = [fontOpts, font.comment || ""];
			if (callback) callback(null, fontOpts, font.comment);
			return result;
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			if (callback) {
				callback(error);
				return null;
			}
			throw error;
		}
	};
	/**
	* Allows you to override the defaults. See the definition of the figDefaults object up above
	* to see what properties can be overridden.
	* Returns the options for the font.
	*
	* @param opts
	*/
	me.defaults = function(opts) {
		if (opts && typeof opts === "object") Object.assign(figDefaults, opts);
		if (typeof structuredClone !== "undefined") return structuredClone(figDefaults);
		else return JSON.parse(JSON.stringify(figDefaults));
	};
	/**
	* Parses data from a FIGlet font file and places it into the figFonts object.
	*
	* @param fontName
	* @param data
	* @param override
	*/
	me.parseFont = function(fontName, data, override = true) {
		if (figFonts[fontName] && !override) return figFonts[fontName].options;
		data = data.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
		const font = new FigletFont();
		const lines = data.split("\n");
		const headerLine = lines.shift();
		if (!headerLine) throw new Error("Invalid font file: missing header");
		const headerData = headerLine.split(" ");
		const opts = {
			hardBlank: headerData[0].substring(5, 6),
			height: parseInt(headerData[1], 10),
			baseline: parseInt(headerData[2], 10),
			maxLength: parseInt(headerData[3], 10),
			oldLayout: parseInt(headerData[4], 10),
			numCommentLines: parseInt(headerData[5], 10),
			printDirection: headerData[6] ? parseInt(headerData[6], 10) : 0,
			fullLayout: headerData[7] ? parseInt(headerData[7], 10) : null,
			codeTagCount: headerData[8] ? parseInt(headerData[8], 10) : null
		};
		if ((opts.hardBlank || "").length !== 1 || [
			opts.height,
			opts.baseline,
			opts.maxLength,
			opts.oldLayout,
			opts.numCommentLines
		].some((val) => val === null || val === void 0 || isNaN(val))) throw new Error("FIGlet header contains invalid values.");
		if (opts.height == null || opts.numCommentLines == null) throw new Error("FIGlet header contains invalid values.");
		if (opts.height < 1 || opts.baseline < 0 || opts.maxLength < 0 || opts.numCommentLines < 0) throw new Error("FIGlet header contains invalid values.");
		opts.fittingRules = getSmushingRules(opts.oldLayout, opts.fullLayout);
		font.options = opts;
		const charNums = [];
		for (let i = 32; i <= 126; i++) charNums.push(i);
		charNums.push(196, 214, 220, 228, 246, 252, 223);
		if (lines.length < opts.numCommentLines + opts.height * charNums.length) throw new Error(`FIGlet file is missing data. Line length: ${lines.length}. Comment lines: ${opts.numCommentLines}. Height: ${opts.height}. Num chars: ${charNums.length}.`);
		font.comment = lines.splice(0, opts.numCommentLines).join("\n");
		font.numChars = 0;
		while (lines.length > 0 && font.numChars < charNums.length) {
			const cNum = charNums[font.numChars];
			font[cNum] = lines.splice(0, opts.height);
			for (let i = 0; i < opts.height; i++) if (typeof font[cNum][i] === "undefined") font[cNum][i] = "";
			else font[cNum][i] = removeEndChar(font[cNum][i], i, opts.height);
			font.numChars++;
		}
		while (lines.length > 0) {
			const cNumLine = lines.shift();
			if (!cNumLine || cNumLine.trim() === "") break;
			let cNum = cNumLine.split(" ")[0];
			let parsedNum;
			if (/^-?0[xX][0-9a-fA-F]+$/.test(cNum)) parsedNum = parseInt(cNum, 16);
			else if (/^-?0[0-7]+$/.test(cNum)) parsedNum = parseInt(cNum, 8);
			else if (/^-?[0-9]+$/.test(cNum)) parsedNum = parseInt(cNum, 10);
			else throw new Error(`Error parsing data. Invalid data: ${cNum}`);
			if (parsedNum === -1 || parsedNum < -2147483648 || parsedNum > 2147483647) throw new Error(`Error parsing data. ${parsedNum === -1 ? "The char code -1 is not permitted." : `The char code cannot be ${parsedNum < -2147483648 ? "less than -2147483648" : "greater than 2147483647"}.`}`);
			font[parsedNum] = lines.splice(0, opts.height);
			for (let i = 0; i < opts.height; i++) if (typeof font[parsedNum][i] === "undefined") font[parsedNum][i] = "";
			else font[parsedNum][i] = removeEndChar(font[parsedNum][i], i, opts.height);
			font.numChars++;
		}
		figFonts[fontName] = font;
		return opts;
	};
	/**
	* Returns an array of the fonts that have been parsed and loaded
	*/
	me.loadedFonts = () => {
		return Object.keys(figFonts);
	};
	/**
	* Remove all fonts that have been loaded
	*/
	me.clearLoadedFonts = () => {
		Object.keys(figFonts).forEach((key) => {
			delete figFonts[key];
		});
	};
	/**
	* Loads a font.
	*
	* @param fontName
	* @param callback
	*/
	me.loadFont = async function(fontName, callback) {
		const actualFontName = getFontName(fontName);
		if (figFonts[actualFontName]) {
			const result = figFonts[actualFontName].options;
			if (callback) callback(null, result);
			return Promise.resolve(result);
		}
		try {
			if (!figDefaults.fetchFontIfMissing) throw new Error(`Font is not loaded: ${actualFontName}`);
			const response = await fetch(`${figDefaults.fontPath}/${actualFontName}.flf`);
			if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
			const text = await response.text();
			const result = me.parseFont(actualFontName, text);
			if (callback) callback(null, result);
			return result;
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			if (callback) {
				callback(err);
				return null;
			}
			throw err;
		}
	};
	/**
	* Loads a font synchronously
	*
	* @param name
	*/
	me.loadFontSync = function(name) {
		const actualFontName = getFontName(name);
		if (figFonts[actualFontName]) return figFonts[actualFontName].options;
		throw new Error("Synchronous font loading is not implemented for the browser, it will only work for fonts already loaded.");
	};
	/**
	* Preloads a list of fonts prior to using textSync
	*
	* @param fonts An array of font names (ex: ["Standard", "Soft"])
	* @param callback Callback
	*/
	me.preloadFonts = async function(fonts, callback) {
		try {
			for (const name of fonts) {
				const actualFontName = getFontName(name);
				const response = await fetch(`${figDefaults.fontPath}/${actualFontName}.flf`);
				if (!response.ok) throw new Error(`Failed to preload fonts. Error fetching font: ${actualFontName}, status code: ${response.statusText}`);
				const data = await response.text();
				me.parseFont(actualFontName, data);
			}
			if (callback) callback();
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			if (callback) {
				callback(err);
				return;
			}
			throw error;
		}
	};
	/**
	* Retrieves a list of the fonts.
	*
	* @param callback
	*/
	me.fonts = function(callback) {
		return new Promise(function(resolve, reject) {
			resolve(fontList);
			if (callback) callback(null, fontList);
		});
	};
	/**
	* Retrieves a list of the fonts.
	*/
	me.fontsSync = function() {
		return fontList;
	};
	me.figFonts = figFonts;
	return me;
})();
//#endregion
Object.defineProperty(exports, "figlet", {
	enumerable: true,
	get: function() {
		return figlet;
	}
});
Object.defineProperty(exports, "getFontName", {
	enumerable: true,
	get: function() {
		return getFontName;
	}
});
