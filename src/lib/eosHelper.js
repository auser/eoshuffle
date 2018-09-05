const path = require ('path');
const fs = require ('fs');
const Eos = require ('eosjs');
const binaryen = require ('binaryen');
const validateConfig = require ('./validateConfig');

const Errors = require ('./errors');

const CONFIG_FILE_NAME = 'eoshuffle.js';

module.exports = function (dir) {
  // Eos(require())
  const eoshuffleFile = path.join (dir, CONFIG_FILE_NAME);
  try {
    const stats = fs.lstatSync (eoshuffleFile);
    if (stats.isFile ()) {
      throw new Error (Errors.INVALID_SETUP);
    }
  } catch (e) {
    if (e.code === 'ENOIDENT') {
      console.error (`No config file found at ${eoshuffleFile}`);
      throw Errors.INVALID_SETUP;
    }
  }

  let cfg = {
    development: {},
    production: {},
  };
  try {
    cfg = require (eoshuffleFile);
  } catch (e) {}
  const env = process.env.NODE_ENV || 'development';
  const envConfig = cfg[env];

  const errors = validateConfig.call (this, envConfig);

  if (errors.length !== 0) {
    let errStr = `${'---- Configuration error ----'}
Check your ${CONFIG_FILE_NAME} file and ensure it follows the standard format.\n
`;
    errors.forEach (err => {
      errStr += `${err.message}\n`;
    });
    throw new Error (errStr);
  }
  const eos = Eos ({...envConfig, binaryen});
  return {
    envConfig,
    eosModules: Eos.modules,
    eos,
  };
};
