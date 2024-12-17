"use client";
import { Button } from '@/components/ui/button'
import React from 'react'
import { createClient } from "@/lib/supabase/client";
import { useRouter } from 'next/navigation';
const page = () => {
  const router = useRouter()
  const supabase = createClient();
  const handleSignout = async () => {
    await supabase.auth.signOut();
    router.push('/')
  };
  return (
    <div>
      dashboard
        <Button onClick={handleSignout}>Sign out </Button>
    </div>
  )
}

export default page
