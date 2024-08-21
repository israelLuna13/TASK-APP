import {z} from 'zod'

/**AUth & Users */
const authSchema = z.object({
    name:z.string(),
    email:z.string(),
    current_password:z.string(),
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
export type updateCurrentUserPassword = Pick<Auth, 'password' | 'password_confirmation' | 'current_password'>
export type CheckPasswordForm = Pick<Auth, 'password'>
/**USERS */
export const userShema=z.object({
    _id:z.string(),
    name:z.string(),
    email:z.string(),
})
export type User = z.infer<typeof userShema>
export type UserProfileForm = Pick<User, 'name' |'email' >

/**NOTES */
const noteSchema=z.object({
    _id:z.string(),
    content:z.string(),
    createdBy:userShema,
    task:z.string(),
    createdAt:z.string()
})
export type Note = z.infer<typeof noteSchema>
export type NoteFormData = Pick<Note, 'content'>

/*TASKS*/
//schema of status
export const taskStatusSchema = z.enum(["pending" , "onHold" , "inProgress" , "underReview" , "completed"])
//type of the status of the tasks
export type TaskStatus = z.infer<typeof taskStatusSchema>
export const taskSchema = z.object({
    _id:z.string(),
    name:z.string(),
    description:z.string(),
    status:taskStatusSchema,
    completedBy:z.array(z.object({
        _id:z.string(),
        user:userShema,
        status:taskStatusSchema
    })),
    notes:z.array(noteSchema.extend({
        createdBy:userShema
    })),
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
    description:z.string(),
    manager:z.string(userShema.pick({_id:true}))
})

//this schema is to all projects
export const dasboardProjectSchema = z.array(
    projectSchema.pick({
        _id:true,
        projectName:true,
        clientName:true,
        description:true,
        manager:true
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