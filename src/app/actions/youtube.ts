"use server";

export async function getYouTubeMetadata(videoId: string) {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        console.warn("YOUTUBE_API_KEY is not set in environment variables.");
        return {
            error: "API key missing. Metadata fetching disabled.",
        };
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch from YouTube API");
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            throw new Error("Video not found");
        }

        const item = data.items[0];
        const snippet = item.snippet;
        const contentDetails = item.contentDetails;

        // Convert ISO 8601 duration (e.g., PT15M33S) to minutes
        const durationMatch = contentDetails.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = parseInt(durationMatch[1] || "0");
        const minutes = parseInt(durationMatch[2] || "0");
        const seconds = parseInt(durationMatch[3] || "0");
        const totalMinutes = hours * 60 + minutes + Math.round(seconds / 60);

        return {
            title: snippet.title,
            channelName: snippet.channelTitle,
            thumbnailUrl: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
            duration: totalMinutes || 0,
        };
    } catch (error) {
        console.error("YouTube Metadata Fetch Error:", error);
        return {
            error: "Could not fetch video metadata.",
        };
    }
}
