import React, { createContext, useContext, useState } from "react";

export interface SearchParams{
    time:string,
    public:string,
    selectedTags:string[],
}

interface SearchContextType{
    searchParams:SearchParams,
    setSearchParams:(params:Partial<SearchParams>)=>void,
}

const SearchContext=createContext<SearchContextType|undefined>(undefined)

export const SearchProvider=({children}:{children:React.ReactNode})=>{
    const [searchParams,setSearchParamsState]=useState<SearchParams>({
        time:"all",
        public:"all",
        selectedTags:[],
    })

    const setSearchParams=(params:Partial<SearchParams>)=>{
        setSearchParamsState((prev)=>({
            ...prev,
            ...params,
        }))
    }

    const value:SearchContextType={
        searchParams,
        setSearchParams,
    }

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearch=()=>{
    const context=useContext(SearchContext)
    if(context===undefined){
        throw new Error("useSearch should be used within a SearchProvider")
    }
    return context
}