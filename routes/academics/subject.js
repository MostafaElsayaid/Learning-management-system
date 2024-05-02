const express = require("express");
const isAdmin = require("../../middlewares/isAdmin");
const islogedIn = require("../../middlewares/isLogin");
const { createsubject,getSujects,getSingleSubject,updatesubject,deleteSubject } = require("../../controller/academics/subjects");
const advancedResults = require("../../middlewares/advancedResults");
const Subject = require("../../model/Academic/Subject");



const subjectRouter = express.Router();
//create subject
subjectRouter.post("/:programID",islogedIn,isAdmin,createsubject)
//get all subjects
subjectRouter.get("/",islogedIn,isAdmin,advancedResults(Subject),getSujects)
    



subjectRouter
    .route("/:id")
    //get single
    .get(islogedIn, isAdmin, getSingleSubject)
    // update
    .put(islogedIn, isAdmin, updatesubject)
    // delete
    .delete(islogedIn, isAdmin, deleteSubject)




module.exports = subjectRouter;