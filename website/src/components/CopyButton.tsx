'use client';

import { useState } from 'react';
import { Button, Tooltip } from '@heroui/react';
import { CopyIcon } from 'lucide-react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip content={copied ? 'Copied!' : 'Copy'} placement="top">
      <Button
        aria-label="Copy code"
        className="absolute right-2 top-2 opacity-30 group-hover:opacity-100 transition-opacity"
        isIconOnly
        onPress={handleClick}
        variant="light"
      >
        <CopyIcon className="size-4" />
      </Button>
    </Tooltip>
  );
}
