export const validation = (schema)=>{
    return (req,res,next)=>{
        let validationResults = [];
        for(const key of Object.keys(schema)){
            const validationError = schema[key].validate(req[key], {abortEarly: false})
            if(validationError.error) {
            validationResults.push(validationError.error.details);
            }
        }
        console.log("validationResults", validationResults);
        if(validationResults.length > 0) {
            return next(new Error({msg: "Validation Error", errors: validationResults}))
        }
        next()
    }
}