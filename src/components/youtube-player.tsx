"use client";

import { cn } from "@/lib/utils";

interface YouTubePlayerProps {
    videoId: string;
    className?: string;
}

export function YouTubePlayer({ videoId, className }: YouTubePlayerProps) {
    return (
        <div className={cn("relative aspect-video w-full overflow-hidden rounded-lg border bg-muted", className)}>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
            />
        </div>
    );
}
