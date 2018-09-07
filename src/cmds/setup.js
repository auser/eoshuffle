const path = require ('path');
const fs = require ('fs');
const tmp = require ('tmp');
const Git = require ('nodegit');
const Promise = require ('bluebird');
const shelljs = require ('shelljs');
const logger = require ('../lib/logger');

const ROOT_DIR = path.join (__dirname, '..', '..');
const NODE_MOD_DIR = path.join (ROOT_DIR, 'node_modules');
const SRC_DIR = path.join (ROOT_DIR, 'src');
const THIRD_PARTY = path.join (SRC_DIR, 'third_party');

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

const exec = async (cmd, destDir = process.cwd (), options = {}) => {
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

  const cmd = `cmake -DCMAKE_BUILD_TYPE=Debug -DOPENSSL_ROOT_DIR="${opensslRoot}" -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ -std=c++14 ..`;
  await exec (cmd);

  await exec (`make`);
};

const buildsecp256k1 = async destDir => {
  const workingDir = path.join (
    THIRD_PARTY,
    'secp256k1-zkp',
    'secp256k1-build'
  );
  let stats;
  try {
    stats = fs.lstatSync (path.join (workingDir, 'lib', 'libsecp256k1.a'));
  } catch (e) {}

  if (!stats || !stats.isFile ()) {
    logger.info (`Building secp256k1-zkp`);
    const cmds = [
      `${workingDir}/autogen.sh`,
      `${workingDir}/configure --prefix=${workingDir}`,
      `make`,
      `make install`,
    ];
    return Promise.each (cmds, async cmd => {
      await exec (cmd, workingDir);
    });
  } else {
    logger.info (`Secp256k1 is already built`);
    return Promise.resolve (stats);
  }
};

const installEos = async destDir => {
  logger.info (`Installing EOS`);
  const cmd = `make install`;
  await exec (cmd, destDir);
};

const handleSetup = async argv => {
  //const rootDir = argv.eosInstallDirectory;
  //const destDir = path.join (rootDir, 'eosio');
  // tmp.dir (async (err, currPath, cleanupCallback) => {
  // if (err) throw err;
  // process.chdir (currPath);

  const destDir = argv.eosInstallDirectory;

  // Setup tmp
  // logger.info (`Setting up the stage...`);
  // const cmakeFile = path.join (ROOT_DIR, 'CMakeLists.txt');
  // shelljs.cp ('-R', path.join (NODE_MOD_DIR, 'boost-lib'), currPath);
  // shelljs.cp ('-R', path.join (ROOT_DIR, 'src', 'third_party/'), currPath);
  // shelljs.cp (cmakeFile, path.join (currPath, 'CMakeLists.txt'));

  const buildDir = path.join (ROOT_DIR, 'build');
  shelljs.mkdir ('-p', buildDir);
  process.chdir (buildDir);

  // Do the thing
  await buildsecp256k1 (destDir);
  await cloneEosIfNecessary (destDir);
  await updateSubmodules (destDir);
  await buildEos (destDir, argv);
  if (argv.install) {
    await installEos (destDir);
  }

  // Manual cleanup
  // cleanupCallback ();
  // });
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
