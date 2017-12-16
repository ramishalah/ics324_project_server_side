const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const mysql = require('mysql');

// connecting to the clear db database
var con = mysql.createPool({
  connectionLimit : 10,
  host: "us-cdbr-iron-east-05.cleardb.net",
  user: "b5654c20bfc08d",
  password: "494c90c0",
  database: "heroku_1c981effd06b6ae"
});


express()
  // to parse the request body
  .use(bodyParser.json())

  // for retrieving all the students
  .get('/students', function(req, res, next){

      var sql = "SELECT * FROM student";
      con.query(sql, function (err, rows, fields) {
        if (err) throw err;
        res.send(rows);
      });

    })




  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
