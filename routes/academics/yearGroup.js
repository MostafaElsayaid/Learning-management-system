const express = require("express");
const isAdmin = require("../../middlewares/isAdmin");
const islogedIn = require("../../middlewares/isLogin");
const { createYearGroups,getYearGroups,getSingleYearGroups,updateYearGroups,deleteYearGroups } = require("../../controller/academics/yearGroup");
const advancedResults = require("../../middlewares/advancedResults");
const YearGroup = require("../../model/Academic/YearGroup");




const yearGroupRouter = express.Router();

yearGroupRouter
    .route("/")
    // create program
    .post(islogedIn, isAdmin, createYearGroups)
    // get all programs
    .get(islogedIn, isAdmin,advancedResults(YearGroup), getYearGroups)

// // create academic year
// academicYearRouter.post("/", islogedIn, isAdmin, createAcademicYear);
// // get all academic year
// academicYearRouter.get("/", islogedIn, isAdmin, getAcademicYear);

yearGroupRouter
    .route("/:id")
    //get single
    .get(islogedIn, isAdmin, getSingleYearGroups)
    // update
    .put(islogedIn, isAdmin, updateYearGroups)
    // delete
    .delete(islogedIn, isAdmin, deleteYearGroups)


// //get single
// academicYearRouter.get("/:id", islogedIn, isAdmin, getSingleAcademicYear);
// // update
// academicYearRouter.put("/:id", islogedIn, isAdmin, updateAcademicYear);
// // delete
// academicYearRouter.delete("/:id", islogedIn, isAdmin,deleteAcademicYear );

module.exports = yearGroupRouter;