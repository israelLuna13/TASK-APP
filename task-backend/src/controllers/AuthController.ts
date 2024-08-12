import type { Request,Response } from "express"
import User from "../models/User"
import { hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import {AuthEMail} from '../emails/AUthEmail'
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
        //create token
        const token = new Token()
        token.token = generateToken()
        token.user  = user.id 

        //Send email
        AuthEMail.sendConfirmationEmail({
            email:user.email,
            name:user.name,
            token:token.token
        })

        
        await Promise.allSettled([user.save(),token.save()])

        res.send('Account created, Check you email to confirm')
       } catch (error) {
        res.status(500).json({error:'There was error'})
       }

    }
    static confirmAccount= async (req:Request,res:Response)=>{
        try {
            const {token} = req.body
            const tokenExist = await Token.findOne({token})

            if(!tokenExist){
                const error = new Error('Token not valide')
                return res.status(401).json({error:error.message})
            }

            const user = await User.findById(tokenExist.user)
            user.confirmed = true

            await Promise.allSettled([user.save(),tokenExist.deleteOne()])
            res.send('Account created successfull')

        } catch (error) {
            res.status(500).json({error:'There was error'})
        }

    }
}