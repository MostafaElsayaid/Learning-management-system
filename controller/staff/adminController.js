const Admin = require("../../model/Staff/Admin");
const asyncHandler = require('express-async-handler');
const generateToken = require("../../utils/generateToken");
const verfiyToken = require("../../utils/verifyToken");
const bcrypt = require("bcryptjs");
const { hashPassword, isPasswordMatch } = require("../../utils/helpers");
const Teacher = require("../../model/Staff/Teacher");
const Student = require("../../model/Academic/Student");



// register admin
// post /api/admins/register
// private

const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    // check if admin is exist 

    const adminFound = await Admin.findOne({ email })
    if (adminFound) {
        throw new Error("admin exist")
    }

    // register

    const user = await Admin.create({
        name, password: await hashPassword(password), email
    })
    res.status(201).json({
        status: "success",
        data: user,
        message: "admin registerated succefully "
    });

})
// login admin
// post /api/admins/login
// private
const loginAdmin = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    console.log(req.body)
    // find user 
    const user = await Admin.findOne({ email })
    if (!user) {
        return res.status(404).json({
            message: "user not found"
        })
    }
    // verfiy password
    const isMatched = await isPasswordMatch(password, user.password)
    if (!isMatched) {

        return res.json({
            message: "invalid login data"
        })
    } else {
        return res.status(201).json({
            data: generateToken(user._id),user,
            message: "admin logedin succefully"
        });
    }


})
// ubdate admin
// put /api/admins/:id
// private
const updateAdmin = asyncHandler(async (req, res) => {

    const { email, name, password } = req.body;

    // if email is taken
    const emailExist = await Admin.findOne({ email })
    if (emailExist) {
        throw new Error("this emailis taken/exist")
    }

    // check user if updated the password
    if (password) {
        /// update admin
        const admin = await Admin.findByIdAndUpdate(req.userAuth._id, {
            email,
            password: await hashPassword(password),
            name
        }, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "success",
            message: "Admin updated succefully",
            data: admin
        })
    } else {

        /// update admin
        const admin = await Admin.findByIdAndUpdate(req.userAuth._id, {
            email,
            name
        }, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "success",
            message: "Admin updated succefully",
            data: admin
        })
    }


})
// delete admin
// delete /api/admins/:id
// private
const deleteAdmin = asyncHandler(async (req, res) => {
    await Admin.findByIdAndDelete(req.params._id);

    res.status(201).json({
        status: "success",
        message: "Admin deleted successfully",

    });
})
// get all admin
// get /api/admins
// private
const getAllAdmin = asyncHandler(async (req, res) => {

    res.status(200).json(res.results);

})
// get single admin
// get /api/admins/:id
// private
const getSingleAdminProfile = asyncHandler(async (req, res) => {

    const admin = await Admin.findById(req.userAuth._id)
        .select('-password -createdAt -updatedAt')
        .populate('academicYears')
        .populate('academicTerms')
        .populate('programs')
        .populate('yearGroups')
        .populate('classLevels')
        .populate('teachers')
        .populate('students')
    if (!admin) {
        throw new Error('admin not found')
    } else {
        res.status(200).json({
            status: "success",
            data: admin,
            message: "admin profile fetched succefully "
        })
    }

})
// admin susbending /unsusbending teacher
// put /api/admins/suspend/teacher/:id
// private


const adminSusbundindgTeacher= asyncHandler(async (req, res) => {
    //find the teacher
    const teacher = await Teacher.findById(req.params.id)
    if(!teacher){
        throw new Error('there is no teacher founded')
    }
  const susTeacher = await Teacher.findByIdAndUpdate(req.params.id,{
    isSuspended: req.body.suspended,
  },{
    new: true,
  })
    res.status(200).json({
        status: "success",
        message: "Teacher susbpended successfuly",
        data: susTeacher
    })

})

//admin withdraw /unwithdraw  teacher
// put /admins/withdraw/teacher/:id
// private
const adminWithdrawingTeacher = asyncHandler(async (req, res) => {
    //find the teacher
    const teacher = await Teacher.findById(req.params.id)
    if(!teacher){
        throw new Error('there is no teacher founded')
    }
  const withdrawTeacher = await Teacher.findByIdAndUpdate(req.params.id,{
    isWitdrawn: req.body.withdrawTeacher,
  },{
    new: true,
  })
    res.status(200).json({
        status: "success",
        message: "Teacher susbpended successfuly",
        data: withdrawTeacher
    })

})
//admin withdraw /unwithdraw  student
// put /admins/withdraw/student/:id
// private
const adminWithdrawingStudent = asyncHandler(async (req, res) => {
    //find the student
    const student = await Student.findById(req.params.id)
    if(!student){
        throw new Error('there is no student founded')
    }
  const withdrawStudent = await Student.findByIdAndUpdate(req.params.id,{
    isWithdrawn: req.body.withdrawStudent,
  },{
    new: true,
  })
    res.status(200).json({
        status: "success",
        message: "Student susbpended successfuly",
        data: withdrawStudent
    })

})





module.exports = {
    registerAdmin,
    loginAdmin,
    updateAdmin,
    deleteAdmin,
    getAllAdmin,
    getSingleAdminProfile,
    adminSusbundindgTeacher,
    adminWithdrawingTeacher,
    adminWithdrawingStudent,
    
   
}
