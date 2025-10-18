import { useWorld } from "../../contexts/WorldContext"
import CommonSearchBar from "./CommonSearchBar"

function WorldSearchBar(){
    const {searchParams, setSearchParams, fetchPublicPictures} = useWorld();

    return (
        <CommonSearchBar
            timeValue={searchParams.time}
            onTimeChange={(time) => setSearchParams({time})}
            showPublicFilter={false}
            selectedTags={searchParams.selectedTags}
            onTagsChange={(tags) => setSearchParams({selectedTags: tags})}
            onSearch={() => fetchPublicPictures()}
        />
    )
}

export default WorldSearchBar

