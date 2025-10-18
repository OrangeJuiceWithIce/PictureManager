import { createContext, useContext, useEffect, useState } from "react";
import type { Picture } from "../types/picture";
import { useAuth } from "./AuthContext";
import { useSearch, type SearchParams } from "./SearchContext";

interface PictureContextType{
    pictures:Picture[]|null;
    loading:boolean;
    fetchPictures:(searchParams?:SearchParams)=>Promise<void>;
    deletePictures:(id:number)=>Promise<void>;
    handleSetPublic:(pictureId:number,ifPublic:boolean)=>void;
}

const PictureContext=createContext<PictureContextType|undefined>(undefined)

export const PictureProvider=({children}:{children:React.ReactNode})=>{
    const [pictures,setPictures]=useState<Picture[]|null>(null)
    const [loading,setLoading]=useState(false)

    const {searchParams}=useSearch()
    const {token}=useAuth()
    
    const fetchPictures=async(searchParams?:SearchParams)=>{
        setLoading(true)
        try{
            const body:any={
                offset:0,
                limit:20,
            }
            if(searchParams){
                body.time=searchParams.time
                body.public=searchParams.public
                body.selectedTags=searchParams.selectedTags
            }

            const res=await fetch("http://localhost:8080/searchpict",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${token}`,
                    "Content-Type":"appliction/json",
                },
                body:JSON.stringify(body),
            })

            const data=await res.json()
            if(data.success&&Array.isArray(data.pictures)){
                setPictures(data.pictures)
            }else{
                alert("搜索失败")
            }
        }catch(error){
            alert("搜索失败"+error)
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

    const handleSetPublic=async(pictureId:number,ifPublic:boolean)=>{
        try{
            const res = await fetch("http://localhost:8080/setpictpub",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${token}`,
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    "pictureId": pictureId,
                    "public":ifPublic,
                })
            })
            const data = await res.json()
            if(data.success){
                alert(`成功设置为Public:${ifPublic}`)
                fetchPictures(searchParams)
            }else{
                alert("设置失败")
            }
        }catch(error){
            alert("设置失败"+error)
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
        handleSetPublic,
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