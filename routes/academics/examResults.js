const express = require("express");
const isAdmin = require("../../middlewares/isAdmin");
const islogedIn = require("../../middlewares/isLogin");
const isStudentlogedIn = require("../../middlewares/isStudentLogin");
const isStudent = require("../../middlewares/isStudent");
const { checkExamResults,getAllExamResults ,adminPublishingExamResults} = require("../../controller/academics/examResults");
const advancedResults = require("../../middlewares/advancedResults");
const ExamResult = require("../../model/Academic/ExamResults");

const examResultsRouter = express.Router()
// checking exams results
examResultsRouter.get('/:id/checking',isStudentlogedIn,isStudent,checkExamResults)
// get all  exams results
examResultsRouter.get('/',isStudentlogedIn,isStudent,advancedResults(ExamResult,"exam"),getAllExamResults)
// publish exam results
examResultsRouter.put('/:id/admin-publish',islogedIn,isAdmin,adminPublishingExamResults)
module.exports = examResultsRouter