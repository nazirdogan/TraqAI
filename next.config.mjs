/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // webp only, deliberately. The optimiser has hung on `Accept: image/avif`
    // in this stack before and silently dropped photos from the page, which is
    // a worse failure than serving a slightly larger file.
    formats: ['image/webp'],
  },
  // Serve the standalone interactive workbooks (static files in /public) at
  // clean URLs. One per ManyChat flow. The .html paths keep working too.
  //   /workbook            -> established teams adopting AI
  //   /workbook/upskill    -> individuals levelling up their own AI skills
  //   /workbook/start      -> new founders running lean with AI before hiring
  //   /workbook/consultant -> AI agencies repositioning from builds to advisory
  // The sign-up used to be an application. Anything still pointing at the old
  // path (an ad, a shared link, a search result) lands on the form, not a 404.
  async redirects() {
    return [
      { source: '/ai-plan-session/apply', destination: '/ai-plan-session/sign-up', permanent: true },
      // The First AI Assistant funnel is replaced by The Person They Keep. Only
      // the landing page moves; its sub-pages stay up for anyone already in it.
      // Temporary, so the old URL can be brought back without a cached 308.
      { source: '/first-ai-assistant', destination: '/keep', permanent: false },
      // The old Dubai ad landing pages are replaced by the rebuilt ones. Temporary, so they can come back if needed.
      { source: '/lp/ai-consultant-dubai', destination: '/lp/ai-consulting', permanent: false },
      { source: '/lp/corporate-ai-training-dubai', destination: '/lp/ai-training', permanent: false },
    ];
  },
  // The rebuilt site (Oct 2026): the homepage, The Transformation, Consulting, Training, About and Contact are static pages
  // in /public/rebuild, sharing assets in /public/site. They are built outside this repo by
  // traq-site-rebuild/build.py --live. beforeFiles lets them take over /, /about and /book from the old app pages,
  // which stay in the code untouched: delete the beforeFiles list to bring the old pages back. Every other route,
  // from /keep and /ai-plan-session to the API, is unaffected.
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/rebuild/index.html' },
        { source: '/transformation', destination: '/rebuild/transformation.html' },
        { source: '/consulting', destination: '/rebuild/consulting.html' },
        { source: '/training', destination: '/rebuild/training.html' },
        { source: '/about', destination: '/rebuild/about.html' },
        // the contact page; /book was its old name and stays for ads and old links
        { source: '/contact', destination: '/rebuild/contact.html' },
        { source: '/book', destination: '/rebuild/contact.html' },
        // the Google Ads landing pages (noindexed), one service each with the inquiry form and a 20-minute call
        { source: '/lp/ai-consulting', destination: '/rebuild/lp-consulting.html' },
        { source: '/lp/ai-training', destination: '/rebuild/lp-training.html' },
      ],
      afterFiles: [
        { source: '/workbook', destination: '/workbook.html' },
        { source: '/workbook/upskill', destination: '/workbook-upskill.html' },
        { source: '/workbook/start', destination: '/workbook-start.html' },
        { source: '/workbook/consultant', destination: '/workbook-consultant.html' },
      ],
    };
  },
};

export default nextConfig;
