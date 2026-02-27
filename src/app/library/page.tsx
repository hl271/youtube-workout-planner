"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { VideoCard } from "@/components/video-card";
import { Button } from "@/components/ui/button";
import { useWorkoutStore } from "@/store/workoutStore";
import { WorkoutType, BodyPart } from "@/types";
import { WORKOUT_TYPES, BODY_PARTS, DURATION_RANGES, LIBRARY_BATCH_SIZE } from "@/constants";
import { XCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { VideoSkeleton } from "@/components/video-skeleton";

const AddVideoDialog = dynamic(() => import("@/components/add-video-dialog").then((mod) => mod.AddVideoDialog), {
    ssr: false,
    loading: () => <Button variant="outline" disabled>Loading...</Button>,
});

const WORKOUT_TYPES_WITH_ALL: (WorkoutType | "All")[] = ["All", ...WORKOUT_TYPES];
const BODY_PARTS_WITH_ALL: (BodyPart | "All")[] = ["All", ...BODY_PARTS];

export default function LibraryPage() {
    const videos = useWorkoutStore((state) => state.videos);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<(WorkoutType | "All")>("All");
    const [bodyPartFilter, setBodyPartFilter] = useState<(BodyPart | "All")>("All");
    const [durationFilter, setDurationFilter] = useState<string>("All");
    const [channelFilter, setChannelFilter] = useState<string>("All");

    // Pagination State
    const [visibleCount, setVisibleCount] = useState(LIBRARY_BATCH_SIZE);
    const observerTarget = useRef<HTMLDivElement>(null);

    const channels = useMemo(() => {
        const uniqueChannels = Array.from(new Set(videos.map(v => v.channelName)));
        return ["All", ...uniqueChannels.sort()];
    }, [videos]);

    const hasActiveFilters = search !== "" || typeFilter !== "All" || bodyPartFilter !== "All" || durationFilter !== "All" || channelFilter !== "All";

    const clearFilters = () => {
        setSearch("");
        setTypeFilter("All");
        setBodyPartFilter("All");
        setDurationFilter("All");
        setChannelFilter("All");
    };

    // Reset pagination when filters change
    useEffect(() => {
        setVisibleCount(LIBRARY_BATCH_SIZE);
    }, [search, typeFilter, bodyPartFilter, durationFilter, channelFilter, videos]);

    const filteredVideos = useMemo(() => {
        return videos.filter((video) => {
            const matchesSearch = video.title.toLowerCase().includes(search.toLowerCase()) ||
                video.channelName.toLowerCase().includes(search.toLowerCase());
            const matchesType = typeFilter === "All" || video.types?.includes(typeFilter as WorkoutType);
            const matchesBodyPart = bodyPartFilter === "All" || video.bodyPart?.includes(bodyPartFilter as BodyPart);

            let matchesDuration = true;
            if (durationFilter !== "All") {
                if (durationFilter === "under15") matchesDuration = video.duration < 15;
                else if (durationFilter === "15-30") matchesDuration = video.duration >= 15 && video.duration <= 30;
                else if (durationFilter === "30-45") matchesDuration = video.duration > 30 && video.duration <= 45;
                else if (durationFilter === "over45") matchesDuration = video.duration > 45;
            }

            const matchesChannel = channelFilter === "All" || video.channelName === channelFilter;

            return matchesSearch && matchesType && matchesBodyPart && matchesDuration && matchesChannel;
        });
    }, [videos, search, typeFilter, bodyPartFilter, durationFilter, channelFilter]);

    // Infinite Scroll Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                if (entries[0].isIntersecting && visibleCount < filteredVideos.length) {
                    // Small delay to simulate "loading" and show skeletons
                    setTimeout(() => {
                        setVisibleCount((prev) => prev + LIBRARY_BATCH_SIZE);
                    }, 300);
                }
            },
            { threshold: 1.0, rootMargin: '100px' }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [visibleCount, filteredVideos.length]);

    const displayedVideos = filteredVideos.slice(0, visibleCount);
    const hasMore = visibleCount < filteredVideos.length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Workout Library</h1>
                    <p className="text-muted-foreground">
                        Manage and organize your saved workout videos.
                    </p>
                </div>
                <AddVideoDialog />
            </div>

            <div className="bg-card border rounded-xl p-4 space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search workouts or channels..."
                            className="pl-9 h-11 bg-background"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as WorkoutType | "All")}>
                            <SelectTrigger className="w-[140px] h-9 text-xs">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {WORKOUT_TYPES_WITH_ALL.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Select value={bodyPartFilter} onValueChange={(v) => setBodyPartFilter(v as BodyPart | "All")}>
                            <SelectTrigger className="w-[140px] h-9 text-xs">
                                <SelectValue placeholder="Body Part" />
                            </SelectTrigger>
                            <SelectContent>
                                {BODY_PARTS_WITH_ALL.map((bp) => (
                                    <SelectItem key={bp} value={bp}>
                                        {bp}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Select value={durationFilter} onValueChange={setDurationFilter}>
                            <SelectTrigger className="w-[140px] h-9 text-xs">
                                <SelectValue placeholder="Duration" />
                            </SelectTrigger>
                            <SelectContent>
                                {DURATION_RANGES.map((d) => (
                                    <SelectItem key={d.value} value={d.value}>
                                        {d.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Select value={channelFilter} onValueChange={setChannelFilter}>
                            <SelectTrigger className="w-[140px] h-9 text-xs">
                                <SelectValue placeholder="Channel" />
                            </SelectTrigger>
                            <SelectContent>
                                {channels.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-9 px-3 text-xs gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <XCircle className="h-3.5 w-3.5" />
                            Clear All
                        </Button>
                    )}
                </div>
            </div>

            {displayedVideos.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {displayedVideos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                        {/* Dynamic Skeletons for the next batch if there are more */}
                        {hasMore && [1, 2, 3, 4].map((i) => (
                            <VideoSkeleton key={`skeleton-${i}`} />
                        ))}
                    </div>
                    {/* Invisible trigger element */}
                    <div ref={observerTarget} className="h-10 w-full" />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 rounded-full bg-muted p-6">
                        <Search className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">No workouts found</h3>
                    <p className="mx-auto max-w-xs text-muted-foreground">
                        {search || typeFilter !== "All"
                            ? "Try adjusting your filters or search terms."
                            : "Start by adding your favorite YouTube workout videos."}
                    </p>
                </div>
            )}
        </div>
    );
}
