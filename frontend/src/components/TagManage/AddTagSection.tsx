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
            const res=await fetch("/api/addtag",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${token}`,
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    "pictureID":id,
                    "tagName":tagInputRef.current.value,
                }),
            })
            const data=await res.json()
            if(!data.success){
                alert("添加标签失败")
            }else{
                alert("标签添加成功")
                tagInputRef.current.value=""
                fetchTags()
                handleAddTagBtnClicked(null)
            }
        }catch(error){
            alert("添加标签失败:"+error)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <div className="add-tag-section">
            <button 
                onClick={()=>handleAddTagBtnClicked(active?null:id)}
                title={active ? "取消" : "添加标签"}
            >
                {active ? "×" : "+"}
            </button>
            {active&&
                <>
                    <input
                        type="text"
                        ref={tagInputRef}
                        placeholder="输入标签名..."
                        onKeyPress={handleKeyPress}
                        autoFocus
                    />
                    <button 
                        className="confirm-btn"
                        onClick={handleSubmit}
                        title="确认添加"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </button>
                </>
            }
        </div>
    )
}

export default AddTagBtn