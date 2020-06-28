const core = require('@actions/core');
const hasha = require('hasha');
const ioUtil = require('@actions/io/lib/io-util.js');
const platformAndArch = `${process.platform}${process.arch}`;

export function getConfig(elmHome) {
    let elmHash = 'no-elm-json';
    if (ioUtil.exists(`./elm.json`)) {
        elmHash = hasha.fromFileSync(`./elm.json`);
    }
    const restoreKey = `elm_home-${core.getInput('elm-version')}-${platformAndArch}`;
    const path = elmHome || "~/.elm";
    const key = restoreKey + "-" + elmHash;
    return { key: key, paths: [path], restoreKeys: [restoreKey] };
}
