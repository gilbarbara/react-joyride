import { Button, Link, Tooltip } from '@heroui/react';
import { CodeIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

const gitHubUrlPrefix = 'https://github.com/gilbarbara/react-joyride/blob/main';

const sourceCodeMap: Record<string, string> = {
  carousel: '/website/src/app/demos/carousel/Carousel.tsx',
  chat: '/website/src/app/demos/chat/Chat.tsx',
  controlled: '/website/src/app/demos/controlled/Controlled.tsx',
  'custom-components': '/website/src/app/demos/custom-components/CustomComponents.tsx',
  modal: '/website/src/app/demos/modal/Modal.tsx',
  'multi-route': '/website/src/app/demos/multi-route/layout.tsx',
  overview: '/website/src/app/demos/overview/Overview.tsx',
  scroll: '/website/src/app/demos/scroll/Scroll.tsx',
};

export default function SourceCodeLink() {
  const pathname = usePathname();

  const slug = pathname.split('/demos/')[1]?.split('/')[0];

  if (!slug) {
    return null;
  }

  const path = sourceCodeMap[slug];

  if (!path) {
    return null;
  }

  const url = `${gitHubUrlPrefix}${path}`;

  return (
    <Tooltip content="View source code" placement="bottom-end" showArrow>
      <Button
        aria-label="Source code link"
        as={Link}
        className="fixed top-30 right-4 z-120 shadow-lg bg-black/30 dark:bg-white/30 text-white/75 dark:text-black/75"
        href={url}
        isExternal
        isIconOnly
        radius="full"
        size="sm"
      >
        <CodeIcon className="size-4" />
      </Button>
    </Tooltip>
  );
}
