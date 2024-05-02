const express = require("express");
const isAdmin = require("../../middlewares/isAdmin");
const islogedIn = require("../../middlewares/isLogin");

const { adminRegisterStudents,loginStudent,getSingleStudentrProfile,getAllStudents,getSingleStudentByAdmin,studentUpdateProfile,adminUpdateStudent,writeExam } = require("../../controller/students/students");
const isStudentlogedIn = require("../../middlewares/isStudentLogin");
const isStudent = require("../../middlewares/isStudent");
const advancedResults = require("../../middlewares/advancedResults");
const Student = require("../../model/Academic/Student");




const studentRouter = express.Router();
// create students
studentRouter.post('/admin/register', islogedIn, isAdmin, adminRegisterStudents);
//login teacher
studentRouter.post('/login', loginStudent);
//get single student profile
studentRouter.get('/profile',isStudentlogedIn,isStudent,getSingleStudentrProfile)
//get all student by admin
studentRouter.get('/admin', islogedIn, isAdmin,advancedResults(Student,"examResults"), getAllStudents);
//get single student by admin
studentRouter.get('/:studentID/admin', islogedIn, isAdmin, getSingleStudentByAdmin)
// update profile by student
studentRouter.put('/:studentID/update', isStudentlogedIn,isStudent,studentUpdateProfile);
// update profile by student
studentRouter.put('/:studentID/update/admin', islogedIn,isAdmin,adminUpdateStudent);
// students taking exam
studentRouter.post('/:examID/write', isStudentlogedIn,isStudent,writeExam);


module.exports = studentRouter;