/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Serve the standalone interactive workbooks (static files in /public) at
  // clean URLs. One per ManyChat flow. The .html paths keep working too.
  //   /workbook            -> established teams adopting AI
  //   /workbook/upskill    -> individuals levelling up their own AI skills
  //   /workbook/start      -> new founders running lean with AI before hiring
  //   /workbook/consultant -> AI agencies repositioning from builds to advisory
  //   /add-ai              -> "Add AI to Your Business" whiteboard explainer
  async rewrites() {
    return [
      { source: '/workbook', destination: '/workbook.html' },
      { source: '/workbook/upskill', destination: '/workbook-upskill.html' },
      { source: '/workbook/start', destination: '/workbook-start.html' },
      { source: '/workbook/consultant', destination: '/workbook-consultant.html' },
      { source: '/add-ai', destination: '/add-ai-to-your-business.html' },
    ];
  },
};

export default nextConfig;
