import {Router} from 'express'
import { body, param } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErros } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
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

    router.post('/login',
        body('email').isEmail().withMessage('Email not valide'),
        body('password').notEmpty().withMessage('The password not cant be empty'),
        handleInputErros,
        AuthController.login
    )
    router.post('/request-code',
        body('email').isEmail().withMessage('Email not valide'),
        handleInputErros,
        AuthController.requestConfirmationCode
    )
    router.post('/forgot-password',
        body('email').isEmail().withMessage('Email not valide'),
        handleInputErros,
        AuthController.forgotPassword
    )

    router.post('/validate-token',
        body('token').notEmpty().withMessage('The Token cant to be empty'),
        handleInputErros,
        AuthController.validateToken
    )
    router.post('/update-password/:token',
        param('token').isNumeric().withMessage('Token not is validate'),
        body('password').isLength({min:8}).withMessage('The password is very short, minimum 8 characters.'),
        body('password_confirmation').custom((value,{req})=>{
            //we validated if password is same
            if(value !== req.body.password){
                throw new Error('The Password are not same')
            }
            //next middleware
            return true
        }),
         handleInputErros,
        AuthController.updatePasswordWithToken
    )

    //route to get the user in session 
    router.get('/user',authenticate,AuthController.user)

    /**Profile */
    router.put('/profile',authenticate,
        body('name').notEmpty().withMessage('The name not most empty'),
        body('email').isEmail().withMessage('The email is no validate'),
        handleInputErros,
        AuthController.updateProfile
    )

    router.post('/update-password',
        authenticate,
        body('current_password').notEmpty().withMessage('The current password cant empty'),
        body('password').isLength({min:8}).withMessage('The password is very short, minimum 8 characters.'),
        body('password_confirmation').custom((value,{req})=>{
            //we validated if password is same
            if(value !== req.body.password){
                throw new Error('The Password are not same')
            }
            //next middleware
            return true
        }),
        handleInputErros,
        AuthController.updateCurrentUserPassword
    )

    router.post('/check-password',
        authenticate,
        body('password').notEmpty().withMessage('The password cant empty'),
        handleInputErros,
        AuthController.checkPassword
    )

export default router