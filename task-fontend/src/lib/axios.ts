import axios from 'axios'
//here we create the base URL, this base url will be in all our routes
const api= axios.create({
    baseURL:import.meta.env.VITE_API_URL
})
export default api