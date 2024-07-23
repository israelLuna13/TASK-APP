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
            res.send('Tarea creada correctamente')
        } catch (error) {
            console.log(error
            
            );
            
        }
    }
}
