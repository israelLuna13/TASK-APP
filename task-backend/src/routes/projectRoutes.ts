import {Router} from 'express'
import { ProjectController } from '../controllers/ProjectController'
import {body} from 'express-validator'
import { handleInputErros } from '../middleware/validation'
const router = Router()
router.get('/',ProjectController.getAllProjects)
router.post('/',
    body('projectName').notEmpty().withMessage('The name of projects is obligation'),
    body('clientName').notEmpty().withMessage('The name of client is obligation'),
    body('description').notEmpty().withMessage('The description of projects is obligation'),
    handleInputErros,
    ProjectController.createProject)
    
export default router