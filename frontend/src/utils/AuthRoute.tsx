import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const AuthRoute=({children}:{children:React.ReactNode})=>{
    const{isAuthenticated,loading}=useAuth()
    if(loading){
        return(
            <div>
                加载中
            </div>
        )
    }
    if(isAuthenticated){
        return <Navigate to="/dashboard" replace />
    }

    return children
}

export default AuthRoute