import React, { createContext, useContext, useEffect, useState } from "react";
import type { Tag } from "../types/tag";
import { useAuth } from "./AuthContext";
import { useWorld } from "./WorldContext";

interface WorldTagContextType{
    tags:Record<number,Tag[]>;
    loading:boolean;
    fetchTags:()=>Promise<void>;
}

const WorldTagContext=createContext<WorldTagContextType|undefined>(undefined)

export const WorldTagProvider=({children}:{children:React.ReactNode})=>{
    const [tags,setTags]=useState<Record<number,Tag[]>>({})
    const [loading,setLoading]=useState(false)

    const {token}=useAuth()
    const {pictures}=useWorld()

    const fetchTags=async()=>{
        if(pictures==null || pictures.length === 0){
            setTags({})
            return
        }
        setLoading(true)
        const pictureIds=pictures.map((p)=>(p.id))
        try{
            const res=await fetch("/api/gettag",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(pictureIds)
            })
            const data=await res.json()
            if(data.success&&typeof data.tags==="object"){
                setTags(data.tags)
            }else{
                console.error("failed to fetch tags")
                setTags({})
            }
        }catch(error){
            console.error("failed to fetch tags:"+error)
            setTags({})
        }finally{
            setLoading(false)
        }
    }
    
    useEffect(()=>{
        fetchTags()
    },[pictures,token])

    const value:WorldTagContextType={
        tags,
        loading,
        fetchTags,
    }
    
    return(
        <WorldTagContext.Provider value={value}>
            {children}
        </WorldTagContext.Provider>
    )
}

export const useWorldTag=()=>{
    const context=useContext(WorldTagContext)
    if(context===undefined){
        throw new Error("useWorldTag should be used within a WorldTagProvider")
    }
    return context
}

