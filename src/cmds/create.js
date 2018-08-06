module.exports = {
  command: 'init [dir]',
  desc: 'Initialize an eos project',
  alias: 'create',
  builder: {
    dir: {
      default: '.',
    },
  },
  handler: argv => {
    console.log ('init called for dir', argv.dir);
  },
};
