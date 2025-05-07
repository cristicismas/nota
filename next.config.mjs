/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    BACKUP_DB_URL: process.env.BACKUP_DB_URL,
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
