"use client";

import { LayoutDashboard, Library, Calendar, Settings } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import AppIcon from "@/app/icon.png";

const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Library",
        url: "/library",
        icon: Library,
    },
    {
        title: "Planner",
        url: "/planner",
        icon: Calendar,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="flex items-center justify-center gap-3 py-6">
                <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
                    <Image
                        src={AppIcon}
                        alt="App Logo"
                        width={32}
                        height={32}
                        className="rounded-lg shadow-sm"
                    />
                    <h1 className="text-xl font-bold text-primary">
                        Workout Planner
                    </h1>
                </div>
                <div className="hidden group-data-[collapsible=icon]:block">
                    <Image
                        src={AppIcon}
                        alt="App Logo"
                        width={24}
                        height={24}
                        className="rounded-md shadow-sm"
                    />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
