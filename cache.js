const core = require('@actions/core');
const cache = require('@actions/cache');
const hasha = require('hasha');

const platformAndArch = `${process.platform}${process.arch}`;
const elmCacheConfig_ = ((elmHome) => {
    let elmHash = 'no-elm-json';
    try {
        elmHash = hasha.fromFileSync(`./elm.json`);
    } catch (error) {
        core.info(error.message);
    }
    const o = {
        inputPath: elmHome || "~/.elm",
        restoreKeys: `elm_home-${core.getInput('elm-version')}-${platformAndArch}`
    };
    o.primaryKey = o.restoreKeys + "-" + elmHash;
    return o
});

export const restoreCached = (elmHome) => {
    core.info('Trying to restore cached ELM cache');
    const elmCacheConfig = elmCacheConfig_(elmHome);
    return cache.restoreCache(elmCacheConfig.inputPath, elmCacheConfig.primaryKey, [elmCacheConfig.restoreKeys]);
};

export const saveCached = () => {
    core.info('Saving ELM packages');
    const elmCacheConfig = elmCacheConfig_(process.env.ELM_HOME);
    return cache.saveCache(elmCacheConfig.inputPath, elmCacheConfig.primaryKey);
};
