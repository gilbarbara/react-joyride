import type { MetadataRoute } from 'next';

const baseUrl = 'https://react-joyride.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const documentation = [
    'getting-started',
    'new-in-v3',
    'how-it-works',
    'hook',
    'props',
    'props/options',
    'props/styles',
    'props/floating-options',
    'step',
    'events',
    'custom-components',
    'exports',
    'recipes',
    'accessibility',
    'migration',
  ];

  const demos = [
    'overview',
    'chat',
    'controlled',
    'multi-route',
    'carousel',
    'custom-components',
    'scroll',
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
