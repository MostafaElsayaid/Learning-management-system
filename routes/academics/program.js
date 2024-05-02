const express = require("express");
const isAdmin = require("../../middlewares/isAdmin");
const islogedIn = require("../../middlewares/isLogin");
const { createProgram , getPrograms,getSingleProgram,updateprogram,deleteProgram} = require("../../controller/academics/programs");
const advancedResults = require("../../middlewares/advancedResults");
const Program = require("../../model/Academic/Program");




const programRouter = express.Router();

programRouter
    .route("/")
    // create program
    .post(islogedIn, isAdmin, createProgram)
    // get all programs
    .get(islogedIn, isAdmin, advancedResults(Program),getPrograms)

// // create academic year
// academicYearRouter.post("/", islogedIn, isAdmin, createAcademicYear);
// // get all academic year
// academicYearRouter.get("/", islogedIn, isAdmin, getAcademicYear);

programRouter
    .route("/:id")
    //get single
    .get(islogedIn, isAdmin, getSingleProgram)
    // update
    .put(islogedIn, isAdmin, updateprogram)
    // delete
    .delete(islogedIn, isAdmin, deleteProgram)


// //get single
// academicYearRouter.get("/:id", islogedIn, isAdmin, getSingleAcademicYear);
// // update
// academicYearRouter.put("/:id", islogedIn, isAdmin, updateAcademicYear);
// // delete
// academicYearRouter.delete("/:id", islogedIn, isAdmin,deleteAcademicYear );

module.exports = programRouter;