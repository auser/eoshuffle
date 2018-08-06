const path = require ('path');
const fs = require ('fs');
const Eos = require ('eosjs');
const binaryen = require ('binaryen');

const Errors = require ('./errors');

const CONFIG_FILE_NAME = 'eoshuffle.js';

module.exports = dir => {
  // Eos(require())
  const eoshuffleFile = path.join (dir, CONFIG_FILE_NAME);
  try {
    const stats = fs.lstatSync (eoshuffleFile);

    if (stats.isFile ()) {
      const cfg = require (eoshuffleFile);
      const env = process.env.NODE_ENV || 'development';
      const envConfig = cfg[env];

      const config = validateConfig (envConfig);

      if (!config) {
        throw Errors.INVALID_CONFIG_SETUP;
      }
      return Eos ({...config, binaryen});
    }
  } catch (e) {
    if (e.code === 'ENOIDENT') {
      console.error (`No config file found at ${eoshuffleFile}`);
      throw Errors.INVALID_SETUP;
    }
  }
};

const validateConfig = cfg => {
  const {httpEndpoint, chainId, keyProvider} = cfg;
  if (!httpEndpoint || httpEndpoint === '') {
    console.error (`Invalid httpProvider. Make sure it is not empty`);
  }

  return {
    httpEndpoint,
    chainId,
    keyProvider,
  };
};
