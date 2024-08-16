import { Link, Navigate, Outlet } from "react-router-dom";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import Logo from "@/components/Logo";
import NavMenu from "@/components/NavMenu";
import { useAuth } from "@/hooks/useAuth";
export default function AppLayout() {

  // our state
  const {data,isError,isLoading} = useAuth()
  
  if(isLoading) return 'Cargando...'
  //If there is no session
  if(isError){
    return <Navigate to='/auth/login'/>
  }
  if(data) return (
     <>
      <header className="bg-gray-800 py-5">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center">
          <div className="w-64 ">
            <Link to={'/'}>
              <Logo />
            </Link>
          </div>
          <NavMenu
            name={data.name}
          />
          
          
        </div>
      </header>
      <section className="max-m-scree-2xl mx-auto mt-10 p-5">
        <Outlet />
      </section>

      <footer className="py-5">
        <p className="text-center">
          Todos los derechos reservados {new Date().getFullYear()}
        </p>
      </footer>

      {/* message that will show in ou screen when all be success or exist error */}
      <ToastContainer
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
    </>
  );

}
