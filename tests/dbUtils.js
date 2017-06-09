import test from 'ava';

var dbUtils = require('../util/dbUtils.js');

test('build contact db insert statement', t => {
  var contact = JSON.parse('{"firstname":"John","lastname":"Rambo"}');
  var contacts = [contact];
  var dmlStatement = dbUtils.buildContactInsertStatement(contacts);
  t.is(dmlStatement, "INSERT INTO salesforce.contact (firstname, lastname, age__c, gender__c, tier_level__c, tier_score__c,established_date__c, winnet_id__c) VALUES(\'John\',\'Rambo\',\'undefined\',\'undefined\',\'undefined\',\'undefined\',\'undefined\',\'undefined\')");
});


test('build offer db insert statement', t => {
  var offer = JSON.parse('{"name":"nth offer"}');
  var offers = [offer];
  var dmlStatement = dbUtils.buildOfferInsertStatement(offers);
  t.is(dmlStatement, 'INSERT INTO offers (name) VALUES (\''+'nth offer'+'\')');
});