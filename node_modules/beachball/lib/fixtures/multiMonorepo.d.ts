import { RepositoryFactory } from './repository';
import { PackageJson } from '../types/PackageInfo';
export declare const packageJsonFixtures: {
    [path: string]: PackageJson;
};
export declare class MultiMonoRepoFactory extends RepositoryFactory {
    root?: string;
    create(): void;
}
//# sourceMappingURL=multiMonorepo.d.ts.map