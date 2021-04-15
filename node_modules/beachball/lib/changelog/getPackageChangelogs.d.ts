import { ChangeInfo, ChangeSet } from '../types/ChangeInfo';
import { PackageInfo } from '../types/PackageInfo';
import { PackageChangelog } from '../types/ChangeLog';
export declare function getPackageChangelogs(changeSet: ChangeSet, dependentChangeInfos: Array<ChangeInfo>, packageInfos: {
    [pkg: string]: PackageInfo;
}): {
    [pkgName: string]: PackageChangelog;
};
//# sourceMappingURL=getPackageChangelogs.d.ts.map