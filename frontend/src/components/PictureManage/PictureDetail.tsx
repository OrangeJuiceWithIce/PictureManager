import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { Picture } from "../../types/picture";
import "./PictureDetail.css"
import ImageEditor from "./ImageEditor";

function PictureDetail(){
    const {id}=useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [picture,setPicture]=useState<Picture|null>(null)
    const {token}=useAuth()
    const [editing,setEditing]=useState(false)
    
    // 检查是否从World页面访问（只读模式）
    const isReadOnly = location.state?.mode === 'world'

    useEffect(()=>{
        const fetchPicture=async()=>{
            try{
                const res=await fetch(`/api/getpictbyid/${id}`,{
                    method:"GET",
                    headers:{
                        "Authorization":`Bearer ${token}`,
                    },
                })
                const data=await res.json();
                if(data.success){
                    setPicture(data.picture)
                }else{
                    alert("获取图片失败")
                }
            }catch(error){
                alert("获取图片失败:"+error)
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
            const res = await fetch("/api/editpict",{
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
                alert("编辑保存成功")
                setEditing(false)
                const refetch = await fetch(`/api/getpictbyid/${data.newPictureId}`,{
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

    if(!picture)return <div className="picture-detail-loading">加载中...</div>
    
    return(
        <div className="picture-detail-container">
            {!editing&&(
                <div className="picture-detail-view">
                    <div className="picture-detail-header">
                        <button 
                            className="back-btn"
                            onClick={() => navigate(-1)}
                            title="返回"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            <span>返回</span>
                        </button>
                        {!isReadOnly && (
                            <button 
                                className="edit-btn"
                                onClick={()=>setEditing(true)}
                                title="编辑图片"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                <span>编辑</span>
                            </button>
                        )}
                    </div>
                    <div className="picture-detail-image-wrapper">
                        <img
                            src={`/${picture.path}`}
                            alt={`图片${picture.id}`}
                            className="picture-detail-image"
                        />
                    </div>
                </div>
            )}
            {editing&&(
                <ImageEditor
                    imgUrl={`/${picture.path}`}
                    onCancel={()=>setEditing(false)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    )
}

export default PictureDetail