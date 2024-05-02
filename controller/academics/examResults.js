const AsyncHandler = require("express-async-handler");
const ExamResult = require("../../model/Academic/ExamResults");
const Student = require("../../model/Academic/Student");


// exam results checking
// post /api/v1/exam-results/:id/checking
// private students only

const checkExamResults = AsyncHandler(async (req, res) => {
    // find the student 
    const foundedStudent = await Student.findById(req.userAuth?._id);
    if (!foundedStudent) {
        throw new Error("No student Founded")
    }
    // find the exam results
    const examResults = await ExamResult.findOne({
        studentID: foundedStudent?.studentId,
        _id: req.params.id,
    }).populate({
        path: 'exam',
        populate: {
            path: 'questions',
        }
    })
        .populate('classLevel')
        .populate('academicTerm')
        .populate('academicYear')

    //check if the exam is published
    if (!examResults?.isPublished) {
        throw new Error("Exam results is not available, check out later");
    }
    res.json({
        status: "success",
        message: "Exam resullts",
        data: examResults,
        student: foundedStudent
    })
})



// get all exam results 
// post /api/v1/exam-results
// private students only

const getAllExamResults = AsyncHandler(async (req, res) => {
    res.status(200).json(res.results);

})
// admin publishing exam results
// post /api/v1/exam-results/:id/admin-publish
// private admin only

const adminPublishingExamResults = AsyncHandler(async (req, res) => {
    //find the exam results
    const examResults = await ExamResult.findById(req.params.id)
    if(!examResults){
        throw new Error('there is no exam results')
    }
  const publishResults = await ExamResult.findByIdAndUpdate(req.params.id,{
    isPublished: req.body.publish,
  },{
    new: true,
  })
    res.status(200).json({
        status: "success",
        message: "exam results published successfuly",
        data: publishResults
    })

})
module.exports = { checkExamResults, getAllExamResults ,adminPublishingExamResults }