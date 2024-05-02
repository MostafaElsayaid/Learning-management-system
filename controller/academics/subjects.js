const AsyncHandler = require("express-async-handler");
const Program = require("../../model/Academic/Program");
const Subject = require("../../model/Academic/Subject");



// create subject
// post /api/subjects/:programID
// private

const createsubject = AsyncHandler(async (req, res) => {

    const { name, description, academicTerm } = req.body;
    //find the program
    const foundedPrgram = await Program.findById(req.params.programID);
    if (!foundedPrgram) {
        throw new Error('Program not found')
    }
    // check exist
    const subject = await Subject.findOne({ name })
    if (subject) {
        throw new Error('Subject already exist')
    }
    // create
    const subjectCreated = await Subject.create({
        name, description, academicTerm, createdBy: req.userAuth._id,
    });
    // push to the program
    foundedPrgram.subjects.push(subjectCreated._id);
    await foundedPrgram.save()
    //save

    res.status(201).json({
        status: "success",
        message: "Subject created successfully",
        data: subjectCreated
    })


});

// get all subjects
// post /api/subjects
// private
const getSujects = AsyncHandler(async (req, res) => {

    res.status(200).json(res.results);



});

// get single  subject
// post /api/subjects/:id
// private

const getSingleSubject = AsyncHandler(async (req, res) => {

    const SingleSubject = await Subject.findById(req.params.id);

    res.status(201).json({
        status: "success",
        message: "Supject fetched successfully",
        data: SingleSubject
    })
});

// update  subject
// put /api/subjects/:id
// private

const updatesubject = AsyncHandler(async (req, res) => {
    const { name, description, academicTerm } = req.body;
    // check name
    const foundedSubject = await Subject.findOne({ name })
    if (foundedSubject) {
        throw new Error("subject alredy exist")
    }
    const SingleSubject = await Subject.findByIdAndUpdate(req.params.id, {
        name,
        description,
        academicTerm,
        createdAt: req.userAuth._id
    }, {
        new: true
    });

    res.status(201).json({
        status: "success",
        message: "supject updated successfully",
        data: SingleSubject
    })
});

// delete program
// delete /programs/:id
// private

const deleteSubject = AsyncHandler(async (req, res) => {


    await Subject.findByIdAndDelete(req.params.id);

    res.status(201).json({
        status: "success",
        message: "subject deleted successfully",

    });
});



module.exports = { createsubject, getSujects, getSingleSubject, updatesubject, deleteSubject }
