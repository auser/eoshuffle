// const lib = require('./lib');

module.exports = async function (opts = {}) {
    // const { logger } = await lib (opts);

    this.createDirectory = '';
    this.template = 'default';

    this.checkForEmptyCreateDirectory = async dir => {
        // check the create directory to make sure the folder is empty

        // throw an error if folder is not empty

    }

    this.checkTemplateExists = async template => {
        // check to make sure the requrested template exists

        // throw an error if template does not exist

    }

    this.createProject = async => {
        // copy the requested template to the createDirectory

    }

    this.create = async (template, dir) => {
        console.log ('this is a test from creator.create');
        console.log('creator.create received template:', template);
        console.log('creator.create received dir:', dir);

        try {
            this.checkForEmptyCreateDirectory(dir)
            this.checkTemplateExists(template)
        } catch (e) {
            console.log ('Error occured while creating project', e);
        }
    }

    return this;
}