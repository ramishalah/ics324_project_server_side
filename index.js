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

  // for retrieving the instructors between two terms giving a course code
  .get('/instructors/:CourseCode/:FirstTerm/:SecondTerm', function(req, res, next){
    var sql = `SELECT FirstName, Lname FROM section s join instructor i on s.InstructorID = i.InstructorID Where CourseCode= '${req.params.CourseCode}' AND Term >= ${req.params.FirstTerm} AND Term <= ${req.params.SecondTerm}`
    console.log(sql);
    con.query(sql, function (err, rows, fields) {
      if (err) throw err;
      res.send(rows);
    });
  })

  // for retrieving the courses between two terms giving an instructor id
  .get('/courses/:InstructorID/:FirstTerm/:SecondTerm', function(req, res, next){
    var sql = `SELECT c.CourseCode, c.CourseName FROM section s join course c on s.CourseCode = c.CourseCode Where InstructorID= ${req.params.InstructorID} AND Term >= ${req.params.FirstTerm} AND Term <= ${req.params.SecondTerm}`
    
    console.log(sql);
    con.query(sql, function (err, rows, fields) {
      if (err) throw err;
      res.send(rows);
    });
  })

  // for retrieving the id's and the names for all instructors who can teach a specific course
  .get('/instructors/:CourseCode', function(req, res, next){
    var sql = `select i.InstructorID, FirstName, Lname
    from instructor i join preferences p
    on i.InstructorID = p.InstructorID
    where (p.Status = 'inreview' or p.status = 'accepted') and p.CourseCode = '${req.params.CourseCode}'`;

    console.log(sql);
    con.query(sql, function (err, rows, fields) {
      if (err) throw err;
      res.send(rows);
    });
  })




  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
