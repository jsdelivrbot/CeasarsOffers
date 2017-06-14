var http = require('http');

exports.callJavaApp = function(response){

    var options = {
      host: 'https://jcaesars.herokuapp.com',
      path: '/rest/time'
    };

    http.request(options, function(resp){
        let result;
        resp.on('data', function (chunk) {
            result += chunk;
        });

        resp.on('end', function () {
            response.json({ message: ' time ' + JSON.stringify(result)});
        });
    }).end();
}
