export default function SkeletonCard() {
  return (
    <div className="bg-[#0f0f12] rounded-2xl shadow-lg overflow-hidden border-2 border-[#2a2a35] animate-pulse">
      {/* Tier Badge Skeleton */}
      <div className="h-10 bg-[#1a1a20]"></div>

      {/* Image Skeleton */}
      <div className="aspect-square bg-[#15151a]"></div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-3 bg-[#0f0f12]">
        {/* Name Skeleton */}
        <div className="h-6 bg-[#1a1a20] rounded w-3/4 mx-auto"></div>

        {/* Badges Skeleton */}
        <div className="flex justify-center gap-1">
          <div className="h-6 w-6 bg-[#1a1a20] rounded-full"></div>
          <div className="h-6 w-6 bg-[#1a1a20] rounded-full"></div>
        </div>

        {/* Motto Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-[#1a1a20] rounded w-full"></div>
          <div className="h-4 bg-[#1a1a20] rounded w-2/3 mx-auto"></div>
        </div>

        {/* Date Skeleton */}
        <div className="flex justify-center">
          <div className="h-7 w-32 bg-[#1a1a20] rounded-full"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-12 bg-[#1a1a20] rounded-xl mt-2"></div>
      </div>
    </div>
  );
}
