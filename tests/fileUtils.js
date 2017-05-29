import test from 'ava';

var ftpUtils = require('../utils/ftpUtils.js');

test('convert date to psql string', t => {
  var d = new Date(2017, 0, 1, 0, 0, 0, 0);
  t.is(dateUtils.convertToPostgresDateTime(d), '2017-01-01 00:00:00');
});