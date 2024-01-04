export interface ModulesFile {
	combined: Combined;
	modules: Module[];
}

export interface Combined {
	/**
	 * Name of the Combined Zip. The Directory where the pack.mcmeta and pack.png are grabbed from.
	 */
	name: string;

	/**
	 * Formatted Name of the Combined Zip. Used in log.
	 */
	formattedName: string;
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

	/**
	 * Whether this module should be provided as a separate zip.
	 */
	shouldProvideSeparately: boolean;
}
