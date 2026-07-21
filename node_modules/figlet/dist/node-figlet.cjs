//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
const require_figlet = require("./figlet-Bofe-fvw.cjs");
let fs = require("fs");
fs = __toESM(fs, 1);
let path = require("path");
path = __toESM(path, 1);
let url = require("url");
//#region src/node-figlet.ts
var moduleDirname = typeof __dirname !== "undefined" ? __dirname : path.dirname((0, url.fileURLToPath)({}.url));
var fontPath = path.join(moduleDirname, "/../fonts/");
var nodeFiglet = require_figlet.figlet;
nodeFiglet.defaults({ fontPath });
nodeFiglet.loadFont = function(name, callback) {
	const actualFontName = require_figlet.getFontName(name);
	return new Promise((resolve, reject) => {
		if (nodeFiglet.figFonts[actualFontName]) {
			if (callback) callback(null, nodeFiglet.figFonts[actualFontName].options);
			resolve(nodeFiglet.figFonts[actualFontName].options);
			return;
		}
		fs.readFile(path.join(nodeFiglet.defaults().fontPath, actualFontName + ".flf"), { encoding: "utf-8" }, (err, fontData) => {
			if (err) {
				if (callback) callback(err);
				reject(err);
				return;
			}
			fontData = fontData + "";
			try {
				const font = nodeFiglet.parseFont(actualFontName, fontData);
				if (callback) callback(null, font);
				resolve(font);
			} catch (error) {
				const typedError = error instanceof Error ? error : new Error(String(error));
				if (callback) callback(typedError);
				reject(typedError);
			}
		});
	});
};
nodeFiglet.loadFontSync = function(font) {
	const actualFontName = require_figlet.getFontName(font);
	if (nodeFiglet.figFonts[actualFontName]) return nodeFiglet.figFonts[actualFontName].options;
	const fontData = fs.readFileSync(path.join(nodeFiglet.defaults().fontPath, actualFontName + ".flf"), { encoding: "utf-8" }) + "";
	return nodeFiglet.parseFont(actualFontName, fontData);
};
nodeFiglet.fonts = function(next) {
	return new Promise((resolve, reject) => {
		const fontList = [];
		fs.readdir(nodeFiglet.defaults().fontPath, (err, files) => {
			if (err) {
				next && next(err);
				reject(err);
				return;
			}
			files.forEach((file) => {
				if (/\.flf$/.test(file)) fontList.push(file.replace(/\.flf$/, ""));
			});
			next && next(null, fontList);
			resolve(fontList);
		});
	});
};
nodeFiglet.fontsSync = function() {
	const fontList = [];
	fs.readdirSync(nodeFiglet.defaults().fontPath).forEach((file) => {
		if (/\.flf$/.test(file)) fontList.push(file.replace(/\.flf$/, ""));
	});
	return fontList;
};
//#endregion
module.exports = nodeFiglet;
