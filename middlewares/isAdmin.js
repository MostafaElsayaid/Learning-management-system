const Admin = require("../model/Staff/Admin");
const verfiyTooken = require("../utils/verifyToken");


const isAdmin = async (req, res, next) => {
   // find the user
   const userId = req?.userAuth?._id
   const adminFound = await Admin.findById(userId);

   // checks if admin
    if(adminFound?.role === 'admin'){
     next()
    } else {
        next(new Error("access denied admin only"));
    }

};

module.exports = isAdmin;