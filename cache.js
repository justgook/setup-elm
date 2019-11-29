const core = require('@actions/core');
const cache  = require('cache/lib/index');

const platformAndArch = `${process.platform}-${process.arch}`;
const elmCacheConfig_ = ((elmHome) => {
    const o = {
        inputPath: elmHome || "~/.elm",
        restoreKeys: `elm_home-${platformAndArch}`
    };
    o.primaryKey = o.restoreKeys; //+ elmJsonHash;
    return o
});

export const restoreCached = (elmHome) => {
    core.info('Trying to restore cached ELM cache');
    const elmCacheConfig = elmCacheConfig_(elmHome);
    return cache.restoreCache(elmCacheConfig.inputPath, elmCacheConfig.primaryKey, elmCacheConfig.restoreKeys);
};

export const saveCached = () => {
    core.info('Saving ELM packages');
    const elmCacheConfig = elmCacheConfig_(process.env.ELM_HOME);
    return cache.saveCache(elmCacheConfig.inputPath, elmCacheConfig.primaryKey);
};


