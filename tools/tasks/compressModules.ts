import { modulesFile, rootDirectory } from "../globals";
import upath from "upath";
import buildConfig from "../buildConfig";
import zip from "gulp-zip";
import gulp from "gulp";
import sanitize from "sanitize-filename";
import { makeName, transformMCMetaObj } from "../util/name";
import del from "del";
import fs from "fs";
import { McMeta } from "../types/mcmeta";

export async function compressModules(): Promise<void> {
	for (const module of modulesFile.modules) {
		const moduleDir = upath.join(rootDirectory, module);
		const moduleDest = upath.join(buildConfig.buildDestinationDirectory, module);
		await cleanUp(moduleDest);
		await createSharedDirs(moduleDest);
		await copy(moduleDir, moduleDest);
		await transformMCMeta(moduleDir, moduleDest);
		await zipFolder(moduleDest, sanitize(`${makeName(module)}.zip`).toLowerCase());
	}
}

async function cleanUp(dir: string) {
	await del(upath.join(dir, "*"), { force: true });
}

async function createSharedDirs(dir: string) {
	if (!fs.existsSync(dir)) {
		await fs.promises.mkdir(dir, { recursive: true });
	}
}

async function copy(baseDir: string, destDir: string) {
	// Don't copy pack.mcmeta, it is transformed into the build folder
	return new Promise((resolve) => {
		gulp.src(buildConfig.normalCopyGlobs, { cwd: baseDir }).pipe(gulp.dest(destDir)).on("end", resolve);
	});
}

async function transformMCMeta(basePath: string, newPath: string) {
	const file = await fs.promises.readFile(upath.join(basePath, "pack.mcmeta"), "utf-8");
	const meta = JSON.parse(file) as McMeta;
	transformMCMetaObj(meta);
	await fs.promises.writeFile(upath.join(newPath, "pack.mcmeta"), JSON.stringify(meta, null, 2));
}

async function zipFolder(path: string, zipName: string): Promise<void> {
	return new Promise((resolve) => {
		gulp
			.src(upath.join(path, "**"), { base: path, dot: true })
			.pipe(zip(zipName))
			.pipe(gulp.dest(buildConfig.buildDestinationDirectory))
			.on("end", resolve);
	});
}
