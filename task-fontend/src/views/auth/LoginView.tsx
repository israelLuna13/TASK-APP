import { useForm } from "react-hook-form";
import { UserLoginForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "@/components/ErrorMessage";
import { Link } from "react-router-dom";
import { login } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function LoginView() {

  const initialValues: UserLoginForm = {
    email: '',
    password: '',
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

  //mutate to authenticate user
  const {mutate} = useMutation({
    mutationFn:login,
    onError:(error)=>{
      toast.error(error.message)
    },
    onSuccess:(data)=>{
      toast.success(data)
    }
  })

  const handleLogin = (formData: UserLoginForm) => { 
    mutate(formData)
  }

  return (
    <>
      <h1 className="text-5xl font-black text-white">Login</h1>
      <p className="text-2xl font-light text-white mt-5">
      Start planning your projects  {''}
        <span className=" text-fuchsia-500 font-bold">Login in this form</span>
      </p>
      <form

        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10 bg-white mt-10"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
          >Email</label>

          <input
            id="email"
            type="email"
            placeholder="Register Email"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "The email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail not válide",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
          >Password</label>

          <input
            type="password"
            placeholder="Register password"
            className="w-full p-3  border-gray-300 border"
            {...register("password", {
              required: "The password is requerided",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Login'
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link className="text-center text-gray-300 font-normal" to={'/auth/register'}>
        ¿You not have account ? Create one
  
        </Link>
        <Link className="text-center text-gray-300 font-normal" to={'/auth/forgot-password'}>
        ¿You forgot your password ? Reset
  
        </Link>
      </nav>
    </>
  )
}