const path = require ('path');
const Promise = require ('bluebird');
const deployer = require ('../deployer');

const compile = async argv => {
  deployer (argv).then (async deployer => {
    await deployer.compile ('coin');
    await deployer.compile ('hello');
  });
};

module.exports = {
  command: 'compile',
  desc: 'Compile contracts',
  builder: yargs =>
    yargs.option ('eosiocpp', {
      alias: 'c',
      desc: 'eosiocpp path',
    }),
  handler: compile,
};
