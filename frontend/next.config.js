/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' https://fonts.googleapis.com; script-src 'self'; img-src 'self'; connect-src 'self' https://ebook-recomecos-backend.onrender.com https://sandbox.api.pagseguro.com"
        }
      ]
    }
  ]
};
module.exports = nextConfig;