const path = require ('path');
const Eos = require ('../lib');
const deployer = require ('../deployer');

const deploy = async function (argv) {
  deployer (argv).then (async deployer => {
    await deployer.deploy ('coin');
  });
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
