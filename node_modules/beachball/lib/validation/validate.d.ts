import { BeachballOptions } from '../types/BeachballOptions';
declare type ValidationOptions = {
    allowMissingChangeFiles: boolean;
    allowFetching: boolean;
};
declare type PartialValidateOptions = Partial<ValidationOptions>;
export declare function validate(options: BeachballOptions, validateOptionsOverride?: PartialValidateOptions): {
    isChangeNeeded: boolean;
};
export {};
//# sourceMappingURL=validate.d.ts.map