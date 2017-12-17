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

  // for retrieving all sections
  .get('/sections', function(req, res, next){

    var sql = "SELECT * FROM section"
    con.query(sql, function (err, rows, fields) {
      if (err) throw err;
      res.send(rows);
    });
  })  

  // for retrieving all courses
  .get('/courses', function(req, res, next){

    var sql = "SELECT * FROM course"
    con.query(sql, function (err, rows, fields) {
      if (err) throw err;
      res.send(rows);
    });
  })

  // for retrieving all instructors
  .get('/instructors', function(req, res, next){

    var sql = "SELECT * FROM instructor"
    con.query(sql, function (err, rows, fields) {
      if (err) throw err;
      res.send(rows);
    });
  })

  // for retrieving all prerequisite
  .get('/prerequisites', function(req, res, next){

    var sql = "SELECT * FROM prerequisite"
    con.query(sql, function (err, rows, fields) {
      if (err) throw err;
      res.send(rows);
    });
  })

  // for retrieving all preferences
  .get('/preferences', function(req, res, next){

    var sql = "SELECT * FROM preferences"
    con.query(sql, function (err, rows, fields) {
      if (err) throw err;
      res.send(rows);
    });
  })

  // for retrieving all enrollments
  .get('/enrollments', function(req, res, next){

    var sql = "SELECT * FROM enrollment"
    con.query(sql, function (err, rows, fields) {
      if (err) throw err;
      res.send(rows);
    });
  })

  // req1
  .get('/:CourseCode/:FirstTerm/:SecondTerm', function(req, res, next){
    var sql = `SELECT FirstName, Lname FROM section s join instructor i on s.InstructorID = i.InstructorID Where CourseCode= '${req.params.CourseCode}' AND Term >= ${req.params.FirstTerm} AND Term <= ${req.params.SecondTerm}`
    console.log(sql);
    con.query(sql, function (err, rows, fields) {
      if (err) throw err;
      res.send(rows);
    });
  })




  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
