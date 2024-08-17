import {TypeOf, z} from 'zod'

/**AUth & Users */
const authSchema = z.object({
    name:z.string(),
    email:z.string(),
    password:z.string(),
    password_confirmation:z.string(),
    token:z.string()
})
type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'name' |'email' | 'password' | 'password_confirmation'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ConfirmToken = Pick<Auth, 'token'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>


/**USERS */
export const userShema=z.object({
    _id:z.string(),
    name:z.string(),
    email:z.string(),
})
export type User = z.infer<typeof userShema>

/*TASKS*/
//schema of status
export const taskStatusSchema = z.enum(["pendig" , "onHold" , "inProgress" , "underReview" , "completed"])
//type of the status of the tasks
export type TaskStatus = z.infer<typeof taskStatusSchema>
export const taskSchema = z.object({
    _id:z.string(),
    name:z.string(),
    description:z.string(),
    status:taskStatusSchema,
    createdAt:z.string(),
    updatedAt:z.string()
})
//
export type Task = z.infer<typeof taskSchema>
//type when we will create a task
export type TaskFormData = Pick<Task, 'name' | 'description'>

/**
 * Projects
 */
//schema of our response of the API
//this schema is to one project
export const projectSchema = z.object({
    _id:z.string(),
    projectName:z.string(),
    clientName:z.string(),
    description:z.string()
})

//this schema is to all projects
export const dasboardProjectSchema = z.array(
    projectSchema.pick({
        _id:true,
        projectName:true,
        clientName:true,
        description:true
    })
)
//type of one project
export type Project = z.infer<typeof projectSchema>
//type of one project but without id, becouse when we use this type , we will create a project and not will have a id 
export type ProjectFormData = Pick<Project,'clientName'| 'projectName' |'description'>

//team
const teamMemberShema = userShema.pick({
    name:true,
    email:true,
    _id:true
})
export const teamMembersShema = z.array(teamMemberShema)
//export type teamMembersShema = z.infer< typeof teamMemberShema >
export type TeamMember = z.infer<typeof teamMemberShema>
export type TeamMemberForm = Pick<TeamMember,'email'>