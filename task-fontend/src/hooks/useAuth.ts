import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/AuthAPI";

//we get the user in session with useQuery
export const useAuth =()=>{
    //with useQuery we get the user in session 
    const {data,isError,isLoading} = useQuery({
        queryKey:['user'],
        queryFn:getUser,
        retry:false,
        refetchOnWindowFocus:false //when we change of windows not will update the page
    })
    return {data,isError,isLoading}
}