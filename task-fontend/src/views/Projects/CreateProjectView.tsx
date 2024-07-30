import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ProjectForm from "@/components/projects/ProjectForm";
import { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectAPI";

export default function CreateProjectView() {
  const navigate = useNavigate();
  //----------------------------------------------------REACT QUERY---------------------------------------------
  //we used react query to do a mutation or change like post,put,dele in our data 
  const { mutate } = useMutation({
    mutationFn: createProject,//function that will execute when will call mutate

    onError: (error) => {
        //if there is a error , will execute this code
      toast.error(error.message);
    },
    //if not there is a error, will excecute this code
    onSuccess: (data) => {
      toast.success(data);
      navigate("/");
    },
  });
  //--------------------------------------------------------------------

  const handleForm = (formData: ProjectFormData) => {
    //we call mutate
    mutate(formData);
  };

  const initialValues: ProjectFormData = {
    projectName: "",
    clientName: "",
    description: "",
  };

  //we get the useform the values that we will use, furthermore we asignate the value initials in the form
  const {
    register,handleSubmit,formState: { errors },} = useForm({ defaultValues: initialValues });
  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black">Create Projects </h1>
        <p className="text-2xl font-light text-gray-500 mt-s">
          Complete the next form to create a project
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
            value="Create Project"
            className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}
