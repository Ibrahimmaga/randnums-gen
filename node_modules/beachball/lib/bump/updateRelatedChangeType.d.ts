import { BumpInfo } from '../types/BumpInfo';
import { ChangeInfo } from '../types/ChangeInfo';
/**
 * Updates package change types based on dependents (e.g given A -> B, if B has a minor change, A should also have minor change)
 *
 * This function is recursive and will futher call itself to update related dependent packages noting groups and bumpDeps flag
 */
export declare function updateRelatedChangeType(pkgName: string, changeInfo: ChangeInfo, bumpInfo: BumpInfo, dependentChangeInfos: Map<string, Map<string, ChangeInfo>>, bumpDeps: boolean): void;
//# sourceMappingURL=updateRelatedChangeType.d.ts.map