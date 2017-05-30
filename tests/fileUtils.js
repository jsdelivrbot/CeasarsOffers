import test from 'ava';

var fileUtils = require('../utils/fileUtils.js');

test('convert to file content', t => {
  var offer = JSON.parse('{"name":"nth offer"}');
  var offer1 = JSON.parse('{"name":"nth offer"}');
  var offers = [offer,offer1];
  t.is(fileUtils.convertToNiceFileContent(offers), 'Name\nnth offer\nnth offer\n');
});