import {z} from 'zod'
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