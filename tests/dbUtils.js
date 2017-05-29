import test from 'ava';

var dbUtils = require('../utils/dbUtils.js');

test('build contact db insert statement', t => {
  var contact = JSON.parse('{"firstname":"John","lastname":"Rambo"}');
  var contacts = [contact];
  var dmlStatement = dbUtils.buildContactInsertStatement(contacts);
  t.is(dmlStatement, 'INSERT INTO salesforce.contact (firstname,lastname) VALUES (\''+'John\',\'Rambo'+'\')');
});

test('build offer db insert statement', t => {
  var offer = JSON.parse('{"name":"nth offer"}');
  var offers = [offer];
  var dmlStatement = dbUtils.buildOfferInsertStatement(offers);
  t.is(dmlStatement, 'INSERT INTO offers (name) VALUES (\''+'nth offer'+'\')');
});