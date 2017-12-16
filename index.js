const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const mysql = require('mysql');

var con = mysql.createPool({
  connectionLimit : 10,
  host: "us-cdbr-iron-east-05.cleardb.net",
  user: "b5654c20bfc08d",
  password: "494c90c0",
  database: "heroku_1c981effd06b6ae"
});


express()
  .use(bodyParser.json())
  .get('/hello', function(req, res, next){
      var sql = "SELECT * FROM student";
      con.query(sql, function (err, rows, fields) {
        if (err) throw err;
        res.send(rows);
      });
    })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
