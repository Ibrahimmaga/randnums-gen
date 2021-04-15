"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
exports.acceptedKeys = ['types', 'typings', 'main', 'module', 'exports', 'repository', 'bin', 'browser', 'files'];
function performPublishConfigOverrides(packagesToPublish, packageInfos) {
    // Everything in publishConfig in accepted keys here will get overridden & removed from the publishConfig section
    for (const pkgName of packagesToPublish) {
        const info = packageInfos[pkgName];
        const packageJson = fs.readJSONSync(info.packageJsonPath);
        if (packageJson.publishConfig) {
            for (const key of exports.acceptedKeys) {
                const value = packageJson.publishConfig[key];
                packageJson[key] = value;
                delete packageJson.publishConfig[key];
            }
        }
        fs.writeJSONSync(info.packageJsonPath, packageJson, { spaces: 2 });
    }
}
exports.performPublishConfigOverrides = performPublishConfigOverrides;
//# sourceMappingURL=performPublishConfigOverrides.js.map