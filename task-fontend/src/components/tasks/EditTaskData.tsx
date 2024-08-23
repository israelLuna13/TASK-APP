import { Navigate, useLocation, useParams } from "react-router-dom";
import {useQuery} from '@tanstack/react-query'
import { getTaskByid } from "@/api/TaskAPI";
import EditTaskModal from "./EditTaskModal";
export default function EditTaskData() {
    const params = useParams()
    const projectId=params.projectId!
    
    const location = useLocation()//current route
    const queryParams = new URLSearchParams(location.search)//we to get queryString ?editTask=66b529a60c2d6b9b44184192
    const taskId = queryParams.get('editTask')! //we get the value of query string when to be in the url 66b529a60c2d6b9b44184192

    const {data, isError} = useQuery({
        queryKey:['task',taskId],
        queryFn:()=>getTaskByid({projectId,taskid:taskId}),
        enabled:!!taskId, //this query not will execute if taskid is null o undefine
        retry:false // we disable automatic attempts
    })

    if(isError) return <Navigate to={'/404'}/>
    
    
 if(data) return <EditTaskModal data={data} taskid={taskId}/>
}
