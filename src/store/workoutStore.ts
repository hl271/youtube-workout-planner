import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WorkoutVideo, AppState, UserSettings } from '../types';
import { DEFAULT_USER_SETTINGS, VALID_THEME_NAMES, STORE_VERSION } from '../constants';

interface WorkoutStore extends AppState {
    addVideo: (video: WorkoutVideo) => void;
    removeVideo: (id: string) => void;
    updateVideo: (video: WorkoutVideo) => void;
    scheduleWorkout: (date: string, videoId: string) => void;
    toggleComplete: (scheduleId: string) => void;
    removeFromSchedule: (scheduleId: string) => void;
    updateSettings: (settings: Partial<UserSettings>) => void;
    batchScheduleWorkouts: (entries: { date: string, videoId: string }[]) => void;
    importData: (state: AppState) => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
    persist(
        (set) => ({
            videos: [],
            schedule: [],
            settings: { ...DEFAULT_USER_SETTINGS },
            addVideo: (video) =>
                set((state) => ({ videos: [...state.videos, video] })),
            removeVideo: (id) =>
                set((state) => ({
                    videos: state.videos.filter((v) => v.id !== id),
                    schedule: state.schedule.filter((s) => s.videoId !== id),
                })),
            updateVideo: (video) =>
                set((state) => ({
                    videos: state.videos.map((v) => (v.id === video.id ? video : v)),
                })),
            scheduleWorkout: (date, videoId) =>
                set((state) => ({
                    schedule: [
                        ...state.schedule,
                        {
                            id: Math.random().toString(36).substring(7),
                            date,
                            videoId,
                            isCompleted: false,
                        },
                    ],
                })),
            toggleComplete: (scheduleId) =>
                set((state) => ({
                    schedule: state.schedule.map((s) =>
                        s.id === scheduleId ? { ...s, isCompleted: !s.isCompleted } : s
                    ),
                })),
            removeFromSchedule: (scheduleId) =>
                set((state) => ({
                    schedule: state.schedule.filter((s) => s.id !== scheduleId),
                })),
            updateSettings: (newSettings) =>
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                })),
            batchScheduleWorkouts: (entries) =>
                set((state) => ({
                    schedule: [
                        ...state.schedule,
                        ...entries.map((entry) => ({
                            id: Math.random().toString(36).substring(7),
                            date: entry.date,
                            videoId: entry.videoId,
                            isCompleted: false,
                        })),
                    ],
                })),
            importData: (newState) =>
                set(() => ({
                    videos: newState.videos || [],
                    schedule: newState.schedule || [],
                    settings: newState.settings || { ...DEFAULT_USER_SETTINGS },
                })),
        }),
        {
            name: 'workout-planner-storage',
            storage: createJSONStorage(() => localStorage),
            version: STORE_VERSION,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            migrate: (persistedState: any, version: number) => {
                let state = persistedState;

                if (version === 0) {
                    // Migrate from version 0 to 1
                    state = {
                        ...state,
                        videos: (state.videos || []).map((video: Record<string, unknown>) => ({
                            ...video,
                            types: video.types || (video.type ? [video.type] : []),
                            equipment: video.equipment || ["None"],
                            bodyPart: video.bodyPart || ["Full Body"],
                        })),
                    };
                }

                if (version < 2) {
                    // Migrate to version 2 (add default settings)
                    state = {
                        ...state,
                        settings: state.settings || { ...DEFAULT_USER_SETTINGS },
                    };
                }

                if (version < 3) {
                    // Migrate to version 3 (update themes to new set)
                    if (state.settings && !VALID_THEME_NAMES.includes(state.settings.theme)) {
                        state = {
                            ...state,
                            settings: {
                                ...state.settings,
                                theme: DEFAULT_USER_SETTINGS.theme,
                            },
                        };
                    }
                }

                return state;
            },
        }
    )
);
