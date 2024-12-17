
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (data.user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}