import mongoose,{Schema, Document,PopulatedDoc, Types} from 'mongoose'
import { ITask } from './Task'
//type of model project
//document ensuring that each object of this type weill have the properties and methods of a mongoose
export interface IProject extends Document  {
 projectName:string,
 clientName:string,
 description:string,
 tasks:PopulatedDoc<ITask & Document>[]   
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
        }
    ]
},{timestamps:true})

//Make the model with typescript type of IProject and structure of ProjectSchema
 const Project = mongoose.model<IProject>('Project',ProjectSchema)
 export default Project