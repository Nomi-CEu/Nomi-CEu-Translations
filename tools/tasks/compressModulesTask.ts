import { modulesFile, rootDirectory } from "../globals";
import upath from "upath";
import buildConfig from "../buildConfig";
import sanitize from "sanitize-filename";
import { makeName } from "../util/name";
import { cleanUp, createDirs, copy, transformMCMeta, zipFolder } from "../util/util";
import log from "fancy-log";

export async function compressModulesTask(): Promise<void> {
	for (const module of modulesFile.modules) {
		const moduleDir = upath.join(rootDirectory, module);
		const moduleDest = upath.join(buildConfig.buildDestinationDirectory, module);
		log(`Zippping Module ${module}...`);
		await cleanUp(moduleDest);
		await createDirs(moduleDest);
		await copy(moduleDir, moduleDest, buildConfig.normalCopyGlobs);
		await transformMCMeta(moduleDir, moduleDest);
		await zipFolder(moduleDest, sanitize(`${makeName(module)}.zip`).toLowerCase());
		log(`Zipped Module ${module}!`);
	}
}
