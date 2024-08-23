import {DndContext, DragEndEvent} from '@dnd-kit/core'
import { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTranslations } from "@/locales/es"
import DropTask from "./DropTask"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateStatus } from '@/api/TaskAPI'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
//import { statusTranslations } from "@/locales/es"
type TaskListProps = {
   tasks:TaskProject[] 
   canEdit: boolean
}

type GroupedTask={
    [key:string]:TaskProject[]
}
//dictionary of task
const initialStatusGroups:GroupedTask = {
    pending:[],
    onHold:[],
    inProgress:[],
    underReview:[],
    completed:[]
}
//this is dictionary to put the color to each status
const statusStyles : {[key:string]:string}= {
    pending:'border-t-slate-500',
    onHold:'border-t-red-500',
    inProgress:'border-t-blue-500',
    underReview:'border-t-amber-500',
    completed:'border-t-emerald-500'
}

export default function TaskList({tasks,canEdit}:TaskListProps) {

  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();

   //mutation to change state
   const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      //when we changed status , we will do fetch of projectById and taskById to bring new data and show in the page
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success(data);
    },
  });


    //we make group of status with his tasks
    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup };
    }, initialStatusGroups);    
    
    //function is called when the user finishes dragging an item 
    //the event e constains information abour the item thas was being dragged and where it was dropped
    const handleDragEnd =(e:DragEndEvent)=>{
      //over: location where the item was dropped
      //active : represents the item that was being dragged
      const {over,active} = e

      //checks if the item was droppend in a valid area thas has an id
      if(over && over.id){
          const taskid=active.id.toString()
          const status = over.id as TaskStatus
          mutate({projectId,taskid,status})//we update status 
          //update the local state
          queryClient.setQueryData(["project", projectId], (prevData:Project)=>{

            const updateTask=prevData.tasks.map((task)=>{
              //update status
              if(task._id == taskid){
                return {
                  ...task,status
                }
              }
              return task
            })
            //project with update status
            return {
              ...prevData,tasks:updateTask
            }
            
          })
      }
    }
  return (
    <>
      <h2 className="text-5xl font-black my-10">Task</h2>

      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">

          {/* EveryThing inside of DndContext you can take wiht the mouse */}
          <DndContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">

                                                                                  {/* depending of the status we put a diferent color */}
              <h3 className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}>
                {statusTranslations[status]}
              </h3>

              <DropTask status={status}/>

              <ul className="mt-5 space-y-5">
                {tasks.length === 0 ? (
                  <li className="text-gray-500 text-center pt-3">
                    Not there is task
                  </li>
                ) : (

                  tasks.map((task) => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                  
                )}
              </ul>
            </div>
          ))}
        </DndContext>
      </div>
    </>
  );
}
