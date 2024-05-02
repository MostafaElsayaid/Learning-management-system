const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const Program = require("../../model/Academic/Program");


// create program
// post /api/programs
// private

const createProgram = AsyncHandler(async (req, res) => {

    const { name, description,duration} = req.body;
    // check exist
    const program = await Program.findOne({ name })
    if (program) {
        throw new Error('Program already exist')
    }
    // create
    const programCreated = await Program.create({
        name, description,duration, createdBy: req.userAuth._id,
    });
    // push class level to admin
    const admin = await Admin.findById(req.userAuth._id);
    admin.programs.push(programCreated._id);
    await admin.save()
    res.status(201).json({
        status: "success",
        message: "Program created successfully",
        data: programCreated
    })


});

// get all create programs
// post /api/programs
// private
const getPrograms = AsyncHandler(async (req, res) => {


    res.status(200).json(res.results);



});

// get single  program
// post /api/programs/:id
// private

const getSingleProgram = AsyncHandler(async (req, res) => {

    const SingleProgram = await Program.findById(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Program fetched successfully",
        data: SingleProgram
    })
});

// update  program
// put /api/programs/:id
// private

const updateprogram = AsyncHandler(async (req, res) => {
    const { name, description ,duration } = req.body;
    // check name
    const foundedProgram = await Program.findOne({ name })
    if (foundedProgram) {
        throw new Error("Program alredy exist")
    }
    const SingleProgram = await Program.findByIdAndUpdate(req.params.id, {
        name,
        description,
        duration,
        createdAt: req.userAuth._id
    }, {
        new: true
    });

    res.status(201).json({
        status: "success",
        message: "Program updated successfully",
        data: SingleProgram
    })
});

// delete program
// delete /programs/:id
// private

const deleteProgram = AsyncHandler(async (req, res) => {
    
    
     await Program.findByIdAndDelete(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Program deleted successfully",
        
    });
});



module.exports = { createProgram, getPrograms, getSingleProgram, updateprogram,deleteProgram }
