import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/feed";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    console.error('Authentication Error:', error);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      console.log(forwardedHost, isLocalEnv, origin , next,'ha nhai');
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}


// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get("code");
//   // if "next" is in param, use it as the redirect URL
//   const next = searchParams.get("next") ?? "/feed";

//   if (code) {
//     const supabase = await createClient();
//     const { error } = await supabase.auth.exchangeCodeForSession(code);
//     console.error('Authentication Error:', error);
//     // const { error } = await supabase.auth.exchangeCodeForSession(code)
//     if (!error) {
//       return NextResponse.redirect(`${origin}${next}`)
//     }
//     // if (!error) {
//     //   const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
//     //   const isLocalEnv = process.env.NODE_ENV === "development";
//     //   console.log(forwardedHost, isLocalEnv, origin , next,'ha nhai');
//     //   if (isLocalEnv) {
//     //     // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
//     //     return NextResponse.redirect(`${origin}${next}`);
//     //   } else if (forwardedHost) {
//     //     return NextResponse.redirect(`https://${forwardedHost}${next}`);
//     //   } else {
//     //     return NextResponse.redirect(`${origin}${next}`);
//     //   }
//     // }
//   }

//   // return the user to an error page with instructions
//   return NextResponse.redirect(`${origin}/auth/auth-code-error`);
// }




