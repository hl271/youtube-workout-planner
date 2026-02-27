"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WorkoutType, Equipment, BodyPart, WorkoutVideo } from "@/types";
import { getYouTubeMetadata } from "@/app/actions/youtube";
import { useToast } from "@/hooks/use-toast";
import { WORKOUT_TYPES, EQUIPMENT_OPTIONS, BODY_PARTS as BODY_PART_OPTIONS } from "@/constants";

interface VideoFormProps {
    initialData?: Partial<WorkoutVideo>;
    onSubmit: (videoData: Omit<WorkoutVideo, "id" | "completedDates" | "createdAt">) => Promise<void>;
    submitLabel: string;
    loading?: boolean;
    isEdit?: boolean;
}

export function VideoForm({ initialData, onSubmit, submitLabel, loading, isEdit }: VideoFormProps) {
    const [fetching, setFetching] = useState(false);
    const [url, setUrl] = useState(initialData?.youtubeId ? `https://www.youtube.com/watch?v=${initialData.youtubeId}` : "");
    const [title, setTitle] = useState(initialData?.title || "");
    const [duration, setDuration] = useState(initialData?.duration?.toString() || "");
    const [channelName, setChannelName] = useState(initialData?.channelName || "");
    const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || "");
    const [selectedTypes, setSelectedTypes] = useState<WorkoutType[]>(initialData?.types || ["Strength"]);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>(initialData?.equipment || ["None"]);
    const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPart[]>(initialData?.bodyPart || ["Full Body"]);

    const { toast } = useToast();

    const extractYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleFetchMetadata = async (videoUrl: string) => {
        const youtubeId = extractYoutubeId(videoUrl);
        if (!youtubeId || isEdit) return;

        setFetching(true);
        try {
            const data = await getYouTubeMetadata(youtubeId);
            if (data.error) {
                setTitle(title || `Workout ${youtubeId}`);
                setThumbnailUrl(`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`);
                setChannelName("YouTube Channel");
            } else {
                setTitle(data.title || "");
                setDuration(data.duration?.toString() || "");
                setChannelName(data.channelName || "");
                setThumbnailUrl(data.thumbnailUrl || "");
                toast({
                    title: "Metadata Fetched",
                    description: "Video details automatically populated.",
                });
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setFetching(false);
        }
    };

    const toggleTag = <T,>(selected: T[], setSelected: (val: T[]) => void, tag: T) => {
        if (selected.includes(tag)) {
            setSelected(selected.filter((t) => t !== tag));
        } else {
            setSelected([...selected, tag]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const youtubeId = extractYoutubeId(url);
        if (!youtubeId) {
            toast({
                title: "Invalid URL",
                description: "Please provide a valid YouTube video URL.",
                variant: "destructive",
            });
            return;
        }

        if (!duration || isNaN(Number(duration))) {
            toast({
                title: "Invalid Duration",
                description: "Please provide a valid duration in minutes.",
                variant: "destructive",
            });
            return;
        }

        await onSubmit({
            youtubeId,
            title: title || `Workout ${youtubeId}`,
            duration: Number(duration),
            channelName: channelName || "YouTube Channel",
            types: selectedTypes,
            equipment: selectedEquipment,
            bodyPart: selectedBodyParts,
            thumbnailUrl: thumbnailUrl || `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {!isEdit && (
                <div className="space-y-2">
                    <Label htmlFor="url">YouTube URL</Label>
                    <Input
                        id="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            if (extractYoutubeId(e.target.value)) {
                                handleFetchMetadata(e.target.value);
                            }
                        }}
                        disabled={loading}
                        required
                    />
                    {fetching && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Fetching video details...
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="title">Video Title</Label>
                <Input
                    id="title"
                    placeholder="Workout Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="duration">Duration (mins)</Label>
                <Input
                    id="duration"
                    type="number"
                    placeholder="20"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    disabled={loading}
                    required
                />
            </div>

            <div className="space-y-4 pt-2">
                <div className="space-y-3">
                    <Label>Workout Types</Label>
                    <div className="flex flex-wrap gap-2">
                        {WORKOUT_TYPES.map((t) => (
                            <Badge
                                key={t}
                                variant={selectedTypes.includes(t) ? "default" : "outline"}
                                className={cn(
                                    "cursor-pointer hover:bg-primary/90 transition-colors py-1.5 px-3",
                                    !selectedTypes.includes(t) && "text-muted-foreground hover:text-foreground"
                                )}
                                onClick={() => !loading && toggleTag(selectedTypes, setSelectedTypes, t)}
                            >
                                {t}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <Label>Body Parts</Label>
                    <div className="flex flex-wrap gap-2">
                        {BODY_PART_OPTIONS.map((bp) => (
                            <Badge
                                key={bp}
                                variant={selectedBodyParts.includes(bp) ? "default" : "outline"}
                                className={cn(
                                    "cursor-pointer hover:bg-primary/90 transition-colors py-1.5 px-3",
                                    !selectedBodyParts.includes(bp) && "text-muted-foreground hover:text-foreground"
                                )}
                                onClick={() => !loading && toggleTag(selectedBodyParts, setSelectedBodyParts, bp)}
                            >
                                {bp}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <Label>Equipment</Label>
                    <div className="flex flex-wrap gap-2">
                        {EQUIPMENT_OPTIONS.map((e) => (
                            <Badge
                                key={e}
                                variant={selectedEquipment.includes(e) ? "default" : "outline"}
                                className={cn(
                                    "cursor-pointer hover:bg-primary/90 transition-colors py-1.5 px-3",
                                    !selectedEquipment.includes(e) && "text-muted-foreground hover:text-foreground"
                                )}
                                onClick={() => !loading && toggleTag(selectedEquipment, setSelectedEquipment, e)}
                            >
                                {e}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
