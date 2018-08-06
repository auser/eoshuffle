const path = require ('path');
const Promise = require ('bluebird');
const thisDir = path.resolve (__dirname);
const Eos = require ('../lib');
const shelljs = require ('shelljs');

const compile = async argv => {
  return new Promise (async (resolve, reject) => {
    const eosiocpp = argv.eosiocpp || shelljs.which ('eosiocpp');
    const {eos, contracts} = await Eos (argv);

    if (!eosiocpp) {
      shell.echo (
        `Sorry, this script requires eosiocpp. Either pass it as an option using the flag or add it to your $PATH and try again.`
      );
      shell.exit (1);
      reject ();
    }

    const compileSingleContract = (cmd, dir) => {
      return new Promise ((resolve, reject) => {
        const pathName = path.basename (dir);
        shelljs.pushd ('-q', dir);
        shelljs.exec (cmd (pathName), (code, stdout, stderr) => {
          shelljs.popd ('-q');
          if (code !== 0) {
            return reject (stderr);
          }
          resolve (path.join (dir, `${pathName}`));
        });
      });
    };

    const promises = contracts.dirs.map (dir => {
      const wastCmd = n => `eosiocpp -o ${n}.wast ${n}.cpp`;
      const abiCmd = n => `eosiocpp -g ${n}.abi ${n}.cpp`;
      return compileSingleContract (wastCmd, dir).then (() =>
        compileSingleContract (abiCmd, dir)
      );
    });
    Promise.all (promises).then (out => {
      console.log ('success', out);
    });
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
