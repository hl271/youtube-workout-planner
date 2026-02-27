"use client";

import React, { useEffect, useState } from "react";
import { useWorkoutStore } from "@/store/workoutStore";
import { LoadingScreen } from "./loading-screen";

export function HydrationProvider({ children }: { children: React.ReactNode }) {
    const [hasHydrated, setHasHydrated] = useState(false);

    // Zustand doesn't have an explicit 'isHydrated' state out of the box with persist
    // unless we manually add it or use the onRehydrateStorage callback.
    // However, a simple useEffect on a client component that waits for the next tick
    // is often enough to ensure hydration has been attempted/completed for LocalStorage.

    useEffect(() => {
        // We can also check if the store has been hydrated by watching the persist API
        const unsubHydrate = useWorkoutStore.persist.onHydrate(() => setHasHydrated(false));
        const unsubFinishHydration = useWorkoutStore.persist.onFinishHydration(() => setHasHydrated(true));

        // For cases where it might have already hydrated before this effect runs
        if (useWorkoutStore.persist.hasHydrated()) {
            setHasHydrated(true);
        }

        return () => {
            unsubHydrate();
            unsubFinishHydration();
        };
    }, []);

    if (!hasHydrated) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
}
