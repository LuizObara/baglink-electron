'use client';

import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-end">
        <Skeleton className="h-8 w-32" />
      </div>

      <Skeleton className="h-8 w-48" /> 

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4 px-4">
          <Skeleton className="h-4 w-20" /> 
          <Skeleton className="h-10 w-full" />

          <Skeleton className="h-4 w-20" /> 
          <Skeleton className="h-10 w-full" />

          <Skeleton className="h-4 w-20" /> 
          <Skeleton className="h-10 w-full" />

          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-full" />
        </div>

        <div className="mx-auto flex flex-col items-center space-y-2">
          <Skeleton className="rounded-full w-48 h-48" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 px-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}