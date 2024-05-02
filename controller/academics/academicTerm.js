const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const AcademicTerm = require("../../model/Academic/AcademicTerm");
// create academic term
// post /api/academic-terms
// private

const createAcademicterm = AsyncHandler(async (req, res) => {

    const { name, description, duration} = req.body;
    // check exist
    const academicTerm = await AcademicTerm.findOne({ name })
    if (academicTerm) {
        throw new Error('Academic term already exist')
    }
    // create
    const academicTermCreated = await AcademicTerm.create({
        name, description,duration, createdBy: req.userAuth._id,
    });
    // puth academic term to admin
    const admin = await Admin.findById(req.userAuth._id);
    admin.academicTerms.push(academicTermCreated._id);
    await admin.save()
    res.status(201).json({
        status: "success",
        message: "Acadmic term created successfully",
        data: academicTermCreated
    })


});

// get all academic term
// post /api/academic-terms
// private
const getAcademicTerms = AsyncHandler(async (req, res) => {


    res.status(200).json(res.results);


});

// get single academic term
// post /api/academic-terms/:id
// private

const getSingleAcademicTerm = AsyncHandler(async (req, res) => {

    const SingleAcademicTerm = await AcademicTerm.findById(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Acadmic term fetched successfully",
        data: SingleAcademicTerm
    })
});

// update  academic term
// put /api/academic-terms/:id
// private

const updateAcademicTerm = AsyncHandler(async (req, res) => {
    const { name, description, duration} = req.body;
    // check name
    const foundedAcademicTerm = await AcademicTerm.findOne({ name })
    if (foundedAcademicTerm) {
        throw new Error("Academic term alredy exist")
    }
    const SingleAcademicTerm = await AcademicTerm.findByIdAndUpdate(req.params.id, {
        name,
        description,
        duration,
        createdAt: req.userAuth._id
    }, {
        new: true
    });

    res.status(201).json({
        status: "success",
        message: "Acadmic term updated successfully",
        data: SingleAcademicTerm
    })
});

// delete academic terms
// delete /api/academic-terms/:id
// private

const deleteAcademicTerm = AsyncHandler(async (req, res) => {
    
    
     await AcademicTerm.findByIdAndDelete(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Acadmic term deleted successfully",
        
    });
});



module.exports = { createAcademicterm, getAcademicTerms, getSingleAcademicTerm, updateAcademicTerm,deleteAcademicTerm }
