import crypto from 'crypto';
import fs from 'fs';

import Promise from 'bluebird';
import globby from 'globby';
import _ from 'lodash';

Promise.promisifyAll(fs);

(async function () {
  var names = await Promise.promisify(globby)([
    'build.js*',
    'config.js',
    'index.html',
    'jspm_packages/es6-module-loader.js*',
    'jspm_packages/github/twbs/bootstrap@3.3.1/css/bootstrap.css*',
    'jspm_packages/system.js*'
  ]);
  var hashes = await Promise.all(names.map(name => Promise.props({name, hash: hash(name)})));

  console.log('CACHE MANIFEST');
  _(hashes).sortBy('name').each(({name, hash}) => console.log(`${name} # ${hash}`));
  console.log();
  console.log('NETWORK:');
  console.log('*');
})();

function hash(name) {
  return new Promise((resolve, reject) =>
    fs.createReadStream(name)
      .pipe(crypto.createHash('sha1'))
      .on('finish', function () { resolve(this.read().toString('hex')); })
  );
}
