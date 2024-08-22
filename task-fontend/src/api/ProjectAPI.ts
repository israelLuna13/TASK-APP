import api from '@/lib/axios';
import {dasboardProjectSchema, editProjectSchema, ProjectFormData, projectSchema} from '@/types/index'
import { isAxiosError } from 'axios';
import { Project } from '@/types/index';

//--------------------------------in each request of axios will be the header with the token to give authorization-------------------------------------
// to make changes in the projects , we need authorization 

export async function createProject(formData:ProjectFormData){
    try {        
        const {data} = await api.post('/projects',formData)
        return data
    } catch (error) {
        //we validate if is a error of axios and the error it have a response
        if(isAxiosError(error) && error.response){
            //we make a new error to handle in other parts of our application
            throw new Error(error.response.data.error)
        }
    }
}

//we get all project and we validate projects with the schema
export async function getProject(){
    
    try {  
        const {data} = await api.get('/projects')   
         
        //other way the send header from the backend  
        // const {data} = await api.get('/projects',{
        //     headers:{
        //         Authorization:`Bearer ${token}`
        //     }
        // })
        const response = dasboardProjectSchema.safeParse(data)
        if(response.success){
            return response.data
        }        
    } catch (error) {
        //we validate if is a error of axios and the error it have a response
        if(isAxiosError(error) && error.response){
            //we make a new error to handle in other parts of our application
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjectById(id:Project['_id']){
    try {        
        const {data} = await api.get(`/projects/${id}`)
        const response = editProjectSchema.safeParse(data)
        if(response.success){
            return response.data    
        }
    } catch (error) {
        //we validate if is a error of axios and the error it have a response
        if(isAxiosError(error) && error.response){
            //we make a new error to handle in other parts of our application
            throw new Error(error.response.data.error)
        }
    }
}

export async function getFullProjectDetails(id:Project['_id']){
    try {        
        const {data} = await api.get(`/projects/${id}`)
        const response = projectSchema.safeParse(data)
        console.log(response);
        console.log(data);
        
        if(response.success){
            return response.data    
        }
    } catch (error) {
        //we validate if is a error of axios and the error it have a response
        if(isAxiosError(error) && error.response){
            //we make a new error to handle in other parts of our application
            throw new Error(error.response.data.error)
        }
    }
}

type ProjectAPIType={
    formData:ProjectFormData,
    projectId:Project['_id']
}
//we update one project
export async function updateProject({formData,projectId}:ProjectAPIType){
    try {        
        const {data} = await api.put<string>(`/projects/${projectId}`,formData)
            return data     
    } catch (error) {
        //we validate if is a error of axios and the error it have a response
        if(isAxiosError(error) && error.response){
            //we make a new error to handle in other parts of our application
            throw new Error(error.response.data.error)
        }
    }
}

//we delete one project
export async function deleteProject(id:Project['_id']){
    try {        
        const {data} = await api.delete<string>(`/projects/${id}`)
            return data     
    } catch (error) {
        //we validate if is a error of axios and the error it have a response
        if(isAxiosError(error) && error.response){
            //we make a new error to handle in other parts of our application
            throw new Error(error.response.data.error)
        }
    }
}