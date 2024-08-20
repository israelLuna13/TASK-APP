import { isAxiosError } from "axios"
import { Note, NoteFormData, Project, Task } from "../types"
import api from "@/lib/axios"
type NoteAPIType={
    formData:NoteFormData
    projectId:Project['_id']
    taskid:Task['_id']
    noteId:Note['_id']
}

export async function createNote({projectId,taskid,formData}:Pick<NoteAPIType,'projectId' | 'taskid' | 'formData'>){

    try {
        const url = `/projects/${projectId}/tasks/${taskid}/notes`
        const  {data} = await api.post<string>(url,formData) 
        return data
            } 
        catch (error) {
            if(isAxiosError(error) && error.response){
                throw new Error(error.response.data.error)
            }
        }

}

export async function deleteNote({projectId,taskid,noteId}:Pick<NoteAPIType,'projectId' | 'taskid' | 'noteId'>){
    try {
      const url = `/projects/${projectId}/tasks/${taskid}/notes/${noteId}`
      const {data} = await api.delete<string>(url)
      return data
            } 
         catch (error) {
            if(isAxiosError(error) && error.response){
                throw new Error(error.response.data.error)
            }
        }
}