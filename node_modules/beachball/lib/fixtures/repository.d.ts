export declare const packageJsonFixture: {
    name: string;
    version: string;
    dependencies: {
        bar: string;
        baz: string;
    };
};
export declare class RepositoryFactory {
    root?: string;
    /** Cloned child repos, tracked so we can clean them up */
    childRepos: Repository[];
    create(): void;
    cloneRepository(): Repository;
    cleanUp(): void;
}
export declare class Repository {
    origin?: string;
    root?: string;
    initialize(): void;
    get rootPath(): string;
    cloneFrom(path: string, originName?: string): void;
    /** Commits a change, automatically uses root path, do not pass absolute paths here */
    commitChange(newFilename: string, content?: string): void;
    /** Commits a change, automatically uses root path, do not pass absolute paths here */
    commitAll(): void;
    getCurrentHash(): string;
    branch(branchName: string): void;
    push(remote: string, branch: string): void;
    cleanUp(): void;
    /**
     * Set to invalid root
     */
    setRemoteUrl(remote: string, remoteUrl: string): void;
}
//# sourceMappingURL=repository.d.ts.map