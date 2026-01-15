export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Tier Badge Skeleton */}
        <div className="flex justify-center">
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        </div>

        {/* Name Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>

        {/* Motto Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>

        {/* Certificate ID Skeleton */}
        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mt-2"></div>

        {/* Button Skeleton */}
        <div className="h-10 bg-gray-200 rounded-lg mt-4"></div>
      </div>
    </div>
  );
}
