"use client";

import { useState, useMemo } from "react";
import { format, addDays, isSameDay } from "date-fns";
import {
    Calendar as CalendarIcon,
    X,
    ChevronLeft,
    Sparkles,
    Check
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useWorkoutStore } from "@/store/workoutStore";
import { WorkoutType, Equipment, BodyPart, WorkoutVideo } from "@/types";
import { cn } from "@/lib/utils";
import { WORKOUT_TYPES, BODY_PARTS as BODY_PART_OPTIONS } from "@/constants";

interface RandomSchedulerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentWeekStart: Date;
}

interface DayConfig {
    date: Date;
    workoutTypes: WorkoutType[];
    bodyParts: BodyPart[];
    equipment: Equipment[];
    minDuration: string;
    maxDuration: string;
    selectedVideoId?: string;
}

export function RandomSchedulerDialog({ open, onOpenChange, currentWeekStart }: RandomSchedulerDialogProps) {
    const { videos, batchScheduleWorkouts } = useWorkoutStore();
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedDays, setSelectedDays] = useState<Date[]>([]);
    const [dayConfigs, setDayConfigs] = useState<Record<string, DayConfig>>({});
    const [generatedPlan, setGeneratedPlan] = useState<Record<string, WorkoutVideo | null>>({});

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
    }, [currentWeekStart]);

    const toggleDay = (day: Date) => {
        const dateStr = format(day, "yyyy-MM-dd");
        if (selectedDays.some(d => isSameDay(d, day))) {
            setSelectedDays(selectedDays.filter(d => !isSameDay(d, day)));
            const newConfigs = { ...dayConfigs };
            delete newConfigs[dateStr];
            setDayConfigs(newConfigs);
        } else {
            setSelectedDays([...selectedDays, day]);
            setDayConfigs({
                ...dayConfigs,
                [dateStr]: {
                    date: day,
                    workoutTypes: [],
                    bodyParts: [],
                    equipment: [],
                    minDuration: "",
                    maxDuration: "",
                }
            });
        }
    };

    const updateConfig = (dateStr: string, field: keyof DayConfig, value: DayConfig[keyof DayConfig]) => {
        setDayConfigs(prev => ({
            ...prev,
            [dateStr]: {
                ...prev[dateStr],
                [field]: value
            }
        }));
    };

    const toggleFilter = <T,>(dateStr: string, field: 'workoutTypes' | 'bodyParts' | 'equipment', value: T) => {
        const config = dayConfigs[dateStr];
        const currentValues = config[field] as T[];
        if (currentValues.includes(value)) {
            const newValue = currentValues.filter(v => v !== value);
            updateConfig(dateStr, field, newValue as DayConfig[keyof DayConfig]);
        } else {
            const newValue = [...currentValues, value];
            updateConfig(dateStr, field, newValue as DayConfig[keyof DayConfig]);
        }
    };

    const generateRandomPlan = () => {
        const plan: Record<string, WorkoutVideo | null> = {};

        selectedDays.forEach(day => {
            const dateStr = format(day, "yyyy-MM-dd");
            const config = dayConfigs[dateStr];

            let filteredVideos = videos;

            if (config.workoutTypes.length > 0) {
                filteredVideos = filteredVideos.filter(v =>
                    v.types.some(t => config.workoutTypes.includes(t))
                );
            }

            if (config.bodyParts.length > 0) {
                filteredVideos = filteredVideos.filter(v =>
                    v.bodyPart.some(bp => config.bodyParts.includes(bp))
                );
            }

            if (config.equipment.length > 0) {
                filteredVideos = filteredVideos.filter(v =>
                    v.equipment.some(e => config.equipment.includes(e))
                );
            }

            const minDur = config.minDuration ? Number(config.minDuration) : null;
            const maxDur = config.maxDuration ? Number(config.maxDuration) : null;
            if (minDur !== null && !isNaN(minDur)) {
                filteredVideos = filteredVideos.filter(v => v.duration >= minDur);
            }
            if (maxDur !== null && !isNaN(maxDur)) {
                filteredVideos = filteredVideos.filter(v => v.duration <= maxDur);
            }

            if (filteredVideos.length > 0) {
                const randomIndex = Math.floor(Math.random() * filteredVideos.length);
                plan[dateStr] = filteredVideos[randomIndex];
            } else {
                plan[dateStr] = null;
            }
        });

        setGeneratedPlan(plan);
        setStep(2);
    };

    const handleSchedule = () => {
        const entries = Object.entries(generatedPlan)
            .filter(([, video]) => video !== null)
            .map(([date, video]) => ({
                date,
                videoId: video!.id
            }));

        batchScheduleWorkouts(entries);
        onOpenChange(false);
        setStep(1);
        setSelectedDays([]);
        setDayConfigs({});
        setGeneratedPlan({});
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-primary/20">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        Random Workout Scheduler
                    </DialogTitle>
                    <DialogDescription>
                        {step === 1
                            ? "Select your workout days and customize your preferences for each."
                            : "Review your randomized plan and confirm to add it to your calendar."}
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-hidden">
                    {step === 1 ? (
                        <div>
                            <div className="px-6 py-4 bg-muted/30">
                                <Label className="text-sm font-semibold mb-3 block">1. Choose Workout Days</Label>
                                <div className="grid grid-cols-7 gap-2">
                                    {weekDays.map((day) => {
                                        const isSelected = selectedDays.some(d => isSameDay(d, day));
                                        return (
                                            <Button
                                                key={day.toString()}
                                                variant={isSelected ? "default" : "outline"}
                                                className={cn(
                                                    "h-14 flex flex-col p-1 transition-all",
                                                    isSelected ? "ring-2 ring-primary ring-offset-2" : "opacity-60 hover:opacity-100"
                                                )}
                                                onClick={() => toggleDay(day)}
                                            >
                                                <span className="text-[10px] uppercase font-bold">{format(day, "EEE")}</span>
                                                <span className="text-lg font-black">{format(day, "d")}</span>
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>

                            <Separator />

                            <div className="overflow-y-auto max-h-[40vh] px-6">
                                <div className="space-y-8 py-6">
                                    {selectedDays.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                                            <CalendarIcon className="h-12 w-12 mb-4" />
                                            <p className="text-sm">Select one or more days above to configure your workouts</p>
                                        </div>
                                    ) : (
                                        selectedDays
                                            .sort((a, b) => a.getTime() - b.getTime())
                                            .map((day) => {
                                                const dateStr = format(day, "yyyy-MM-dd");
                                                const config = dayConfigs[dateStr];
                                                if (!config) return null;

                                                return (
                                                    <div key={dateStr} className="space-y-4 p-4 rounded-xl border border-primary/10 bg-primary/5">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="font-bold text-primary flex items-center gap-2">
                                                                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">
                                                                    {format(day, "d")}
                                                                </span>
                                                                {format(day, "EEEE, MMMM do")}
                                                            </h3>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => toggleDay(day)}
                                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div>
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-1.5 block">Workout Types</Label>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {WORKOUT_TYPES.map(type => (
                                                                        <Badge
                                                                            key={type}
                                                                            variant={config.workoutTypes.includes(type) ? "default" : "outline"}
                                                                            className="cursor-pointer transition-all hover:scale-105 active:scale-95"
                                                                            onClick={() => toggleFilter(dateStr, 'workoutTypes', type)}
                                                                        >
                                                                            {type}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-1.5 block">Body Parts</Label>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {BODY_PART_OPTIONS.map(part => (
                                                                        <Badge
                                                                            key={part}
                                                                            variant={config.bodyParts.includes(part) ? "secondary" : "outline"}
                                                                            className={cn(
                                                                                "cursor-pointer transition-all hover:scale-105 active:scale-95",
                                                                                config.bodyParts.includes(part) ? "bg-primary/70 text-white" : ""
                                                                            )}
                                                                            onClick={() => toggleFilter(dateStr, 'bodyParts', part)}
                                                                        >
                                                                            {part}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-1.5 block">Duration (mins)</Label>
                                                                <div className="flex items-center gap-2">
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="Min"
                                                                        value={config.minDuration}
                                                                        onChange={(e) => updateConfig(dateStr, 'minDuration', e.target.value)}
                                                                        className="h-8 w-24 text-sm"
                                                                    />
                                                                    <span className="text-xs text-muted-foreground">to</span>
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="Max"
                                                                        value={config.maxDuration}
                                                                        onChange={(e) => updateConfig(dateStr, 'maxDuration', e.target.value)}
                                                                        className="h-8 w-24 text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-y-auto max-h-[50vh] px-6">
                            <div className="py-6 space-y-4">
                                {selectedDays
                                    .sort((a, b) => a.getTime() - b.getTime())
                                    .map(day => {
                                        const dateStr = format(day, "yyyy-MM-dd");
                                        const video = generatedPlan[dateStr];

                                        return (
                                            <div key={dateStr} className="flex gap-4 p-4 rounded-xl border bg-card shadow-sm group">
                                                <div className="w-16 flex flex-col items-center justify-center border-r pr-4 border-muted">
                                                    <span className="text-xs font-bold text-muted-foreground uppercase">{format(day, "EEE")}</span>
                                                    <span className="text-2xl font-black">{format(day, "d")}</span>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    {video ? (
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-medium text-primary mb-1">Generated Workout</p>
                                                                <h4 className="font-bold truncate leading-tight">{video.title}</h4>
                                                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                                                    <span>{video.channelName}</span>
                                                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                                    <span>{video.duration}m</span>
                                                                </p>
                                                            </div>
                                                            <div className="w-20 aspect-video rounded overflow-hidden flex-shrink-0 border">
                                                                <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-destructive py-2">
                                                            <p className="text-sm font-medium flex items-center gap-2">
                                                                <X className="h-4 w-4" />
                                                                No matching workouts found
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 pt-2 border-t bg-muted/10">
                    {step === 1 ? (
                        <div className="flex w-full justify-between items-center gap-4">
                            <Button variant="ghost" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={generateRandomPlan}
                                disabled={selectedDays.length === 0}
                                className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                            >
                                Generate Random Plan
                                <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex w-full justify-between items-center gap-4">
                            <Button variant="ghost" onClick={() => setStep(1)} className="flex items-center gap-2">
                                <ChevronLeft className="h-4 w-4" />
                                Back to Filters
                            </Button>
                            <Button
                                onClick={handleSchedule}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Confirm & Schedule
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
