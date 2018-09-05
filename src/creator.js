const fs = require('fs-extra');
const logger = require('./lib/logger').createNewLogger();
const request = require('request');
const ghdownload = require('github-download');
const tmp = require('tmp');
const cwd = require('process').cwd();

module.exports = async function (opts = {}) {

    // helper functions (note: move to fileHelper lib)
    const isEmptyDir = (dir) => { 
        const files = fs.readdirSync(dir);
        return files.length === 0;
    }

    // main functions
    const checkForEmptyCreateDirectory = dir => {
        logger.info(`making sure destination directory is empty...`);
        if (!isEmptyDir(dir)) {
            throw 'Please run `eoshuffle init` from an empty directory.';
        }
        logger.info(`directory ${dir} is empty`);
    }

    const templateExists = templateUrl => {
        logger.info('checking that template exists...');

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
                logger.debug(`template does exist.`);
                resolve(true);
            })
        })

    }

    const setupTempDir = () => {
        logger.info('setting up temporary directory...');
        const tmpDirObject = tmp.dirSync({
            dir: cwd,
            unsafeCleanup: true
        })
        logger.info('set up temporary directory:', tmpDirObject.name);
        return tmpDirObject;
    }

    const downloadTemplate = (url, tempDirectory) => {
        logger.info('downloading template...');
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

    const copyTempDirToDestination = async (tempDir, destination) => {
        logger.info('copying template to destination folder...');
        await fs.copy(tempDir, destination);
        logger.info(`copied ${tempDir} to ${destination}`)
    }

    this.create = async (template, destination) => {

        const templateUrl = `https://github.com/eoshuffle/eoshuffle-init-${template}`;

        try {
            checkForEmptyCreateDirectory(destination)
            await templateExists(templateUrl);
            const tempDirObject = setupTempDir();
            await downloadTemplate(templateUrl, tempDirObject.name);
            await copyTempDirToDestination(tempDirObject.name, destination);
            tempDirObject.removeCallback();
        } catch (e) {
            logger.error ('Error occured while creating project:', e);
        }
    }

    return this;
}