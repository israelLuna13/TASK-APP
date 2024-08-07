import { Navigate, useParams } from "react-router-dom"
import {useQuery} from '@tanstack/react-query'
import { getProjectById } from "@/api/ProjectAPI";
import EditProjectForm from "@/components/projects/EditProjectForn";

export default function EditProjectsViews() {
  const params = useParams()
  const projectId= params.projectId!

  //with useQuery we call the function getProjectById
  const { data, isLoading,isError } = useQuery({
    queryKey: ["editProject",projectId],
    queryFn: ()=>getProjectById(projectId),// we use callback when the function it have arguments
    retry:false // if the query is false or is error not will try again
  });
  if(isLoading) return 'Cargando...'
  if(isError) return <Navigate to='/404'/>  
  
  if(data) return <EditProjectForm data={data} projectId={projectId}/>
}
