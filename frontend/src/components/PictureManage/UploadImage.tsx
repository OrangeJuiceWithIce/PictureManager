import type React from "react";
import { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

function UploadImage(){
    const  [selectedFiles,setSelectedFiles]=useState<FileList|null>(null)
    const fileInputRef=useRef<HTMLInputElement>(null)

    const {token}=useAuth()

    const handleFileChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        setSelectedFiles(event.target.files);
    }

    const handleUpload=async()=>{
        if(!selectedFiles||selectedFiles.length===0){
            alert("Please choose image first")
            return
        }
        for(let i=0;i<selectedFiles.length;i++){
            const file=selectedFiles[i]
            const formData=new FormData();
            formData.append("file",file);

            try{
                const res=await fetch("http://localhost:8080/upload",{
                    method:"POST",
                    headers:{
                        "Authorization":`Bearer ${token}`,
                    },
                    body:formData,
                });
                const data=await res.json()
                if(!data.success){
                    alert(`图片${file.name}上传失败`+data.error)
                }else{
                    alert(`图片${file.name}上传成功`)
                }
            }catch(error){
                console.error("上传出错:",error);
            }
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

export default UploadImage