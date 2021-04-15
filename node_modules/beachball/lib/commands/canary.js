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
const semver_1 = __importDefault(require("semver"));
const gatherBumpInfo_1 = require("../bump/gatherBumpInfo");
const performBump_1 = require("../bump/performBump");
const setDependentVersions_1 = require("../bump/setDependentVersions");
const getPackageInfos_1 = require("../monorepo/getPackageInfos");
const listPackageVersions_1 = require("../packageManager/listPackageVersions");
const publishToRegistry_1 = require("../publish/publishToRegistry");
function canary(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const oldPackageInfo = getPackageInfos_1.getPackageInfos(options.path);
        const bumpInfo = gatherBumpInfo_1.gatherBumpInfo(options);
        options.keepChangeFiles = true;
        options.generateChangelog = false;
        options.tag = options.canaryName || 'canary';
        if (options.all) {
            for (const pkg of Object.keys(oldPackageInfo)) {
                bumpInfo.modifiedPackages.add(pkg);
            }
        }
        const packageVersions = yield listPackageVersions_1.listPackageVersions([...bumpInfo.modifiedPackages], options.registry);
        for (const pkg of bumpInfo.modifiedPackages) {
            let newVersion = oldPackageInfo[pkg].version;
            do {
                newVersion = semver_1.default.inc(newVersion, 'prerelease', options.canaryName || 'canary');
            } while (packageVersions[pkg].includes(newVersion));
            bumpInfo.packageInfos[pkg].version = newVersion;
        }
        setDependentVersions_1.setDependentVersions(bumpInfo.packageInfos, bumpInfo.scopedPackages);
        yield performBump_1.performBump(bumpInfo, options);
        if (options.publish) {
            yield publishToRegistry_1.publishToRegistry(bumpInfo, options);
        }
        else {
            console.log('Skipping publish');
        }
    });
}
exports.canary = canary;
//# sourceMappingURL=canary.js.map