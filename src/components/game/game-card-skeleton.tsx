import { Skeleton } from '@/components/ui/skeleton'

export function GameCardSkeleton() {
  return (
    <div className="bg-gray-800/40 rounded-xl overflow-hidden border border-gray-700/50 animate-pulse">
      <Skeleton className="aspect-[16/10] bg-gray-700/50" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 bg-gray-700/50 rounded w-3/4" />
        <Skeleton className="h-3 bg-gray-700/50 rounded w-1/2" />
        <Skeleton className="h-3 bg-gray-700/50 rounded w-1/3" />
      </div>
    </div>
  )
}
