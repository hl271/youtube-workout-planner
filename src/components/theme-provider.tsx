"use client";

import { useEffect } from "react";
import { useWorkoutStore } from "@/store/workoutStore";
import { THEME_CSS_CLASSES } from "@/constants";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useWorkoutStore((state) => state.settings.theme);

    useEffect(() => {
        // Remove all current theme classes
        const root = window.document.documentElement;
        THEME_CSS_CLASSES.forEach((t) => root.classList.remove(t));

        // Toggle .dark class for shadcn and other component logic
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        // Add the current theme class
        root.classList.add(`theme-${theme}`);
    }, [theme]);

    return <>{children}</>;
}
