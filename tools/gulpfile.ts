// noinspection JSUnusedGlobalSymbols,UnnecessaryLocalVariableJS

import gulp from "gulp";
import { compressModulesTask, copyModulesTask } from "./tasks/compressModulesTask";
import { compressCombinedTask } from "./tasks/compressCombinedTask";
import { setup } from "./tasks/shared";

export const compressModules = gulp.series(setup, compressModulesTask);
export const copyModules = gulp.series(setup, copyModulesTask);
export const compressCombined = gulp.series(setup, compressCombinedTask);
export const copyCombined = gulp.series(setup, compressCombinedTask);

exports.default = gulp.series(setup, gulp.parallel(compressModulesTask, compressCombinedTask));
