const fs = require('fs');
// const lib = require ('./lib');

module.exports = async function (opts = {}) {
    // const { logger } = await lib (opts);

    function isEmptyDir (dir) { // note: move to fileHelper lib
        const files = fs.readdirSync(dir);
        const filesInDirectory = files.length;
        console.log('files in directory', filesInDirectory)
        return filesInDirectory < 0;
    }

    function templateExists (template) {

    }

    const checkForEmptyCreateDirectory = async dir => {
        // check the create directory to make sure the folder is empty
        if (!isEmptyDir(dir)) {
            // throw an error if folder is not empty
            throw 'Please run `eoshuffle init` from an empty directory.';
        }
        console.log(`[x] directory ${dir} is empty`);
    }

    const checkTemplateExists = async template => {
        // check to make sure the requrested template exists
        if (!folderExists(template, './templates')) {
            throw new Error('The requested template does not exist.');
        }
        // throw an error if template does not exist
        console.log(`[x] template ${template} does exist in /eoshuffle/templates`);

    }

    const createProject = async => {
        // copy the requested template to the createDirectory

    }

    this.create = async (template, dir) => {
        console.log ('this is a test from creator.create');
        console.log('creator.create received template:', template);
        console.log('creator.create received dir:', dir);

        try {
            await checkForEmptyCreateDirectory(dir)
            await checkTemplateExists(template)
            await createProject(dir, template)
        } catch (e) {
            console.log ('Error occured while creating project:', e);
        }
    }

    return this;
}