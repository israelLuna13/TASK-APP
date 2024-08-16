import { Request,Response,NextFunction } from "express"
import jwt from 'jsonwebtoken'
import User, { IUser } from "../models/User"

//we put the atribute user in the req to get acces from other files
declare global{
    namespace Express {
        interface Request{
            user?:IUser
        }
    }
}

export const authenticate = async(req:Request,res:Response,next:NextFunction)=>{
   
    //we get the bearer with the token from the headers
    const bearer = req.headers.authorization
   
    //we validate if there is token
    if(!bearer){
        const error = new Error('Not authorized')
        return res.status(401).json({error:error.message})
    }
    //we get the token and we take the parte with the token
    const token = bearer.split(' ')[1]

    try {
        //we decoded the token and we validate if decoded is objet and it have de property id
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(typeof decoded === 'object' && decoded.id){
            //we get the information the user only id , name and email
            const user = await User.findById(decoded.id).select('_id name email')

            // we put the user en el req
            if(user){
                req.user = user
                next()
            }else{
                res.status(500).json({error:'Invalidate token'})
            }
        }
        
    } catch (error) {
        res.status(500).json({error:'Invalidate token'})
    }
}