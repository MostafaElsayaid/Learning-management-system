const AsyncHandler = require("express-async-handler");
const AcademicYear = require("../../model/Academic/AcademicYear");
const Admin = require("../../model/Staff/Admin");

// create academic year
// post /api/academic-years
// private

const createAcademicYear = AsyncHandler(async (req, res) => {

    const { name, fromYear, toYear } = req.body;
    // check exist
    const academicYear = await AcademicYear.findOne({ name })
    if (academicYear) {
        throw new Error('Academic year already exist')
    }
    // create
    const academicYearCreated = await AcademicYear.create({
        name, fromYear, toYear, createdBy: req.userAuth._id,
    });
    // puth academic year to admin
    const admin = await Admin.findById(req.userAuth._id);
    admin.academicYears.push(academicYearCreated._id);
    await admin.save()
    res.status(201).json({
        status: "success",
        message: "Acadmic year created successfully",
        data: academicYearCreated
    })


});

// get all academic year
// post /api/academic-years
// private
const getAcademicYear = AsyncHandler(async (req, res) => {


    res.status(200).json(res.results);
   


});

// get single academic year
// post /api/academic-years/:id
// private

const getSingleAcademicYear = AsyncHandler(async (req, res) => {

    const SingleAcademicYear = await AcademicYear.findById(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Acadmic year fetched successfully",
        data: SingleAcademicYear
    })
});

// update  academic year
// put /api/academic-years/:id
// private

const updateAcademicYear = AsyncHandler(async (req, res) => {
    const { name, fromYear, toYear } = req.body;
    // check name
    const foundedAcademicYear = await AcademicYear.findOne({ name })
    if (foundedAcademicYear) {
        throw new Error("Academic year alredy exist")
    }
    const SingleAcademicYear = await AcademicYear.findByIdAndUpdate(req.params.id, {
        name,
        fromYear,
        toYear,
        createdAt: req.userAuth._id
    }, {
        new: true
    });

    res.status(201).json({
        status: "success",
        message: "Acadmic year updated successfully",
        data: SingleAcademicYear
    })
});

// delete academic year
// delete /api/academic-years/:id
// private

const deleteAcademicYear = AsyncHandler(async (req, res) => {


    await AcademicYear.findByIdAndDelete(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Acadmic year deleted successfully",

    });
});



module.exports = { createAcademicYear, getAcademicYear, getSingleAcademicYear, updateAcademicYear, deleteAcademicYear }
