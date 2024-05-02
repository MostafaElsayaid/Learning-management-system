const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const ClassLevel = require("../../model/Academic/ClassLevel");

// create class level
// post /api/class-Levels
// private

const createClassLevel = AsyncHandler(async (req, res) => {

    const { name, description} = req.body;
    // check exist
    const classLevel = await ClassLevel.findOne({ name })
    if (classLevel) {
        throw new Error('Class level already exist')
    }
    // create
    const classLevelCreated = await ClassLevel.create({
        name, description, createdBy: req.userAuth._id,
    });
    // push class level to admin
    const admin = await Admin.findById(req.userAuth._id);
    admin.classLevels.push(classLevelCreated._id);
    await admin.save()
    res.status(201).json({
        status: "success",
        message: "Class level created successfully",
        data: classLevelCreated
    })


});

// get all class level
// post /api/class-Levels
// private
const getClassLevel = AsyncHandler(async (req, res) => {

    res.status(200).json(res.results);


});

// get single class lecvel
// post /api/class-Levels/:id
// private

const getSingleClassLevel = AsyncHandler(async (req, res) => {

    const SingleClassLevel = await ClassLevel.findById(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Class level fetched successfully",
        data: SingleClassLevel
    })
});

// update  class level
// put /api/class-Levels/:id
// private

const updateClassLevel = AsyncHandler(async (req, res) => {
    const { name, description} = req.body;
    // check name
    const foundedClassLevel = await ClassLevel.findOne({ name })
    if (foundedClassLevel) {
        throw new Error("Class level alredy exist")
    }
    const SingleClassLevel = await ClassLevel.findByIdAndUpdate(req.params.id, {
        name,
        description,
        
        createdAt: req.userAuth._id
    }, {
        new: true
    });

    res.status(201).json({
        status: "success",
        message: "Class level updated successfully",
        data: SingleClassLevel
    })
});

// delete class level
// delete /class-Levels/:id
// private

const deleteClassLevel = AsyncHandler(async (req, res) => {
    
    
     await ClassLevel.findByIdAndDelete(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Class level deleted successfully",
        
    });
});



module.exports = { createClassLevel, getClassLevel, getSingleClassLevel, updateClassLevel,deleteClassLevel }
