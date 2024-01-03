import simpleGit from "simple-git";
import buildConfig from "../buildConfig";
import { checkModuleEnv, copy } from "./util";
import { assetsFolderName, cloneDirectory, modulesFile, rootDirectory } from "../globals";
import upath from "upath";
import del from "del";
import log from "fancy-log";

export async function cloneRepo(): Promise<void> {
	checkModuleEnv(false);

	const module = modulesFile.modules.find((module) => module.name === process.env.MODULE.trim());

	const git = simpleGit();

	// Remove Clone Dir, if it exists
	await del(cloneDirectory, { force: true });
	log(`Cloning into ${module.git}...`);
	await git.clone(module.git, cloneDirectory, []);
	log(`Cloned into ${module.git}!`);

	await copy(
		upath.join(cloneDirectory, module.pathToAssets),
		upath.join(rootDirectory, module.name, assetsFolderName),
		buildConfig.copyEnglishLangGlobs,
	);
}
