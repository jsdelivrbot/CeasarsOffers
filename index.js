var express = require('express');
var pg = require('pg');
var fs = require('fs');
//var Readable = require('stream').Readable;
//var PromiseFtp = require('promise-ftp');
var fileUtility = require('./controllers/fileUtility.js');

var app = express();
var router = express.Router();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

router.use(function(req,res,next){
    next();
});

app.get('/', function(request, response) {
    response.render('pages/index');
});

//write directly to FTP server
/*var saveFileOnFTPServer = function(records, fileName){
    var dataToBeSaved = fileUtility.convertToNiceFileContent(records);

    var readableStream = new Readable();
    readableStream._read = function noop() {};
    readableStream.push(dataToBeSaved);

    var ftp = new PromiseFtp();
        ftp.connect({host: host, user: user, password: password})
        .then(function (serverMessage) {
            return ftp.put(readableStream,fileName);
        }).then(function () {
            return ftp.end();
        });
}*/

// convert from JSON representation to CSV
//var convertToNiceFileContent = function(recordsJSON){
//    return '';
//}

app.get('/generateFile',function(request,response){
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT name FROM salesforce.contact ', function(err, result) {
        done();
        fileUtility.saveFileOnFTPServer(result.rows,'contacts.txt');
        response.render('pages/index', {results: result.rows, size: result.rows.length} );
        });
    });
});

app.get('/offers', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT name FROM offers ', function(err, result) {
            done();
            if (err) {
                console.error(err); response.send("Error " + err);
            } else {
                response.render('pages/offers', {results: result.rows, size: result.rows.length} );
            }
        });
    });
});


app.get('/contacts', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT firstname, lastname FROM salesforce.contact ', function(err, result) {
        done();
        if (err) {
            console.error(err); response.send("Error " + err);
        } else {
            response.render('pages/contacts', {results: result.rows, size: result.rows.length} );
        }
        });
    });
});

router.route('/offers').get(
    function(req, res) {
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('SELECT name FROM offers ', function(err, result){
                done();
                if(err){
                    res.json(err);
                } else {
                    res.json(result.rows);
                }
            });
        });
    }
);

router.route('/offers').post(function(req, res) {
        res.json({ message: 'You have done successful offer post call with following params : ' + req.params  });
    }
);

router.route('/contacts').get(
    function(req, res) {
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('SELECT firstname, lastname FROM salesforce.contact ', function(err, result){
                done();
                if(err){
                    res.json(err);
                } else {
                    res.json(result.rows);
                }
            });
        });
    }
);


router.route('/contacts').post(function(req, res) {
        res.json({ message: 'You have done successful contacts post call with following params : ' + req.params });
    }
);

app.use('/rest',router);