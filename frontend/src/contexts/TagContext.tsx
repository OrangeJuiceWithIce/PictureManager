import React, { createContext, useContext, useEffect, useState } from "react";
import type { Tag } from "../types/tag";
import { useAuth } from "./AuthContext";
import { usePicture } from "./PictureContext";

interface TagContextType{
    tags:Record<number,Tag[]>;
    loading:boolean;
    fetchTags:()=>Promise<void>;
}

const TagContext=createContext<TagContextType|undefined>(undefined)

export const TagProvider=({children}:{children:React.ReactNode})=>{
    const [tags,setTags]=useState<Record<number,Tag[]>>({})
    const [loading,setLoading]=useState(false)

    const {token}=useAuth()
    const {pictures}=usePicture()

    const fetchTags=async()=>{
        if(pictures==null){
            setTags({})
            return
        }
        setLoading(true)
        const pictureIds=pictures.map((p)=>(p.id))
        try{
            const res=await fetch("http://localhost:8080/gettag",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${token}`
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

    const value:TagContextType={
        tags,
        loading,
        fetchTags,
    }
    
    return(
        <TagContext.Provider value={value}>
            {children}
        </TagContext.Provider>
    )
}

export const useTag=()=>{
    const context=useContext(TagContext)
    if(context===undefined){
        throw new Error("useTag should be used within a TagProvider")
    }
    return context
}