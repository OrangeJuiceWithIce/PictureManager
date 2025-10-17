import type React from "react";
import { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { usePicture } from "../../contexts/PictureContext";
import { useSearch } from "../../contexts/SearchContext";

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
            alert("Please choose image first")
            return
        }

        const formData=new FormData();
        for(let i=0;i<selectedFiles.length;i++){
            const file=selectedFiles[i]
            formData.append("files",file);
        }

        try{
            const res=await fetch("http://localhost:8080/uploadpict",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${token}`,
                },
                body:formData,
            });
            const data=await res.json()
            if(!data.success){
                alert(`图片上传失败`+data.error)
            }else{
                alert(`图片上传成功`)
                await fetchPictures(searchParams)
            }
        }catch(error){
            console.error("上传出错:",error);
        }

        setSelectedFiles(null)
        if(fileInputRef.current){
            fileInputRef.current.value=""
        }
    }
    return(
        <div>
            <input 
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={handleFileChange}
            />
            <button onClick={handleUpload}>
                上传图片
            </button>
        </div>
    )
}

export default UploadSection