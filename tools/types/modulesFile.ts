export interface ModulesFile {
	modules: Module[];
}

export interface Module {
	/**
	 * Must be same as the name of the directory.
	 */
	name: string;

	/**
	 * HTTPS link to the git object to clone (for GitHub Repos, end the link in .git)
	 */
	git: string;

	/**
	 * Path from base of the repo to the assets folder where the en_us.langs are grabbed from.
	 */
	pathToAssets: string;
}
