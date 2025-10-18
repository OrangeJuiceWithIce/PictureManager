import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import type { Picture } from "../types/picture";

interface WorldSearchParams {
    time: string;
    offset: number;
    limit: number;
    selectedTags: string[];
}

interface WorldContextType {
    pictures: Picture[];
    loading: boolean;
    searchParams: WorldSearchParams;
    setSearchParams: (params: Partial<WorldSearchParams>) => void;
    fetchPublicPictures: (params?: Partial<WorldSearchParams>) => Promise<void>;
}

const WorldContext = createContext<WorldContextType | undefined>(undefined);

export const WorldProvider = ({ children }: { children: React.ReactNode }) => {
    const [pictures, setPictures] = useState<Picture[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParamsState] = useState<WorldSearchParams>({
        time: "all",
        offset: 0,
        limit: 20,
        selectedTags: [],
    });
    const { token } = useAuth();

    const fetchPublicPictures = async (params?: Partial<WorldSearchParams>) => {
        const finalParams = { ...searchParams, ...params };
        setLoading(true);
        try {
            const res = await fetch("/api/getpublicpict", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(finalParams),
            });
            const data = await res.json();
            if (data.success) {
                setPictures(data.pictures || []);
            } else {
                alert("获取公开图片失败");
            }
        } catch (error) {
            console.error("获取公开图片失败:", error);
            alert("获取公开图片失败");
        } finally {
            setLoading(false);
        }
    };

    const setSearchParams = (params: Partial<WorldSearchParams>) => {
        setSearchParamsState((prev) => ({
            ...prev,
            ...params,
        }));
    };

    useEffect(() => {
        fetchPublicPictures();
    }, [searchParams]);

    const value: WorldContextType = {
        pictures,
        loading,
        searchParams,
        setSearchParams,
        fetchPublicPictures,
    };

    return (
        <WorldContext.Provider value={value}>
            {children}
        </WorldContext.Provider>
    );
};

export const useWorld = () => {
    const context = useContext(WorldContext);
    if (context === undefined) {
        throw new Error("useWorld should be used within a WorldProvider");
    }
    return context;
};

