import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'Bingbot',
          '*',
        ],
        allow: '/',
      },
      { userAgent: 'CCBot', disallow: '/' },
    ],
    sitemap: 'https://traqcollective.com/sitemap.xml',
    host: 'https://traqcollective.com',
  };
}
