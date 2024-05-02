const express = require("express");
const { createAcademicYear, getAcademicYear, getSingleAcademicYear, updateAcademicYear, deleteAcademicYear } = require("../../controller/academics/academicYear");
const isAdmin = require("../../middlewares/isAdmin");
const islogedIn = require("../../middlewares/isLogin");
const AcademicYear = require("../../model/Academic/AcademicYear");
const advancedResults = require("../../middlewares/advancedResults");




const academicYearRouter = express.Router();

academicYearRouter
    .route("/")
    // create academic year
    .post(islogedIn, isAdmin, createAcademicYear)
    // get all academic year
    .get(islogedIn, isAdmin,advancedResults(AcademicYear), getAcademicYear)

// // create academic year
// academicYearRouter.post("/", islogedIn, isAdmin, createAcademicYear);
// // get all academic year
// academicYearRouter.get("/", islogedIn, isAdmin, getAcademicYear);

academicYearRouter
    .route("/:id")
    //get single
    .get(islogedIn, isAdmin, getSingleAcademicYear)
    // update
    .put(islogedIn, isAdmin, updateAcademicYear)
    // delete
    .delete(islogedIn, isAdmin, deleteAcademicYear)


// //get single
// academicYearRouter.get("/:id", islogedIn, isAdmin, getSingleAcademicYear);
// // update
// academicYearRouter.put("/:id", islogedIn, isAdmin, updateAcademicYear);
// // delete
// academicYearRouter.delete("/:id", islogedIn, isAdmin,deleteAcademicYear );

module.exports = academicYearRouter;