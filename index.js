const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
const io = require('@actions/io');

async function setupCompiler(version) {
    let elmCompiler = tc.find(`elm-${process.platform}`, version, 'x64');
    if (elmCompiler === '') {
        core.info(`Downloading Elm ${version} - ${process.platform} ...`);
        let elmDowloadPath = '';
        if (process.platform === 'win32') {
            elmDowloadPath = await tc.downloadTool(`https://github.com/elm/compiler/releases/download/${version}/binary-for-windows-64-bit.gz`);
        } else if (process.platform === 'linux') {
            elmDowloadPath = await tc.downloadTool(`https://github.com/elm/compiler/releases/download/${version}/binary-for-linux-64-bit.gz`);
        } else if (process.platform === 'darwin') {
            elmDowloadPath = await tc.downloadTool(`https://github.com/elm/compiler/releases/download/${version}/binary-for-mac-64-bit.gz`);
        } else {
            core.setFailed(`There is no elm for "${process.platform}"`);
        }

        console.log("elmCompilerPath", elmDowloadPath);

        try {
            await exec.exec(`gunzip elmCompilerPath`);
            // elmCompiler = await tc.extractZip(elmCompilerPath, `${process.env.HOME}/elm`);

        }
        catch (error) {
            core.setFailed(error.message);
        }
        // await exec.exec(`ls ${elmCompiler}`)
        // await io.mv('path/to/file', 'path/to/dest');
        //
        // tc.cacheFile(elmCompilerPath, 'elm', `elm-${process.platform}`, version);
        //
        // await exec.exec(`chmod +x ${process.env.HOME}/elm`);
    }

    // core.addPath(elmCompiler);


}




async function setElmHome(elmHome) {
    core.getInput('elm-home');
    core.exportVariable('ELM_HOME', 'Val');
}


// setupCompiler('0.19.1')

setupCompiler(core.getInput('elm-version'));
// setElmHome(core.getInput('elm-home'))
