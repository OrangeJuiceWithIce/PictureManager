import { useState, useRef, useEffect } from "react"
import { usePicture } from "../../contexts/PictureContext"
import { useSearch } from "../../contexts/SearchContext"
import SearchTagGallery from "./SearchTagGallery"
import "./SearchBar.css"

function SearchBar(){
    const {searchParams,setSearchParams}=useSearch()
    const [tagInput,setTagInput]=useState("")
    const {fetchPictures}=usePicture()
    const inputRef = useRef<HTMLInputElement>(null)

    const selectedTags=searchParams.selectedTags

    // 动态调整input宽度
    useEffect(() => {
        if (inputRef.current) {
            const input = inputRef.current
            const tempSpan = document.createElement('span')
            tempSpan.style.visibility = 'hidden'
            tempSpan.style.position = 'absolute'
            tempSpan.style.fontSize = window.getComputedStyle(input).fontSize
            tempSpan.style.fontFamily = window.getComputedStyle(input).fontFamily
            tempSpan.textContent = tagInput || input.placeholder
            document.body.appendChild(tempSpan)
            
            const textWidth = tempSpan.offsetWidth
            document.body.removeChild(tempSpan)
            
            const minWidth = 60
            const maxWidth = 120
            const newWidth = Math.min(Math.max(textWidth + 20, minWidth), maxWidth)
            input.style.width = `${newWidth}px`
        }
    }, [tagInput])

    const handleAddTag = () => {
        if (tagInput.trim()) {
            setSearchParams({selectedTags:[...selectedTags,tagInput.trim()]})
            setTagInput("")
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddTag()
        }
    }

    return(
        <div className="search-bar-wrapper">
            <div className="search-bar-container">
                <select 
                    className="time-filter"
                    value={searchParams.time}
                    onChange={(e)=>setSearchParams({time:e.target.value})}
                >
                    <option value="all">全部</option>
                    <option value="today">今天</option>
                    <option value="week">本周</option>
                    <option value="month">本月</option>
                    <option value="year">今年</option>
                </select>
                
                <div className="search-input-area">
                    <SearchTagGallery />
                    
                    <div className="tag-input-group">
                        <input 
                            ref={inputRef}
                            type="text"
                            className="tag-input"
                            value={tagInput}
                            placeholder="添加标签..."
                            onChange={(e)=>setTagInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            className="add-tag-btn"
                            onClick={handleAddTag}
                            title="添加标签"
                        >
                            +
                        </button>
                    </div>
                </div>

                <button
                    className="search-btn"
                    onClick={()=>fetchPictures(searchParams)}
                    title="搜索"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default SearchBar