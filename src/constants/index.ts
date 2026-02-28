import { WorkoutType, Equipment, BodyPart, AppTheme, UserSettings } from '../types';

// ─── Tag Arrays ────────────────────────────────────────────────
export const WORKOUT_TYPES: WorkoutType[] = [
    "Yoga", "HIIT", "Strength", "Cardio", "Pilates", "Stretch", "Boxing", "Other",
];

export const BODY_PARTS: BodyPart[] = [
    "Full Body", "Upper Body", "Lower Body", "Core", "Other",
];

export const EQUIPMENT_OPTIONS: Equipment[] = [
    "None", "Dumbbells", "Resistance Band", "Other",
];

// ─── Duration Filter Ranges (Library Page) ─────────────────────
export const DURATION_RANGES = [
    { label: "All Durations", value: "All" },
    { label: "< 15 min", value: "under15" },
    { label: "15 - 30 min", value: "15-30" },
    { label: "30 - 45 min", value: "30-45" },
    { label: "45+ min", value: "over45" },
] as const;

// ─── Theme Definitions ─────────────────────────────────────────
export const THEMES: { name: AppTheme; color: string }[] = [
    { name: "dark", color: "#1a1a1a" },
    { name: "white", color: "#ffffff" },
    { name: "mint", color: "#e6fffa" },
    { name: "sky", color: "#ebf8ff" },
    { name: "peach", color: "#fff5f0" },
];

export const VALID_THEME_NAMES: AppTheme[] = THEMES.map((t) => t.name);

export const THEME_CSS_CLASSES: string[] = THEMES.map((t) => `theme-${t.name}`);

// ─── Default User Settings ─────────────────────────────────────
export const BACKUP_REMINDER_DAYS = 30;

export const DEFAULT_USER_SETTINGS: UserSettings = {
    name: "Athlete",
    monthlyGoal: 20,
    theme: "dark",
    lastExportedAt: undefined,
};

// ─── Pagination Config ─────────────────────────────────────────
export const LIBRARY_BATCH_SIZE = 12;

// ─── Store Config ──────────────────────────────────────────────
export const STORE_VERSION = 3;
