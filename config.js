const core = require('@actions/core');
const hasha = require('hasha');
const platformAndArch = `${process.platform}${process.arch}`;

export function getConfig(elmHome) {
    let elmHash = 'no-elm-json';
    try {
        elmHash = hasha.fromFileSync(`./elm.json`);
    } catch (error) {
        core.info(error.message);
    }
    const restoreKey = `elm_home-${core.getInput('elm-version')}-${platformAndArch}`;
    const path = elmHome || "~/.elm";
    const key = restoreKey + "-" + elmHash;
    return { key: key, paths: [path], restoreKeys: [restoreKey] };
}
