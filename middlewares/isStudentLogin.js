const Student = require("../model/Academic/Student");

const verfiyTooken = require("../utils/verifyToken");


const isStudentlogedIn = async (req, res, next) => {
   // get token form header

   const headerObj = req.headers;
   const token = headerObj?.authorization?.split(" ")[1];
   
   //verify token
   const verfiiedToken = verfiyTooken(token);
   if (verfiiedToken) {
      // find the student
      const student = await Student.findById(verfiiedToken.id).select('name email role');
      // save student into req.obj
      req.userAuth = student;
      next()
   } else {
      const err = new Error('token expired or not valid');

      next(err)
   }


};

module.exports = isStudentlogedIn;