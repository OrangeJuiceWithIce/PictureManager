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
        <div className="PictureCard" key={id}>
            <img 
                src={`http://localhost:8080/${path}`}
                alt="pic"
                onClick={()=>handleClick(id)}
            />
            <button className="deleteBtn"
                onClick={async()=>await onDelete(id)}
            >
                X
            </button>
            <TagGallery pictureId={id} tags={tags}/>
            <AddTagSection id={id} active={active} handleAddTagBtnClicked={handleAddTagBtnClicked}/>
        </div>
    )
}

export default PictureCard