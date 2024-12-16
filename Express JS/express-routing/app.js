const express = require('express');
const app = express();
const port = 6969;

//Basic route structure:
//app.METHOD(PATH, HANDLER)
/*
    app is an instance of express.
    METHOD is an HTTP request method, in lowercase.
    PATH is a path on the server.
    HANDLER is the function executed when the route is matched.
*/
//common method routes are GET, POST, PUT, DELETE.


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


//ROUTE PATHS:
app.get('/', (req, res) => {
    res.send('Root');
});

app.get('/about', (req, res) => {
    res.send('About');
});

app.get('/contact', (req, res) => {
    res.send('Contact');
});


app.get('/ab?cd', (req, res) => {
    res.send('ab?cd');
});



//ROUTE PARAMETERS:




