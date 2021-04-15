"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tmp = __importStar(require("tmp"));
// tmp is supposed to be able to clean up automatically, but this doesn't always work within jest.
// So we attempt to use its built-in cleanup mechanisms, but tests should ideally do their own cleanup too.
// Clean up created directories when the program exits (even on uncaught exception)
tmp.setGracefulCleanup();
function tmpdir(options) {
    // "unsafe" means delete on exit even if it still contains files...which actually is safe
    return tmp.dirSync(Object.assign(Object.assign({}, options), { unsafeCleanup: true })).name;
}
exports.tmpdir = tmpdir;
//# sourceMappingURL=tmpdir.js.map