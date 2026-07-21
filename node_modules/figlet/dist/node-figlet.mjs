import { n as getFontName, t as figlet } from "./figlet-DPpovuyG.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
//#region src/node-figlet.ts
var moduleDirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));
var fontPath = path.join(moduleDirname, "/../fonts/");
var nodeFiglet = figlet;
nodeFiglet.defaults({ fontPath });
nodeFiglet.loadFont = function(name, callback) {
	const actualFontName = getFontName(name);
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
	const actualFontName = getFontName(font);
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
export { nodeFiglet as default };
