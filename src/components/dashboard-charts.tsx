"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface WeeklyData {
    name: string;
    completed: number;
}

interface DashboardChartsProps {
    weeklyData: WeeklyData[];
}

export function WorkoutBarChart({ weeklyData }: DashboardChartsProps) {
    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={weeklyData}
                    margin={{
                        top: 5,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <Tooltip
                        cursor={{ fill: "hsl(var(--primary) / 0.1)" }}
                        contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px",
                            color: "hsl(var(--foreground))"
                        }}
                        itemStyle={{ color: "hsl(var(--primary))" }}
                    />
                    <Bar
                        dataKey="completed"
                        radius={[4, 4, 0, 0]}
                        className="fill-primary"
                    >
                        {weeklyData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fillOpacity={0.8}
                                className="fill-primary hover:fill-primary transition-colors"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
