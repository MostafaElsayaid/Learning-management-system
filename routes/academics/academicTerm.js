const express = require("express");
const isAdmin = require("../../middlewares/isAdmin");
const islogedIn = require("../../middlewares/isLogin");
const { createAcademicterm, getAcademicTerms, getSingleAcademicTerm, updateAcademicTerm, deleteAcademicTerm } = require("../../controller/academics/academicTerm");
const AcademicTerm = require("../../model/Academic/AcademicTerm");
const advancedResults = require("../../middlewares/advancedResults");




const academicTermRouter = express.Router();

academicTermRouter
    .route("/")
    // create academic year
    .post(islogedIn, isAdmin, createAcademicterm)
    // get all academic year
    .get(islogedIn, isAdmin, advancedResults(AcademicTerm),getAcademicTerms)

// // create academic year
// academicYearRouter.post("/", islogedIn, isAdmin, createAcademicYear);
// // get all academic year
// academicYearRouter.get("/", islogedIn, isAdmin, getAcademicYear);

academicTermRouter
    .route("/:id")
    //get single
    .get(islogedIn, isAdmin, getSingleAcademicTerm)
    // update
    .put(islogedIn, isAdmin, updateAcademicTerm)
    // delete
    .delete(islogedIn, isAdmin, deleteAcademicTerm)


// //get single
// academicYearRouter.get("/:id", islogedIn, isAdmin, getSingleAcademicYear);
// // update
// academicYearRouter.put("/:id", islogedIn, isAdmin, updateAcademicYear);
// // delete
// academicYearRouter.delete("/:id", islogedIn, isAdmin,deleteAcademicYear );

module.exports = academicTermRouter;