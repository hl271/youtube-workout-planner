"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500">
            <div className="relative flex flex-col items-center">
                {/* Animated Rings */}
                <div className="absolute h-32 w-32 animate-ping rounded-full border-4 border-primary/20 duration-[2000ms]" />
                <div className="absolute h-32 w-32 animate-pulse rounded-full border-2 border-primary/40" />

                {/* Central Spinner */}
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-2xl">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>

                {/* Text Section */}
                <div className="mt-8 text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Prepping Your Gains
                    </h2>
                    <p className="mt-2 text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-200">
                        Curating your workout library...
                    </p>
                </div>

                {/* Progress Bar (Indeterminate) */}
                <div className="mt-8 w-48 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-full bg-primary animate-progress-indeterminate" />
                </div>
            </div>
        </div>
    );
}
