const yargs = require ('yargs');
const fs = require ('fs');
const ghdownload = require ('github-download');
const request = require ('request');
const {exec} = require ('shelljs');
const tmp = require ('tmp');

const checkDir = dir => {
  return new Promise ((resolve, reject) => {
    const content = fs.readdirSync (dir);
    if (content.length > 0) {
      const err =
        `Cannot create in directory ${dir}.\n` +
        'Something exists here already. Instead, create ' +
        'rerun the command for a directory that does not exist';

      throw new Error (err);
    }
  });
};

const create = async argv => {
  const dir = argv.dir;
  console.log ('init called for dir', dir);
  await checkDir (dir);
};

module.exports = {
  command: 'init <dir>',
  desc: 'Initialize an eos project',
  alias: 'create',
  builder: yargs =>
    yargs.positional ('dir', {
      describe: 'the directory to create into',
      type: 'string',
      default: process.cwd (),
    }),
  handler: create,
};
