const express = require("express");
const { adminRegisterTeachers, loginTeacher, getAllTeachers, getSingleTeacherByAdmin, getSingleTeacherProfile, teacherUpdateProfile, adminUpdateTeacher } = require("../../controller/staff/teachers");
const isAdmin = require("../../middlewares/isAdmin");
const islogedIn = require("../../middlewares/isLogin");
const isTeacherlogedIn = require("../../middlewares/isLoginTeacher");
const isTeacher = require("../../middlewares/isTeacher");
const advancedResults = require("../../middlewares/advancedResults");
const Teacher = require("../../model/Staff/Teacher");

const teacherRouter = express.Router();
// create teacher
teacherRouter.post('/admin/register', islogedIn, isAdmin, adminRegisterTeachers)
//login teacher
teacherRouter.post('/login', loginTeacher)
//get all teacher
teacherRouter.get('/admin', islogedIn, isAdmin, advancedResults(Teacher, {
    path: "examsCreated",
    populate:{
        path:"questions"
    }
}), getAllTeachers)
//get single teacher profile
teacherRouter.get('/profile', isTeacherlogedIn, isTeacher, getSingleTeacherProfile)
//update  teacher profile by teacher
teacherRouter.put('/:teacherID/update', isTeacherlogedIn, isTeacher, teacherUpdateProfile)
//update  teacher profile by ADMIN
teacherRouter.put('/:teacherID/update/admin', islogedIn, isAdmin, adminUpdateTeacher)
//get single teacher by admin
teacherRouter.get('/:teacherID/admin', islogedIn, isAdmin, getSingleTeacherByAdmin)


module.exports = teacherRouter;