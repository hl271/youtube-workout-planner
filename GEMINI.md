# Project Overview
**App Name:** Youtube Workout Planner
**Description:** A dashboard to curate, categorize, and schedule YouTube workout videos into a structured fitness calendar.
**Primary User Goal:** I want to organize disparate YouTube links into a searchable library and schedule them into a weekly/monthly plan with progress tracking.

# Tech Stack & Constraints
- **Framework:** Next.js 14 (App Router) with TypeScript.
- **State Management:** Zustand with `persist` middleware.
- **Styling:** Tailwind CSS, shadcn/ui, and **Framer Motion** for animations.
- **Analytics:** Recharts for progress visualization.
- **Data Persistence:** LocalStorage for the MVP, structured with versioned migrations.
- **Video Handling:** standard YouTube IFrame API and YouTube Data API.

# Core Features (Implemented)
1. **Video Ingest & Meta-Tagging:**
   - [x] Automatic metadata fetching (Title, Channel, Thumbnails).
   - [x] Multi-tag support (Workout Type, Body Part, Equipment).
2. **Searchable Library:**
   - [x] Grid view with advanced filtering.
   - [x] **Video Editing**: Modify existing video attributes and tags.
   - [x] **Batch Loading**: Infinite scrolling support in batches of 12 for high performance.
3. **Planner/Scheduler:**
   - [x] Weekly calendar view with "Assign" functionality.
   - [x] Dynamic "Today" navigation button synced to view date.
   - [x] **Randomized Scheduler**: Batch schedule workouts for a specific week based on user-defined filters (Type, Body Part).
4. **Workout Mode & Progress:**
   - [x] Embedded YouTube playback.
   - [x] Completion status tied to specific dates.
5. **Dashboard Analytics:**
   - [x] **Weekly Activity Chart**: Responsive bar chart using Recharts.
   - [x] **Trend Tracking**: Motivational progress counts and monthly goal indicators.
   - [x] **Data Safety Monitor**: Interactive "Last Backup" status card with intentional on-click recommendations.
6. **Premium Theming:**
   - [x] **Theme Set**: Dark, White, Mint, Sky, Peach.
   - [x] **Thorough Application**: Themes control background, sidebar, and chart accent colors.
7. **Performance & Polish:**
   - [x] **Lazy Loading Screen**: Full-screen branded loader shown during store hydration.
   - [x] **Smooth Route Transitions**: Fluid fade and slide-up animations using Framer Motion.
   - [x] **Zustand Selector Optimization**: Drastically reduced re-renders by switching to specific store subscribers.
   - [x] **Dynamic Imports**: Reduced initial bundle size by lazy loading charts and dialogs.
   - [x] **Image Optimization**: Explicit lazy loading for external thumbnails.
   - [x] **Centralized Constants**: All tags, themes, and default settings defined in `src/constants/index.ts`.
   - [x] **Branded Identity**: Integrated custom 3D emoji-styled app icon across the interface and browser tab.

# UI/UX Requirements
- **Dashboard Layout:** Sidebar navigation with personalized greetings.
- **Visuals:** High-energy aesthetic with theme-aware components.
- **Responsive:** Mobile-first design for gym/mat use.

# Rules & Logic
- **Validation:** Do not allow saving a workout without a duration and at least one category.
- **Persistence:** Ensure the "Completed" status is tied to the specific date on the calendar, not just the video itself.
- **Data Safety:** Interactive backup monitoring on Dashboard to prevent data loss from browser cache clears.

# Expected Output
Please provide the complete code for this application. Start by providing the directory structure for a Next.js App Router project, then provide the code for:
1. The types/interfaces (TypeScript).
2. The core 'WorkoutStore' (using Context API or a simple hook for LocalStorage).
3. The individual page components (Library, Planner, Dashboard).