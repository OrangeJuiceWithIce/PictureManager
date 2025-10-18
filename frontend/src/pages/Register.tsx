import RegisterForm from "../components/forms/RegisterForm"
import "./AuthPage.css"

function RegisterPage(){
    return(
        <div className="auth-page">
            <div className="auth-overlay"></div>
            <div className="auth-content">
                <div className="auth-form-wrapper">
                    <div className="auth-header">
                        <h1>创建账户</h1>
                    </div>
                    <RegisterForm />
                    <div className="auth-footer">
                        <p>已有账户？ <a href="/login">立即登录</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage