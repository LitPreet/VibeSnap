/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                hostname: "lh3.googleusercontent.com",
                protocol: "https",
              },
              {
                hostname: "vgrpouzxlizcvcwkvxdh.supabase.co",
                protocol: "https",
              }
        ]
    },
    eslint:{
      ignoreDuringBuilds: true,
    }
};

export default nextConfig;
