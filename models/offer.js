
var pg = require('pg');

exports.postOffer = function(request, response,next){
     var requestBody = request.body;
     var offers = JSON.parse(JSON.stringify(requestBody));
     var dml = 'insert into offers (name) values ';
     for(var i = 0; i<offers.length; i++){
         dml += '(\''+offers[i].name+'\'),';
     }
     dml = dml.substring(0,dml.length - 1);

    console.log('dml ' + dml);

     pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(dml,
            function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    for(var i = 0; i < result.rows.length; i++){
                        console.log('row inserted with id: ' + result.rows[i].id);
                    }
                }
                client.end();
        });
     });
 }