import { Project, Task, TaskFormData, taskSchema } from "../types";
import api from "@/lib/axios";
import { isAxiosError } from "axios";
type TaskAPI = {
    formData:TaskFormData,
    projectId:Project['_id'],
    taskid:Task['_id']
    status:Task['status']
}

export async function createTask({formData,projectId}:Pick<TaskAPI, 'formData'|'projectId'>){
    try {
        const url = `/projects/${projectId}/task`
        const {data} = await api.post<string>(url,formData)        
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function getTaskByid({projectId,taskid}:Pick<TaskAPI, 'projectId'|'taskid'>){
    try {
        const url = `/projects/${projectId}/tasks/${taskid}`
        const {data} = await api(url)     
        const response = taskSchema.safeParse(data)          
        if(response.success){
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function updateTask({projectId,taskid,formData}:Pick<TaskAPI, 'projectId' | 'taskid' | 'formData'>){
    try {
        const url = `/projects/${projectId}/task/${taskid}`
        const {data} = await api.put<string>(url,formData)                
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteTask({projectId,taskid}:Pick<TaskAPI, 'projectId'|'taskid'>){
    try {
        const url = `/projects/${projectId}/task/${taskid}`
        const {data} = await api.delete<string>(url)                
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function updateStatus({projectId,taskid,status}:Pick<TaskAPI, 'projectId'|'taskid'|'status'>){
    try {
        const url = `/projects/${projectId}/task/${taskid}/status`
        const {data} = await api.post<string>(url,{status})                
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

