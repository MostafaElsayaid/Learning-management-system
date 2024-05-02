const express = require("express");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherlogedIn = require("../../middlewares/isLoginTeacher");
const { createExam,getAllExams,getSingleExam,updateExam,deleteExam } = require("../../controller/academics/examsCtrl");
const advancedResults = require("../../middlewares/advancedResults");
const Exam = require("../../model/Academic/Exam");


const examRouter = express.Router();

examRouter.route('/')
//create exam
.post(isTeacherlogedIn,isTeacher,createExam)
// get all exams
.get(isTeacherlogedIn,isTeacher,advancedResults(Exam,{
    path: 'questions',
    populate:{
     path:"createdBy"
    }
 }),getAllExams)

examRouter.route('/:id')
//get single exam
.get(isTeacherlogedIn,isTeacher,getSingleExam)
// update exam
.put(isTeacherlogedIn,isTeacher,updateExam)
// delete exam
.delete(isTeacherlogedIn,isTeacher,deleteExam)
module.exports = examRouter;