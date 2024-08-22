import { getFullProjectDetails } from "@/api/ProjectAPI";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskList from "@/components/tasks/TaskList";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

export default function ProjectsDetailsView() {
  const { data: user, isLoading: authLoading } = useAuth();

  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  //with useQuery we call the function getProjectById
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getFullProjectDetails(projectId), // we use callback when the function it have arguments
    retry: false, // if the query is false or is error not will try again
  });

  console.log(data);
  
  //we validate if the user in session is a manager of project, this memo we send with taskList and taskCard
  const canEdit = useMemo(()=>data?.manager === user?._id,[data,user])  
    //we waiting the data of function getProjects and getUser
  if (isLoading && authLoading) return "Cargando...";
  if (isError) return <Navigate to="/404" />;

  //if there are data the projects and user
  if (data && user)
    return (
      <>
        <h1 className="text-5xl font-black">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          {data.description}
        </p>
        
        {/* if is the manager of project */}
        {isManager(data.manager, user._id) && (
          <nav className="my-5 flex gap-3">
            <button
              type="button"
              className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
              //we put a query in the url + route current
              onClick={() => navigate(location.pathname + "?newTask=true")}
            >
              Add Task
            </button>

            <Link
              to={"team"}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            >
              Collaborators
            </Link>
          </nav>
        )}

        <TaskList tasks={data.tasks} canEdit={canEdit}/>
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </>
    );
}
