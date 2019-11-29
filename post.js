const { saveCached } = require("./cache");
const core = require('@actions/core');
if (core.getInput('cache')) {
    saveCached();
}
