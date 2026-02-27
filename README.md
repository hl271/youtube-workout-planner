# 🏋️ YouTube Workout Planner

A high-energy, modern dashboard to curate, categorize, and schedule your favorite YouTube workout videos into a structured fitness calendar.

[**Live Demo (Coming Soon)**](https://your-deployed-app-url.vercel.app)

## ✨ Features

- **📺 Create your own workout library**: Add any YouTube link and automatically fetch metadata. Tag by workout type, targeted body part, and equipment.
- **🔍 Searchable Library**: Find your next workout fast with advanced filtering and a premium grid view featuring infinite scrolling.
- **📅 Smart Planner**: Dynamic calendar view to organize your fitness journey. Use the **Randomized Scheduler** to spice up your routine based on your goals.
- **💪 Workout Mode**: Follow along with embedded playback and track completion status pinned to specific calendar dates.
- **📊 Dashboard Analytics**: Visualize your progress with interactive weekly activity charts and trend tracking.
- **🎨 Premium Theming**: Choose from Dark, White, Mint, Sky, or Peach themes. Your vibe, your workout.
- **📱 Responsive & Optimized**: Built for the gym, your mat, or your desktop. Fast initial loads with lazy-loaded components.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & shadcn/ui
- **State**: Zustand (Persisted in LocalStorage)
- **Charts**: Recharts
- **APIs**: YouTube IFrame & Data API

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn / pnpm / bun)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/youtube-workout-planner.git
   cd youtube-workout-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your YouTube API Key (if applicable):
   ```env
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see your planner in action!

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
