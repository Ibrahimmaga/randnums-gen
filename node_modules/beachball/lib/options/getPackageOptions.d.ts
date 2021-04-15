import { PackageOptions } from '../types/BeachballOptions';
/**
 * Gets all package level options (default + root options + package options + cli options)
 * This function inherits packageOptions from the repoOptions
 */
export declare function getCombinedPackageOptions(actualPackageOptions: Partial<PackageOptions>): PackageOptions;
/**
 * Gets all the package options from the configuration file of the package itself without inheritance
 */
export declare function getPackageOptions(packagePath: string): Partial<PackageOptions>;
//# sourceMappingURL=getPackageOptions.d.ts.map