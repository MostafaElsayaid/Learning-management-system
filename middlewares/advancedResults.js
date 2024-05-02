// model,populate

const advancedResults = (model,populate)=>{
    return async (req, res, next)=>{
        let modelQuery = model.find()
        //convert query strings
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 3;
        const skip = (page - 1) * limit;
        const total = await model.countDocuments();
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        //populate
        if(populate){
            modelQuery = modelQuery.populate(populate)
        }
        //filtring / searching
        if(req.query.name){
            modelQuery = modelQuery.find({
                name: { $regex: req.query.name, $options: "i" },
            });
        }
       
        // pagination results
        const pagination = {};
        //add next
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }
        // add prev
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }
        //find subject
        const subject = await modelQuery.find()
            .skip(skip)
            .limit(limit)
    //results
    res.results = { total,
        pagination,
        results: subject.length,
        status: "success",
        message: `fetching all successfuly`,
        data: subject
    };
     
    next()
    };
};

module.exports = advancedResults;