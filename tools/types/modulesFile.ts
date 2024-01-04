export interface ModulesFile {
	modules: Module[];
}

export interface Module {
	/**
	 * The Name of the Module. Has to be a folder in the root directory of this project. Will also be the name of the output zip.
	 */
	name: string;

	/**
	 * The formatted name of the Module, used in English Lang Update Commit Messages.
	 */
	formattedName: string;

	/**
	 * Link to the project's github page (without a slash at the end)
	 */
	git: string;

	/**
	 * Path from base of the repo to the assets folder where the en_us.langs are grabbed from.
	 */
	pathToAssets: string;
}
