import upath from "upath";
import { modulesFile, rootDirectory } from "../globals";
import buildConfig from "../buildConfig";
import { cleanUp, copy, createDirs, transformMCMeta, zipFolder } from "./util";
import sanitize from "sanitize-filename";
import { makeName } from "./name";
import log from "fancy-log";

export async function compressCombinedTask(): Promise<void> {
	return zipOrCopyCombined(true);
}

export async function copyCombinedTask(): Promise<void> {
	return zipOrCopyCombined(false);
}

export async function zipOrCopyCombined(zip: boolean): Promise<void> {
	const dir = upath.join(rootDirectory, buildConfig.combinedName);
	const dest = upath.join(buildConfig.buildDestinationDirectory, buildConfig.combinedName);
	log(`${zip ? "Zipping" : "Copying"} Combined...`);
	await cleanUp(dest);
	await createDirs(dest);
	for (const module of modulesFile.modules) {
		log(`Copying Module ${module.name} for combined...`);
		const moduleDir = upath.join(rootDirectory, module.name);
		await copy(moduleDir, dest, buildConfig.copyToCombinedDirGlobs);
		log(`Copied Module ${module.name} for combined!`);
	}
	await copy(dir, dest, buildConfig.copyPackPngGlobs);
	await transformMCMeta(dir, dest);
	if (zip) await zipFolder(dest, sanitize(`${makeName(buildConfig.combinedName)}.zip`).toLowerCase());
	log(`${zip ? "Zipped" : "Copied"} Combined!`);
}
