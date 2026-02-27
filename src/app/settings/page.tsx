"use client";

import { useWorkoutStore } from "@/store/workoutStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, User, Target, Palette, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";
import { THEMES as themes, STORE_VERSION } from "@/constants";

export default function SettingsPage() {
    const { settings, updateSettings, videos, schedule, importData } = useWorkoutStore();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const data = {
            videos,
            schedule,
            settings,
            version: STORE_VERSION, // Current store version
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `workout-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
            title: "Data Exported",
            description: "Your workout database has been saved to a local file.",
        });
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);

                // Basic validation
                if (!json.videos || !json.schedule || !json.settings) {
                    throw new Error("Invalid backup file format.");
                }

                importData(json);

                toast({
                    title: "Import Successful",
                    description: "Your workout database has been restored.",
                });
            } catch (err) {
                console.error("Import error:", err);
                toast({
                    variant: "destructive",
                    title: "Import Failed",
                    description: err instanceof Error ? err.message : "Could not parse backup file.",
                });
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = '';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Customize your profile and application appearance.
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            User Profile
                        </CardTitle>
                        <CardDescription>
                            How the app should identify you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input
                                id="name"
                                value={settings.name}
                                onChange={(e) => updateSettings({ name: e.target.value })}
                                placeholder="Enter your name"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Workout Goals
                        </CardTitle>
                        <CardDescription>
                            Set your targets for the month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="goal">Monthly Workout Goal</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="goal"
                                    type="number"
                                    value={settings.monthlyGoal}
                                    onChange={(e) => updateSettings({ monthlyGoal: parseInt(e.target.value) || 0 })}
                                    className="max-w-[150px]"
                                />
                                <span className="text-muted-foreground">workouts per month</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            App Theme
                        </CardTitle>
                        <CardDescription>
                            Choose a pastel color palette for the interface.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            {themes.map((theme) => (
                                <button
                                    key={theme.name}
                                    onClick={() => updateSettings({ theme: theme.name })}
                                    className={cn(
                                        "group relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-105",
                                        settings.theme === theme.name
                                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                            : "border-muted bg-card hover:border-primary/50"
                                    )}
                                >
                                    <div
                                        className="h-10 w-10 rounded-full shadow-inner flex items-center justify-center border border-muted/20"
                                        style={{ backgroundColor: theme.color }}
                                    >
                                        {settings.theme === theme.name && (
                                            <Check className={cn(
                                                "h-5 w-5",
                                                theme.name === "dark" ? "text-white" : "text-black"
                                            )} />
                                        )}
                                    </div>
                                    <span className="text-xs font-medium capitalize">
                                        {theme.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5" />
                            Data Management
                        </CardTitle>
                        <CardDescription>
                            Export or import your workout database to keep your data synced across devices.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Backup Data</Label>
                                <p className="text-sm text-muted-foreground">
                                    Download all your videos, schedules, and settings as a JSON file.
                                </p>
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center gap-2"
                                    onClick={handleExport}
                                >
                                    <Download className="h-4 w-4" />
                                    Export Database
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Label>Restore Data</Label>
                                <p className="text-sm text-muted-foreground">
                                    Upload a previously exported JSON file to restore your database.
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".json"
                                    onChange={handleImport}
                                />
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center gap-2"
                                    onClick={handleImportClick}
                                >
                                    <Upload className="h-4 w-4" />
                                    Import Database
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
