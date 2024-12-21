import React from 'react'
import { Skeleton } from '../ui/skeleton'

const ProfileShimmer = () => {
  return (
    <div className="w-full">
    {/* Skeleton for Cover Image */}
    <Skeleton className="w-full h-40" />

    {/* Profile Image Skeleton */}
    <div className="relative w-full flex justify-start">
      <Skeleton className="h-[112px] w-[112px] rounded-full absolute top-[-56px] left-5" />
    </div>

    {/* Button Skeleton */}
    <div className="flex w-full justify-center mt-3 ml-9">
      <Skeleton className="w-[55%] h-10 rounded-full" />
    </div>

    {/* Bio and Name skeleton */}
    <div className="space-y-2 my-6 ml-5">
      <Skeleton className="h-5 w-[350px]" />
      <Skeleton className="h-5 w-[350px]" />
    </div>

    {/* {post} */}
    <div className="grid grid-cols-2 gap-2">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
  </div>
  )
}

export default ProfileShimmer
