import { redirect } from "next/navigation";
// import LoginForm from "../../components/ui/forms/LoginForm";
import { createClient } from "@/lib/supabase/server";
import MansoryLayout from "@/components/mansoryLayout";
import Logo from "@/assets/images/AppLogo.png";
import Image from "next/image";
import GoogleSignin from "@/components/ui/forms/LoginForm";

export default async function LoginPage() {
  const supabase = await createClient();
  // const { data, error } = await supabase.auth.getUser();
  // if (data.user) {
  //   redirect("/dashboard");
  // }
  return (
    <div className="h-screen w-full grid overflow-hidden">
      <MansoryLayout />
      <div className="w-full bg-white absolute bottom-0 xs:h-[200px] xs-390:h-[360px] md:h-[200px] rounded-tr-[90px] rounded-tl-[90px] flex flex-col items-center">
        <div className="flex gap-1 mr-10 mt-8 p-0  items-center justify-center w-full">
          <div className="w-[100px] h-[40px] flex justify-end">
            <Image
              src={Logo}
              style={{ objectFit: "cover" }}
              alt="logo"
              className=" translate-x-6"
            />
          </div>
          <h2 className="font-[700] text-[28px] text-black tracking-wider">
            Vibesnap
          </h2>
        </div>
        <p className="font-normal text-md mb-2 tracking-wide text-black">
          Moments That Matter, Shared Forever.
        </p>
        <GoogleSignin />
      </div>
    </div>
  );
}
