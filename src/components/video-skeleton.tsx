import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export function VideoSkeleton() {
    return (
        <Card className="overflow-hidden group animate-pulse">
            <div className="relative aspect-video bg-muted overflow-hidden" />
            <CardHeader className="p-4 space-y-2">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent className="px-4 pb-2 flex gap-2">
                <div className="h-5 bg-muted rounded w-12" />
                <div className="h-5 bg-muted rounded w-16" />
            </CardContent>
            <CardFooter className="p-4 pt-2 border-t flex justify-between gap-2">
                <div className="h-8 bg-muted rounded flex-1" />
                <div className="h-8 bg-muted rounded w-10" />
                <div className="h-8 bg-muted rounded w-10" />
            </CardFooter>
        </Card>
    );
}
