const path = require ('path');
const glob = require ('glob');
const fs = require ('fs');
const Promise = require ('bluebird');

const identity = i => i;

module.exports.findByExtension = (base, ext, filter = identity) => {
  return new Promise (async (resolve, reject) => {
    if (!fs.existsSync (base)) {
      return reject (`No directory at ${base}`);
    }

    glob (base + '/**/*' + ext, {}, (err, files) => {
      if (err) {
        reject (err);
      } else {
        resolve (files.filter (filter));
      }
    });
  });
};

module.exports.findDirs = (base, filter = identity) => {
  return new Promise (async (resolve, reject) => {
    if (!fs.existsSync (base)) {
      return reject (`No directory at ${base}`);
    }

    glob (base + '/*', {}, (err, files) => {
      if (err) return reject (err);
      const o = files
        .filter (f => f.match (/contracts\/libs/) == null)
        .filter (i => fs.lstatSync (i).isDirectory ());
      return resolve (o);
    });
  });
};

module.exports.findContracts = (base, ext) => {};
