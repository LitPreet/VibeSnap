
import { redirect } from "next/navigation";
// import LoginForm from "../../components/ui/forms/LoginForm";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (data.user) {
    redirect("/dashboard");
  }
return <h1>hey</h1>
  // return <LoginForm />;
}