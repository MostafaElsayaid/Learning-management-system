const express = require("express");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherlogedIn = require("../../middlewares/isLoginTeacher");
const { createQuestions,getAllQuestions,getSingleQuestion,updatQuestion } = require("../../controller/academics/examQuestions");
const advancedResults = require("../../middlewares/advancedResults");
const Question = require("../../model/Academic/Questions");


const questionRouter = express.Router()
//create questions
questionRouter.post('/:examID',isTeacherlogedIn,isTeacher,createQuestions)
//get all questions
questionRouter.get('/',isTeacherlogedIn,isTeacher,advancedResults(Question),getAllQuestions)
//get single question
questionRouter.get('/:id',isTeacherlogedIn,isTeacher,getSingleQuestion)
//update question
questionRouter.put('/:id',isTeacherlogedIn,isTeacher,updatQuestion)

module.exports = questionRouter;