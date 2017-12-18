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

    var prerequisiteSql = `select p.PreCourseCode
    from course c join prerequisite p
    on c.CourseCode = p.CourseCode
    where c.CourseCode = '${req.params.CourseCode}'`;


    var prerequisite = [];
    con.query(prerequisiteSql, function (err, rows, fields) {
      if (err) throw err;
      prerequisite = rows;
      res.send(prerequisite);
    });

    var studentWithCoursesSql = `select s.StuID, s.Fname, s.Lname, se.CourseCode
    from student s
    join enrollment e
    on s.StuID = e.StuID
    join section se
    on e.CRN = se.CRN`;

    var studentsWithCourses = [];
    con.query(studentWithCoursesSql, function (err, rows, fields) {
      if (err) throw err;
      studentsWithCourses = rows;
    });

    // var students = [];

    // var prerequisiteCourseCode = prerequisite[0].PreCourseCode;

    // for(j = 0; j < studentsWithCourses.length; j++) {

    //   var CourseCode = studentsWithCourses[j].CourseCode;
    //   // var studentID1 = studentsWithCourses[j].StuID;
    //   // var studentID2;
    //   // if(studentsWithCourses[i + 1] != null)
    //   //   studentID2 = studentsWithCourses[j + 1].StuID;

    //   if(CourseCode == prerequisiteCourseCode) {
    //     students.push(
    //       {
    //         StudID: studentsWithCourses[j].StuID,
    //         Fname: studentsWithCourses[j].Fname,
    //         Lname: studentsWithCourses[j].Lname
    //       }
    //     )
    //   } 
    // }
    // res.send(students);

    // var eachStudentWithCourses = [];
    // var coursesArray = []
    // for(i = 0; i < studentsWithCourses.length; i++) {
    //   var studentID1 = studentsWithCourses[i].StuID;
    //   var studentID2;
    //   if(studentsWithCourses[i + 1] != null)
    //     studentID2 = studentsWithCourses[i + 1].StuID;

    //   coursesArray.push(studentsWithCourses.CourseCode);
      
    //   if(studentID1 != studentID2) {
    //     var studentHasCourses = {
    //       studentID1: coursesArray
    //     }
    //     coursesArray = [];
    //     eachStudentWithCourses.push(studentHasCourses);

    //   }
    // }

    // var students = [];
    // for(i = 0; i < prerequisite.length; i++) {
    //   var preCourseCode = prerequisite[i].CourseCode;
    //   for(j = 0; j < eachStudentWithCourses.length; j++){
    //     var studentId = eachStudentWithCourses[j];
    //     for(k = 0; k < eachStudentWithCourses.studentID1.length; k++) {
    //       if(eachStudentWithCourses.studentID1[k] == preCourseCode)
    //         students.push({
    //           StuID: studentId,

    //         });
    //     }
    //   }
    // }



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
