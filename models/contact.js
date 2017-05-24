var pg = require('pg');
var dateUtils = require('../utils/dateUtils.js');
var fileUtility = require('../controllers/fileUtility.js');

exports.getRecordsBeforeDateAndPostToFTPServer = function(dateParam){
    var results = [];
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        const query = client.query('SELECT name FROM salesforce.contact where systemmodstamp < \'' + dateUtils.convertToPostgresDateTime(dateParam)+'\';');

        query.on('row', (row) => {results.push(row);});

        query.on('end', () => {
            done();
            console.log('results ' + results);
            fileUtility.saveFileOnFTPServer(results,'contacts.txt');
        });
    });
}

exports.postContact = function(request, response){
     var requestBody = request.body;
     var contacts = JSON.parse(JSON.stringify(requestBody));
     for(var i = 0; i<contacts.length; i++){
         console.log('contact name ' + contacts[i].name);
     }
 }