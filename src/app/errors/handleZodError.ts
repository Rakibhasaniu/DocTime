import { ZodError, ZodIssue } from "zod";


const handleZodError =(err:ZodError) => {
    
    let errorDetails= {
        zodError:err.issues.map((issue:ZodIssue) => {
            return {
                            field:issue?.path[issue.path.length - 1],
                            message:issue?.message
                }
        })
    }
    // console.log(errorDetails)
    // console.log(err)
   const  statusCode= 400; 
   return {
    statusCode,
    message:err.message,
    errorDetails
   }
}
export default handleZodError;