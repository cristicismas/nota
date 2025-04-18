/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SERVER_URL: process.env.SERVER_URL,
  },

  async redirects() {
    return [
      {
        source: "/((?!api|login$|_next/static|_next/image).*)",
        destination: "/login",
        permanent: false,
        missing: [
          {
            type: "cookie",
            key: "sessionId",
          },
        ],
      },
      {
        source: "/",
        destination: "/login",
        permanent: false,
        missing: [
          {
            type: "cookie",
            key: "sessionId",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
