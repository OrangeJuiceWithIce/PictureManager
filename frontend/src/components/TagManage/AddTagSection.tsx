import { useRef } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useTag } from "../../contexts/TagContext"

type AddTagBtnProps={
    id:number
    active:boolean
    handleAddTagBtnClicked:(id:number|null)=>void
}

function AddTagBtn({id,active,handleAddTagBtnClicked}:AddTagBtnProps){
    const tagInputRef=useRef<HTMLInputElement>(null)
    const {token}=useAuth()
    const {fetchTags}=useTag()

    const handleSubmit=async()=>{
        if(!tagInputRef.current||tagInputRef.current.value==""){
            handleAddTagBtnClicked(null)
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
                fetchTags()
            }
        }catch(error){
            alert("添加tag失败:"+error)
        }
    }

    return (
        <div>
            <button onClick={()=>handleAddTagBtnClicked(active?null:id)}>
                +
            </button>
            {active&&
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