import test from 'ava';

var dateUtils = require('../utils/dateUtils.js');

test('convert date to psql string', t => {
  var d = new Date(2017, 0, 1, 0, 0, 0, 0);
  t.is(dateUtils.convertToPostgresDateTime(d), '2017-01-01 00:00:00');
});

test('ensure leading zeros', t => {
  t.is(dateUtils.ensureLeadingZeros(1),'01');
  t.is(dateUtils.ensureLeadingZeros(10),'10');
});

test('calculate time difference in milliseconds', t => {
  var startMs = new Date().getTime() - 10;
  t.true(dateUtils.calculateTimeDiffInMilliseconds(startMs) >= 10);
});