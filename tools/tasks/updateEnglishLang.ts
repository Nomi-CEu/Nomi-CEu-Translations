import simpleGit from "simple-git";
import buildConfig from "../buildConfig";
import { checkModuleEnv, copy } from "./util";
import { assetsFolderName, cloneDirectory, modulesFile, rootDirectory, shouldTransformQuestBook } from "../globals";
import upath from "upath";
import del from "del";
import log from "fancy-log";
import { transformQuestBook } from "./moduleSpecific/transformQuestBook";
import { setOutput } from "@actions/core";

export async function updateEnglishLangTask(): Promise<void> {
	checkModuleEnv(false);

	const module = modulesFile.modules.find((module) => module.name === process.env.MODULE.trim());

	const git = simpleGit();

	// Remove Clone Dir, if it exists
	await del(cloneDirectory, { force: true });
	const cloneLink = `${module.git}.git`;
	log(`Cloning into ${cloneLink}...`);
	await git.clone(cloneLink, cloneDirectory, []);
	log(`Cloned into ${cloneLink}!`);

	// Transform Quest Book if Needed
	if (shouldTransformQuestBook(module)) {
		await transformQuestBook();
	}

	await copy(
		upath.join(cloneDirectory, module.pathToAssets),
		upath.join(rootDirectory, module.name, assetsFolderName),
		buildConfig.copyEnglishLangGlobs,
	);

	// Must specify simple git in clone dir to work
	const hash = (await simpleGit(cloneDirectory).log()).latest.hash;
	setOutput("module", JSON.stringify(module));
	setOutput("link", `${module.git}/commit/${hash}`);
}
