import axios from "axios";

export const getSpotifyTrack = async (query: string, access_token: any) => {    
    const spotifyData = await axios.get(`https://api.spotify.com/v1/search?type=track&limit=1&q=${query}`, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    });

    return {
        artist: {
            items: spotifyData.data.tracks.items[0].album.artists[0].external_urls
        },
        tracks: {
            items: spotifyData.data.tracks.items[0]
        }
    }
}