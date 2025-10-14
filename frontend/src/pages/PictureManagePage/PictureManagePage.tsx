import GetPicture from "../../components/PictureManage/GetPicture";
import UploadPicture from "../../components/PictureManage/UploadPicture";
import { PictureProvider } from "../../contexts/PictureContext";

function PictureManagePage(){
    return(
        <PictureProvider>
            <UploadPicture />
            <GetPicture />
        </PictureProvider>
    )
}

export default PictureManagePage