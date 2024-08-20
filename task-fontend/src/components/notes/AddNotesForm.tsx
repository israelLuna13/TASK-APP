import { NoteFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/api/NoteAPI";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
export default function AddNotesForm() {
  // we get id project of params and id task value of queryString
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = params.projectId!;
  const taskid = queryParams.get("viewTask")!;

  const initialValues: NoteFormData = {
    content: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: initialValues });
  
  const queryClient = useQueryClient();

  //mutation to create note
  const { mutate } = useMutation({
    mutationFn: createNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["task", taskid] }); //We call the getTestById function with its queryKey to bring the new data
    },
  });
  const handleAddNote = (formData: NoteFormData) => {
    const data = {
      projectId,
      taskid,
      formData,
    };
    mutate(data);
    reset();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleAddNote)}
        className="space-y-3"
        noValidate
      >
        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="content">
            Create note
          </label>
          <input
            id="content"
            type="text"
            placeholder="Content of the note"
            className="w-full p-3 border border-gray-300"
            {...register("content", {
              required: "The content of note is required",
            })}
          />

          {errors.content && (
            <ErrorMessage>{errors.content.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value="Create note"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-black cursor-pointer"
        />
      </form>
    </>
  );
}
