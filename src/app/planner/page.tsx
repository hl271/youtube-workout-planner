"use client";

import { useMemo, useState } from "react";
import {
    addDays,
    format,
    startOfWeek,
    isSameDay
} from "date-fns";
import {
    CheckCircle2,
    Circle,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Clock,
    Play
} from "lucide-react";
import { useWorkoutStore } from "@/store/workoutStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RandomSchedulerDialog } from "@/components/random-scheduler-dialog";
import { Wand2 } from "lucide-react";

export default function PlannerPage() {
    const schedule = useWorkoutStore((state) => state.schedule);
    const videos = useWorkoutStore((state) => state.videos);
    const toggleComplete = useWorkoutStore((state) => state.toggleComplete);
    const removeFromSchedule = useWorkoutStore((state) => state.removeFromSchedule);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

    const weekDays = useMemo(() => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }, [currentDate]);

    const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
    const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
    const goToToday = () => setCurrentDate(new Date());

    const getWorkoutsForDay = (date: Date) => {
        const dateString = format(date, "yyyy-MM-dd");
        return schedule
            .filter((s) => s.date === dateString)
            .map((s) => ({
                ...s,
                video: videos.find((v) => v.id === s.videoId),
            }))
            .filter((s) => s.video); // Filter out any entries where video might have been deleted
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Workout Planner</h1>
                    <p className="text-muted-foreground">
                        Schedule your workouts and track your consistency.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevWeek}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={goToToday}>
                        {format(currentDate, "MMM yyyy")}
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextWeek}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="default"
                        className="gap-2 ml-2"
                        onClick={() => setIsSchedulerOpen(true)}
                    >
                        <Wand2 className="h-4 w-4" />
                        Random Scheduler
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                    {format(weekDays[0], "MMMM d")} - {format(weekDays[6], "MMMM d, yyyy")}
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                {weekDays.map((day) => {
                    const workouts = getWorkoutsForDay(day);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div key={day.toString()} className="flex flex-col gap-2">
                            <div className={cn(
                                "flex flex-col items-center justify-center rounded-t-lg p-2 border-x border-t",
                                isToday ? "bg-primary text-primary-foreground" : "bg-muted/50"
                            )}>
                                <span className="text-xs font-medium uppercase opacity-80">
                                    {format(day, "EEE")}
                                </span>
                                <span className="text-lg font-bold">
                                    {format(day, "d")}
                                </span>
                            </div>
                            <div className={cn(
                                "flex flex-1 flex-col gap-3 rounded-b-lg border p-3 min-h-[300px]",
                                isToday && "border-primary/50 bg-primary/5"
                            )}>
                                {workouts.length > 0 ? (
                                    workouts.map((item) => (
                                        <Card key={item.id} className="overflow-hidden border-muted">
                                            <div className="relative aspect-video">
                                                <img
                                                    src={item.video?.thumbnailUrl}
                                                    alt={item.video?.title}
                                                    className="object-cover w-full h-full grayscale-[0.5] opacity-80"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Play className="h-5 w-5 text-white drop-shadow-md" />
                                                </div>
                                                {item.isCompleted && (
                                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                                                        <CheckCircle2 className="h-10 w-10 text-primary fill-background animate-in zoom-in-50 duration-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <CardContent className="p-2 space-y-2">
                                                <h4 className="text-xs font-semibold line-clamp-2 leading-tight">
                                                    {item.video?.title}
                                                </h4>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center text-[10px] text-muted-foreground">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        {item.video?.duration}m
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 justify-end">
                                                        {item.video?.types?.slice(0, 2).map((type) => (
                                                            <Badge key={type} variant="outline" className="text-[10px] px-1 h-4 whitespace-nowrap">
                                                                {type}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-1 gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => toggleComplete(item.id)}
                                                    >
                                                        {item.isCompleted ? (
                                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                                        ) : (
                                                            <Circle className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                        onClick={() => removeFromSchedule(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-muted p-4 text-center">
                                        <p className="text-[10px] text-muted-foreground">Rest Day</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <RandomSchedulerDialog
                open={isSchedulerOpen}
                onOpenChange={setIsSchedulerOpen}
                currentWeekStart={weekDays[0]}
            />
        </div>
    );
}
