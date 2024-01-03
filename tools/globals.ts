import buildConfig from "./buildConfig";
import upath from "upath";
import modulesJson from "../modules.json";
import { Module, ModulesFile } from "./types/modulesFile";

export const rootDirectory = "..";
export const cloneDirectory = upath.join(buildConfig.buildDestinationDirectory, "clone");
export const assetsFolderName = "assets";
export const modulesFile = modulesJson as ModulesFile;

export const shouldTransformQuestBook = (module: Module): boolean => module.name === "nomi-ceu";
