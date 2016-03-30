var request  = require('request'),
	jsonfile = require('jsonfile');

// var results = {
// 	'ice cream': [
// 		'ice cream creamy',
// 		...
// 	],
// 	'hot-dog': [
// 		...
// 	]
// }

var results = {};

var query = ['ice cream', 'hot-dog', 'justin bieber', 'corgi', 'cats', 'shibas'];
var service = 'yt';
var language = 'en';

function concatenateUrl(query){
	var requestUrl = 'https://www.google.com/complete/search?&client=firefox' +
					 '&q=' + query +
					 '&ds=' + service +
					 '&hl=' + language;
	return requestUrl;
}

function callAPI(i){
	console.log('Called callAPI');
	console.log(query[i] + ', ' + service + ', ' + language);
	var url = concatenateUrl(query[i], service, language);

	// This is the actual API call
	request(url, function(error, response, body){
		// console.log(response);
		console.log(body);
		// This is all NATIVE javascript
		console.log(typeof body);		// My original data is just a string
		var result = JSON.parse(body);	// I need to convert it to a JSON object
		console.log(typeof result);
		var autocomplete = result[1];	// Getting just the autocomplete suggestions
		console.log(autocomplete);

		results[query[i]] = autocomplete;
		console.log(results);

		i++;
		if(i < query.length){
			callAPI(i);
		}else{
			jsonfile.writeFileSync('data/autocomplete_results.json', results);
		}
	});
}

callAPI(0);



