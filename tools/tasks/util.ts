import del from "del";
import upath from "upath";
import fs from "fs";
import gulp from "gulp";
import { McMeta } from "../types/mcmeta";
import { transformMCMetaObj } from "./name";
import zip from "gulp-zip";
import buildConfig from "../buildConfig";

export async function cleanUp(dir: string) {
	await del(upath.join(dir, "*"), { force: true });
}

export async function createDirs(dir: string) {
	if (!fs.existsSync(dir)) {
		await fs.promises.mkdir(dir, { recursive: true });
	}
}

export async function copy(baseDir: string, destDir: string, globs: string[]) {
	// Don't copy pack.mcmeta, it is transformed into the build folder
	return new Promise((resolve) => {
		gulp.src(globs, { cwd: baseDir }).pipe(gulp.dest(destDir)).on("end", resolve);
	});
}

export async function transformMCMeta(basePath: string, newPath: string) {
	const file = await fs.promises.readFile(upath.join(basePath, "pack.mcmeta"), "utf-8");
	const meta = JSON.parse(file) as McMeta;
	transformMCMetaObj(meta);
	await fs.promises.writeFile(upath.join(newPath, "pack.mcmeta"), JSON.stringify(meta, null, 2));
}

export async function zipFolder(path: string, zipName: string): Promise<void> {
	return new Promise((resolve) => {
		gulp
			.src(upath.join(path, "**"), { base: path, dot: true })
			.pipe(zip(zipName))
			.pipe(gulp.dest(buildConfig.buildDestinationDirectory))
			.on("end", resolve);
	});
}
