import {Router} from 'express'
import { ProjectController } from '../controllers/ProjectController'
import {body,param} from 'express-validator'
import { handleInputErros } from '../middleware/validation'
const router = Router()
//routes 
//create project
router.post('/',
    body('projectName').notEmpty().withMessage('The name of projects is obligation'),
    body('clientName').notEmpty().withMessage('The name of client is obligation'),
    body('description').notEmpty().withMessage('The description of projects is obligation'),
    handleInputErros,
    ProjectController.createProject)
    //get all project
    router.get('/',ProjectController.getAllProjects)

    //get project by id
    router.get('/:id',param('id').isMongoId().withMessage('Not valid id'),handleInputErros,ProjectController.getProjectById)
    //update project
    router.put('/:id',param('id').isMongoId().withMessage('Not valid id'),
    body('projectName').notEmpty().withMessage('The name of projects is obligation'),
    body('clientName').notEmpty().withMessage('The name of client is obligation'),
    body('description').notEmpty().withMessage('The description of projects is obligation')
    ,handleInputErros,ProjectController.updateProject)

    //delete project
    router.delete('/:id',param('id').isMongoId().withMessage('Not valid id'),handleInputErros,ProjectController.deleteProject)

    
export default router