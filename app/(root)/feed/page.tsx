"use client";
import { Button } from '@/components/ui/button'
import React from 'react'
import { createClient } from "@/lib/supabase/client";
import { useRouter } from 'next/navigation';
import Navbar from '@/components/nav/nav';
const page = () => {
  const router = useRouter()
  const supabase = createClient();

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/login');
    } else {
      console.error('Error signing out:', error.message);
    }
  };
  return (
    <div className='p-3 bg-green-200 h-screen overflow-y-scroll overflow-x-hidden w-full'>
      <Navbar />
        <Button onClick={handleSignout}>Sign out </Button>
    </div>
  )
}

export default page
