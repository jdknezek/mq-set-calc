import _ from 'lodash';
import parse from 'csv-parse';

export function translate(load) {
  return new Promise((resolve, reject) => {
    parse(load.source, (e, lines) => {
      if (e) {
        reject(e);
        return;
      }

      var headers = lines[0];

      resolve('module.exports = ' + JSON.stringify(lines.slice(1).reduce((lookup, line) => {
        lookup[line[0]] = line.reduce((row, value, index) => {
          if (!value) {
            return row;
          }

          row[headers[index]] = value;
          return row;
        }, {});

        return lookup;
      }, {})));
    });
  });
}
