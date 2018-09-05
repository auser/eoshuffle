const {createLogger, format, transports} = require ('winston');

const defaultOptions = {
  level: 'info',
};

module.exports.createNewLogger = (options = {}) => {
  const opts = Object.assign ({}, defaultOptions, options, {
    transports: [
      new transports.Console ({
        format: format.combine (format.colorize (), format.simple ()),
      }),
    ],
  });
  return createLogger (opts);
};

module.exports = module.exports.createNewLogger ({});
