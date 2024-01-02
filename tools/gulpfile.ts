// noinspection JSUnusedGlobalSymbols,UnnecessaryLocalVariableJS

import gulp from "gulp";
import { compressModules } from "./tasks/compressModules";

export const compressAllModules = gulp.series(compressModules);
