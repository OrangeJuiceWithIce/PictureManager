import { useState } from "react"
import './form.css'
import { useAuth } from "../../contexts/AuthContext"

function RegisterForm(){
    const [email,setEmail]=useState('')
    const [username,setUsername]=useState('') 
    const [password,setPassword]=useState('')

    const {login}=useAuth()

    const handleRegister=async(e:React.FormEvent)=>{
        e.preventDefault()

        try{
            const res=await fetch("http://localhost:8080/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    email,
                    username,
                    password,
                }),
            })
            const data=await res.json()
            if (!data.success){
                alert("register failed:"+data.error)
            }else{
                login(data.token,data.user)
                alert("register success:"+data.user.userId)
            }
        }catch(err){
            alert("register failed:"+err)
        }
    }

    return (
        <form onSubmit={handleRegister}>
            <input 
                name="email"
                type="email"
                placeholder="email"
                value={email}
                onChange={(event)=>setEmail(event.target.value)}
                required
            />
            <input
                name="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(event)=>setUsername(event.target.value)}
                required
            />
            <input 
                name="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(event)=>setPassword(event.target.value)}
                required
            />
            <button type="submit">
                Register
            </button>
        </form>
    )
}

export default RegisterForm