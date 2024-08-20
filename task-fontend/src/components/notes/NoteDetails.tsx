import { deleteNote } from "@/api/NoteAPI";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index";
import { formatDate } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

type NoteDetailsProps = {
  note: Note;
};
export default function NoteDetails({ note }: NoteDetailsProps) {
  //our hook
  const { data, isLoading } = useAuth();
  //the user that created note is the user in session, one each that the user change will execute the use memo
  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data]);
  //we get projectId of params and taskid of querySrting
  const queryClient = useQueryClient();
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskid = queryParams.get("viewTask")!;
  const projectId = params.projectId!;

  //muatate to delete note
  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["task", taskid] }); //We call the getTestById function with its queryKey to bring the new data
    },
  });
  const handleDelete = () => {
    mutate({ projectId, taskid, noteId: note._id });
  };
  if (isLoading) return "Load...";
  return (
    <>
      <div className="p-3 flex justify-between items-center">
        <div>
          <p>
            {note.content} for{" "}
            <span className="font-bold">{note.createdBy.name}</span>
          </p>
          <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
        </div>

        {canDelete && (
          <button
            type="button"
            className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </>
  );
}
