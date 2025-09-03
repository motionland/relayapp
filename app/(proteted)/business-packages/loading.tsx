import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>

      <Skeleton className="h-10 w-full mb-6" />

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="min-w-full">
          <div className="bg-gray-50 h-12 flex items-center px-6">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-4 w-24 mx-6" />
            ))}
          </div>

          <div className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
              <div key={row} className="flex items-center h-16 px-6">
                {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                  <div key={`${row}-${col}`} className="mx-6">
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
