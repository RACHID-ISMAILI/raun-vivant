// Sitemap generation for RAUN-RACHID

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const generateSitemap = (): string => {
  const baseUrl = 'https://raun-rachid.com'; // Replace with actual domain
  const now = new Date().toISOString();

  const urls: SitemapEntry[] = [
    {
      url: `${baseUrl}/`,
      lastmod: now,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/raun-demo`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/intentions`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/admin`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.3
    }
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemapXml;
};

// Generate robots.txt content
export const generateRobotsTxt = (): string => {
  const baseUrl = 'https://raun-rachid.com'; // Replace with actual domain
  
  return `User-agent: *
Allow: /
Allow: /raun-demo
Allow: /intentions
Disallow: /admin

Sitemap: ${baseUrl}/sitemap.xml
`;
};