const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
const io = require('@actions/io');
const ioUtil = require('@actions/io/lib/io-util.js');
const { restoreCache, saveCache } = require('cache/lib/index');


const elmCacheConfig = (() => {
    const o = {
        inputPath: elmHome,
        restoreKeys: `elm_home-${platformAndArch}`
    };
    o.primaryKey = o.restoreKeys; //+ elmJsonHash;
    return o
})();

// const restoreCached = () => {
//     core.info('trying to restore cached ELM cache');
//     return restoreCache(elmCacheConfig.inputPath, elmCacheConfig.primaryKey, elmCacheConfig.restoreKeys);
// };

const saveCached = () => {
    core.info('saving ELM modules');
    return saveCache(elmCacheConfig.inputPath, elmCacheConfig.primaryKey);
};

saveCached();
