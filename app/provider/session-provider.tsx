'use client'

import { useUser } from "@/lib/store/user";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect } from "react";

export default function SessionProvider() {
  const setUser = useUser((state) => state.setUser);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const readUserSession = async () => {
    const { data } = await supabase.auth.getSession();
    const {data: userInfo} = await supabase.from("users").select("*").eq("id",data?.session?.user?.id).single();
    setUser(userInfo);
  };

  useEffect(() => {
    readUserSession();
    // eslint-disable-next-line
  }, []);

  return <></>;
}
