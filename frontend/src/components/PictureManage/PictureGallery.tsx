import "./PictureGallery.css"
import PictureCard from "./PictureCard";
import { usePicture } from "../../contexts/PictureContext";
import { useTag } from "../../contexts/TagContext";
import { useState } from "react";

function PictureGallery(){
    const {pictures,loading,deletePictures,handleSetPublic}=usePicture()
    const [activeId,setActiveId]=useState<number|null>(null)
    const {tags}=useTag()

    const handleAddTagBtnClicked=(id:number|null)=>{
        setActiveId(id)
    }

    if(loading){
        return(
            <div className="PictureGallery-loading">
                加载中...
            </div>
        )
    }
    return(
        <div className="PictureGallery">
            {pictures?.map((picture)=>(
                <PictureCard 
                    key={picture.id} 
                    id={picture.id} 
                    ifPublic={picture.public}
                    path={picture.path} 
                    tags={tags[picture.id]??[]}
                    active={activeId==picture.id}
                    onDelete={deletePictures}
                    handleAddTagBtnClicked={handleAddTagBtnClicked}
                    handleSetPublicBtnClicked={()=>handleSetPublic(picture.id,!picture.public)}
                />
            ))}
        </div>
    )
}

export default PictureGallery