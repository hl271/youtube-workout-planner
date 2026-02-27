"use client";

import { Play, CalendarPlus, Trash2, User, Pencil } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkoutVideo } from "@/types";
import { useWorkoutStore } from "@/store/workoutStore";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import { memo } from "react";

const EditVideoDialog = dynamic(() => import("./edit-video-dialog").then((mod) => mod.EditVideoDialog), {
    ssr: false,
});

interface VideoCardProps {
    video: WorkoutVideo;
}

export const VideoCard = memo(function VideoCard({ video }: VideoCardProps) {
    const removeVideo = useWorkoutStore((state) => state.removeVideo);
    const scheduleWorkout = useWorkoutStore((state) => state.scheduleWorkout);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const { toast } = useToast();

    const handleSchedule = () => {
        if (selectedDate) {
            const dateString = format(selectedDate, "yyyy-MM-dd");
            scheduleWorkout(dateString, video.id);
            toast({
                title: "Workout Scheduled",
                description: `Scheduled for ${format(selectedDate, "PPP")}.`,
            });
            setIsScheduleOpen(false);
        }
    };

    return (
        <Card className="overflow-hidden group">
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    loading="lazy"
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <Play className="h-6 w-6 fill-current" />
                    </Button>
                </div>
                <Badge className="absolute bottom-2 right-2" variant="secondary">
                    {video.duration} min
                </Badge>
            </div>
            <CardHeader className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle className="text-lg line-clamp-1">{video.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                            <User className="h-3 w-3 mr-1" />
                            {video.channelName}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 pb-2 space-y-2">
                <div className="flex flex-wrap gap-2">
                    {video.types?.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs border-primary/30">
                            {type}
                        </Badge>
                    ))}
                    {video.bodyPart?.map((bp) => (
                        <Badge key={bp} variant="secondary" className="text-xs bg-primary/70 border-none">
                            {bp}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-2 border-t flex justify-between gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => setIsScheduleOpen(true)}
                >
                    <CalendarPlus className="h-4 w-4" />
                    Schedule
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsEditOpen(true)}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeVideo(video.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>

            <EditVideoDialog
                video={video}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />

            <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Schedule Workout</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center py-4">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSchedule}>Confirm Schedule</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
});
