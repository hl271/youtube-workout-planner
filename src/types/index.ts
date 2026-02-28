export type WorkoutType = 'Yoga' | 'HIIT' | 'Strength' | 'Cardio' | 'Pilates' | 'Stretch' | 'Boxing' | 'Other';
export type Equipment = 'None' | 'Dumbbells' | 'Kettlebell' | 'Resistance Band' | 'Mat' | 'Yoga Block' | 'Bench' | 'Barbell' | 'Other';
export type BodyPart = 'Full Body' | 'Upper Body' | 'Lower Body' | 'Core' | 'Arms' | 'Legs' | 'Back' | 'Chest' | 'Shoulders' | 'Other';

export interface WorkoutVideo {
    id: string;
    youtubeId: string;
    title: string;
    duration: number; // in minutes
    channelName: string;
    types: WorkoutType[];
    equipment: Equipment[];
    bodyPart: BodyPart[];
    thumbnailUrl: string;
    createdAt: string;
}

export interface ScheduleEntry {
    id: string;
    date: string; // ISO string YYYY-MM-DD
    videoId: string;
    isCompleted: boolean;
}

export type AppTheme = 'dark' | 'white' | 'mint' | 'sky' | 'peach';

export interface UserSettings {
    name: string;
    monthlyGoal: number;
    theme: AppTheme;
    lastExportedAt?: string;
}

export interface AppState {
    videos: WorkoutVideo[];
    schedule: ScheduleEntry[];
    settings: UserSettings;
}
