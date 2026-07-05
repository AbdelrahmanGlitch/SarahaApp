export const validation = (schema)=>{
    return (req,res,next)=>{
        const validationResults = [];
        for(const key of Object.keys(schema)){
            const validationError = schema[key].validate(req[key], {abortEarly: false})
            if(validationError.error) {
                validationResults.push(...validationError.error.details);
            }
        }
        if(validationResults.length > 0) {
            const error = new Error("Validation Error")
            error.errors = validationResults
            error.cause = 400
            return next(error)
        }
        next()
    }
}