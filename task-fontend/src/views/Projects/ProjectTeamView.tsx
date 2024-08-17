
import { Fragment } from 'react'
import { Menu,Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'

import AddMemberModal from '@/components/team/addMemberModal'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProjectTeam, removeUserFromProject } from '@/api/TeamAPI'
import { toast } from 'react-toastify'
import { TeamMember } from '@/types/index'

export default function ProjectTeamView() {
    const params = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const projectId = params.projectId!
    //we make query to bring the team of a project
    const {data,isLoading,isError} = useQuery({
      queryKey:['projectTeam',projectId], //name of the query
      queryFn:()=>getProjectTeam(projectId),
      retry:false //if there is error not try do the query again
    })

    //mutation to delete a user of a project team
    const {mutate} = useMutation({
      mutationFn:removeUserFromProject,
      onError:(error)=>{
        toast.error(error.message)
      },
      onSuccess:(data)=>{
        toast.success(data)
        queryClient.invalidateQueries({queryKey:['projectTeam']})//We run a query that brings the users of a team, to refresh the page
      }
    })

    const handleRemoveUser =(member:TeamMember)=>{
      const data = {
        projectId,
        userId:member._id
      }
      mutate(data)
    }

    if(isLoading) return 'Cargando...'
    if(isError) return <Navigate to={'/404'}/>
  if(data)return (
    <>
      <h1 className="text-5xl font-black">
        Manage work team to this project
      </h1>
      <p className="text-2xl font-light text-gray-500 mt-5"></p>

      <nav className="my-5 flex gap-3">
        <button
          type="button"
          className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
          //we put a query in the url + route current, this is to open the modal
          onClick={() => navigate(location.pathname + "?addMember=true")}
        >
          Add collaborator
        </button>

        <Link
          to={`/projects/${projectId}`}
          className="bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
        >
          Back to project
        </Link>
      </nav>

      <h2 className="text-5xl font-black my-10">Current members</h2>
      {data.length ? (
        <ul
          role="list"
          className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg"
        >
          {data?.map((member) => (
            <li key={member._id} className="flex justify-between gap-x-6 px-5 py-10">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto space-y-2">
                  <p className="text-2xl font-black text-gray-600">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {member.email}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                  <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">options</span>
                    <EllipsisVerticalIcon
                      className="h-9 w-9"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        <button
                          type="button"
                          className="block px-3 py-1 text-sm leading-6 text-red-500"
                          onClick={()=>handleRemoveUser(member)}
                        >
                          Delete project
                        </button>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center py-20">There are no members in the team</p>
      )}

      <AddMemberModal />
    </>
  );
}
