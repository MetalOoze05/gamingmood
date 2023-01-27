import axios from "axios";

export const getSpotifyTrack = async (query: string, access_token: any) => {    
    const spotifyData = await axios.get(`https://api.spotify.com/v1/search?type=track,artist&limit=1&q=${query}`, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    });

    return {
        artist: {
            items: spotifyData.data.artists.items[0]
        },
        tracks: {
            items: spotifyData.data.tracks.items[0]
        }
    }
}