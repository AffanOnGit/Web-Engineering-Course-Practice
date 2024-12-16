const http = require('http'); //require() method means we are importing a Node moduel to our app
const url = require('url');
const fs = require('fs');

//now app has access to http module, we create the server:
http.createServer(function (req, res) { //method executes when someone access the server
    // response is to come in form of html, so we add http header with right content type
    //write response to client
    res.writeHead(200, { 'Content-Type': 'text/html' });

    //write response to client

    //HTTP MODULE
    // res.write('Hello World!'); 
    // res.write(req.url); 

    //SPLIT QUERY STRING USING URL MODULE
    // var q = url.parse(req.url, true).query;
    // var text = q.year + " " + q.month
    // res.write(text);

    //end the response
    res.end();
}).listen(2000); //listen to server on port 2000



http.createServer(function (req, res) {
    fs.readFile("./demofile1.html", function (err, data) {
        res.writeHead(200, { 'content-type': 'text/html' });
        res.write(data);
        return res.end();
    })

    fs.appendFile("./myNewFile.txt", "Hello appended content! \n", function (err) {
        if (err) throw err;
        console.log("Saved appended content to file!");
    })

    fs.open("myNewFile2.txt", "w", function (err, file) {
        if (err) throw err;
        console.log("Opened and saved new file!");
    })

    fs.writeFile("myNewFile3.txt", "Hello content", function (err) {
        if (err) throw err;
        console.log("Updated file3!");
    })

    fs.unlink("./myNewFile3.txt", function (err) {
        if (err) throw err;
        console.log("File3 Deleted!")
    })

    fs.rename("./myNewFile2.txt", "renamedFile2.txt", (err) => {
        if (err) {
            throw err;
        }

        console.log("File2 has been renamed!");
    })
}).listen(2001); //file system module server listening on 2001 port







