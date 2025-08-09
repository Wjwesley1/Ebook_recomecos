const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_CSP_HEADER: process.env.NODE_ENV === 'development' ? '' : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sandbox.pagseguro.uol.com.br;",
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
                value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sandbox.pagseguro.uol.com.br;",
              },
            ],
          },
        ];
  },
};

module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
};