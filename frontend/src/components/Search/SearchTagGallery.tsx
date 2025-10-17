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
                <span key={index} >
                    #{tag}
                    <button onClick={()=>handleDelete(tag)}>
                        x
                    </button>
                </span>
            ))}
        </div>
    )
}

export default SearchTagGallery