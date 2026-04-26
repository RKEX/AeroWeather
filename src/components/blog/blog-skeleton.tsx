import { Skeleton } from "@/components/ui/skeleton";

export function BlogSkeleton() {
  return (
    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 space-y-6">
          <Skeleton className="aspect-[16/10] w-full rounded-[1.5rem]" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      ))}
    </div>
  );
}
