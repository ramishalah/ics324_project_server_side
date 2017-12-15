const express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , mysql = require('mysql');



// use body-parser middleware
app.use(bodyParser.json());

// initialize routes
app.use('/api', require('./routes/api'));



// listen for requests
app.listen(process.env.port || 4000, function(){
  console.log('now listening for requests');
});