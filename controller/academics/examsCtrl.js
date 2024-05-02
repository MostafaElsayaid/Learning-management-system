const asyncHandler = require("express-async-handler");
const Exam = require("../../model/Academic/Exam");
const Teacher = require("../../model/Staff/Teacher");
const Student = require("../../model/Academic/Student");

// create exam
// POST /api/v1/exams
// private teacher only

const createExam = asyncHandler(async (req, res) => {


    const {
        name,
        description,
        subject,
        program,
        academicTerm,
        duration,
        examDate,
        examTime,
        examType,
        classLevel,
        academicYear,
        examStatus

    } = req.body;
    //find teacher
    const teacherFound = await Teacher.findById(req.userAuth?._id);
    if (!teacherFound) {
        throw new Error("Teacher not found")
    }
    //find exam
    const examExist = await Exam.findOne({ name })
    if (examExist) {
        throw new Error("exam already exist")
    }
    // create exam
    const examCreated = new Exam({
        name,
        description,
        academicTerm,
        academicYear,
        classLevel,
        duration,
        examDate,
        examTime,
        examStatus,
        subject,
        program,
        examType,
        createdBy: req.userAuth?._id
    });
    //push to teacher
    teacherFound.examsCreated.push(examCreated._id)
    //save exam
    await examCreated.save();
    await teacherFound.save();

    res.status(201).json({
        status: "success",
        message: "exam created",
        data: examCreated
    })
})

// get all exams
// post /api/exams
// private teacher only
const getAllExams = asyncHandler(async (req, res) => {


    res.status(200).json(res.results);


});

// get single exam
// post /api/exams/:id
// private teacher only

const getSingleExam = asyncHandler(async (req, res) => {

    const SingleExam = await Exam.findById(req.params.id);

    res.status(201).json({
        status: "success",
        message: "exam fetched successfully",
        data: SingleExam
    })
});

// update Exam
// put /api/exams/:id
// private teacher only

const updateExam = asyncHandler(async (req, res) => {
    const { name,
        description,
        subject,
        program,
        academicTerm,
        duration,
        examDate,
        examTime,
        examType,
        classLevel,
        academicYear,
        examStatus } = req.body;
    // check name
    const foundedExam = await Exam.findOne({ name })
    if (foundedExam) {
        throw new Error("exam alredy exist")
    }
    const examUpdated = await Exam.findByIdAndUpdate(req.params.id, {
        name,
        description,
        subject,
        program,
        academicTerm,
        duration,
        examDate,
        examTime,
        examType,
        classLevel,
        academicYear,
        examStatus,
        createdAt: req.userAuth?._id
    }, {
        new: true
    });

    res.status(201).json({
        status: "success",
        message: "exam updated successfully",
        data: examUpdated
    })
});



// delete exam
// delete /exams/:id
// private teacher only

const deleteExam = asyncHandler(async (req, res) => {


    await Exam.findByIdAndDelete(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Exam deleted successfully",

    });
});




module.exports = {
    createExam,
    getAllExams,
    getSingleExam,
    updateExam,
    deleteExam
}