import { cleanUp, createDirs } from "./util";
import buildConfig from "../buildConfig";
import { zipOrCopyCombined } from "./compressCombinedTask";
import { modulesFile } from "../globals";
import { zipOrCopyModule } from "./compressModulesTask";

export async function setup(): Promise<void> {
	await cleanUp(buildConfig.buildDestinationDirectory);
	await createDirs(buildConfig.buildDestinationDirectory);
}

export async function compressSpecifiedModuleTask(): Promise<void> {
	return zipOrCopySpecifiedModule(true);
}

export async function copySpecifiedModuleTask(): Promise<void> {
	return zipOrCopySpecifiedModule(false);
}

async function zipOrCopySpecifiedModule(zip: boolean) {
	let module = process.env.MODULE;
	if (!module) throw new Error("Module Env Variable must not be empty.");
	module = module.trim();
	if (module === buildConfig.combinedName) return zipOrCopyCombined(zip);
	if (!modulesFile.modules.includes(module))
		throw new Error(
			`Module Env Variable must be a module specified in module.json, or 'combined'. Found: '${module}'. Accepted: [${modulesFile.modules.join(
				", ",
			)}, combined].`,
		);

	return zipOrCopyModule(zip, module);
}
