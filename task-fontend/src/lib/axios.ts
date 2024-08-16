import axios from 'axios'
//here we create the base URL, this base url will be in all our routes
const api= axios.create({
    baseURL:import.meta.env.VITE_API_URL
})

//in each request of axios we put the header custom 
api.interceptors.request.use( config=> {
    const token = localStorage.getItem('AUTH_TOKEN')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config 
})
export default api