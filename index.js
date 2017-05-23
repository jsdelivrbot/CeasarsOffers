var express = require('express');
var router = express.Router();

var pg = require('pg');
var app = express();

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

app.get('/generateFile',function(request,response){
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT name FROM salesforce.contact ', function(err, result) {
        done();
        ////
        console.log(result.rows);
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