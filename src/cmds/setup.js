const path = require ('path');
const fs = require ('fs');
const Git = require ('nodegit');
const Promise = require ('bluebird');
const shelljs = require ('shelljs');
const logger = require ('../lib/logger');

const doesDirectoryExist = async dir =>
  new Promise (resolve => {
    fs.exists (dir, b => {
      resolve (b);
    });
  });

const cloneEosIfNecessary = async destDir => {
  const directoryExists = await doesDirectoryExist (destDir);
  if (!directoryExists) {
    const cloneOptions = {
      depth: 1,
    };

    logger.info (`Cloning eos into ${destDir}`);
    const repo = await Git.Clone (
      'https://github.com/EOSIO/eos.git',
      destDir,
      cloneOptions
    );
    logger.info (`Completed cloning of eos`);
  }
};

const exec = async (cmd, destDir, options = {}) => {
  const shellOpts = Object.assign (
    {},
    {
      cwd: destDir,
    },
    options
  );
  return await new Promise ((resolve, reject) => {
    shelljs.exec (cmd, shellOpts, (code, stdout, stderr) => {
      if (code !== 0) {
        return reject (stderr);
      }
      resolve (stdout);
    });
  });
};

const updateSubmodules = async destDir => {
  logger.info (`Updating submodules 🚀`);
  const cmd = `git submodule update --init --recursive`;
  const output = await exec (cmd, destDir);
  console.log ('repo', output);
};

const buildEos = async (destDir, argv) => {
  logger.info (
    `Building eos... This could take a while, so go grab a cup of coffee ☕️`
  );
  const cmd = `./eosio_build.sh`;
  const output = await exec (cmd, destDir);
  console.log ('repo', output);
};

const handleSetup = async argv => {
  const rootDir = argv.eosInstallDirectory;
  const destDir = path.join (rootDir, 'eosio');
  // console.log ('argv ->', destDir);
  await cloneEosIfNecessary (destDir);
  await updateSubmodules (destDir);
  await buildEos (destDir, argv);
};

module.exports = {
  command: 'setup',
  desc: 'Setup eoshuffle (including compiling eoshuffle)',
  alias: 'setup',
  builder: yargs =>
    yargs.option ('install', {
      alias: 'i',
      desc: 'install system-wide',
    }),
  handler: handleSetup,
};
