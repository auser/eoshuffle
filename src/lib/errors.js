const errors = [
  {name: 'INVALID_SETUP', msg: 'Invalid setup'},
  {name: 'INVALID_CONFIG_SETUP', msg: 'Invalid configuration'},
];

module.exports = errors.reduce ((acc, obj, i) => {
  return {
    ...acc,
    [obj.name]: `[${i}]: ${obj.msg}`,
  };
}, {});
