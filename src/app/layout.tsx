import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { HydrationProvider } from "@/components/hydration-provider";
import { PageTransition } from "@/components/page-transition";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Youtube Workout Planner",
  description: "Curate and schedule your YouTube workouts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider>
          <HydrationProvider>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 overflow-y-auto">
                  <div className="p-4 md:p-8">
                    <div className="mb-8 flex items-center md:hidden">
                      <SidebarTrigger />
                    </div>
                    <PageTransition>
                      {children}
                    </PageTransition>
                  </div>
                </main>
              </div>
              <Toaster />
            </SidebarProvider>
          </HydrationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
