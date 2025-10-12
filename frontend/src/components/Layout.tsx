import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout(){
    return(
        <div style={{display:"flex", height:"100vh"}}>
            <Sidebar />
            <div style={{flex:1}}>
                <Outlet />
            </div>
        </div>
    )
}

export default Layout