var Promise = require('bluebird');
var crypto = require('crypto');
var fs = require('fs');
var globbyAsync = Promise.promisify(require('globby'));

globbyAsync([
  'build.js*',
  'config.js',
  'jspm_packages/es6-module-loader.js*',
  'jspm_packages/github/twbs/bootstrap@3.3.1/css/bootstrap.css*',
  'jspm_packages/system.js*'
].sort()).map(name => new Promise((resolve, reject) => fs.createReadStream(name).pipe(crypto.createHash('sha1')).on('finish', function () { resolve({name, hash: this.read().toString('hex')}) }))).then(files => {
  console.log('CACHE MANIFEST');
  files.forEach(({name, hash}) => {
    console.log(name + ' # ' + hash);
  })
  console.log();
  console.log('NETWORK:');
  console.log('*');
});
