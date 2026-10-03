import Header from "./pages/Header"
import { Outlet } from "react-router"
export default function Admin() {
  return (
   <>
   <Header/>
   <Outlet/>
   </>
  )
}
