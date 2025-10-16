import { useRef, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"

type AddTagBtnProps={
    id:number
}

function AddTagBtn({id}:AddTagBtnProps){
    const [addTag,setAddTag]=useState(false)
    const tagInputRef=useRef<HTMLInputElement>(null)
    const {token}=useAuth()
    
    const handleAddClick=()=>{
        setAddTag((prev)=>(!prev))
    }

    const handleSubmit=async()=>{
        if(!tagInputRef.current||tagInputRef.current.value==""){
            setAddTag((prev)=>(!prev))
            return
        }

        try{
            const res=await fetch("http://localhost:8080/addtag",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${token}`,
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    "pictureID":id,
                    "tagName":tagInputRef.current.value,
                    "tagType":"custom",
                }),
            })
            const data=await res.json()
            if(!data.success){
                alert("添加tag失败")
            }else{
                alert("添加tag成功")
                tagInputRef.current.value=""
            }
        }catch(error){
            alert("添加tag失败:"+error)
        }
    }

    return (
        <div>
            <button onClick={handleAddClick}>
                +
            </button>
            {addTag&&
                <>
                    <input
                        type="text"
                        ref={tagInputRef}
                    />
                    <button onClick={handleSubmit}>✔</button>
                </>
            }
        </div>
    )
}

export default AddTagBtn