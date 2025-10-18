import LoginForm from "../components/forms/LoginForm"
import "./AuthPage.css"

function LoginPage(){
    return(
        <div className="auth-page">
            <div className="auth-overlay"></div>
            <div className="auth-content">
                <div className="auth-form-wrapper">
                    <div className="auth-header">
                        <h1>欢迎回来</h1>
                    </div>
                    <LoginForm />
                    <div className="auth-footer">
                        <p>还没有账户？ <a href="/register">立即注册</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage