import { createContext, useContext, useEffect, useState } from "react";
import type{ User } from "../types/user";
import { verifyToken } from "../utils/Auth";

interface AuthContextType{
    user:User|null,
    token:string|null,
    isAuthenticated:boolean,
    login:(newToken:string,newUser:User)=>void,
    logout:()=>void,
    loading:boolean,
}

const AuthContext=createContext<AuthContextType|undefined>(undefined)
//向App.tsx提供context
export const AuthProvider=({children}:{children:React.ReactNode})=>{
    const [user,setUser]=useState<User|null>(null)
    const [token,setToken]=useState<string|null>(null)
    const [loading,setLoading]=useState(true)

    const isAuthenticated=user!=null&&token!=null

    useEffect(()=>{
        const initAuth=async()=>{
            const storedToken=localStorage.getItem("Token")
            if(storedToken){
                const {valid,user}=await verifyToken(storedToken)
                if(valid){
                    setToken(storedToken)
                    setUser(user)
                }else{
                    localStorage.removeItem("Token")
                }
            }
            setLoading(false)
        }
        initAuth()
    },[])

    const login=(newToken:string,newUser:User)=>{
        setToken(newToken)
        setUser(newUser)
        localStorage.setItem("Token",newToken)
    }
    const logout=()=>{
        setToken(null)
        setUser(null)
        localStorage.removeItem("Token")
    }

    const value:AuthContextType={
        user,
        token,
        isAuthenticated,
        login,
        logout,
        loading,
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
//
export const useAuth=()=>{
    const context=useContext(AuthContext)
    if(context==undefined){
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}