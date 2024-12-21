import React from 'react'
import { Skeleton } from '../ui/skeleton'

const MyPostShimmer = () => {
  return (
    <div className='grid grid-cols-2 gap-2 w-full'>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`rounded-2xl h-auto w-full p-4 bg-gray-200 mb-4 animate-pulse`}
          >
            {/* User info skeleton */}
            <div className="flex w-fit cursor-pointer gap-4">
              <div className="relative w-[50px] h-[50px]">
                <Skeleton className="w-[50px] h-[50px] rounded-full" /> 
              </div>
              <div className="flex flex-col justify-center">
                <Skeleton className="w-24 h-4 mb-2" /> 
                <Skeleton className="w-20 h-4" /> 
              </div>
            </div>

            {/* Hashtags skeleton */}
            <div className="my-2">
              <Skeleton className="h-6 w-full" />
            </div>

            {/* Carousel skeleton */}
            <div className="w-full max-w-[500px] h-[260px] mb-2">
              <Skeleton className="h-full w-full rounded-xl" /> 
            </div>

            {/* Like and Share skeleton */}
            <div className="flex justify-between w-full mt-2">
              <Skeleton className="w-24 h-8 rounded-2xl" /> 
              <Skeleton className="w-24 h-8 rounded-2xl" /> 
            </div>
          </div>
        ))}
    </div>
  )
}

export default MyPostShimmer
