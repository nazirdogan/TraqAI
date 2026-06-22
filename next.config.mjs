/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Serve the standalone interactive workbook (a static file in /public) at a
  // clean URL. /workbook -> /workbook.html (the .html path keeps working too).
  async rewrites() {
    return [{ source: '/workbook', destination: '/workbook.html' }];
  },
};

export default nextConfig;
