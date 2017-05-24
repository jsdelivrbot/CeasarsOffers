var pg = require('pg');


var buildInsertStatement = function(offers){
    var statement = 'insert into offers (name) values ';
    for(var i = 0; i<offers.length; i++){
        statement += '(\''+offers[i].name+'\'),';
    }
    statement = statement.substring(0,dml.length - 1);
    return statement;
}

exports.postOffer = function(request, response,next){

     var dml = buildInsertStatement(JSON.parse(JSON.stringify(request.body)));

     pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(dml,
            function(err, result) {
                if (err) {
                    response.json({ message: 'Error during offer post ' + JSON.stringify(err)});
                } else {
                    response.json({ message: 'You have done successful offer post call ' + JSON.stringify(result)});
                }
                client.end();
            }
        );
     });
 }