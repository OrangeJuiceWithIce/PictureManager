import { Link } from "react-router-dom"
import './Sidebar.css'
import { useAuth } from "../contexts/AuthContext"

function Sidebar(){
    const {isAuthenticated}=useAuth()
    return(
        <nav className="Sidebar">
                <Link to="/">首页</Link>
                {isAuthenticated?(
                    <>
                        <Link to="/dashBoard">用户设置</Link>
                        <Link to="/mypicture">我的图片</Link>
                        <Link to="/world">世界</Link>
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