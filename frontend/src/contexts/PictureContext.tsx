import { createContext, useContext, useEffect, useState } from "react";
import type { Picture } from "../types/picture";
import { useAuth } from "./AuthContext";

interface PictureContextType{
    pictures:Picture[]|null;
    loading:boolean;
    fetchPictures:()=>Promise<void>;
    deletePictures:(id:number)=>Promise<void>;
}

const PictureContext=createContext<PictureContextType|undefined>(undefined)

export const PictureProvider=({children}:{children:React.ReactNode})=>{
    const [pictures,setPictures]=useState<Picture[]|null>(null)
    const [loading,setLoading]=useState(false)
    const {token}=useAuth()

    const fetchPictures=async()=>{
        setLoading(true)
        try{
            const res=await fetch(`http://localhost:8080/getpict?limit=20`,{
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${token}`,
                },
            })

            const data=await res.json()
            if(!data.success){
                alert("获取图片失败:"+data.error)
            }else{
                setPictures(data.pictures)
            }
        }catch(error){
            alert("获取图片失败:"+error)
        }finally{
            setLoading(false)
        }
    }

    const deletePictures=async(id:number)=>{
        const confirmed=window.confirm("Are you sure to delete this picture?")
        if(!confirmed)return

        try{
            const res=await fetch(`http://localhost:8080/deletepict/${id}`,{
                method:"DELETE",
                headers:{
                    "Authorization":`Bearer ${token}`,
                },
            })
            const data=await res.json()
            if(!data.success){
                alert("删除图片失败")
            }else{
                alert("删除图片成功")
                fetchPictures()
            }
        }catch(error){
            alert("删除图片失败:"+error)
        }
    }

    useEffect(()=>{
        fetchPictures()
    },[token])

    const value:PictureContextType={
        pictures,
        loading,
        fetchPictures,
        deletePictures,
    }
    return (
        <PictureContext.Provider value={value}>
            {children}
        </PictureContext.Provider>
    )
}

export const usePicture=()=>{
    const context=useContext(PictureContext);
    if(context===undefined){
        throw new Error("usePicture must be used within a PictureProvider")
    }
    return context
}