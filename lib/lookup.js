export function translate(load) {
  var lines = load.source.trim().split(/\r\n|\r|\n/).map(line => line.split(','));
  var headers = lines[0];

  return 'module.exports = ' + JSON.stringify(lines.slice(1).reduce((lookup, line) => {
    lookup[line[0]] = line.reduce((row, value, index) => {
      if (value) {
        try { value = JSON.parse(value); } catch (e) { }
        row[headers[index]] = value;
      }
      return row;
    }, {});

    return lookup;
  }, {}));
}
