const Schema = require ('validate');

const config = new Schema ({
  httpEndpoint: {
    type: String,
  },
  chainId: {
    type: String,
  },
  keyProvider: {
    required: true,
  },
  tokenAccount: {
    type: String,
    required: true,
  },
});

module.exports = function (cfg) {
  config.message ({
    required: p => `${p} is required`,
  });
  return config.validate (cfg);
};
