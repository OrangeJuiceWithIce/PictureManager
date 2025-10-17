import { useState } from "react"
import { usePicture } from "../../contexts/PictureContext"
import { useSearch } from "../../contexts/SearchContext"
import SearchTagGallery from "./SearchTagGallery"

function SearchBar(){
    const {searchParams,setSearchParams}=useSearch()
    const [tagInput,setTagInput]=useState("")
    const {fetchPictures}=usePicture()

    const selectedTags=searchParams.selectedTags

    return(
        <div>
            <select 
                value={searchParams.time}
                onChange={(e)=>setSearchParams({time:e.target.value})}
            >
                <option value="all">all</option>
                <option value="today">today</option>
                <option value="week">recent week</option>
                <option value="month">recent month</option>
                <option value="year">recent year</option>
            </select>
            <input 
                type="text"
                onChange={(e)=>setTagInput(e.target.value)}
                placeholder="输入标签名"
            >
            </input>
            <button 
                onClick={()=>setSearchParams({selectedTags:[...selectedTags,tagInput]})}
            >
                +
            </button>
            <SearchTagGallery />
            <button
                onClick={()=>fetchPictures(searchParams)}
            >
                search
            </button>
        </div>
    )
}

export default SearchBar