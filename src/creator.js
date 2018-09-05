const fs = require('fs');
// const lib = require ('./lib');
const request = require('request');

module.exports = async function (opts = {}) {
    // const { logger } = await lib (opts);

    function isEmptyDir (dir) { // note: move to fileHelper lib
        const files = fs.readdirSync(dir);
        const filesInDirectory = files.length;
        console.log('files in directory', filesInDirectory)
        return filesInDirectory < 0;
    }

    const templateExists = template => {
        // const url = `https://github.com/auser/eoshuffle-init-${template}`;
        const url = `https://github.com/auser/eos-dapp-starter`;
        console.log('checking for template at', url);

        const options = {
            method: 'HEAD',
            uri: url,
        };

        return new Promise((resolve, reject) => {
            request(options, (e, response) => {
                if (e) {
                    return reject(e);
                } else if (response.statusCode == 404) {
                    return  reject(`Eoshuffle template does not exist at ${url}`);
                } else if (response.statusCode == !200) {
                    return reject(`Error connecting to github.  Please check your internet connection.`);
                }
                console.log(`[x] template '${template}' does exist.`);
                resolve(true);
            })
        })

    }

    const downloadTemplate = async () => {
        console.log('downloading template...');
    }

    const unpackTemplate = async () => {
        console.log('unpacking template...');
    }

    const configureTemplate = async () => {
        console.log('configureing template...');
    }

    const checkForEmptyCreateDirectory = async dir => {
        // check the create directory to make sure the folder is empty
        if (!isEmptyDir(dir)) {
            // throw an error if folder is not empty
            throw 'Please run `eoshuffle init` from an empty directory.';
        }
        console.log(`[x] directory ${dir} is empty`);
    }

    this.create = async (template, destination) => {
        console.log('creator.create received template:', template);
        console.log('creator.create received dir:', destination);

        try {
            // await checkForEmptyCreateDirectory(destination)
            await templateExists(template);
            // copy the requested template to the createDirectory
            await downloadTemplate();
            await unpackTemplate();
            await configureTemplate();
        } catch (e) {
            console.log ('Error occured while creating project:', e);
        }
    }

    return this;
}