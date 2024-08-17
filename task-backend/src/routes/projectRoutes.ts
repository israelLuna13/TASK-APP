import {Router} from 'express'
import { ProjectController } from '../controllers/ProjectController'
import {body,param} from 'express-validator'
import { handleInputErros } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import {  projectExists} from '../middleware/project'
import { taskExists, tasksBelongsToProject } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'
const router = Router()
    //-------------------------------------------------------------------routes project------------------------------------------------------------------- 

//create project
//router.use(authenticate) //to not put authenticate in each route
router.post('/',authenticate,
    body('projectName').notEmpty().withMessage('The name of projects is obligation'),
    body('clientName').notEmpty().withMessage('The name of client is obligation'),
    body('description').notEmpty().withMessage('The description of projects is obligation'),
    handleInputErros,
    ProjectController.createProject)
    //get all project
    router.get('/',authenticate,ProjectController.getAllProjects)

    //get project by id
    router.get('/:id',authenticate,param('id').isMongoId().withMessage('Not valid id'),handleInputErros,ProjectController.getProjectById)
    //update project
    router.put('/:id',authenticate,
    param('id').isMongoId().withMessage('Not valid id'),
    body('projectName').notEmpty().withMessage('The name of projects is obligation'),
    body('clientName').notEmpty().withMessage('The name of client is obligation'),
    body('description').notEmpty().withMessage('The description of projects is obligation')
    ,handleInputErros,ProjectController.updateProject)

    //delete project
    router.delete('/:id',authenticate,param('id').isMongoId().withMessage('Not valid id'),handleInputErros,ProjectController.deleteProject)

    //-------------------------------------------------------------------routes task------------------------------------------------------------------- 
   
    //all routes that it have projectId it execute the middleware projectExists,not to put into the controller
    router.param('projectId',projectExists)

    router.post('/:projectId/task',
        body('name').notEmpty().withMessage('The name of task is obligation'),
        body('description').notEmpty().withMessage('The description of task is obligation'),
        handleInputErros,        
        TaskController.createTask
    )
      router.get('/:projectId/task',
        TaskController.getProjectTasks
      )

      //all routes that it have taskid it execute the middleware taskExists and tasksBelongsToProject ,not to put into the controller
      router.param('taskid',taskExists)
      router.param('taskid',tasksBelongsToProject)

      router.get('/:projectId/task/:taskid',
        param('taskid').isMongoId().withMessage('Not valid id'),
        handleInputErros,
        TaskController.getTaskById
      )
      router.put('/:projectId/task/:taskid',
        param('taskid').isMongoId().withMessage('Not valid id'),
        body('name').notEmpty().withMessage('The name of task is obligation'),
        body('description').notEmpty().withMessage('The description of task is obligation'),
        handleInputErros,
        TaskController.updateTask)

      router.delete('/:projectId/task/:taskid',
          param('taskid').isMongoId().withMessage('Not valid id'),
          handleInputErros,
          TaskController.deleteTask)

      router.post('/:projectId/task/:taskid/status',
            body('status').notEmpty().withMessage('The state is obligate'),
            handleInputErros,
            TaskController.updateStatus)

//routes for teams
        router.post('/:projectId/team/find',authenticate,
          body('email').isEmail().toLowerCase().withMessage('E-mail not validate'),
          handleInputErros,
          TeamMemberController.findMemberByEmail
        )

        router.get('/:projectId/team',authenticate,
          TeamMemberController.getProjectTeam
        )

        router.post('/:projectId/team',authenticate,
          body('id').isMongoId().withMessage('Not valid id'),
          handleInputErros,
          TeamMemberController.addMemberById
        )

        router.delete('/:projectId/team',authenticate,
          body('id').isMongoId().withMessage('Not valid id'),
          handleInputErros,
          TeamMemberController.removeMemberById
        )



export default router