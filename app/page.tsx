'use client'
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";


export default  function Home() {
  const supabase =  createClient();
   const handleSignout = async() => {
    await supabase.auth.signOut()
   }

  return (
   <Button onClick={handleSignout}>Sign out </Button>
  );
}
