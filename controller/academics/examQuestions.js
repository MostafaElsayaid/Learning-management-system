
const Exam = require("../../model/Academic/Exam");
const Question = require("../../model/Academic/Questions");
const AsyncHandler = require("express-async-handler");

// create exam questions
// post /api/questions/:examID/
// private teachers only

const createQuestions = AsyncHandler(async (req, res) => {
    const { question, optionA, optionB, optionC, optionD, correctAnswer } = req.body
    // find the exam
    const examFound = await Exam.findById(req.params.examID)
    if (!examFound) {
        throw new Error("Exam not found")
    }
    // check if qouestion exist
    const questionExist = await Question.findOne({ question })
    if (questionExist) {
        throw new Error("Question exist")
    }
    // create exam
    const questionCreated = await Question.create({
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        createdBy: req.userAuth?._id,
    })
    // add question into exam
    examFound.questions.push(questionCreated?._id)
    //save 
    await examFound.save();
    res.status(201).json({
        status: "success",
        message: "Question created",
        data: questionCreated,
    })
});

// get all questions
// post /api/questions
// private teacher only
const getAllQuestions = AsyncHandler(async (req, res) => {


    res.status(200).json(res.results);


});

// get single  pquestions
// post /api/questions/:id
// private teacher only

const getSingleQuestion = AsyncHandler(async (req, res) => {

    const getSingleQuestion = await Question.findById(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Question fetched successfully",
        data: getSingleQuestion
    })
});

// update  question
// put /api/questions/:id
// private teacher only

const updatQuestion = AsyncHandler(async (req, res) => {
    const { question, optionA, optionB, optionC, optionD, correctAnswer } = req.body;
    // check question exist
    const foundedQuestion = await Question.findOne({ question })
    if (foundedQuestion) {
        throw new Error("Question alredy exist")
    }
    const singleQuestion = await Question.findByIdAndUpdate(req.params.id, {
        question,
         optionA, 
         optionB,
          optionC,
           optionD,
            correctAnswer,
        createdBy: req.userAuth?._id
    }, {
        new: true
    });

    res.status(201).json({
        status: "success",
        message: "Question updated successfully",
        data: singleQuestion
    })
});

module.exports = { createQuestions, getAllQuestions, getSingleQuestion,updatQuestion }

