"use client";

import { useState, useMemo, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  addMonths,
  subMonths,
  eachWeekOfInterval,
  endOfWeek,
  differenceInDays,
  parseISO,
  formatDistanceToNow
} from "date-fns";
import {
  Trophy,
  Flame,
  Calendar as CalendarIcon,
  Play,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useWorkoutStore } from "@/store/workoutStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BACKUP_REMINDER_DAYS } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const YouTubePlayer = dynamic(() => import("@/components/youtube-player").then((mod) => mod.YouTubePlayer), {
  ssr: false,
  loading: () => <div className="aspect-video bg-muted animate-pulse rounded-t-xl" />,
});

const WorkoutBarChart = dynamic(() => import("@/components/dashboard-charts").then((mod) => mod.WorkoutBarChart), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full bg-muted animate-pulse rounded-lg" />,
});

export default function DashboardPage() {
  const schedule = useWorkoutStore((state) => state.schedule);
  const videos = useWorkoutStore((state) => state.videos);
  const toggleComplete = useWorkoutStore((state) => state.toggleComplete);
  const settings = useWorkoutStore((state) => state.settings);
  const { toast } = useToast();
  const router = useRouter();

  const [viewDate, setViewDate] = useState(new Date());

  const handleCheckBackupStatus = () => {
    if (settings.lastExportedAt) {
      const lastExport = parseISO(settings.lastExportedAt);
      const daysSinceExport = differenceInDays(new Date(), lastExport);

      if (daysSinceExport >= BACKUP_REMINDER_DAYS) {
        toast({
          title: "Data Backup Recommended",
          description: `It's been ${daysSinceExport} days since your last local backup. Download your data to keep it safe!`,
          action: (
            <Button variant="outline" size="sm" onClick={() => router.push('/settings')}>
              Backup Now
            </Button>
          ),
        });
      } else {
        toast({
          title: "Data is Up to Date",
          description: `Your last backup was ${formatDistanceToNow(lastExport, { addSuffix: true })}. Your data is currently well-protected.`,
        });
      }
    } else {
      if (videos.length >= 10) {
        toast({
          title: "Protect Your Data",
          description: "You have significant workout data but haven't created a local backup yet. We highly recommend doing so!",
          action: (
            <Button variant="outline" size="sm" onClick={() => router.push('/settings')}>
              Backup Now
            </Button>
          ),
        });
      } else {
        toast({
          title: "No Backups Yet",
          description: "You haven't exported your data yet. Once you have more workouts, we'll suggest keeping a local copy safe.",
        });
      }
    }
  };

  const today = useMemo(() => new Date(), []);
  const todayWorkouts = useMemo(() => {
    const todayStr = format(today, "yyyy-MM-dd");
    return schedule
      .filter((s) => s.date === todayStr)
      .map((s) => ({
        ...s,
        video: videos.find((v) => v.id === s.videoId),
      }))
      .filter((s) => s.video);
  }, [schedule, videos, today]);

  const stats = useMemo(() => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);

    const completedInViewMonth = schedule.filter((s) => {
      const date = new Date(s.date);
      return s.isCompleted && isWithinInterval(date, { start: monthStart, end: monthEnd });
    }).length;

    const totalDuration = schedule
      .filter(s => s.isCompleted)
      .reduce((acc, s) => {
        const video = videos.find(v => v.id === s.videoId);
        return acc + (video?.duration || 0);
      }, 0);

    return {
      completedInViewMonth,
      totalCompleted: schedule.filter(s => s.isCompleted).length,
      totalDuration,
    };
  }, [schedule, videos, viewDate]);

  const weeklyData = useMemo(() => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });

    return weeks.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const completedCount = schedule.filter(s => {
        const d = new Date(s.date);
        return s.isCompleted && isWithinInterval(d, { start: weekStart, end: weekEnd });
      }).length;

      return {
        name: `W${index + 1}`,
        completed: completedCount
      };
    });
  }, [schedule, viewDate]);

  const nextMonth = () => setViewDate(addMonths(viewDate, 1));
  const prevMonth = () => setViewDate(subMonths(viewDate, 1));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {settings.name}!</h1>
          <p className="text-muted-foreground">
            {stats.completedInViewMonth >= settings.monthlyGoal
              ? "Goal reached! You're crushing it! 🚀"
              : `You're ${settings.monthlyGoal - stats.completedInViewMonth} workouts away from your monthly goal!`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setViewDate(new Date())}>
            {format(viewDate, "MMM yyyy")}
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Progress</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedInViewMonth}</div>
            <p className="text-xs text-muted-foreground">Workouts completed in {format(viewDate, "MMMM")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompleted}</div>
            <p className="text-xs text-muted-foreground">All-time completions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(stats.totalDuration / 60)}h {stats.totalDuration % 60}m
            </div>
            <p className="text-xs text-muted-foreground">Total minutes trained</p>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "cursor-pointer transition-all active:scale-95",
            (!settings.lastExportedAt && videos.length >= 10) || (settings.lastExportedAt && differenceInDays(new Date(), parseISO(settings.lastExportedAt)) >= BACKUP_REMINDER_DAYS)
              ? "border-orange-500/50 bg-orange-500/5 hover:bg-orange-500/10"
              : "hover:bg-accent"
          )}
          onClick={handleCheckBackupStatus}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <ShieldCheck className={cn(
              "h-4 w-4",
              (!settings.lastExportedAt && videos.length >= 10) || (settings.lastExportedAt && differenceInDays(new Date(), parseISO(settings.lastExportedAt)) >= BACKUP_REMINDER_DAYS)
                ? "text-orange-500"
                : "text-green-500"
            )} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {settings.lastExportedAt
                ? formatDistanceToNow(parseISO(settings.lastExportedAt), { addSuffix: true })
                : "Never"}
            </div>
            <p className="text-xs text-muted-foreground">Click to check status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Play className="h-5 w-5" />
            Today&apos;s Routine
          </h2>

          {todayWorkouts.length > 0 ? (
            <div className="space-y-6">
              {todayWorkouts.map((item) => (
                <Card key={item.id} className="overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm">
                  <div className="flex flex-col">
                    <YouTubePlayer videoId={item.video?.youtubeId || ""} />

                    <div className="p-6 space-y-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1.5">
                            {item.video?.types?.map((type) => (
                              <Badge key={type} variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
                                {type}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center bg-muted px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.video?.duration} min
                          </span>
                        </div>
                        <h3 className="font-black text-2xl leading-tight tracking-tight uppercase italic">{item.video?.title}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{item.video?.channelName}</p>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <Button
                          className={cn(
                            "flex-1 gap-2 h-12 text-lg font-bold uppercase tracking-tighter transition-all",
                            item.isCompleted ? "bg-muted text-muted-foreground hover:bg-muted" : "bg-primary hover:scale-[1.02]"
                          )}
                          onClick={() => toggleComplete(item.id)}
                        >
                          {item.isCompleted ? (
                            <>
                              <CheckCircle2 className="h-5 w-5" />
                              Workout Completed
                            </>
                          ) : (
                            <>
                              <Flame className="h-5 w-5" />
                              Finish Workout
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="icon" className="h-12 w-12 border-primary/20" asChild>
                          <a href={`https://www.youtube.com/watch?v=${item.video?.youtubeId}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center py-12 text-center border-dashed">
              <div className="rounded-full bg-muted p-4 mb-4">
                <CalendarIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No workouts scheduled for today</h3>
              <p className="text-muted-foreground mb-6">Take a rest or plan something from your library.</p>
              <Button asChild>
                <Link href="/planner">Go to Planner</Link>
              </Button>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Analytics
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Weekly Activity</CardTitle>
              <CardDescription>Completions per week in {format(viewDate, "MMMM")}</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkoutBarChart weeklyData={weeklyData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Monthly Goal</CardTitle>
              <CardDescription>Your activity target</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completions</span>
                <span className="font-medium font-mono">{stats.completedInViewMonth}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.min((stats.completedInViewMonth / settings.monthlyGoal) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                Goal: {settings.monthlyGoal} workouts per month ({Math.floor((stats.completedInViewMonth / settings.monthlyGoal) * 100)}%)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
