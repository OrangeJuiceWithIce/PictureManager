import { useAuth } from "../contexts/AuthContext"
import "./DashBoard.css"

function Dashboard(){
    const {user, logout}=useAuth()
    
    return(
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="user-info">
                    <div className="user-avatar">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name">{user?.username}</span>
                </div>
                
                <div className="dashboard-welcome">
                    <h2>你好,{user?.username}!</h2>
                    <p className="dashboard-subtitle">Welcomed to Use PictureManager</p>
                </div>
                
                <button 
                    className="logout-btn"
                    onClick={logout}
                    title="退出登录"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>退出</span>
                </button>
            </div>
            
            <div className="dashboard-content">
                {/* 预留内容区域 */}
            </div>
        </div>
    )
}

export default Dashboard