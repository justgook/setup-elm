const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
const io = require('@actions/io');
const ioUtil = require('@actions/io/lib/io-util.js');

async function setupCompiler(version, elmHome) {
    let elmCompiler = await io.which('elm', false);
    elmHome = elmHome === '' ? (process.env.ELM_HOME || `${process.env.HOME}/elm_home`) : elmHome;
    if (elmCompiler === '' && await ioUtil.exists(`${elmHome}/elm`)) {
        elmCompiler = `${elmHome}/elm`;
    }
    if (elmCompiler === '') {
        elmCompiler = tc.find(`elm-${process.platform}`, version, 'x64');
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

        try {
            // await io.mv(elmDownloadPath, elmDownloadPath = elmDownloadPath.replace(/\/[^\/]+$/, "/elm.gz"));
            await ioUtil.rename(elmDownloadPath, elmDownloadPath = elmDownloadPath.replace(/\/[^\/]+$/, "/elm.gz"));
            if (process.platform === 'win32') {
                await exec.exec(`gzip -d ${elmDownloadPath}`);
            } else {
                await exec.exec(`gunzip ${elmDownloadPath}`);
            }

            elmCompiler = `${elmHome}/elm`;
            await io.mv(elmDownloadPath.replace(`.gz`, ''), elmCompiler);
            await exec.exec(`chmod +x ${elmCompiler}`);
            await tc.cacheFile(elmCompiler, 'elm', `elm-${process.platform}`, version);

        } catch (error) {
            core.setFailed(error.message);
        }
    }
    core.addPath(elmCompiler.replace(/elm$/, ''));
    core.exportVariable('ELM_HOME', elmHome);
    core.setOutput('elm-home', elmHome);
}

setupCompiler(core.getInput('elm-version'), core.getInput('elm-home'));

