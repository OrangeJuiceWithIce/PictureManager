import PictureGallery from "../../components/PictureManage/PictureGallery";
import UploadSection from "../../components/PictureManage/UploadSection";
import SearchBar from "../../components/Search/SearchBar";
import { PictureProvider } from "../../contexts/PictureContext";
import { SearchProvider } from "../../contexts/SearchContext";
import { TagProvider } from "../../contexts/TagContext";
import"./PictureManage.css"

function PictureManagePage(){
    return(
        <SearchProvider>
                <PictureProvider>
                    <TagProvider>
                        <div className="container">
                            <SearchBar />
                            <UploadSection />
                            <PictureGallery />
                        </div>
                    </TagProvider>
                </PictureProvider>
        </SearchProvider>
    )
}

export default PictureManagePage