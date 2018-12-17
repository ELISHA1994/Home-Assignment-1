/**
 *  Primary file for the API
 * 
 */

// Dependencies
var http = require('http');
var https = require('https');
var url =require('url');
var { StringDecoder } = require('string_decoder');
var config = require('./config');
var fs = require('fs');

// Intantiate the HTTP server
var httpServer = http.createServer((req,res) => {
    // calls the request handler
    serverRequestHandler(req,res);
});

// Start HTTP server
httpServer.listen(config.httpPort,() => {
    console.log('The HTTP server is running on port '+config.httpPort+ ' and on '+config.envName+ ' enivironment'); 
});

// Intantiate the HTTPS server
var options = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(options,(req,res) => {
    // calls the request handler
    serverRequestHandler(req,res);
});

// Start HTTPS server
httpsServer.listen(config.httpsPort,() => {
    console.log('The HTTPS server is running on port '+config.httpsPort+ ' and on '+config.envName+ 'enivironment');
});

// Server logic for both httpServer httpsServer
var serverRequestHandler = (req,res) => {

    // Get the url and Parse it
    var parsedUrl = url.parse(req.url, true);

    // Get pathName and trim the pathName
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query String as an Object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get the request headers as an object
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder('utf8');
    var buffer = '';


    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {

        buffer += decoder.end();
        

        // Check the request router for a matching path for a handler,
        // If none is found, default to th not-found handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        // Route the request to the handler specifield in the router
        chosenHandler(data,(statusCode,payload) => {

            // Use the statusCode returned by the handler, otherwise set default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload returned by the handler, otherwise set default to empty object
            payload = typeof(payload) == 'object' ? payload : {};

            
            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the response
            console.log('Returning this response: ',statusCode,payloadString);
            
            
        });

    });
};


// Define all handlers
var handlers = {};

// Hello handler
handlers.hello = (data,callback) => {
    callback(200,{
        'message' : 'Hello your request is been processed, please hold a little while'
    });
};

// Not-Found handler
handlers.notFound = (data,callback) => {
    callback(404);
};


// Define a request router
var router = {
    'hello' : handlers.hello
};