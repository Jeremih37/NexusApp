import { Skeleton } from '@/components/ui/skeleton'

export function GameCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      <Skeleton className="aspect-[16/10] bg-white/[0.03]" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 bg-white/[0.03] rounded-xl w-3/4" />
        <Skeleton className="h-3 bg-white/[0.03] rounded-xl w-1/2" />
        <Skeleton className="h-3 bg-white/[0.03] rounded-xl w-1/3" />
      </div>
    </div>
  )
}
