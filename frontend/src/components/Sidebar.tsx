import { Link } from "react-router-dom"
import './Sidebar.css'
import { useAuth } from "../contexts/AuthContext"

function Sidebar(){
    const {isAuthenticated,logout}=useAuth()
    return(
        <nav className="Sidebar">
                <Link to="/">首页</Link>
                {isAuthenticated?(
                    <>
                        <Link to="/dashBoard">用户仪表盘</Link>
                        <Link to="/mypicture">图片</Link>
                        <button onClick={logout}>Logout</button>
                    </>              
                )
                :(
                    <>
                        <Link to="/register">注册</Link>
                        <Link to="/Login">登录</Link>
                    </>
                )
                }
        </nav>
    )
}

export default Sidebar