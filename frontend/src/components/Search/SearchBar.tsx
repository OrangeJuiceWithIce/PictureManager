import { usePicture } from "../../contexts/PictureContext"
import { useSearch } from "../../contexts/SearchContext"
import CommonSearchBar from "./CommonSearchBar"

function SearchBar(){
    const {searchParams, setSearchParams} = useSearch()
    const {fetchPictures} = usePicture()

    return (
        <CommonSearchBar
            timeValue={searchParams.time}
            onTimeChange={(time) => setSearchParams({time})}
            showPublicFilter={true}
            publicValue={searchParams.public}
            onPublicChange={(pub) => setSearchParams({public: pub})}
            selectedTags={searchParams.selectedTags}
            onTagsChange={(tags) => setSearchParams({selectedTags: tags})}
            onSearch={() => fetchPictures(searchParams)}
        />
    )
}

export default SearchBar