import { Link } from "react-router-dom"
import './Sidebar.css'

function Sidebar(){
    return(
        <nav className="Sidebar">
                <Link to="/">首页</Link>
                <Link to="/register">注册</Link>
                <Link to="/Login">登录</Link>
                <Link to="/DashBoard">用户仪表盘</Link>
                <button>Logout</button>
        </nav>
    )
}

export default Sidebar