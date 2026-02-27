"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWorkoutStore } from "@/store/workoutStore";
import { WorkoutVideo } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { VideoForm } from "./video-form";

export function AddVideoDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { addVideo } = useWorkoutStore();
    const { toast } = useToast();

    const handleAdd = async (videoData: Omit<WorkoutVideo, "id" | "completedDates" | "createdAt">) => {
        setLoading(true);
        try {
            const newVideo: WorkoutVideo = {
                id: Math.random().toString(36).substring(7),
                ...videoData,
                createdAt: new Date().toISOString(),
            };

            addVideo(newVideo);
            toast({
                title: "Video Added",
                description: "Successfully added to your library.",
            });
            setOpen(false);
        } catch {
            toast({
                title: "Error",
                description: "Failed to add video. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Workout
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Workout Video</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <VideoForm
                        onSubmit={handleAdd}
                        submitLabel="Save Workout"
                        loading={loading}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
