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
	const dir = upath.join(rootDirectory, modulesFile.combined.name);
	const dest = upath.join(buildConfig.buildDestinationDirectory, modulesFile.combined.name);
	log(`${zip ? "Zipping" : "Copying"} ${modulesFile.combined.formattedName} / Combined...`);
	await cleanUp(dest);
	await createDirs(dest);
	for (const module of modulesFile.modules) {
		log(`Copying Module ${module.name} for ${modulesFile.combined.formattedName} / Combined...`);
		const moduleDir = upath.join(rootDirectory, module.name);
		await copy(moduleDir, dest, buildConfig.copyToCombinedDirGlobs);
		log(`Copied Module ${module.name} for ${modulesFile.combined.formattedName} / Combined!`);
	}
	await copy(dir, dest, buildConfig.copyPackPngGlobs);
	await transformMCMeta(dir, dest);
	if (zip) await zipFolder(dest, sanitize(`${makeName(modulesFile.combined.name)}.zip`).toLowerCase());
	log(`${zip ? "Zipped" : "Copied"} ${modulesFile.combined.formattedName} / Combined!`);
}
