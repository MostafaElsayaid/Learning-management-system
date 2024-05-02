const express = require("express");
const isAdmin = require("../../middlewares/isAdmin");
const islogedIn = require("../../middlewares/isLogin");
const { createClassLevel ,getClassLevel,getSingleClassLevel,updateClassLevel,deleteClassLevel} = require("../../controller/academics/classLevel");
const advancedResults = require("../../middlewares/advancedResults");
const ClassLevel = require("../../model/Academic/ClassLevel");




const classlevelRouter = express.Router();

classlevelRouter
    .route("/")
    // create class name
    .post(islogedIn, isAdmin, createClassLevel)
    // get all class names
    .get(islogedIn, isAdmin, advancedResults(ClassLevel),getClassLevel)

// // create academic year
// academicYearRouter.post("/", islogedIn, isAdmin, createAcademicYear);
// // get all academic year
// academicYearRouter.get("/", islogedIn, isAdmin, getAcademicYear);

classlevelRouter
    .route("/:id")
    //get single
    .get(islogedIn, isAdmin, getSingleClassLevel)
    // update
    .put(islogedIn, isAdmin, updateClassLevel)
    // delete
    .delete(islogedIn, isAdmin, deleteClassLevel)


// //get single
// academicYearRouter.get("/:id", islogedIn, isAdmin, getSingleAcademicYear);
// // update
// academicYearRouter.put("/:id", islogedIn, isAdmin, updateAcademicYear);
// // delete
// academicYearRouter.delete("/:id", islogedIn, isAdmin,deleteAcademicYear );

module.exports = classlevelRouter;