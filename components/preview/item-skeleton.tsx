
import { Skeleton } from "@/components/ui/skeleton";

export default function ItemSkeleton () {
    return (
        <>
            <div className="flex items-center mx-3">
                <Skeleton className="h-6 w-6 rounded" />
            </div>
            <div className="flex p-4 border border-gray-300 w-full rounded-lg shadow-lg">
                <div className="flex items-center space-x-4">
                    <Skeleton className="w-32 h-32 rounded-lg" />
                </div>
                <div className="flex-1 ml-4 space-y-2">
                    <Skeleton className="h-5 w-[200px]" />
                    <Skeleton className="h-6 w-[125px]" />
                    <Skeleton className="h-3 w-[150px]" />
                    <Skeleton className="h-4 w-[700px]" />
                </div>
                <div className="flex items-start mx-3">
                    <Skeleton className="h-6 w-6 rounded" />
                </div>
            </div>
        </>
    )        
}
