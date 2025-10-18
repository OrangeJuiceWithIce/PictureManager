import "./PictureGallery.css"
import PictureCard from "./PictureCard";
import { useWorld } from "../../contexts/WorldContext";
import { useWorldTag } from "../../contexts/WorldTagContext";

function WorldGallery(){
    const {pictures, loading} = useWorld();
    const {tags} = useWorldTag();

    // World模式下的空操作函数
    const emptyDelete = async () => {};
    const emptyAddTag = () => {};
    const emptySetPublic = () => {};

    if(loading){
        return(
            <div className="PictureGallery-loading">
                加载中...
            </div>
        )
    }

    if(!pictures || pictures.length === 0){
        return(
            <div className="PictureGallery-loading">
                暂无公开图片
            </div>
        )
    }

    return(
        <div className="PictureGallery">
            {pictures.map((picture)=>(
                <PictureCard 
                    key={picture.id} 
                    id={picture.id} 
                    ifPublic={picture.public}
                    path={picture.path} 
                    tags={tags[picture.id] ?? []}
                    active={false}
                    onDelete={emptyDelete}
                    handleAddTagBtnClicked={emptyAddTag}
                    handleSetPublicBtnClicked={emptySetPublic}
                    mode="world"
                    username={picture.username}
                />
            ))}
        </div>
    )
}

export default WorldGallery

