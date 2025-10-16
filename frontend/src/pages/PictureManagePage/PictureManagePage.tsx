import PictureGallery from "../../components/PictureManage/PictureGallery";
import UploadSection from "../../components/PictureManage/UploadSection";
import { PictureProvider } from "../../contexts/PictureContext";

function PictureManagePage(){
    return(
        <PictureProvider>
            <UploadSection />
            <PictureGallery />
        </PictureProvider>
    )
}

export default PictureManagePage