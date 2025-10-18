import { useSearch } from "../../contexts/SearchContext"

function SearchTagGallery(){
    const {searchParams,setSearchParams}=useSearch()
    const tags=searchParams.selectedTags

    const handleDelete=(tagToDelete:string)=>{
        const newTags=tags.filter(tag=>tag!==tagToDelete)
        setSearchParams({selectedTags:newTags})
    }
    return(
        <div className="SearchTagGallery">
            {tags?.map((tag,index)=>(
                <div key={index} className="search-tag-item">
                    <span className="search-tag-text">
                        #{tag}
                    </span>
                    <button 
                        className="search-tag-remove"
                        onClick={()=>handleDelete(tag)}
                        title="移除标签"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    )
}

export default SearchTagGallery