const path = require ('path');
const fs = require ('fs');
const tmp = require ('tmp');
const Git = require ('nodegit');
const Promise = require ('bluebird');
const shelljs = require ('shelljs');
const logger = require ('../lib/logger');

ROOT_DIR = path.join (__dirname, '..', '..');
NODE_MOD_DIR = path.join (ROOT_DIR, 'node_modules');

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
  await exec (cmd, destDir);
};

const buildEos = async (destDir, argv) => {
  logger.info (
    `Building eos... This could take a while, so go grab a cup of coffee ☕️`
  );
  opensslRoot = path.join (
    NODE_MOD_DIR,
    'nodegit',
    'vendor',
    'openssl',
    'openssl'
  );
  // secp256k1Lib = path.join (NODE_MOD_DIR, 'secp256k1', 'build', 'Release');
  // secp256k1Include = path.join (
  //   NODE_MOD_DIR,
  //   'secp256k1',
  //   'src',
  //   'secp256k1-src',
  //   'include'
  // );

  const cmakeJs = path.join (NODE_MOD_DIR, '.bin', 'cmake-js');

  const cmd = `${cmakeJs} --CDOPENSSL_ROOT_DIR="${opensslRoot}" --CDCMAKE_C_COMPILER=clang --CDCMAKE_CXX_COMPILER=clang++ --std c++14`;
  await exec (cmd, destDir);

  await exec (`make`, destDir);
};

const installEos = async destDir => {
  logger.info (`Installing EOS`);
  const cmd = `make install`;
  await exec (cmd, destDir);
};

const handleSetup = async argv => {
  //const rootDir = argv.eosInstallDirectory;
  //const destDir = path.join (rootDir, 'eosio');
  tmp.dir (async (err, path, cleanupCallback) => {
    if (err) throw err;
    process.chdir (path);

    logger.debug (`Working in directory: ${path}`);
    const destDir = argv.eosInstallDirectory;
    // console.log ('argv ->', destDir);
    await cloneEosIfNecessary (destDir);
    await updateSubmodules (destDir);
    await buildEos (destDir, argv);
    if (argv.install) {
      await installEos (destDir);
    }

    // Manual cleanup
    cleanupCallback ();
  });
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
