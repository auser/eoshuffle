const lib = require ('./lib');

module.exports = function () {
  // const lib

  this.deploy = contract => {
    console.log ('contract', contract);
  };

  return this;
};
