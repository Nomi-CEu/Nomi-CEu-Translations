export interface ModulesFile {
	modules: Module[];
}

export interface Module {
	/**
	 * The Name of the Module. Has to be a folder in the root directory of this project. Will also be the name of the output zip.
	 */
	name: string;

	/**
	 * HTTP link to the git object to clone (for GitHub Repos, end the link in .git). Example: https://github.com/Nomi-CEu/Nomi-CEu-Translations.git (for this project)
	 */
	git: string;

	/**
	 * Path from base of the repo to the assets folder where the en_us.langs are grabbed from.
	 */
	pathToAssets: string;
}
