"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { WorkoutVideo } from "@/types";
import { useWorkoutStore } from "@/store/workoutStore";
import { VideoForm } from "./video-form";
import { useToast } from "@/hooks/use-toast";

interface EditVideoDialogProps {
    video: WorkoutVideo;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditVideoDialog({ video, open, onOpenChange }: EditVideoDialogProps) {
    const [loading, setLoading] = useState(false);
    const { updateVideo } = useWorkoutStore();
    const { toast } = useToast();

    const handleUpdate = async (videoData: Omit<WorkoutVideo, "id" | "completedDates" | "createdAt">) => {
        setLoading(true);
        try {
            updateVideo({
                ...video,
                ...videoData,
            });
            toast({
                title: "Video Updated",
                description: "The video details have been successfully updated.",
            });
            onOpenChange(false);
        } catch {
            toast({
                title: "Error",
                description: "Failed to update video. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Workout Video</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <VideoForm
                        initialData={video}
                        onSubmit={handleUpdate}
                        submitLabel="Update Video"
                        loading={loading}
                        isEdit={true}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
