import mongoose,{Schema, Document,PopulatedDoc, Types} from 'mongoose'
import Task, { ITask } from './Task'
import { IUser } from './User'
import Note from './Note'
//type of model project
//document ensuring that each object of this type weill have the properties and methods of a mongoose
export interface IProject extends Document  {
 projectName:string,
 clientName:string,
 description:string,
 tasks:PopulatedDoc<ITask & Document>[],
 manager:PopulatedDoc<IUser & Document>,
 team:PopulatedDoc<IUser & Document>[]  
}
//schema of project in the mongoode db collection
const ProjectSchema:Schema = new Schema({
    projectName:{
        type:String,
        require:true,
        trim:true
    },
    clientName:{
        type:String,
        require:true,
        trim:true
    },
    description:{
        type:String,
        require:true,
        trim:true
    },
    tasks:[
        {
            type:Types.ObjectId,
            ref:'Task'
        },
 
    ],
    manager:{
        type:Types.ObjectId,
        ref:'User'
    },
    team:[
        {
            type:Types.ObjectId,
            ref:'User'
        },
    ]

},{timestamps:true})

  //middleware
     //we deleted the notes that belong to task  and deleted task that belong project when we deleted a project
  ProjectSchema.pre('deleteOne',{document:true}, async function(){
    const projectId = this._id
    if(!projectId) return 
    const tasks = await Task.find({project:projectId})
    for(const task of tasks){
        await Note.deleteMany({task:task.id})
    }
    await Task.deleteMany({project:projectId})    
   })


//Make the model with typescript type of IProject and structure of ProjectSchema
 const Project = mongoose.model<IProject>('Project',ProjectSchema)
 export default Project