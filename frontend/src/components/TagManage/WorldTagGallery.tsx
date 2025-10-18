import { useWorld } from "../../contexts/WorldContext"
import type { Tag } from "../../types/tag"

type WorldTagGalleryProps={
    tags:Tag[],
}

function WorldTagGallery({tags}:WorldTagGalleryProps){
    const {searchParams, setSearchParams} = useWorld();

    if(tags.length===0) return <></>

    const selectedTags = searchParams.selectedTags;

    const handleTagClicked = (tagName: string) => {
        const isSelected = selectedTags.includes(tagName)
        if (!isSelected) {
            setSearchParams({
                selectedTags: [...selectedTags, tagName]
            })
        }
    }

    return(
        <div className="TagGallery">
            {tags?.map((tag)=>(
                <span 
                    key={tag.id} 
                    className="world-tag"
                    onClick={() => handleTagClicked(tag.name)}
                    style={{ cursor: 'pointer' }}
                >
                    #{tag.name}
                </span>
            ))}
        </div>
    )
}

export default WorldTagGallery

