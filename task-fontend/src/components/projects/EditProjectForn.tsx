import { Link, useNavigate } from 'react-router-dom'
import ProjectForm from './ProjectForm'
import { Project, ProjectFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import {useMutation,useQueryClient} from '@tanstack/react-query'
import { updateProject } from '@/api/ProjectAPI';
import { toast } from 'react-toastify';

//type to data the we get form out api
type EditProjectFormProps={
    data:ProjectFormData,
    projectId: Project['_id']
}

export default function EditProjectForm({data,projectId}:EditProjectFormProps) {

    const navigate = useNavigate()
      //we get the useform the values that we will use, furthermore we asignate the value initials in the form
      const {
        register,handleSubmit,formState: { errors },} = useForm({ defaultValues: {
            projectName:data.projectName,
            clientName:data.clientName,
            description:data.description
        } });

        const queryClient=useQueryClient()//delete data previus and do other query

        //mutate to update project
        const {mutate} = useMutation({
            mutationFn:updateProject,
            onError:(error)=>{
                toast.error(error.message);
            },
            onSuccess:(data)=>{
                //we do a new query to have data more recent
                //the queryKey is the query tha we execute to that the data to be updated
                queryClient.invalidateQueries({queryKey:['projects']})
                queryClient.invalidateQueries({queryKey:["editProject",projectId]})
                toast.success(data)
                navigate('/')
            }
        })

        const handleForm = (formData:ProjectFormData)=>{
            //mutate only take one argument but out function take 2 arguments
            //so , we created a object with the 2 arguments to mutate
        const data = {
            formData,
            projectId
        }
        mutate(data)
        
        }
  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black">Edit Projects </h1>
        <p className="text-2xl font-light text-gray-500 mt-s">
          Complete the next form to edit a project
        </p>

        <nav className="my-5">
          <Link
            className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            to={"/"}
          >
            Return to my projects
          </Link>
        </nav>

        <form
          action=""
          className="mt-10 bg-white shadow-lg p-10 rounded-lg"
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <ProjectForm register={register} errors={errors} />

          <input
            type="submit"
            value="Save changes"
            className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  )
}
