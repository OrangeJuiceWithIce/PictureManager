import { useTag } from "../../contexts/TagContext"
import type { Tag } from "../../types/tag"

type TagGalleryProps={
    tags:Tag[],
}

function TagGallery({tags}:TagGalleryProps){
    const {loading}=useTag()

    if(loading||tags.length===0)return<></>
    
    return(
        <div className="TagGallery">
            {tags?.map((tag)=>(
                <span key={tag.id}>
                    #{tag.name}
                </span>
            ))}
        </div>
    )
}

export default TagGallery