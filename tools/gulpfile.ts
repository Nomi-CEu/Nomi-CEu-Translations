// noinspection JSUnusedGlobalSymbols,UnnecessaryLocalVariableJS

import gulp from "gulp";
import { compressModulesTask, copyModulesTask } from "./tasks/compressModulesTask";
import { compressCombinedTask, copyCombinedTask } from "./tasks/compressCombinedTask";
import { compressSpecifiedModuleTask, copySpecifiedModuleTask, setup } from "./tasks/shared";
import { makeGHAFileNames } from "./tasks/name";
import { updateEnglishLangTask } from "./tasks/updateEnglishLang";

export const compressModules = gulp.series(setup, compressModulesTask);
export const copyModules = gulp.series(setup, copyModulesTask);
export const compressCombined = gulp.series(setup, compressCombinedTask);
export const copyCombined = gulp.series(setup, copyCombinedTask);
export const compressSpecifiedModule = gulp.series(setup, compressSpecifiedModuleTask);
export const copySpecifiedModule = gulp.series(setup, copySpecifiedModuleTask);

export const makeGHANames = gulp.series(makeGHAFileNames);

export const updateEnglishLang = gulp.series(setup, updateEnglishLangTask);

exports.default = gulp.series(setup, compressModulesTask, compressCombinedTask);
