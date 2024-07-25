import type{Request,Response,NextFunction} from 'express'
import Project, { IProject } from "../models/Proyect";

//rewrite request, we put the atribute project in request
declare global {
    namespace Express{
        interface Request{
            project:IProject
        }
    }
}
//we validate if the project exist
export async function projectExists(req:Request,res:Response,next:NextFunction){
    try {
        const {projectId} = req.params
        const project = await Project.findById(projectId)
        if(!project){
            const error = new Error('Project not found')
            return res.status(404).json({error:error.message})
        }
        //put project in the req
        req.project = project
        next() //next middleware
    } catch (error) {
        console.log(error);
    }
}