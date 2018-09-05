const path = require('path');
const Eos = require('../lib');
const creator = require('../creator');

const create = async function (argv) {
    creator (argv).then (async creator => {
        await creator.create (argv.template, argv.dir);
    })
}

module.exports = {
  command: 'init [template] [dir]',
  desc: 'Initialize an eos project',
  alias: 'create',
  builder: {
    template: {
      default: 'default'
    },
    dir: {
      default: process.cwd(),
    },
  },
  //handler: argv => {
  //    console.log('init called for dir', argv.dir);
  //},
  handler: create,
};
