# React Joyride Website

Documentation and demo site for [react-joyride](https://github.com/gilbarbara/react-joyride).

Site: https://react-joyride.com

## Stack

- [Next.js](https://nextjs.org/) 16
- [HeroUI](https://heroui.com/) v2
- [Tailwind CSS](https://tailwindcss.com/) v4
- [MDX](https://mdxjs.com/) with rehype-pretty-code + Shiki
- [next-themes](https://github.com/pacocoursey/next-themes)
- [DocSearch](https://docsearch.algolia.com/)

## Features

- **Documentation**: MDX pages covering getting-started, API reference, events, custom components, accessibility, migration, and more
- **Demos**: 8 interactive examples — overview, controlled, custom-components, scroll, modal, carousel, chat, multi-route

## Development

```bash
pnpm dev         # Start dev server at localhost:3000
pnpm build       # Production build
pnpm start       # Serve production build
pnpm lint        # ESLint with --fix
pnpm typecheck   # TypeScript check
```

> Uses `--webpack` flag for dev/build due to Turbopack symlink issues with local package imports.
