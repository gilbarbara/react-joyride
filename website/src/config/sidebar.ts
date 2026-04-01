type Sidebar = Record<string, SidebarItem[]>;

export interface SidebarItem {
  items?: SidebarItem[];
  label: string;
  path: string;
}

export const sidebar: Sidebar = {
  demos: [
    {
      label: 'Overview',
      path: '/demos/overview',
    },
    {
      label: 'Chat App',
      path: '/demos/chat',
    },
    {
      label: 'Dashboard (Controlled)',
      path: '/demos/controlled',
    },
    {
      label: 'Multi Route',
      path: '/demos/multi-route',
    },
    {
      label: 'Carousel',
      path: '/demos/carousel',
    },
    {
      label: 'Custom Components',
      path: '/demos/custom-components',
    },
    {
      label: 'Scroll',
      path: '/demos/scroll',
    },
    {
      label: 'Modal',
      path: '/demos/modal',
    },
  ],
  docs: [
    { label: 'Getting Started', path: '/docs/getting-started' },
    { label: 'New in V3', path: '/docs/new-in-v3' },
    { label: 'How It Works', path: '/docs/how-it-works' },
    { label: 'useJoyride Hook', path: '/docs/hook' },
    {
      label: 'Props',
      path: '/docs/props',
      items: [
        {
          label: 'Options',
          path: '/docs/props/options',
        },
        {
          label: 'Styles',
          path: '/docs/props/styles',
        },
        {
          label: 'Floating Options',
          path: '/docs/props/floating-options',
        },
      ],
    },
    { label: 'Step', path: '/docs/step' },
    { label: 'Events', path: '/docs/events' },
    { label: 'Custom Components', path: '/docs/custom-components' },
    { label: 'Exports', path: '/docs/exports' },
    { label: 'Recipes', path: '/docs/recipes' },
    { label: 'Accessibility', path: '/docs/accessibility' },
    { label: 'Migration', path: '/docs/migration' },
  ],
};
