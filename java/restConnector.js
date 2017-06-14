var http = require('http');

exports.callJavaApp = function(response){

    var options = {
      host: 'jcaesars.herokuapp.com',
      path: '/rest/time'
    };

    http.request(options, function(resp){
        let result = '';

        resp.on('data', function (chunk) {
            result += chunk;
        });

        resp.on('end', function () {
            response.json({time:JSON.stringify(result)});
        });
        
    }).end();
}
