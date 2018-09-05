const path = require ('path');
// const instantiateEos = require ('./eosHelper');
const fh = require ('./fileHelper');
const {createNewLogger} = require ('./logger');

module.exports = async (options = {}) => {
  const directory = options.directory;

  try {
    const contractDir = path.join (directory, 'contracts');
    const buildDir = path.join (directory, 'build');

    const byExt = async (ext, baseDir, filter) =>
      fh.findByExtension (baseDir || directory, ext, filter);
    const dirs = async (baseDir, filter) =>
      fh.findDirs (baseDir || directory, filter);

    // const eosInst = instantiateEos (directory);
    const logger = createNewLogger ();

    return {
      // ...eosInst,
      logger: logger,
      dirs: {
        buildDir,
        contractDir,
      },
      contracts: {
        dirs: await dirs (contractDir),
        // abi: await byExt ('abi', contractDir),
        // wasm: await byExt ('wasm', contractDir),
        // wast: await byExt ('wast', contractDir),
      },
    };
  } catch (e) {
    throw e;
  }
};
