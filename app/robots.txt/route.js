// app/robots.txt/route.js
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edutalk-one.vercel.app';
  
  const robots = `User-agent: *
Allow: /
Allow: /auth/login
Allow: /auth/register
Allow: /docs
Disallow: /api/
Disallow: /dashboard/
Disallow: /_next/
Disallow: /admin/
Disallow: /private/

# Specific bot rules
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Yandex
Allow: /
Crawl-delay: 2

# Block AI training bots
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}