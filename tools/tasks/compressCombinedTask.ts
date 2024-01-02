import upath from "upath";
import { modulesFile, rootDirectory } from "../globals";
import buildConfig from "../buildConfig";
import { cleanUp, copy, createDirs, transformMCMeta, zipFolder } from "../util/util";
import sanitize from "sanitize-filename";
import { makeName } from "../util/name";
import log from "fancy-log";

export async function compressCombinedTask(): Promise<void> {
	const dir = upath.join(rootDirectory, buildConfig.combinedName);
	const dest = upath.join(buildConfig.buildDestinationDirectory, buildConfig.combinedName);
	log("Zippping Combined...");
	await cleanUp(dest);
	await createDirs(dest);
	for (const module of modulesFile.modules) {
		log(`Copying Module ${module} for combined...`);
		const moduleDir = upath.join(rootDirectory, module);
		await copy(moduleDir, dest, buildConfig.copyToCombinedDirGlobs);
		log(`Copied Module ${module} for combined!`);
	}
	await copy(dir, dest, buildConfig.copyPackPngGlobs);
	await transformMCMeta(dir, dest);
	await zipFolder(dest, sanitize(`${makeName(buildConfig.combinedName)}.zip`).toLowerCase());
	log("Zipped Combined!");
}
