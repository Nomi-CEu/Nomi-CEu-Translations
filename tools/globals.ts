import buildConfig from "./buildConfig";
import upath from "upath";
import modulesJson from "../modules.json";
import { Modules } from "./types/modules";

export const allDestDirectory = upath.join(buildConfig.buildDestinationDirectory, "all");
export const rootDirectory = "..";
export const modulesFile = modulesJson as Modules;
