import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { Picture } from "../../types/picture";
import "./PictureDetail.css"
import ImageEditor from "./ImageEditor";
function PictureDetail(){
    const {id}=useParams()
    const [picture,setPicture]=useState<Picture|null>(null)
    const {token}=useAuth()
    const [editing,setEditing]=useState(false)

    useEffect(()=>{
        const fetchPicture=async()=>{
            try{
                const res=await fetch(`http://localhost:8080/getpictbyid/${id}`,{
                    method:"GET",
                    headers:{
                        "Authorization":`Bearer ${token}`,
                    },
                })
                const data=await res.json();
                if(data.success){
                    setPicture(data.picture)
                }else{
                    alert("failed to fetch picture")
                }
            }catch(error){
                alert("failed to fetch picture:"+error)
            }
        }
        fetchPicture()
    },[id,token])

    const handleSaveEdit=async(params:{rotate:number,grayscale:boolean,crop:{
        x:number,
        y:number,
        width:number,
        height:number,
    }|null})=>{
        try{
            const res = await fetch("http://localhost:8080/editpict",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${token}`,
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    pictureId: picture?.id,
                    rotate: params.rotate,
                    grayscale: params.grayscale,
                    crop: params.crop,
                })
            })
            const data = await res.json()
            if(data.success){
                alert("已保存编辑")
                setEditing(false)
                const refetch = await fetch(`http://localhost:8080/getpictbyid/${data.newPictureId}`,{
                    method:"GET",
                    headers:{"Authorization":`Bearer ${token}`}
                })
                const d = await refetch.json()
                if(d.success){
                    setPicture(d.picture)
                }
            }else{
                alert("保存失败")
            }
        }catch(error){
            alert("保存失败"+error)
        }
    }

    if(!picture)return <>loading</>
    return(
        <div>
            {!editing&&(
                <>
                    <img
                        src={`http://localhost:8080/${picture.path}`}
                        alt={`图片${picture.id}`}
                    />
                    <button onClick={()=>setEditing(true)}>编辑</button>
                </>
            )}
            {editing&&(
                <ImageEditor
                    imgUrl={`http://localhost:8080/${picture.path}`}
                    onCancel={()=>setEditing(false)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    )
}

export default PictureDetail