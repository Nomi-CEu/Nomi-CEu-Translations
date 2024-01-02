import buildConfig from "../buildConfig";
import { McMeta } from "../types/mcmeta";
import sanitize from "sanitize-filename";
import { setOutput } from "@actions/core";
import { modulesFile } from "../globals";

let date: string;

export function makeName(bodyName: string): string {
	const body = makeArtifactNameBody();
	if (body) return `${buildConfig.baseName}-${makeArtifactNameBody()}-${bodyName}`;
	return `${buildConfig.baseName}-${bodyName}`;
}

export async function makeGHAFileName(): Promise<void> {
	const name = process.env.MODULE;
	setOutput("file", sanitize(makeName(name).toLowerCase()));
}

/**
 * Returns artifact name body depending on environment variables.
 * Mostly intended to be called by CI/CD.
 */
export function makeArtifactNameBody(): string {
	// If the tag is provided by CI, simply just glue it to the base name.
	if (process.env.GITHUB_TAG) {
		return `${process.env.GITHUB_TAG}`;
	}
	// If Pull Request Branch Name is provided and a 'True SHA' is provided
	else if (process.env.GITHUB_HEAD_REF && process.env.TRUE_SHA) {
		const shortCommit = process.env.TRUE_SHA.substring(0, 7);
		return `${process.env.GITHUB_HEAD_REF}-${shortCommit}`;
	}
	// If SHA and ref is provided, append both the branch and short SHA.
	else if (process.env.GITHUB_SHA && process.env.GITHUB_REF && process.env.GITHUB_REF.startsWith("refs/heads/")) {
		const shortCommit = process.env.GITHUB_SHA.substring(0, 7);
		const branch = /refs\/heads\/(.+)/.exec(process.env.GITHUB_REF);
		return `${branch[1]}-${shortCommit}`;
	} else {
		return "";
	}
}

export function transformMCMetaObj(mcMeta: McMeta): void {
	const body = makeArtifactNameBody();
	mcMeta.pack.description = mcMeta.pack.description + ` (Build ${body ? body : getDate()})`;
}

function padNum(num: number) {
	return num.toString().padStart(2, "0");
}

function getDate(): string {
	if (date) return date;
	const dateObj = new Date();
	date =
		[dateObj.getFullYear(), padNum(dateObj.getMonth() + 1), padNum(dateObj.getDate())].join("-") +
		"_" +
		[padNum(dateObj.getHours()), padNum(dateObj.getMinutes()), padNum(dateObj.getSeconds())].join(".");
	return date;
}
