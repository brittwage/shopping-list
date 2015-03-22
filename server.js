var http = require('http');
var static = require('node-static'); // TODO

var Items = function() {
    this.items = [];
    this.id = 0;
};

Items.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
};

// define a delete method
Items.prototype.delete = function(id){
    // find the index of the item we want to delete
    var success = false
    for (var i=0; i < this.items.length; i++) {
        if (this.items[i].id === id) {
            var index = i
            this.items.splice(index, 1)
            success = true
            break
        }
    }
    if (success === false) {
        // If an incorrect ID is supplied, your endpoint should fail
        // gracefully, returning a JSON error message.
        console.log('Ungraceful fail')
    }
}

var items = new Items();
items.add('Broad beans');
items.add('Tomatoes');
items.add('Peppers');

items.delete(0)
items.delete(1)

var fileServer = new static.Server('./public'); // TODO syntax

var server = http.createServer(function (req, res) {
    // GET /items HTTP/version -> return `items` object
    // use response
    if (req.method === 'GET' && req.url === '/items') {
        // TODO why does this log when visiting vanilla localhost:8080
        console.log("doing the GET stuff")
        // send a JSON object of the array of item objects stored in the 
        // item object
        var responseData = JSON.stringify(items.items);
        // set the content-type of the response header to JSON
        res.setHeader('Content-Type', 'application/json');
        // ?
        res.statusCode = 200;
        res.end(responseData);
    // POST /items HTTP/version {"name": "eggs"} -> add `item` to `items` object
    // use request
    // Recall: Here we are *reading the request body*
    } else if (req.method === 'POST' && req.url === '/items') {
        console.log("doing the POST stuff")
        var item = '';
        // Notice how you create a new empty string called item, then add
        // chunks of data to the string as they are received by the server.
        req.on('data', function (chunk) {
            item += chunk;
            // Imagine:
            // chunk 1: {"nam
            // chunk 2: e": "but
            // chunk 3: ter"}
            // are added to the string `item` one after another
        });
        req.on('end', function () {
            // ? try...catch statement
            try {
                item = JSON.parse(item); // ?
                items.add(item.name);
                res.statusCode = 201;
                res.end();
            } catch(e) {
                res.statusCode = 400;
                responseData = {'message': 'Invalid JSON'};
                res.end(JSON.stringify(responseData));
            }
        });
    } else if (req.method === 'DELETE') { // TODO conditional syntax
        console.log("Doing the DELETE stuff")
        var id = parseInt(req.url.split('/')[2])
        console.log("Item ID: " + id)
        console.log(id)
        items.delete(id) // TODO why does this work via the backend but not via the frontend?
    } else {
        // TODO syntax
        fileServer.serve(req, res);
    }
});

server.listen(8080, function() {
    console.log('listening on localhost: 8080');
});