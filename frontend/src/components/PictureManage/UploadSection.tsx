import type React from "react";
import { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { usePicture } from "../../contexts/PictureContext";
import { useSearch } from "../../contexts/SearchContext";
import "./UploadSection.css"

function UploadSection(){
    const  [selectedFiles,setSelectedFiles]=useState<FileList|null>(null)
    const fileInputRef=useRef<HTMLInputElement>(null)

    const {token}=useAuth()
    const {searchParams}=useSearch()
    const {fetchPictures}=usePicture()

    const handleFileChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        setSelectedFiles(event.target.files);
    }

    const handleUpload=async()=>{
        if(!selectedFiles||selectedFiles.length===0){
            alert("请先选择图片")
            return
        }

        const formData=new FormData();
        for(let i=0;i<selectedFiles.length;i++){
            const file=selectedFiles[i]
            formData.append("files",file);
        }

        try{
            const res=await fetch("api/uploadpict",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${token}`,
                },
                body:formData,
            });
            const data=await res.json()
            if(!data.success){
                alert(`图片上传失败：`+data.error)
            }else{
                alert(`成功上传 ${selectedFiles.length} 张图片`)
                await fetchPictures(searchParams)
            }
        }catch(error){
            console.error("上传出错:",error);
            alert("上传失败，请重试")
        }

        setSelectedFiles(null)
        if(fileInputRef.current){
            fileInputRef.current.value=""
        }
    }

    const handleChooseFile = () => {
        fileInputRef.current?.click()
    }

    const getFileCountText = () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            return "选择图片"
        }
        return `已选择 ${selectedFiles.length} 张`
    }

    return(
        <div className="upload-section-wrapper">
            <div className="upload-section-container">
                <input 
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="file-input-hidden"
                />
                
                <button 
                    className="choose-file-btn"
                    onClick={handleChooseFile}
                    title="选择要上传的图片"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span>{getFileCountText()}</span>
                </button>

                <button 
                    className="upload-btn"
                    onClick={handleUpload}
                    title="上传图片"
                    disabled={!selectedFiles || selectedFiles.length === 0}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>上传</span>
                </button>
            </div>
        </div>
    )
}

export default UploadSection