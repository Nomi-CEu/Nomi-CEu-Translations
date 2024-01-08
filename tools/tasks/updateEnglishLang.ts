import simpleGit, { SimpleGit } from "simple-git";
import buildConfig from "../buildConfig";
import { checkModuleEnv, copy } from "./util";
import { assetsFolderName, cloneDirectory, modulesFile, rootDirectory, shouldTransformQuestBook } from "../globals";
import upath from "upath";
import del from "del";
import log, { error } from "fancy-log";
import { transformQuestBook } from "./moduleSpecific/transformQuestBook";
import { setOutput } from "@actions/core";
import { Module } from "../types/modulesFile";

export async function updateEnglishLangTask(): Promise<void> {
	checkModuleEnv(false, "MODULE");

	const module = modulesFile.modules.find((module) => module.name === process.env.MODULE.trim());

	const git = simpleGit();

	// Remove Clone Dir, if it exists
	await del(cloneDirectory, { force: true });
	const cloneLink = `${module.git}.git`;
	log(`Cloning into ${cloneLink}...`);
	await git.clone(cloneLink, cloneDirectory, []);
	log(`Cloned into ${cloneLink}!`);

	const clonedGit = simpleGit(cloneDirectory);
	if (module.branch) await handleBranch(clonedGit, module);

	// Transform Quest Book if Needed
	if (shouldTransformQuestBook(module)) {
		await transformQuestBook();
	}

	const modulePath = upath.join(rootDirectory, module.name);
	await del(
		buildConfig.englishLangGlobs.map((glob) => upath.join(modulePath, glob)),
		{ force: true },
	);

	await copy(
		upath.join(cloneDirectory, module.pathToAssets),
		upath.join(modulePath, assetsFolderName),
		buildConfig.englishLangGlobs,
	);

	// Must specify simple git in clone dir to work
	const hash = (await clonedGit.log()).latest.hash;
	setOutput("module", JSON.stringify(module));
	setOutput("link", `${module.git}/commit/${hash}`);
}

async function handleBranch(clonedGit: SimpleGit, module: Module) {
	const branchData = await clonedGit.branch();
	const remoteBranch = `remotes/origin/${module.branch}`;
	if (module.branch === branchData.current) {
		error(
			`Module '${module.formattedName}' has a specified branch that is the default ('${module.branch}'). This is an error.`,
		);
		return;
	}
	if (!branchData.all.includes(remoteBranch)) {
		error(
			`Module '${module.formattedName}' has a specified branch that is not in the remote repository ('${module.branch}'). This is an error.`,
		);
		return;
	}
	await clonedGit.checkoutBranch(module.branch, remoteBranch);
	log(`Checked Out Branch '${module.branch}'!`);
}
