const core = require('@actions/core');
const cache = require('@actions/cache');
const { getConfig } = require("./config");

if (core.getInput('cache')) {
    core.info('Saving ELM packages');
    const {paths, key} = getConfig(process.env.ELM_HOME);
    cache.saveCache(paths, key);
}
