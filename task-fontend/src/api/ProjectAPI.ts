import api from '@/lib/axios';
import {ProjectFormData} from '@/types/index'
import { isAxiosError } from 'axios';

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