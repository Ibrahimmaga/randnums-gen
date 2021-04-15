import { ChangeFileInfo } from '../types/ChangeInfo';
import { BeachballOptions } from '../types/BeachballOptions';
/**
 * Uses `prompts` package to prompt for change type and description, fills in git user.email and scope
 */
export declare function promptForChange(options: BeachballOptions): Promise<{
    [pkgname: string]: ChangeFileInfo;
} | undefined>;
//# sourceMappingURL=promptForChange.d.ts.map