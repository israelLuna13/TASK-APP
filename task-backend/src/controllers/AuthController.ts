import type { Request,Response } from "express"
import bcrypt from 'bcrypt'
import User from "../models/User"
import { hashPassword } from "../utils/auth"
export class AuthController {
    static createAccount= async (req:Request,res:Response)=>{
       try {
        const {password,email}=req.body

        //not same email
        const userExist = await User.findOne({email})
        if(userExist){
            const error = new Error('The user is registered')
            return res.status(409).json({error:error.message})
        }

        //create user
        const user = new User(req.body)
        //hash password
        user.password =await  hashPassword(password)
        await user.save()
        res.send('Account created, Check you email to confirm')
       } catch (error) {
        res.status(500).json({error:'There was error'})
       }

    }
}