const AsyncHandler = require("express-async-handler");
const YearGroup = require("../../model/Academic/YearGroup");
const Admin = require("../../model/Staff/Admin");



// create yearGroup
// post /api/v1/year-group
// private

const createYearGroups = AsyncHandler(async (req, res) => {

    const { name, academicYear } = req.body;
    // check exist
    const yearGroup = await YearGroup.findOne({ name })
    if (yearGroup) {
        throw new Error('year group already exist')
    }
    // create
    const yearGroupCreated = await YearGroup.create({
        name, academicYear, createdBy: req.userAuth._id,
    });
    // find the admin
    const admin = await Admin.findById(req.userAuth._id)
    if(!admin){
        throw new Error("admin doesn't exist")
    }
    // push to the year group into admin
    admin.yearGroups.push(yearGroupCreated._id);
     //save
    await admin.save()
   

    res.status(201).json({
        status: "success",
        message: "year group created successfully",
        data: yearGroupCreated
    })


});

// get all year groups
// post /api/year-groups
// private
const getYearGroups = AsyncHandler(async (req, res) => {

    res.status(200).json(res.results);



});

// get single  year group
// post /api/year-groups/:id
// private

const getSingleYearGroups = AsyncHandler(async (req, res) => {

    const SingleYearGroup = await YearGroup.findById(req.params.id);

    res.status(201).json({
        status: "success",
        message: "year group fetched successfully",
        data: SingleYearGroup
    })
});

// update year group
// put /api/year-groups/:id
// private

const updateYearGroups = AsyncHandler(async (req, res) => {
    const { name,academicYear} = req.body;
    // check name
    const foundedYearGroup = await YearGroup.findOne({ name })
    if (foundedYearGroup) {
        throw new Error("YearGroup alredy exist")
    }
    const SingleYearGroup = await YearGroup.findByIdAndUpdate(req.params.id, {
        name,
        academicYear,
        createdAt: req.userAuth._id
    }, {
        new: true
    });

    res.status(201).json({
        status: "success",
        message: "Year Group updated successfully",
        data: SingleYearGroup
    })
});

// delete year group
// delete /year-groups/:id
// private

const deleteYearGroups = AsyncHandler(async (req, res) => {


    await YearGroup.findByIdAndDelete(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Year Group deleted successfully",

    });
});



module.exports = { createYearGroups, getYearGroups, getSingleYearGroups, updateYearGroups, deleteYearGroups }
