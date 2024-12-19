import EditProfile from "@/components/EditProfile";
import {  createClient } from "@/lib/supabase/server";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const supabase = await createClient();
  const { data: userInfo } = await supabase
    .from("users")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!userInfo?.id) {
    return <h1 className="text-white">Not found</h1>;
  }
  return <EditProfile userData={userInfo}/>;
};

export default page;
