const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const mysql = require('mysql');

var con = mysql.createPool({
  connectionLimit : 10,
  host: "us-cdbr-iron-east-05.cleardb.net",
  user: "b80bbc009ec33c",
  password: "98f73cf6",
  database: "heroku_ec70ce51f8640f0"
});


express()
  .use(bodyParser.json())
  .get('/hello', function(req, res, next){
      var sql = "SELECT * FROM temp";
      con.query(sql, function (err, rows, fields) {
        if (err) throw err;
        res.send(rows);
      });
    })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
