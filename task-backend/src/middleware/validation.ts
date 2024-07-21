import { Request,Response,NextFunction } from "express";
import { validationResult } from "express-validator";
//validate the data of body
export const handleInputErros = (req:Request,res:Response, next:NextFunction)=>{
    let erros = validationResult(req)
    if(!erros.isEmpty()){
        return res.status(400).json({erros})
    }
    next()
}