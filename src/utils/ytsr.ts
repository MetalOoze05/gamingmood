import YouTube from "youtube-sr";

export const getYtSong = async (query: string) => {
    const video = await YouTube.searchOne(query);
    
    return {
        video
    }
}