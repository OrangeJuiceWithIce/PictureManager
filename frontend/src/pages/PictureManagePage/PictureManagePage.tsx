import PictureGallery from "../../components/PictureManage/PictureGallery";
import UploadSection from "../../components/PictureManage/UploadSection";
import SearchBar from "../../components/Search/SearchBar";
import { PictureProvider } from "../../contexts/PictureContext";
import { SearchProvider } from "../../contexts/SearchContext";
import { TagProvider } from "../../contexts/TagContext";

function PictureManagePage(){
    return(
        <SearchProvider>
                <PictureProvider>
                    <TagProvider>
                        <SearchBar />
                        <UploadSection />
                        <PictureGallery />
                    </TagProvider>
                </PictureProvider>
        </SearchProvider>
    )
}

export default PictureManagePage