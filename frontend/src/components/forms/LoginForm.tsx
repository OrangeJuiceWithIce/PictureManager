import { useState } from "react"
import "./form.css"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../ui/Button"

function LoginForm(){
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

    const {login}=useAuth()

    const handleLogin=async(e:React.FormEvent)=>{
        e.preventDefault()

        try{
            const res=await fetch("/api/login",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    email,
                    password,
                }),
            })

            const data=await res.json()
            if (!data.success){
                alert("login failed:"+data.error)
            }else{
                login(data.token,data.user)
                alert("login success:"+data.user.userId)
            }
        }catch(err){
            alert("login failed:"+err)
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <input
                name="email"
                type="email"
                placeholder="请输入邮箱地址"
                value={email}
                onChange={(event)=>setEmail(event.target.value)}
                required
            />
            <input 
                name="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(event)=>setPassword(event.target.value)}
                required
            />
            <Button type="submit">登录</Button>
        </form>
    )
}

export default LoginForm