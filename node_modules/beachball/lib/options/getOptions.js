"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getCliOptions_1 = require("./getCliOptions");
const getRepoOptions_1 = require("./getRepoOptions");
const getDefaultOptions_1 = require("./getDefaultOptions");
/**
 * Gets all repo level options (default + root options + cli options)
 */
function getOptions(argv) {
    const cliOptions = getCliOptions_1.getCliOptions(argv);
    return Object.assign(Object.assign(Object.assign({}, getDefaultOptions_1.getDefaultOptions()), getRepoOptions_1.getRepoOptions(cliOptions)), cliOptions);
}
exports.getOptions = getOptions;
//# sourceMappingURL=getOptions.js.map