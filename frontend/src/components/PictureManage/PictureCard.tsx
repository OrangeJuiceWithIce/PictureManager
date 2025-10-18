import { useNavigate } from "react-router-dom";
import type { Tag } from "../../types/tag";
import AddTagSection from "../TagManage/AddTagSection";
import TagGallery from "../TagManage/TagGallery";
import WorldTagGallery from "../TagManage/WorldTagGallery";
import "./PictureCard.css"

type PictureCardProps={
    id:number,
    ifPublic:boolean,
    path:string,
    tags:Tag[],
    active:boolean,//目前用于激活tag输入框
    onDelete:(id:number)=>Promise<void>;
    handleAddTagBtnClicked:(id:number|null)=>void;
    handleSetPublicBtnClicked:(id:number,ifPublic:boolean)=>void;
    mode?:'myPicture'|'world',  // 新增：区分模式
    username?:string, // 新增：用于World模式显示用户名
}

function PictureCard({id,ifPublic,path,tags,active,onDelete,handleAddTagBtnClicked,handleSetPublicBtnClicked,mode='myPicture',username}:PictureCardProps){
    const navigate=useNavigate()
    const handleClick=(id:number)=>{
        navigate(`/picture/${id}`, { state: { mode } })
    }
    
    const handleSetPublicClick = () => {
        const visibility=ifPublic?"私人":"公开"
        if (window.confirm(`确定要将该图片的可见度设置为:${visibility}?`)) {
            handleSetPublicBtnClicked(id,ifPublic)
        }
    }
    
    const isWorldMode = mode === 'world'
    
    return (
        <div className="picture-card" key={id}>
            <div className="picture-card-image-wrapper">
                <img 
                    src={`/${path}`}
                    alt="pic"
                    onClick={()=>handleClick(id)}
                    className="picture-card-image"
                />
                {!isWorldMode && (
                    <>
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
                        <button 
                            className="picture-visibility-btn"
                            onClick={handleSetPublicClick}
                            title="修改可见度"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                    </>
                )}
                
                <div className="picture-card-footer">
                    {isWorldMode ? (
                        <>
                            <div className="picture-card-username">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span>{username}</span>
                            </div>
                            <WorldTagGallery tags={tags}/>
                        </>
                    ) : (
                        <>
                            <TagGallery pictureId={id} tags={tags}/>
                            <AddTagSection id={id} active={active} handleAddTagBtnClicked={handleAddTagBtnClicked}/>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PictureCard