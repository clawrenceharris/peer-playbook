import React from "react";
import { Skeleton } from "./";

export function AppSkeleton() {
  return (
    <div className="w-full h-full">
      <div className="header">
        <Skeleton className="w-60 h-7 rounded-full" />
        <Skeleton className="w-20 h-7 rounded-full" />
      </div>
      <div className="secondary-header">
        <Skeleton className="w-full max-w-140 h-10 rounded-full" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-20 h-8 rounded-full" />
          <Skeleton className="w-20 h-8 rounded-full" />
          <Skeleton className="w-20 h-8 rounded-full" />

          <Skeleton className="w-20 h-8 rounded-full" />
        </div>
      </div>

      <div className="container overflow-hidden">
        <div className="grid cols-auto grid-cols-2 md:grid-cols-3 gap-6 max-w-[500px] md:max-w-[750px] mx-auto w-full">
          <Skeleton className="h-50 w-full max-w-[250px] rounded-xl" />
          <Skeleton className="h-50 w-full ma-w-[250px] rounded-xl" />
          <Skeleton className="h-50 w-full max-w-[250px] rounded-xl" />
          <Skeleton className="h-50 w-full  max-w-[250px] rounded-xl" />
          <Skeleton className="h-50 w-full max-w-[250px] rounded-xl" />
          <Skeleton className="h-50 w-full max-w-[250px] rounded-xl" />
          <Skeleton className="h-50 w-full max-w-[250px] rounded-xl" />
          <Skeleton className="h-50 w-full ma-w-[250px] rounded-xl" />
          <Skeleton className="h-50 w-full max-w-[250px] rounded-xl" />
          <Skeleton className="h-50 w-full  max-w-[250px] rounded-xl" />
          <Skeleton className="h-50 w-full max-w-[250px] rounded-xl" />
          <Skeleton className="h-50 w-full max-w-[250px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
