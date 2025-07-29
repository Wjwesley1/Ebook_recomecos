/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_CSP_HEADER: process.env.NODE_ENV === 'development' ? '' : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  },
  async headers() {
    return process.env.NODE_ENV === 'development'
      ? []
      : [
          {
            source: '/:path*',
            headers: [
              {
                key: 'Content-Security-Policy',
                value: "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
              },
            ],
          },
        ];
  },
};

export default nextConfig;