import type{Request,Response,NextFunction} from 'express'
import Task, { ITask } from "../models/Task";

//rewrite request, we put the atribute task in request to used in controller
declare global {
    namespace Express{
        interface Request{
            task:ITask
        }
    }
}
//we validate if the task exist
export async function taskExists(req:Request,res:Response,next:NextFunction){
    try {
        const {taskid} = req.params
        const task = await Task.findById(taskid)
        if(!task){
            const error = new Error('Task not found')
            return res.status(404).json({error:error.message})
        }
        //put task in the req
        req.task = task
        next() //next middleware
    } catch (error) {
        console.log(error);
    }
}
//we validate if a task to belong of a project
export async function tasksBelongsToProject(req:Request,res:Response,next:NextFunction){
    if(req.task.project.toString() !== req.project.id.toString() ){
        const error = new Error('Action not valide')
        return res.status(400).json({error:error.message})
    }

    next()//next middleware

}

//we validated if the user in session is a manage to do changes in the task
export async function hasAuthorization(req:Request,res:Response,next:NextFunction){
    
    if(req.user.id.toString() !== req.project.manager.toString()){
        const error = new Error('Action not valide')
        return res.status(400).json({error:error.message})
    }

    next()//next middleware

}