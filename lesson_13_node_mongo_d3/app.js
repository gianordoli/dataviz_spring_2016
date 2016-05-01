/*---------- EXPRESS SETUP ----------*/
var express		= require('express'),
	bodyParser	= require('body-parser');	// helper for parsing HTTP requests

var app = express();						// our Express app

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));// parse application/x-www-form-urlencoded
app.use(bodyParser.json());							// parse application/json

// Express server
app.use(function(req, res, next) {
    // Setup a Cross Origin Resource sharing
    // See CORS at https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('incoming request from ---> ' + ip);
    var url = req.originalUrl;
    console.log('### requesting ---> ' + url);	// Show the URL user just hit by user
    next();
});

app.use('/', express.static(__dirname + '/public'));
/*---------------------------------*/


/*------------------- ROUTERS -------------------*/
app.get('/countries', function(request, response){
	console.log('Requested ' + request.originalUrl);
	// response.json('hello');
	// readRecords({});
	// readRecords({}, function(docs){
	// 	response.json(docs);
	// });

	console.log(request.query.gdp_min);
	readRecords({
		'gdp': {'$gte': Number(request.query.gdp_min)}
		//'gdp': {'$gte': 40000}
	}, function(docs){
		response.json(docs);
	});	
});


/*-------------------- MONGO --------------------*/
var	MongoClient = require('mongodb').MongoClient;
var db;

function initMongo(){
	MongoClient.connect('mongodb://localhost:27017/countries', function(err, _db) {

		if(err === null){
			db = _db;
			console.log("Connected correctly to server");
		}else{
			console.log(err);
		}
	});	
};

function readRecords(query, callback){
	console.log('Called readRecords.');

	query = query || {};

	db.collection('records').find(query).toArray(function(err, docs){
	    	if(err === null){
	    		// console.log(docs);
	    		if(callback !== undefined){
	    			callback(docs);
	    		}
	    	}else{
				console.log(err);
	    	}
	    	db.close();
	});
}

initMongo();

/*---------- BASIC SETUP ----------*/
var PORT = 4000;
app.listen(PORT, function(){
	console.log('Express server is running at ' + PORT);
});
/*---------------------------------*/