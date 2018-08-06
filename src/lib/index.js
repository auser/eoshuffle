const path = require ('path');
const eos = require ('./eosHelper');
const fh = require ('./fileHelper');

module.exports = async argv => {
  const contractDir = path.join (argv.directory, 'contracts');
  const byExt = async (ext, baseDir, filter) =>
    fh.findByExtension (baseDir || argv.directory, ext, filter);
  const dirs = async (baseDir, filter) =>
    fh.findDirs (baseDir || argv.directory, filter);

  return {
    eos: eos (argv.directory),
    contracts: {
      dirs: await dirs (contractDir),
      abis: await byExt ('abi'),
      // cpp: await byExt ('cpp', contractDir, i => {
      //   // Ignore contracts/libs
      //   return i.match (/contracts\/libs/) === null;
      // }),
    },
  };
};
