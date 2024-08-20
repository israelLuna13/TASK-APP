import type { Request,Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import {AuthEMail} from '../emails/AUthEmail'
import { generateJWT } from "../utils/jwt"
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
                return res.status(404).json({error:error.message})
            }

            const user = await User.findById(tokenExist.user)
            user.confirmed = true

            await Promise.allSettled([user.save(),tokenExist.deleteOne()])
            res.send('Account confirmed successfull')

        } catch (error) {
            res.status(500).json({error:'There was error'})
        }

    }

    static login= async (req:Request,res:Response)=>{
        try {
            
            const {email,password} = req.body
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('User not exist')
                return res.status(404).json({error:error.message})
            }

            if(!user.confirmed){
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()
                            //Send email
                    AuthEMail.sendConfirmationEmail({
                        email:user.email,
                        name:user.name,
                        token:token.token
                    })

                const error = new Error('The account not it was confirmed, We have send email the confirm')
                return res.status(401).json({error:error.message})
            }

            //check password
            const isPasswordCorrect = await checkPassword(password,user.password)
            console.log(isPasswordCorrect);
            
            if(!isPasswordCorrect){
                const error = new Error('Password Incorrect')
                return res.status(401).json({error:error.message})
            }
            const token = generateJWT({id:user.id})
            res.send(token)
        } catch (error) {
            res.status(500).json({error:'There was error'})
        }
    }

    //send the token at the user to confirm her account
    static requestConfirmationCode= async (req:Request,res:Response)=>{
        try {
         const {email}=req.body
 
         //User exist
         const user = await User.findOne({email})
         if(!user){
             const error = new Error('The user is not register')
             return res.status(404).json({error:error.message})
         }

         if(user.confirmed){
            const error = new Error('The user is already confirmed')
            return res.status(403).json({error:error.message})
         }
 
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
         res.send('Email send with new token your email')
        } catch (error) {
         res.status(500).json({error:'There was error'})
        }
 
     }
     
    static forgotPassword= async (req:Request,res:Response)=>{
        try {
         const {email}=req.body
 
         //User exist
         const user = await User.findOne({email})
         if(!user){
             const error = new Error('The user is not register')
             return res.status(404).json({error:error.message})
         }
 
         //create token
         const token = new Token()
         token.token = generateToken()
         token.user  = user.id 
         await token.save()
 
         //Send email
         AuthEMail.sendPasswordResetToken({
             email:user.email,
             name:user.name,
             token:token.token
         })
         res.send('Check your email from instructions')
        } catch (error) {
         res.status(500).json({error:'There was error'})
        }
 
     }

     static validateToken= async (req:Request,res:Response)=>{
        try {
            const {token} = req.body
            const tokenExist = await Token.findOne({token})

            if(!tokenExist){
                const error = new Error('Token not valide')
                return res.status(404).json({error:error.message})
            }

            res.send('Token validate, Enter new password')

        } catch (error) {
            res.status(500).json({error:'There was error'})
        }

    }


    //we change the password with token
    static updatePasswordWithToken= async (req:Request,res:Response)=>{
        try {
            const {token} = req.params
            const {password} = req.body
            const tokenExist = await Token.findOne({token})

            if(!tokenExist){
                const error = new Error('Token not valide')
                return res.status(404).json({error:error.message})
            }

            const user = await User.findById(tokenExist.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])

            res.send('The password modificated successfull')

        } catch (error) {
            res.status(500).json({error:'There was error'})
        }

    }

    //we get the user in the session
    static user= async (req:Request,res:Response)=>{
      return res.json(req.user)
    }

    static updateProfile= async (req:Request,res:Response)=>{
        const {name,email} = req.body
        const userExist = await User.findOne({email})

        //if the email is same and the user with email repet not is the user in session
        if(userExist && userExist.id.toString() !== req.user.id.toString()){
            const error = new Error('That email is already registered')
          return  res.status(409).json({error:error.message})
        }
        req.user.name = name
        req.user.email = email
        try {
            await req.user.save()
            res.send('Profile update successfull')
            
        } catch (error) {
            res.status(500).json({error:'There was error'})
        }
    }

    static updateCurrentUserPassword= async (req:Request,res:Response)=>{
        const {current_password,password} = req.body

        const user = await User.findById(req.user.id)
        const isPasswordCorrect = await checkPassword(current_password,user.password)
        if(!isPasswordCorrect){
            const error = new Error('Password is incorrect')
          return  res.status(401).json({error:error.message})
        }
        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('Password changed successfully')
        } catch (error) {
            res.status(500).json({error:'There was error'})
        }
    }
   
}