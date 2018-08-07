const path = require ('path');
const instantiateEos = require ('./eosHelper');
const fh = require ('./fileHelper');
const {createNewLogger} = require ('./logger');

module.exports = async argv => {
  try {
    const contractDir = path.join (argv.directory, 'contracts');
    const byExt = async (ext, baseDir, filter) =>
      fh.findByExtension (baseDir || argv.directory, ext, filter);
    const dirs = async (baseDir, filter) =>
      fh.findDirs (baseDir || argv.directory, filter);

    const eosInst = instantiateEos (argv.directory);
    const logger = createNewLogger ();

    return {
      ...eosInst,
      logger: logger,
      contracts: {
        dirs: await dirs (contractDir),
        abi: await byExt ('abi', contractDir),
        wasm: await byExt ('wasm', contractDir),
        wast: await byExt ('wast', contractDir),
        // cpp: await byExt ('cpp', contractDir, i => {
        //   // Ignore contracts/libs
        //   return i.match (/contracts\/libs/) === null;
        // }),
      },
    };
  } catch (e) {
    throw e;
  }
};
