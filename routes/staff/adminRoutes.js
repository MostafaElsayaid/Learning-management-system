const express = require("express");

const adminRouter = express.Router();
const adminController = require("../../controller/staff/adminController");
const islogedIn = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const advancedResults = require("../../middlewares/advancedResults");
const Admin = require("../../model/Staff/Admin");


// register
adminRouter.post('/register', adminController.registerAdmin)
//login
adminRouter.post('/login', adminController.loginAdmin)

// update
adminRouter.put('/',islogedIn,isAdmin, adminController.updateAdmin)
// delete
adminRouter.delete('/',islogedIn,isAdmin, adminController.deleteAdmin)

//get all 
adminRouter.get('/',islogedIn,isAdmin,advancedResults(Admin),adminController.getAllAdmin)
// get single
adminRouter.get('/profile', islogedIn,isAdmin, adminController.getSingleAdminProfile)
// suspend or unsuspend teacher
adminRouter.put('/suspend/teacher/:id', adminController.adminSusbundindgTeacher)
//withdraw or withdraw teacher
adminRouter.put('/withdraw/teacher/:id', adminController.adminWithdrawingTeacher)
//withdraw or withdraw student
adminRouter.put('/withdraw/student/:id', adminController.adminWithdrawingStudent)



module.exports = adminRouter;