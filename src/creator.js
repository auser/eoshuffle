const fs = require('fs');
// const lib = require ('./lib');
const request = require('request');
const ghdownload = require('github-download');
const tmp = require('tmp');
const cwd = require('process').cwd();

module.exports = async function (opts = {}) {
    // const { logger } = await lib (opts);

    // helper functions (note: move to fileHelper lib)
    const isEmptyDir = (dir) => { 
        const files = fs.readdirSync(dir);
        return files.length === 0;
    }

    // main functions
    const checkForEmptyCreateDirectory = dir => {
        console.log(`making sure destination directory is empty...`);
        if (!isEmptyDir(dir)) {
            throw 'Please run `eoshuffle init` from an empty directory.';
        }
        console.log(`directory ${dir} is empty`);
    }

    const templateExists = templateUrl => {
        console.log('checking that template exists...');

        const options = {
            method: 'HEAD',
            uri: templateUrl,
        };

        return new Promise((resolve, reject) => {
            request(options, (e, response) => {
                if (e) {
                    return reject(e);
                } else if (response.statusCode == 404) {
                    return reject(`Eoshuffle template does not exist at ${templateUrl}`);
                } else if (response.statusCode == !200) {
                    return reject(`Error connecting to github.  Please check your internet connection.`);
                }
                console.log(`template does exist.`);
                resolve(true);
            })
        })

    }

    const setupTempDir = () => {
        console.log('setting up temporary directory...');
        const tmpDirObject = tmp.dirSync({
            dir: cwd,
            unsafeCleanup: true
        })
        console.log('set up temporary directory:', tmpDirObject.name);
        return tmpDirObject;
    }

    const downloadTemplate = (url, tempDirectory) => {
        console.log('downloading template...');
        return new Promise((resolve, reject) => {
            ghdownload(url, tempDirectory)
                .on('error', err => {
                    return reject(err);
                })
                .on('end', () => {
                    resolve();
                })
        })
    }

    const copyTempDirToDestination = (tempDir, destination) => {
        console.log('copying template to destination folder...');
        fs.copy(tempDir, destination);
        console.log(`copied ${tempDir} to ${destination}`)
    }

    this.create = async (template, destination) => {
        // console.log('creator.create received template:', template);
        // console.log('creator.create received dir:', destination);

        const templateUrl = `https://github.com/billbitt/eoshuffle-init-${template}`;

        try {
            checkForEmptyCreateDirectory(destination)
            await templateExists(templateUrl);
            const tempDirObject = setupTempDir();
            await downloadTemplate(templateUrl, tempDirObject.name);
            copyTempDirToDestination(tempDirObject.name, destination);
            tempDirObject.removeCallback();
        } catch (e) {
            console.log ('Error occured while creating project:', e);
        }
    }

    return this;
}