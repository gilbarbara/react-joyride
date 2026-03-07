import type { MetadataRoute } from 'next';

const baseUrl = 'https://react-joyride.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const documentation = [
    'getting-started',
    'how-it-works',
    'props',
    'props/options',
    'props/floating-options',
    'props/styles',
    'step',
    'events',
    'custom-components',
    'hook',
    'exports',
    'accessibility',
    'migration',
  ];

  const demos = [
    'basic',
    'controlled',
    'custom-components',
    'scroll',
    'multi-route',
    'carousel',
    'modal',
  ];

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    ...documentation.map(slug => ({
      url: `${baseUrl}/docs/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/demos`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    ...demos.map(slug => ({
      url: `${baseUrl}/demos/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
}
