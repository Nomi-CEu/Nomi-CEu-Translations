import { modulesFile, rootDirectory } from "../globals";
import upath from "upath";
import buildConfig from "../buildConfig";
import sanitize from "sanitize-filename";
import { makeName } from "./name";
import { cleanUp, createDirs, copy, transformMCMeta, zipFolder } from "./util";
import log from "fancy-log";

export async function compressModulesTask(): Promise<void> {
	return zipOrCopyModules(true);
}

export async function copyModulesTask(): Promise<void> {
	return zipOrCopyModules(false);
}

export async function zipOrCopyModules(zip: boolean): Promise<void> {
	for (const module of modulesFile.modules) {
		await zipOrCopyModule(zip, module.name);
	}
}

export async function zipOrCopyModule(zip: boolean, moduleName: string): Promise<void> {
	const moduleDir = upath.join(rootDirectory, moduleName);
	const moduleDest = upath.join(buildConfig.buildDestinationDirectory, moduleName);
	log(`${zip ? "Zipping" : "Copying"} Module ${moduleName}...`);
	await cleanUp(moduleDest);
	await createDirs(moduleDest);
	await copy(moduleDir, moduleDest, buildConfig.normalCopyGlobs);
	await transformMCMeta(moduleDir, moduleDest);
	if (zip) await zipFolder(moduleDest, sanitize(`${makeName(moduleName)}.zip`).toLowerCase());
	log(`${zip ? "Zipped" : "Copied"} Module ${moduleName}!`);
}
