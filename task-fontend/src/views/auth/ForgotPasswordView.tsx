import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "../../types";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "@/components/ErrorMessage";
import { forgotPassword } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function ForgotPasswordView() {
  const initialValues: ForgotPasswordForm = {
    email: ''
  }
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });
  
  //mutation to send email with the token
  const {mutate} = useMutation({
    mutationFn:forgotPassword,
    onError:(error)=>{
        toast.error(error.message)
    },
    onSuccess:(data)=>{
        toast.success(data)
        reset()
    }
  })
  const handleForgotPassword = (formData: ForgotPasswordForm) => {
    mutate(formData)
  }

  return (
    <>
        <h1 className="text-5xl font-black text-white">Reset your password</h1>
         <p className="text-2xl font-light text-white mt-5">
            You forgot your password? Put your email {''}
        <span className=" text-fuchsia-500 font-bold"> and reset your password</span>
      </p>
      <form
        onSubmit={handleSubmit(handleForgotPassword)}
        className="space-y-8 p-10  bg-white mt-10"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
            htmlFor="email"
          >Email</label>
          <input
            id="email"
            type="email"
            placeholder="Registration email"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "The email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail not valide",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Enviar Instrucciones'
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to='/auth/login'
          className="text-center text-gray-300 font-normal"
        >
          You have account? Login
        </Link>

        <Link
          to='/auth/register'
          className="text-center text-gray-300 font-normal"
        >
          ¿You not have account? Create
        </Link>
      </nav>
    </>
  )
}