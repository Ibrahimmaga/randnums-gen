"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unlinkChangeFiles_1 = require("../changefile/unlinkChangeFiles");
const writeChangelog_1 = require("../changelog/writeChangelog");
const fs_extra_1 = __importDefault(require("fs-extra"));
function writePackageJson(modifiedPackages, packageInfos) {
    for (const pkgName of modifiedPackages) {
        const info = packageInfos[pkgName];
        const packageJson = fs_extra_1.default.readJSONSync(info.packageJsonPath);
        packageJson.version = info.version;
        ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depKind => {
            // updatedDeps contains all of the dependencies in the bump info since the beginning of a build job
            const updatedDepsVersions = info[depKind];
            if (updatedDepsVersions) {
                // to be cautious, only update internal && modifiedPackages, since some other dependency
                // changes could have occurred since the beginning of the build job and the next merge step
                // would overwrite those incorrectly!
                const modifiedDeps = Object.keys(updatedDepsVersions).filter(dep => modifiedPackages.has(dep));
                for (const dep of modifiedDeps) {
                    if (packageJson[depKind] && packageJson[depKind][dep]) {
                        packageJson[depKind][dep] = updatedDepsVersions[dep];
                    }
                }
            }
        });
        fs_extra_1.default.writeJSONSync(info.packageJsonPath, packageJson, { spaces: 2 });
    }
}
exports.writePackageJson = writePackageJson;
/**
 * Performs the bump, writes to the file system
 *
 * deletes change files, update package.json, and changelogs
 */
function performBump(bumpInfo, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { modifiedPackages, packageInfos, changes, dependentChangeInfos } = bumpInfo;
        writePackageJson(modifiedPackages, packageInfos);
        if (options.generateChangelog) {
            // Generate changelog
            yield writeChangelog_1.writeChangelog(options, changes, dependentChangeInfos, packageInfos);
        }
        if (!options.keepChangeFiles) {
            // Unlink changelogs
            unlinkChangeFiles_1.unlinkChangeFiles(changes, packageInfos, options.path);
        }
    });
}
exports.performBump = performBump;
//# sourceMappingURL=performBump.js.map