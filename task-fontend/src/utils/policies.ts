import { Project, TeamMember } from "../types";

//we validate if the user cretaed the project
export const isManager = (managerId: Project['manager'],userId:TeamMember['_id'])=>{
    return managerId === userId
}