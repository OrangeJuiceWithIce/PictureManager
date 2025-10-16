import "./PictureGallery.css"
import PictureCard from "./PictureCard";
import { usePicture } from "../../contexts/PictureContext";

function PictureGallery(){
    const {pictures,loading,deletePictures}=usePicture()

    if(loading){
        return(
            <div>
                加载中
            </div>
        )
    }
    return(
        <div className="PictureGallery">
            {pictures?.map((picture)=>(
                <PictureCard key={picture.id} id={picture.id} path={picture.path} onDelete={deletePictures}/>
            ))}
        </div>
    )
}

export default PictureGallery