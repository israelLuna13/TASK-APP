import type { Request,Response } from "express";
import Task from "../models/Task";

export class TaskController{
    static createTask = async(req:Request, res:Response)=>{        
        //we put into req the attribute project from middleware 
        //here it is  available the project in the req
        try {
            //instance of task
            const task = new Task(req.body)
            //put the project of req into attribute project of task ,  
            task.project = req.project.id
            //put the id task into attribute of model project 
            req.project.tasks.push(task.id)
            
        //execute all actios to save in database
        // in this case none action depends of other , so execute all
           await Promise.allSettled([
                task.save(),
                req.project.save()
            ])
            res.send('Task created successfull')
        } catch (error) {
            res.status(500).json({error:'There was an error'})    
            
        }
    }

    //get all tasks with project it is to belong, moroever we bring all properties of a project 
    static getProjectTasks =async (req:Request, res:Response)=>{
        try {
            //with populate we do a where and bring all properties of a project
            //we make a join with table project and table tasks y we bring all tasks with all information of a project
            const tasks = await Task.find({
            project:req.project.id}).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({error:'There was an error'})
        }
    }
    //------------------------------------------------the code repetitive  the some methods move to the middleware task------------------------------------------------

    static getTaskById =async (req:Request, res:Response)=>{
        try {
            // const {taskid} = req.params
            // const task = await Task.findById(taskid)
            // //if task not found
            // if(!task){
            //     const error = new Error('Task not found')
            //     return res.status(404).json({error:error.message})
            // }
            //We validate that a URL request id is the same as a task id that is in the database
            // if(req.task.project.toString() !== req.project.id){
            //     const error = new Error('Action not valide')
            //     return res.status(400).json({error:error.message})
            // }
            const task = await Task.findById(req.task.id)
                        .populate({path:'completedBy.user',select:'id name email'})
            res.json(task)
            
        } catch (error) {
            res.send(500).json({error:'There was an error'})
        }
}

static updateTask =async (req:Request, res:Response)=>{
    try {
        const {taskid} = req.params
        const task = await Task.findById(taskid)
        //if task not found
        if(!task){
            const error = new Error('Task not found')
            return res.status(404).json({error:error.message})
        }
        //We validate that a URL request id is the same as a task id that is in the database
        if(req.task.project.toString() !== req.project.id){
            const error = new Error('Action not valide')
            return res.status(400).json({error:error.message})
        }
       
        req.task.name = req.body.name
        req.task.description = req.body.description
        await req.task.save()
        res.json('Task updated succesfult')
        
    } catch (error) {
        res.status(500).json({error:'There was an error'})
    }
}

static deleteTask =async (req:Request, res:Response)=>{
    try {
        // const {taskid} = req.params
        // const task = await Task.findById(taskid)
        // //if task not found
        // if(!task){
        //     const error = new Error('Task not found')
        //     return res.status(404).json({error:error.message})
        // }
        //We validate that a URL request id is the same as a task id that is in the database
        // if(req.task.project.toString() !== req.project.id){
        //     const error = new Error('Action not valide')
        //     return res.status(400).json({error:error.message})
        // }
        

        //we bring the task that not we want delete
        req.project.tasks = req.project.tasks.filter(task => task._id.toString() !== req.task._id.toString())
        await Promise.allSettled([req.task.deleteOne(),req.project.save()])
        res.json('Task delete succesfuly')
        
    } catch (error) {
        res.send(500).json({error:'There was an error'})
    }
}

static updateStatus =async (req:Request, res:Response)=>{
  
    try {
        // const {taskid} = req.params
        // const task = await Task.findById(taskid)

        //    //We validate that a URL request id is the same as a task id that is in the database
        //    if(task.project.toString() !== req.project.id){
        //     const error = new Error('Action not valide')
        //     return res.status(400).json({error:error.message})
        // }
        const {status} = req.body
        req.task.status=status
        //we saved the user and state that change of a task
        const data = {
            user:req.user.id,
            status}
        req.task.completedBy.push(data) //we saved the user and state in the array
        await req.task.save()
        res.send('Task Update')

    } catch (error) {
        res.status(500).json({error:'There was an error'})
    }
}
}
