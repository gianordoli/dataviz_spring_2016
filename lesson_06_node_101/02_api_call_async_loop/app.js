var request = require('request'),
    prompt  = require('prompt'),
    jsonfile = require('jsonfile');

// Let's create an array of letter from a-z
var letters = [];
for(var i = 65; i <= 90; i++){
    letters.push(String.fromCharCode(i));
}
// services: '', 'i', 'yt' (web, images, youtube)
// language: https://sites.google.com/site/tomihasa/google-language-codes

// This object will hold our results
var results = {};

prompt.start();

prompt.get(['service', 'language'], function (err, result) {
    if (err) { return onErr(err); }
    console.log('Command-line input received:');
    // No query this time!
    console.log('  Service: ' + result.service);
    console.log('  Language: ' + result.language);

    // Let's start at 0
    callAPI(0, result.service, result.language);
});

function concatenateUrl(query, service, language){
    var requestUrl = 'https://www.google.com/complete/search?' +
                     '&client=firefox'+
                     '&q=' + query +
                     '&ds=' + service +
                     '&hl=' + language;
    return requestUrl;
}

function callAPI(i, service, language){
    
    var url = concatenateUrl(letters[i], service, language);
    console.log('Calling autocoplete API for:');    
    console.log(url);
    request(url, function(error, response, body){

        // console.log(error);
        // console.log(response);
        if(!error && response.statusCode == 200){
            // console.log(body);
            // console.log(typeof body);
            var result = JSON.parse(body);
            console.log(result);
            // console.log(typeof result);
            results[result[0]] = result[1];

            // If we haven't got to the end yet...
            if(i < letters.length - 1){
                i++;
                // We don't want to break Google, right?
                setTimeout(function(){
                    // Recursion! :-o
                    callAPI(i, service, language);
                }, 1000);
            }else{
                console.log(results);
                saveFile();
            }
        }
    });
}

function saveFile(){
    if(service === '') { service = 'web' };
    jsonfile.writeFileSync('autocomplete_' + service + '_' + language + '.json', results);
}