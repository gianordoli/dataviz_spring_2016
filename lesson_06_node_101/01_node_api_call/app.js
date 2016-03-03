// require is the function to load a module
var prompt = require('prompt');
var request = require('request');
// 'request' is the NAME of one particular module I'm loading

// This syntax is from the prompt module
// It's not a native NodeJS thing!!!!
prompt.start();

// prompt.get(['name'], function(err, result){
// 	console.log(result);
// 	console.log('User name is ' + result.name);
// });

// services: '', 'i', 'yt' (web, images, youtube)
prompt.get(['query', 'service', 'language'], function(err, result){
	if(!err) {
		console.log(result);
		callAPI(result.query, result.service, result.language);
	}else{
		throw err;
	}
});

function concatenateUrl(query, service, language){
	var requestUrl = 'https://www.google.com/complete/search?&client=firefox' +
					 '&q=' + query +
					 '&ds=' + service +
					 '&hl=' + language;
	return requestUrl;
}

function callAPI(query, service, language){
	console.log('Called callAPI');
	console.log(query + ', ' + service + ', ' + language);
	var url = concatenateUrl(query, service, language);

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
	});
}







