const asyncHandler = require('express-async-handler');
const Teacher = require('../../model/Staff/Teacher');
const { hashPassword, isPasswordMatch } = require('../../utils/helpers');
const generateToken = require('../../utils/generateToken');
const Admin = require('../../model/Staff/Admin');



// admin register teacher
// POST /api/teachers/admin/register
// private

const adminRegisterTeachers = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;
    //find the admin
    const foundedAdmin = await Admin.findById(req.userAuth._id);
    if (!foundedAdmin) {
        throw new Error('there is no admin founded')
    }
    // check if teacher exists ?
    const teacher = await Teacher.findOne({ email })
    if (teacher) {
        throw new Error('teacher already exists')
    }
    // hash password
    const hashedPassword = await hashPassword(password);
    // creat teacher 
    const teacherCreated = await Teacher.create({
        name,
        password: hashedPassword,
        email
    });
    //push teacher to admin
    foundedAdmin.teachers.push(teacherCreated?._id);
    await foundedAdmin.save();
    // send teacher data
    res.status(200).json({
        status: "success",
        message: "teacher created",
        data: teacherCreated
    })
});

// alogin teacher
// POST /api/teachers/admin/login
// public

const loginTeacher = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // find the teacher
    const teacher = await Teacher.findOne({ email })
    if (!teacher) {
        throw new Error("teacher not found")
    }
    const isMatchedPassword = await isPasswordMatch(password, teacher?.password);
    if (!isMatchedPassword) {
        return res.json({
            massege: "invalid login data"
        })
    } else {
        res.status(200).json({
            status: "success",
            message: "Teacher login successfull",
            data: generateToken(teacher?._id),teacher
        })
    }
    //

})

// get all teachers
// GET /api/teachers/admin/teachers
// private admin only

const getAllTeachers = asyncHandler(async (req, res) => {
 
   res.status(200).json(res.results);
   
})

// get single teacher by admin
// GET /api/teachers/:teacherID/admin
// private admin only
const getSingleTeacherByAdmin = asyncHandler(async (req, res) => {
    const teacherID = req.params.teacherID;
    // find teacger
    const teacher = await Teacher.findById(teacherID)
    // check exist
    if (!teacher) {
        throw new Error("Teacher not found")
    }
    res.status(200).json({
        status: "success",
        message: "fetch single teacher by admin",
        data: teacher
    })
})
// get single teacher profile
// GET /api/teachers/profile
// private teachers only
const getSingleTeacherProfile = asyncHandler(async (req, res) => {

    const teacher = await Teacher.findById(req.userAuth?._id).select("-password -createdAt -createdBy")
    if (!teacher) {
        throw new Error("Teacher not found");
    }
    res.status(200).json({
        status: "success",
        message: "fetch single teacher",
        data: teacher,
    })
})

// update teacher profile bu teacher
// put /api/v1/teachers/:teacherID/update
// private teacher only
const teacherUpdateProfile = asyncHandler(async (req, res) => {

    const { email, name, password } = req.body;

    // if email is taken
    const emailExist = await Teacher.findOne({ email })
    if (emailExist) {
        throw new Error("this email is taken/exist")
    }

    // check user if updated the password
    if (password) {
        /// update admin
        const teacher = await Teacher.findByIdAndUpdate(req.userAuth._id, {
            email,
            password: await hashPassword(password),
            name
        }, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "success",
            message: "teacher updated succefully",
            data: teacher
        })
    } else {

        /// update admin
        const teacher = await Teacher.findByIdAndUpdate(req.userAuth._id, {
            email,
            name
        }, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "success",
            message: "teacher updated succefully",
            data: teacher
        })
    }


})

// update teacher profile by admin
// put /api/v1/teachers/:teacherID/admin
// private admin only
const adminUpdateTeacher = asyncHandler(async (req, res) => {

    const { program, classLevel, academicYear, subject } = req.body;

    // if email is taken
    const teacherFound = await Teacher.findById(req.params.teacherID)
    if (!teacherFound) {
        throw new Error("teacher not found")
    }
    //check if teacher is withdrawn
    if (teacherFound.isWitdrawn) {
        throw new Error("Action denied , teacher is withdraw")
    }
    //assign program
    if (program) {
        teacherFound.program = program;
        await teacherFound.save()
        res.status(200).json({
            status: "success",
            message: "teacher updated succefully",
            data: teacherFound
        });
    }
    //assign class level
    if (classLevel) {
        teacherFound.classLevel = classLevel;
        await teacherFound.save()
        res.status(200).json({
            status: "success",
            message: "teacher updated succefully",
            data: teacherFound
        });
    }
    //assign academic year
    if (academicYear) {
        teacherFound.academicYear = academicYear;
        await teacherFound.save()
        res.status(200).json({
            status: "success",
            message: "teacher updated succefully",
            data: teacherFound
        });
    }
    //assign subject
    if (subject) {
        teacherFound.subject = subject;
        await teacherFound.save()
        res.status(200).json({
            status: "success",
            message: "teacher updated succefully",
            data: teacherFound
        });
    }

    res.status(200).json({
        status: "success",
        message: "teacher updated succefully",
        data: teacherFound
    });



})


module.exports = {
    adminRegisterTeachers, loginTeacher, getAllTeachers, getSingleTeacherByAdmin, getSingleTeacherProfile
    , teacherUpdateProfile, adminUpdateTeacher
}
