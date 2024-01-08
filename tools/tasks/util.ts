import del from "del";
import upath from "upath";
import fs from "fs";
import gulp from "gulp";
import { McMeta } from "../types/mcmeta";
import { transformMCMetaObj } from "./name";
import zip from "gulp-zip";
import buildConfig from "../buildConfig";
import { ModuleType } from "../types/moduleType";
import { modulesFile } from "../globals";

export async function cleanUp(dir: string) {
	await del(upath.join(dir, "*"), { force: true });
}

export async function createDirs(dir: string) {
	if (!fs.existsSync(dir)) {
		await fs.promises.mkdir(dir, { recursive: true });
	}
}

export async function copy(baseDir: string, destDir: string, globs: string[]) {
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

/**
 * Checks the module env variable.
 * @param allowCombined Whether combined is allowed. If false, will throw if combined.
 * @param prioritize Whether to prioritize COMBINED or MODULE specific operations, if combined has same name as module.
 * @return type Always returns Module if allowCombined is false.
 */
export function checkModuleEnv(allowCombined: boolean, prioritize: ModuleType): ModuleType {
	let module = process.env.MODULE;
	if (!module) throw new Error("Module Env Variable must not be empty.");

	module = module.trim();
	const isCombined = module === modulesFile.combined.name;
	const isModule = modulesFile.modules.map((module) => module.name).includes(module);

	if (prioritize === "COMBINED") {
		if (isCombined) {
			if (allowCombined) return "COMBINED";
			throwCannotBeCombinedError();
		}
		if (isModule) return "MODULE";

		throwNoModuleFoundError(allowCombined);
	}
	if (isModule) return "MODULE";
	if (isCombined) {
		if (allowCombined) return "COMBINED";
		throwCannotBeCombinedError();
	}

	throwNoModuleFoundError(allowCombined);
}

function throwCannotBeCombinedError() {
	throw new Error(`Module Env Variable cannot be '${modulesFile.combined.name}' for this operation!`);
}

function throwNoModuleFoundError(allowCombined: boolean) {
	if (allowCombined)
		throw new Error(
			`Module Env Variable must be a module specified in module.json, or '${
				modulesFile.combined.name
			}'. Found: '${module}'. Accepted: [${modulesFile.modules.join(", ")}, ${modulesFile.combined.name}].`,
		);

	throw new Error(
		`Module Env Variable must be a module specified in module.json. Found: '${module}'. Accepted: [${modulesFile.modules.join(
			", ",
		)}. Module Env Variable cannot be '${modulesFile.combined.name}' for this operation!`,
	);
}
