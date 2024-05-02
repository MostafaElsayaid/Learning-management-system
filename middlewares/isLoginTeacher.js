const Admin = require("../model/Staff/Admin");
const Teacher = require("../model/Staff/Teacher");

const verfiyTooken = require("../utils/verifyToken");


const isTeacherlogedIn = async (req, res, next) => {
   // get token form header

   const headerObj = req.headers;
   const token = headerObj?.authorization?.split(" ")[1];
   
   //verify token
   const verfiiedToken = verfiyTooken(token);
   if (verfiiedToken) {
      // find the teacher
      const user = await Teacher.findById(verfiiedToken.id).select('name email role');
      // save user into req.obj
      req.userAuth = user;
      next()
   } else {
      const err = new Error('token expired or not valid');

      next(err)
   }


};

module.exports = isTeacherlogedIn;