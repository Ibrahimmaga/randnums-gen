import { PackageInfo } from '../types/PackageInfo';
export declare function getNpmPackageInfo(packageName: string, registry: string, token?: string | null): Promise<any>;
export declare function listPackageVersionsByTag(packageInfos: PackageInfo[], registry: string, tag: string, token?: string | null): Promise<{
    [pkg: string]: string;
}>;
export declare function listPackageVersions(packageList: string[], registry: string): Promise<{
    [pkg: string]: string[];
}>;
//# sourceMappingURL=listPackageVersions.d.ts.map