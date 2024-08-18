import { Task } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTranslations } from "@/locales/es"
//import { statusTranslations } from "@/locales/es"
type TaskListProps = {
   tasks:Task[] 
   canEdit: boolean
}

type GroupedTask={
    [key:string]:Task[]
}
//dictionary of task
const initialStatusGroups:GroupedTask = {
    pendig:[],
    onHold:[],
    inProgress:[],
    underReview:[],
    completed:[]
}
//this is dictionary to put the color to each status
const statusStyles : {[key:string]:string}= {
    pendig:'border-t-slate-500',
    onHold:'border-t-red-500',
    inProgress:'border-t-blue-500',
    underReview:'border-t-amber-500',
    completed:'border-t-emerald-500'
}

export default function TaskList({tasks,canEdit}:TaskListProps) {

    //we make group of status with his tasks
    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup };
    }, initialStatusGroups);    
    
  return (
    <>
      <h2 className="text-5xl font-black my-10">Task</h2>

      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">

        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">

                                                                                {/* depending of the status we put a diferent color */}
            <h3 className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}>
              {statusTranslations[status]}
            </h3>

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
      </div>
    </>
  );
}
