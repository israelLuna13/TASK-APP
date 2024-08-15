import type { Request,Response } from "express"
import Project from "../models/Proyect"
export class ProjectController{

    static createProject = async(req:Request, res:Response)=>{

        const project = new Project(req.body)
        //put the manager in the project
        project.manager = req.user.id
        
        try {
            await project.save()
            res.send('Project created successfully')
        } catch (error) {
            console.log(error);
        }        
    }

    static getAllProjects = async(req:Request, res:Response)=>{
        try {
            const projects = await Project.find({
                //condition, only we bring the project of the person who is in session
                $or:[
                    {
                        manager:{$in:req.user.id}
                    }
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(error);
        }
    }

    //get  project with all information of a task that it have these project
    static getProjectById = async(req:Request, res:Response)=>{
        const {id} = req.params
        try {
            //popula is like where in a sql query
            const project = await Project.findById(id).populate('tasks').populate('tasks')
            if(!project){
                const error = new Error('Project not found')
                return res.status(404).json({error:error.message})
            }
                   //We validate that the person who is in session is the owner of the project
            if(project.manager.toString() != req.user.id.toString()){
                const error = new Error('Action not validate')
                return res.status(404).json({error:error.message})
            }
            res.json(project)
        } catch (error) {
            console.log(error);
        }
    }

    static updateProject = async(req:Request, res:Response)=>{
        const {id} = req.params
        const project = await Project.findById(id)
        if(!project){
            const error = new Error('Project not found')
            return res.status(404).json({error:error.message})
        }
               //We validate that the person who is in session is the owner of the project
        if(project.manager.toString() != req.user.id.toString()){
            const error = new Error('Only manager can update the project')
            return res.status(404).json({error:error.message})
        }
        project.clientName = req.body.clientName
        project.projectName = req.body.projectName
        project.description = req.body.description
        await project.save()
        res.send('Updated project')
        
        try {
           
        } catch (error) {
            console.log(error);
        }
    }

    static deleteProject = async(req:Request, res:Response)=>{
        const {id} = req.params
        try {
            const project = await Project.findById(id)
            if(!project){
                const error = new Error('Project not found')
                return res.status(404).json({error:error.message})
            }
            //We validate that the person who is in session is the owner of the project
            if(project.manager.toString() != req.user.id.toString()){
                const error = new Error('Only manager can delete the project')
                return res.status(404).json({error:error.message})
            }
           await project.deleteOne()
            console.log(project);
            res.send('Project deleted')
        } catch (error) {
            console.log(error);
        }
    }

}
