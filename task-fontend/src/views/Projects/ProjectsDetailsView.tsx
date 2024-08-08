import { getProjectById } from "@/api/ProjectAPI";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export default function ProjectsDetailsView() {
  const navigate= useNavigate()
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
  
  if(data) return (
    <>
      <h1 className="text-5xl font-black">{data.projectName}</h1>
      <p className="">{data.description}</p>

      <nav className="my-5 flex gap-3">
        <button type="button" 
          className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            onClick={()=> navigate('?newTask=true')} >
            Add Task
        </button>
      </nav>
      <AddTaskModal/>

    </>
  )
}
