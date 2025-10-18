import { useNavigate } from "react-router-dom";
import type { Tag } from "../../types/tag";
import AddTagSection from "../TagManage/AddTagSection";
import TagGallery from "../TagManage/TagGallery";
import "./PictureCard.css"

type PictureCardProps={
    id:number;
    path:string,
    tags:Tag[],
    active:boolean,//目前用于激活tag输入框
    onDelete:(id:number)=>Promise<void>;
    handleAddTagBtnClicked:(id:number|null)=>void;
}

function PictureCard({id,path,tags,active,onDelete,handleAddTagBtnClicked}:PictureCardProps){
    const navigate=useNavigate()
    const handleClick=(id:number)=>{
        navigate(`/picture/${id}`)
    }
    
    return (
        <div className="picture-card" key={id}>
            <div className="picture-card-image-wrapper">
                <img 
                    src={`http://localhost:8080/${path}`}
                    alt="pic"
                    onClick={()=>handleClick(id)}
                    className="picture-card-image"
                />
                <button 
                    className="picture-delete-btn"
                    onClick={async()=>await onDelete(id)}
                    title="删除图片"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
            
            <div className="picture-card-footer">
                <TagGallery pictureId={id} tags={tags}/>
                <AddTagSection id={id} active={active} handleAddTagBtnClicked={handleAddTagBtnClicked}/>
            </div>
        </div>
    )
}

export default PictureCard