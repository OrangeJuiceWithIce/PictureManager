import PictureGallery from "../../components/PictureManage/PictureGallery";
import UploadSection from "../../components/PictureManage/UploadSection";
import { PictureProvider } from "../../contexts/PictureContext";
import { TagProvider } from "../../contexts/TagContext";

function PictureManagePage(){
    return(
        <PictureProvider>
            <TagProvider>
                <UploadSection />
                <PictureGallery />
            </TagProvider>
        </PictureProvider>
    )
}

export default PictureManagePage