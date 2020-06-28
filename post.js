const core = require('@actions/core');
const cache = require('@actions/cache');
const { getConfig } = require("./config");

if (core.getInput('cache')) {
    core.info('Saving ELM packages');
    const { paths, key } = getConfig(process.env.ELM_HOME);
    cache.saveCache(paths, key)
        .then(function () {
            core.info('Cache Saved');
        })
        .catch(function (error) {
            core.info(error.message);
        })
}
