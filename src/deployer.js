const path = require ('path');
const fs = require ('fs-extra');
const Promise = require ('bluebird');
const shelljs = require ('shelljs');
const lib = require ('./lib');

const buildPath = path.join (__dirname, '..', 'build');
const thirdPartyPath = path.join (buildPath, 'src', 'third_party');
const eosiocppPath = path.join (thirdPartyPath, 'eosio', 'tools', 'eosiocpp');

module.exports = async function (opts = {}) {
  // const lib
  const {eos, envConfig, logger, dirs} = await lib (opts);
  const findContract = (name, ext) => {
    const buildfile = path.join (dirs.buildDir, name, `${name}.${ext}`);
    try {
      const stats = fs.lstatSync (buildfile);
      if (stats.isFile ()) {
        return buildfile;
      } else {
        throw new Error (`Not a file`);
      }
    } catch (e) {
      throw e;
    }
  };

  const loadWasmFile = async name => {
    const wasmFile = findContract (name, 'wasm');
    if (!wasmFile) {
      throw new Error (`No wasm file`);
    }
    const wasm = fs.readFileSync (wasmFile);
    return wasm;
  };

  const loadAbiFile = async name => {
    const abiFile = findContract (name, 'abi');
    if (!abiFile) {
      throw new Error (`No abi file`);
    }
    const abi = fs.readFileSync (abiFile);
    return abi;
  };

  const _compileContract = (cmd, dir) => {
    return new Promise ((resolve, reject) => {
      const pathName = path.basename (dir);
      logger.debug = `Running: ${cmd}`;
      shelljs.exec (cmd, {silent: true}, (code, stdout, stderr) => {
        if (code !== 0) {
          return reject (stderr);
        }
        resolve (stdout);
      });
    });
  };

  const compileAbi = async dir => {
    const pathName = path.basename (dir);
    const inputDir = path.join (dirs.contractDir, pathName);
    const inputFile = path.join (inputDir, `${pathName}.cpp`);
    const outputDir = path.join (dirs.buildDir, pathName);
    const outputFile = path.join (outputDir, `${pathName}.abi`);

    fs.mkdirpSync (outputDir);
    const abiCommand = `${eosiocppPath} -g ${outputFile} ${inputFile}`;
    return _compileContract (abiCommand, dir);
  };
  const compileWast = async dir => {
    const pathName = path.basename (dir);
    const inputDir = path.join (dirs.contractDir, pathName);
    const inputFile = path.join (inputDir, `${pathName}.cpp`);
    const outputDir = path.join (dirs.buildDir, pathName);
    const outputFile = path.join (outputDir, `${pathName}.wast`);
    fs.mkdirpSync (outputDir);

    const wastCmd = `${eosiocppPath} -o ${outputFile} ${inputFile}`;
    return _compileContract (wastCmd, dir);
  };

  this.compile = async dir => {
    const eosiocpp = opts.eosiocpp || shelljs.which ('eosiocpp');
    if (!eosiocpp) {
      logger.info (
        `Sorry, this script requires eosiocpp. Either pass it as an option using the flag or add it to your $PATH and try again.`
      );
      shell.exit (1);
      reject ();
    }

    await compileWast (dir);
    await compileAbi (dir);
    logger.info ('Complete');
  };

  const deployWast = async name => {
    try {
      logger.info (`Deploying contract ${name} wasm`);

      const wasm = await loadWasmFile (name);
      await eos.setcode (envConfig.tokenAccount, 0, 0, wasm, {
        authorization: `${envConfig.tokenAccount}@active`,
      });
    } catch (e) {
      logger.error (`Error setting ${name} code`, e);
      throw e;
    }
  };

  const deployAbi = async name => {
    try {
      logger.info (`Deploying contract ${name} abi`);

      const abi = await loadAbiFile (name);
      await eos.setabi (envConfig.tokenAccount, JSON.parse (abi), {
        authorization: `${envConfig.tokenAccount}@active`,
      });
    } catch (e) {
      logger.error (`Error setting ${name} abi`, e);
      throw e;
    }
  };

  this.deploy = async name => {
    try {
      const dir = path.join (dirs.contractDir, name);
      logger.info (`Compile contract: ${dir}`);
      await this.compile (dir);
    } catch (e) {
      logger.error ('Error occurred compile contract', e);
    }

    await deployWast (name);
    await deployAbi (name);
    // const out = await eos.setabi (envConfig.tokenAccount, JSON.parse (abi));
  };

  return this;
};
