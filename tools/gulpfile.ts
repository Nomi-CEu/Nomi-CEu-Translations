// noinspection JSUnusedGlobalSymbols,UnnecessaryLocalVariableJS

import gulp from "gulp";
import { compressModulesTask } from "./tasks/compressModulesTask";
import { compressCombinedTask } from "./tasks/compressCombinedTask";
import { setup } from "./tasks/shared";

export const compressAllModules = gulp.series(setup, compressModulesTask);
export const compressCombined = gulp.series(setup, compressCombinedTask);
exports.default = gulp.series(setup, gulp.parallel(compressModulesTask, compressCombinedTask));
