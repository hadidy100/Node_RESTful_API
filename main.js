/*

Anas Elhadidy
Aug 11 2018 

This program creates a simple RESTful API using node.js server side programming. 
The API is sent back via http, utilizing some of the robust libraries that node provides. 

*/





var http = require ('http'); 
var url = require ('url'); 
var StringDecoder = require('string_decoder').StringDecoder; 
//Instantiate the server object 
var httpServer = http.createServer(function(req,res) {
	// The following abstract processRequest function is defined at the bottom.
	processRequest(req,res); 
	}); // end of  createServer
	
//Start the sever and make it listen on port 8080 and notify the user 	
httpServer.listen(8080,function(){
	console.log("Server has just began running on port 8080");
	}); // end of function in listen

/*
The following function accomplishes the following tasks: 
 1.  It uses the http.url object to parse the url the the user entered on the client 
 2.  It assigns the path property that we get form step one into a variable that we also call untrimmedUrl
 3.  It trimms the untrimmedUrl
 4.  It assigns the query property that we get from step one into a variable named queryStringObject
 5.  It assigns the method name that we get from step one into a  variable named method
 6.  It assigns the header name that we get from step one into a variable named header 
 7.  It instantiates a new StringDecoder object that uses the utf-8 char set and assigns it to decoder 
 8.  It creates a variable named buffer where it is initialized to null
 9.  It looks at the events the we get from the request object  and dynamically appends the chuncks of the stream that we get back 
 10. It marks the end of the buffer string the we created in steps 8 and 9 once the stream stops flowing 
 11. It creates a functions called qualifyHandler that routs the request
 12. It creates an object called httpObject that contains the needed properties to relate to the http request 
 13. It validates the url, and returns a status code based on the validation result
 14. It returns a message on the server with the status code and the payload
*/	
 var processRequest = function (req,res){
	var parsedUrl = url.parse(req.url, true); 
	var untrimmedUrl = parsedUrl.pathname; 
	var trimmedUrl = untrimmedUrl.replace(/^\/+|\/+$/g,'');
	var queryStringObject = parsedUrl.query; 
	var method = req.method.toLowerCase();
	var headers = req.headers; 
	var decoder = new StringDecoder('utf-8'); 
	var buffer = ''; 

	//While the streams are still comming through, append to the buffer every single chuck of the incomming streams
	req.on('data',function(data){
	buffer += decoder.write(data); 
	});

	//Once the streams finished coming through, end the buffer string to cap it off 
	req.on('end', function(){
	buffer += decoder.end();  
	var validateUrl = typeof(router[trimmedUrl]) !== 'undefined' ? router[trimmedUrl] : handlers.notfound; 
	var data = {
				'trimmedUrl' : trimmedUrl, 
				'queryStringObject' : queryStringObject, 
				'method' : method, 
				'headers' : headers, 
				'payload' : buffer
			 };
	validateUrl(data,function(statusCode,payload){
		statusCode = typeof(statusCode) == 'number' ? statusCode : 200; 
		payload = typeof(payload) == 'object' ? payload : {}; 
		var payloadString = JSON.stringify(payload);  
		res.setHeader('content-Type','application/json'); 
		res.writeHead(statusCode); 
		res.end(payloadString); 
		console.log('As a server, I am returning this response ', statusCode, payloadString); 
	 }); // end of validateUrl

	});
};// end of processRequest 

var handlers = {}; 
handlers.hello = function(data,callback){
    console.log('The URL that you entered exists !! SUCCESS !!!');
	callback(200); 
	
};

handlers.notfound = function (data,callback){
	console.log( 'Sorry, the url you entered does not exist ');
	callback(404);
}; 

var router = {
	'hello' : handlers.hello
};




