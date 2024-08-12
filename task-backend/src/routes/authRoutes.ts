import {Router} from 'express'
import { body } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErros } from '../middleware/validation'
const router = Router()
router.post('/create-account',
    body('name').notEmpty().withMessage('The name not most empty'),
    body('password').isLength({min:8}).withMessage('The password is very short, minimum 8 characters.'),
    body('password_confirmation').custom((value,{req})=>{
        //we validated if password is same
        if(value !== req.body.password){
            throw new Error('The Password are not same')
        }
        //next middleware
        return true
    }),
    body('email').isEmail().withMessage('Email not valide'),
    handleInputErros,
    AuthController.createAccount)
    
    router.post('/confirm-account',
        body('token').notEmpty().withMessage('The Token cant to be empty'),
        handleInputErros,
        AuthController.confirmAccount
    )
export default router