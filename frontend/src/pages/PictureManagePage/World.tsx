import WorldGallery from "../../components/PictureManage/WorldGallery";
import WorldSearchBar from "../../components/Search/WorldSearchBar";
import { WorldProvider } from "../../contexts/WorldContext";
import { WorldTagProvider } from "../../contexts/WorldTagContext";
import "./MyPicture.css"

function World(){
    return(
        <WorldProvider>
            <WorldTagProvider>
                <div className="container">
                    <WorldSearchBar />
                    <WorldGallery />
                </div>
            </WorldTagProvider>
        </WorldProvider>
    )
}

export default World