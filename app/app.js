const express = require("express");
const adminRouter = require("../routes/staff/adminRoutes");
const { globalErrorHandler, notFoundErr } = require("../middlewares/globalErrorHandler");
const academicYearRouter = require("../routes/academics/academicYear");
const academicTermRouter = require("../routes/academics/academicTerm");
const classlevelRouter = require("../routes/academics/classLevel");
const programRouter = require("../routes/academics/program");
const subjectRouter = require("../routes/academics/subject");
const yearGroupRouter = require("../routes/academics/yearGroup");
const teacherRouter = require("../routes/staff/teachers");
const examRouter = require("../routes/academics/exam");
const studentRouter = require("../routes/staff/students");
const questionRouter = require("../routes/academics/questions");
const examResultsRouter = require("../routes/academics/examResults");








const app = express();

// middlewares
app.use(express.json());

//routes

//adimns 
app.use('/api/v1/admins', adminRouter);
              // academic years 
        app.use('/api/v1/academic-years', academicYearRouter);
            // academic terms
        app.use('/api/v1/academic-terms', academicTermRouter);
            // class levels
        app.use('/api/v1/class-Levels', classlevelRouter);
           // programs
        app.use('/api/v1/programs', programRouter);
         // subjects
        app.use('/api/v1/subjects', subjectRouter);
         // year groups
        app.use('/api/v1/year-groups',yearGroupRouter);

        
//teachers
app.use('/api/v1/teachers', teacherRouter);
        //create exam
        app.use('/api/v1/exams', examRouter);
        // create questions
        app.use('/api/v1/questions',questionRouter)

//students
app.use('/api/v1/students',studentRouter)
   //checking exams reslts
   app.use('/api/v1/exam-results',examResultsRouter)


// error middleare
app.use(notFoundErr)

app.use(globalErrorHandler);

module.exports = app;
