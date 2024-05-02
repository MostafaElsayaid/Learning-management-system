const asyncHandler = require('express-async-handler');
const { hashPassword, isPasswordMatch } = require('../../utils/helpers');
const generateToken = require('../../utils/generateToken');
const Student = require('../../model/Academic/Student');
const Exam = require('../../model/Academic/Exam');
const ExamResult = require('../../model/Academic/ExamResults');
const Admin = require('../../model/Staff/Admin');



// admin register students
// POST /api/students/admin/register
// private admin only

const adminRegisterStudents = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;
    //find the admin
    const foundedAdmin = await Admin.findById(req.userAuth._id);
    if(!foundedAdmin){
        throw new Error('there is no admin founded')
    }
    // check if student exists ?
    const student = await Student.findOne({ email })
    if (student) {
        throw new Error('student already exists')
    }

    // hash password
    const hashedPassword = await hashPassword(password);
    // creat student 
    const studentCreated = await Student.create({
        name,
        password: hashedPassword,
        email
    });
    //push student to admin
    foundedAdmin.students.push(studentCreated?._id);
    await foundedAdmin.save();
    // send student data
    res.status(200).json({
        status: "success",
        message: "student created",
        data: studentCreated
    })
});

// alogin students
// POST /api/students/admin/login
// public 

const loginStudent = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // find the student
    const student = await Student.findOne({ email })
    if (!student) {
        throw new Error("student not found")
    }
    const isMatchedPassword = await isPasswordMatch(password, student?.password);
    if (!isMatchedPassword) {
        return res.json({
            massege: "invalid login data"
        })
    } else {
        res.status(200).json({
            status: "success",
            message: "Student login successfull",
            data: generateToken(student?._id)
        })
    }
    //

});

// get single student profile
// GET /api/students/profile
// private students only
const getSingleStudentrProfile = asyncHandler(async (req, res) => {

    const student = await Student.findById(req.userAuth?._id).select("-password -createdAt -createdBy").populate('examResults')

    if (!student) {
        throw new Error("Student not found");
    }
    // get student profile 
    const studentProfile = {
        name: student?.name,
        email: student?.email,
        currentClassLevel: student?.currentClassLevel,
        program: student?.program,
        dateAdmitted: student?.dateAdmitted,
        isSuspended: student?.isSuspended,
        isWithdrawn: student?.isWithdrawn,
        studentID: student?.studentId,
        prefectName: student?.prefectName

    }
    //get studnt exam results
    const examResults = student?.examResults;
    // current exam 
    const currentExamResult = examResults[examResults.length - 1];
    //check if exam is piblished
    const isPublished = currentExamResult?.isPublished;

    // send res
    res.status(200).json({
        status: "success",
        message: "fetch single student profile",
        data: {
            studentProfile,
            currentExamResult: isPublished ? currentExamResult : [],
        }
    })
});

// get all students
// GET /api/students/admin/students
// private admin only

const getAllStudents = asyncHandler(async (req, res) => {
    res.status(200).json(res.results);

});

// get single student by admin
// GET /api/studentss/:studentID/admin
// private admin only
const getSingleStudentByAdmin = asyncHandler(async (req, res) => {
    const studentID = req.params.studentID;
    // find student
    const student = await Student.findById(studentID)
    // check exist
    if (!student) {
        throw new Error("Student not found")
    }
    res.status(200).json({
        status: "success",
        message: "fetch single student by admin",
        data: student
    })
})

// update student profile by student
// put /api/v1/students/:studentID/update
// private student only
const studentUpdateProfile = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    // if email is taken
    const emailExist = await Student.findOne({ email })
    if (emailExist) {
        throw new Error("this email is taken/exist")
    }

    // check user if updated the password
    if (password) {
        /// update admin
        const student = await Student.findByIdAndUpdate(req.userAuth._id, {
            email,
            password: await hashPassword(password),

        }, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "success",
            message: "student updated succefully",
            data: student
        })
    } else {

        /// update 
        const student = await Student.findByIdAndUpdate(req.userAuth._id, {
            email,

        }, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "success",
            message: "student updated succefully",
            data: student
        })
    }


})

// update student profile by admin
// put /api/v1/students/:studentID/update/admin
// private admin only

const adminUpdateStudent = asyncHandler(async (req, res) => {
    const { classLevels, academicYear, program, name, email, prefectName, isSuspended, isWithdrawn } = req.body;
    // find the student
    const studentFound = await Student.findById(req.params.studentID);

    if (!studentFound) {
        throw new Error("student not found")
    }

    //update 
    const studentUpdated = await Student.findByIdAndUpdate(req.params.studentID,
        {
            $set: {
                name,
                email,
                academicYear,
                program,
                prefectName,
                isSuspended,
                isWithdrawn
            },
            $addToSet: {
                classLevels
            }
        }, {
        new: true
    });
    //response
    res.status(200).json({
        status: "success",
        message: "student updated succefully",
        data: studentUpdated
    })

})
// Student taking exam
// put /api/v1/students/:examID/write
// private student only

const writeExam = asyncHandler(async (req, res) => {
    //get the student
    const foundedStudent = await Student.findById(req.userAuth?._id);
    if (!foundedStudent) {
        throw new Error("student not found")
    }
    // get exam
    const foundedExam = await Exam.findById(req.params.examID).populate("questions").populate("academicTerm");
    if (!foundedExam) {
        throw new Error("Exam not found")
    }

    // //check if student already take the exams
    const studentFoundedResults = await ExamResult.findOne({ student: foundedStudent?._id });
    if (studentFoundedResults) {
        throw new Error('you have already take the exam')
    }
    //check is student is withdrawn / suspended
    if (foundedStudent.isWithdrawn || foundedStudent.isSuspended) {
        throw new Error("you are suspended // withdrawn , you can not take the exam")
    }
    //get questions
    const questions = foundedExam?.questions;

    //get student question
    const studentAnswers = req.body.answers;

    //check if students answer all questions
    if (studentAnswers.length != questions.length) {
        throw new Error('you have not answer all questions')
    }

    // bulding report opj
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let status = ''
    let grade = 0;
    let score = 0;
    let remarks = '';
    let answeredQuestions = [];

    //check for answers
    for (i = 0; i < questions.length; i++) {
        const question = questions[i]
        //check if answers is correct
        if (question.correctAnswer === studentAnswers[i]) {
            correctAnswers++
            score++
            question.isCorrect = true
        } else {
            wrongAnswers++
        }
    }
    //calculate reports
    totalQuestions = questions.length;
    grade = (correctAnswers / questions.length) * 100
    answeredQuestions = questions.map(question => {
        return {
            question: question.question,
            correctAnswer: question.correctAnswer,
            isCorrect: question.isCorrect
        }
    })
    // calculate status
    if (grade >= 50) {
        status = 'passed'
    } else {
        status = 'failed'
    }

    // Remarks
    if (grade >= 80) {
        remarks = 'Excellent';
    } else if (grade >= 70) {
        remarks = 'Very Good';
    }
    else if (grade >= 60) {
        remarks = ' Good';
    }
    else if (grade >= 50) {
        remarks = 'Poor';
    }
    else {
        remarks = 'faild';
    }
    //genrate exam results
    const examRuesults = await ExamResult.create({
        studentID: foundedStudent?.studentId,
        exam: foundedExam?._id,
        grade,
        score,
        status,
        remarks,
        classLevel: foundedExam?.classLevel,
        academicTerm: foundedExam?.academicTerm,
        academicYear: foundedExam?.academicYear,
        answerdQuestions: answeredQuestions,
    })

    //push to  results into student
    foundedStudent.examResults.push(examRuesults?._id);
    //  //save 
    await foundedStudent.save();

    //Promoting
    // promote to next level {level 200}
    if (foundedExam.academicTerm.name === 'sec term' && status === 'passed' && foundedStudent.currentClassLevel === 'level 100') {
        foundedStudent.classLevels.push('level 200');
        foundedStudent.currentClassLevel = 'level 200'
        await foundedStudent.save();

    }
    // promote to next level {level 300}
    if (foundedExam.academicTerm.name === 'sec term' && status === 'passed' && foundedStudent.currentClassLevel === 'level 200') {
        foundedStudent.classLevels.push('level 300');
        foundedStudent.currentClassLevel = 'level 300'
        await foundedStudent.save();

    }
    // promote to next level {level 400}
    if (foundedExam.academicTerm.name === 'sec term' && status === 'passed' && foundedStudent.currentClassLevel === 'level 300') {
        foundedStudent.classLevels.push('level 400');
        foundedStudent.currentClassLevel = 'level 400'
        await foundedStudent.save();

    }
    // promote to next level {graduate}
    if (foundedExam.academicTerm.name === 'sec term' && status === 'passed' && foundedStudent.currentClassLevel === 'level 400') {
        foundedStudent.isGraduated = true;
        foundedStudent.yearGraduated = new Date
        await foundedStudent.save();

    }
    res.status(200).json({
        status: "success",
        data: 'you have submited your exam , check later for results'

    })

});


module.exports = {
    adminRegisterStudents,
    loginStudent,
    getSingleStudentrProfile,
    getAllStudents,
    getSingleStudentByAdmin,
    studentUpdateProfile,
    adminUpdateStudent,
    writeExam
}