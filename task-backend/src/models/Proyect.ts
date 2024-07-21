import mongoose,{Schema, Document} from 'mongoose'
//type of model project
//document ensuring that each object of this type weill have the properties and methods of a mongoose
export type ProjectType = Document & {
 projectName:string,
 clientName:string,
 description:string   
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
})

//Make the model with typescript type of ProjectType and structure of ProjectSchema
 const Project = mongoose.model<ProjectType>('Project',ProjectSchema)
 export default Project