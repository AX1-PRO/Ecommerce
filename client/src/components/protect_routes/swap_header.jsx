import Main_Header from "../../Layout/Header/Main_Header"
import Logged_header from '../../Layout/Header/Logged_header'
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
export default function swap_Header(){
    let {user,loading}=useSelector((e)=>{return e.auth_slice})
        let Navigate=useNavigate()
if(loading?.getme){
    return null
}
    return(
     user ? <Logged_header/> : <Main_Header/>
    )
}