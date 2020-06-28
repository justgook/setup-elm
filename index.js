const core = require('@actions/core');
const cache = require('@actions/cache');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
const io = require('@actions/io');
const ioUtil = require('@actions/io/lib/io-util.js');
const { getConfig } = require("./config");

async function setupCompiler(version, elmHome) {
    try {
        elmHome = elmHome === ''
            ? (process.env.ELM_HOME || `${process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']}/elm_home`)
            : elmHome;

        let elmCompiler = await io.which('elm', false);

        if (core.getInput('cache')) {
            core.info('Trying to restore cached ELM config');
            const { paths, key, restoreKeys } = getConfig(elmHome);
            await cache.restoreCache(paths, key, restoreKeys)
        }

        if (elmCompiler === '') {
            elmCompiler = tc.find(`elm-${process.platform}`, version, 'x64');
        }


        if (await ioUtil.exists(`${elmHome}/elm`)) {
            elmCompiler = `${elmHome}/elm`;
        }


        if (elmCompiler === '') {
            core.info(`Downloading Elm ${version} for ${process.platform} ...`);
            let elmDownloadPath = '';
            if (process.platform === 'win32') {
                elmDownloadPath = await tc.downloadTool(`https://github.com/elm/compiler/releases/download/${version}/binary-for-windows-64-bit.gz`);
            } else if (process.platform === 'linux') {
                elmDownloadPath = await tc.downloadTool(`https://github.com/elm/compiler/releases/download/${version}/binary-for-linux-64-bit.gz`);
            } else if (process.platform === 'darwin') {
                elmDownloadPath = await tc.downloadTool(`https://github.com/elm/compiler/releases/download/${version}/binary-for-mac-64-bit.gz`);
            } else {
                core.setFailed(`There is no elm for "${process.platform}"`);
            }
            const newPath =
                process.platform === 'win32'
                    ? elmDownloadPath.replace(/\\[^\\]+$/, "\\elm.gz")
                    : elmDownloadPath.replace(/\/[^\/]+$/, "/elm.gz");
            await ioUtil.rename(elmDownloadPath, newPath);
            elmDownloadPath = newPath;

            if (process.platform === 'win32') {
                await exec.exec(`gzip -df \"${elmDownloadPath}\"`);
                if (await ioUtil.exists(`${elmHome}`)) {
                    await exec.exec(`mkdir ${elmHome}`);
                }
            } else {
                await exec.exec(`gunzip ${elmDownloadPath}`);
            }

            elmCompiler = `${elmHome}/elm`;
            await exec.exec(`cp ${elmDownloadPath.replace('.gz', '')} ${elmCompiler}`);
            await exec.exec(`chmod +x ${elmCompiler}`);
            await tc.cacheFile(elmCompiler, 'elm', `elm-${process.platform}`, version);

        }
        core.addPath(elmCompiler.replace(/elm$/, ''));
        core.exportVariable('ELM_HOME', elmHome);
        core.setOutput('elm-home', elmHome);
    } catch (error) {
        core.setFailed(error.message);
    }
}


setupCompiler(core.getInput('elm-version'), core.getInput('elm-home'));

