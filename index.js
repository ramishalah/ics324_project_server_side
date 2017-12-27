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

  // for retrieving the students who eligible to take a specific course
  .get('/:CourseCode', function(req, res, next){

    

    var prerequisite = [];
    var studentsWithCourses = [];
    

    var prerequisiteSql = `select p.PreCourseCode
    from course c join prerequisite p
    on c.CourseCode = p.CourseCode
    where c.CourseCode = '${req.params.CourseCode}'`;


    con.query(prerequisiteSql, function (err, rows, fields) {
      if (err) throw err;
      prerequisite = rows;
      console.log(prerequisite);

      var studentWithCoursesSql = `select s.StuID, s.Fname, s.Lname, se.CourseCode
      from student s
      join enrollment e
      on s.StuID = e.StuID
      join section se
      on e.CRN = se.CRN`;

      
      con.query(studentWithCoursesSql, function (err, rows, fields) {
        if (err) throw err;
        studentsWithCourses = rows;
        console.log(studentsWithCourses)

        var sql = "SELECT * FROM student";
        con.query(sql, function (err, rows, fields) {
          if (err) throw err;
          var students = [];
          for(j = 0; j < studentsWithCourses.length; j++) {

            if(prerequisite.length == 0) {
              students = rows;
              break;
            } else if(studentsWithCourses[j].CourseCode == prerequisite[0].PreCourseCode && prerequisite.length != 0) {
              students.push(
                {
                  StuID: studentsWithCourses[j].StuID,
                  Fname: studentsWithCourses[j].Fname,
                  Lname: studentsWithCourses[j].Lname
                }
              )
            }
          }
          res.send(students);
        });
      });
    });
  })

  // for retrieving the id's and the names for all instructors who can teach a specific course
  .get('/instructors/:CourseCode', function(req, res, next){
    var sql = `select i.InstructorID, FirstName, Lname
    from instructor i join preferences p
    on i.InstructorID = p.InstructorID
    where (p.status = 'approved') and p.CourseCode = '${req.params.CourseCode}'`;

    console.log(sql);
    con.query(sql, function (err, rows, fields) {
      if (err) throw err;
      res.send(rows);
    });
  })

  .post('/addpreference', function(req, res, next){
    var instructorId = req.body.InstructorID;
    var courseCode = req.body.CourseCode;

    var sql = `insert into preferences values('${courseCode}', ${instructorId}, 'inreview')`;
    con.query(sql, function (err, rows, fields) {
      if (err){
        if(err.code == "ER_DUP_ENTRY")
          res.status(400).send("Duplicate InstructorID and CourseCode");
        else if(err.code == "ER_NO_REFERENCED_ROW_2")  
          res.status(400).send("InstructorID or course code does not exist");
        else
          res.status(400).send("JSON format is not correct");
      } else {
        res.send(req.body);
      }
      
    });
  })

  .put('/editpreference', function(req, res, next){
    var instructorId = req.body.InstructorID;
    var courseCode = req.body.CourseCode;
    var status = req.body.Status;

    var sql = `update preferences set Status = '${status}' where InstructorID = ${instructorId} AND CourseCode = '${courseCode}'`;
    con.query(sql, function (err, rows, fields) {
      if (err) 
        res.status(400).send("JSON format is not correct");
      else  
        res.send(req.body);
    });
  })
  // to delete all the preferences table
  .delete('/deletepreferences', function(req, res, next){

    var sql = "TRUNCATE preferences";
    con.query(sql, function (err, rows, fields) {
      if (err) throw err;
      res.send("Deleted!");
    });
  })

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
