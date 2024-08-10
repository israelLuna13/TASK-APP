import mongoose,{Schema, Document,Types} from 'mongoose'
//diccionario value of state the task
const taskStatus={
    PENDING: 'pendig',
    ON_HOLD:'onHold',
    IN_PROGRESS:'inProgress',
    UNDER_REVIEW:'underReview',
    COMPLETED:'completed'
} as const //only will read 

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]
//type of model project
//document ensuring that each object of this type weill have the properties and methods of a mongoose
export interface ITask extends Document  {
    name:string,
    description:string,
    project:Types.ObjectId,
    status:TaskStatus
   }

   
   export const TaskSchema : Schema = new Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    description:{
        type:String,
        trim:true,
        required:true
    },
    project:{
        type:Types.ObjectId,
        ref:'Project'
    },
    status:{
        type:String,
        enum:Object.values(taskStatus),
        default:taskStatus.PENDING
    }

   },{timestamps:true})

//Make the model with typescript type of ITask and structure of TaskSchema
   const Task = mongoose.model<ITask>('Task',TaskSchema)
   export default Task