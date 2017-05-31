import test from 'ava';

var fileUtils = require('../utils/fileUtils.js');

test('convert to file content', t => {
  var offer = JSON.parse('{"firstname":"nth offer","lastname":"nth offer"}');
  var offer1 = JSON.parse('{"firstname":"nth offer","lastname":"nth offer"}');
  var offers = [offer,offer1];
  t.is(fileUtils.convertToNiceFileContent(offers), 'firstname,lastname\nnth offer,nth offer\nnth offer,nth offer\n');
});