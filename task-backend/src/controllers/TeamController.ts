import type {Request,Response} from 'express'
import User from '../models/User'
import Project from '../models/Proyect'
export class TeamMemberController{

    static findMemberByEmail =async(req:Request,res:Response,)=>{
        const {email} = req.body

        //user with id, email, name
        const user = await User.findOne({email}).select('id email name')
        if(!user){
            const error = new Error('User not found')
            return res.status(404).json({error:error.message})
        }
        res.json({user})
    }

    static getProjectTeam =async(req:Request,res:Response,)=>{
        const project = await (await Project.findById(req.project.id)).populate({
            path:'team',
            select:'id email name'
        })
        res.json(project.team)
    }

    //we add the users a team of project
    static addMemberById =async(req:Request,res:Response,)=>{
        const {id} = req.body        
        const user = await User.findById(id).select('id')

        if(!user){
            const error = new Error('User not found')
            return res.status(404).json({error:error.message})
        }

        //If the logged in user is on the project team
        if(req.project.team.some(team=>team.toString() === user.id.toString())){
            const error = new Error('User exist in this project')
            return res.status(404).json({error:error.message})
        }
        //we put the user in the team
        req.project.team.push(user.id)
        await req.project.save()
        res.send('User add successfull')
    }

    static removeMemberById =async(req:Request,res:Response,)=>{
        const {id} = req.body   
        //if the user is not on the project
        if(!req.project.team.some(team=>team.toString() === id)){
            const error = new Error('User not found in the project')
            return res.status(404).json({error:error.message})
        }
        
        //We bring what we do not want to erase
        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== id)
        await req.project.save()
        res.send('User deleted successfull')
    }
}