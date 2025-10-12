import type { User } from "../types/user";

export const verifyToken=async(token:string):Promise<{valid:boolean,user:User|null}>=>{
    try{
        const res=await fetch("http://localhost:8080/verify-token",{
            method:"GET",
            headers:{
                "Authorization":`Bearer ${token}`,
                "Content-Type":"application/json",
            },
        });
        
        const data = await res.json()
        if(!data.valid){
            return {valid:false,user:null}
        }
        return {valid:true,user:data.user}
    }catch(error){
        alert("token verification failed")
        return {valid:false,user:null}
    }
}