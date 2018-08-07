const fs = require ('fs');
const Eos = require ('../lib');

const deploy = async function (argv) {
  const {eos, envConfig, contracts, logger} = await Eos (argv);
  const findContract = (name, ext) => {
    const found = contracts[ext].filter (i => i.indexOf (name) >= 0);
    return found.length > 0 ? found[0] : null;
  };

  const wasmFile = findContract (`${argv.name}.wasm`, 'wasm');
  const abiFile = findContract (`${argv.name}.abi`, 'abi');

  if (!wasmFile || !abiFile) {
    throw new Error ('No compiled contracts');
  }
  const wasm = fs.readFileSync (wasmFile);
  const abi = fs.readFileSync (abiFile);

  try {
    logger.info (`Deploying contract ${argv.name}`);
    await eos.setcode (envConfig.tokenAccount, 0, 0, wasm, {
      authorization: `${envConfig.tokenAccount}@owner`,
    });
  } catch (e) {}
  const out = await eos.setabi (envConfig.tokenAccount, JSON.parse (abi));

  logger.info (`All done`);
};

module.exports = {
  command: 'deploy',
  desc: 'deploy contracts',
  builder: yargs =>
    yargs
      .option ('account', {
        alias: 'a',
        desc: 'account authority',
      })
      .option ('name', {
        alias: 'n',
        desc: 'contract to deploy',
        demandOption: true,
      }),
  handler: deploy,
};
