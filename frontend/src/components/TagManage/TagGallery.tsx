import { useAuth } from "../../contexts/AuthContext"
import { useSearch } from "../../contexts/SearchContext"
import { useTag } from "../../contexts/TagContext"
import type { Tag } from "../../types/tag"

type TagGalleryProps={
    pictureId:number,
    tags:Tag[],
}

function TagGallery({pictureId,tags}:TagGalleryProps){
    const {loading}=useTag()
    const {searchParams,setSearchParams}=useSearch()
    const {token}=useAuth()
    const {fetchTags}=useTag()

    if(loading||tags.length===0)return<></>
    const selectedTags=searchParams.selectedTags

    //点击标签可以添加到搜索栏
    const handleTagClicked=(tagName:string)=>{
        const isSelected=selectedTags.includes(tagName)
        const newTags=isSelected
        ?selectedTags.filter(tag=>tag!==tagName)
        :[...selectedTags,tagName]

        setSearchParams({
            selectedTags:newTags
        })
    }
    //删除tag
    const handleDeleteTag=async(pictureId:number,tagId:number)=>{
        try{
            const res=await fetch("http://localhost:8080/deletetag",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${token}`,
                },
                body:JSON.stringify({
                    "pictureId":pictureId,
                    "tagId":tagId,
                })
            })
            const data=await res.json()
            if(data.success){
                alert("删除tag成功")
                fetchTags()
            }else{
                alert("删除tag失败")
            }
        }catch(error){
            alert("删除tag失败")
        }
    }
    return(
        <div className="TagGallery">
            {tags?.map((tag)=>(
                <span key={tag.id} onClick={()=>handleTagClicked(tag.name)}>
                    #{tag.name}
                    <button onClick={()=>handleDeleteTag(pictureId,tag.id)}>
                        x
                    </button>
                </span>
            ))}
        </div>
    )
}

export default TagGallery