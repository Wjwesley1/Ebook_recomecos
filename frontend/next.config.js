module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sandbox.pagseguro.uol.com.br https://assets.pagseguro.com.br;",
          },
        ],
      },
    ];
  },
};