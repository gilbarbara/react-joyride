import { Children, isValidElement, type ReactNode } from 'react';
import { Divider } from '@heroui/react';
import type { MDXComponents } from 'mdx/types';

import Code from '~/components/Code';
import CopyButton from '~/components/CopyButton';

function getTextContent(children: ReactNode): string {
  return Children.toArray(children)
    .map(child => {
      if (typeof child === 'string') {
        return child;
      }

      if (typeof child === 'number') {
        return String(child);
      }

      if (isValidElement<{ children?: ReactNode }>(child)) {
        return getTextContent(child.props.children);
      }

      return '';
    })
    .join('');
}

function Heading({
  as: Tag,
  children,
  className,
  ...props
}: {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  children: ReactNode;
  className: string;
}) {
  const id = slugify(getTextContent(children));

  return (
    <Tag className={`group ${className}`} id={id} {...props}>
      {children}
      <a
        aria-hidden="true"
        className="ml-2 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity no-underline"
        href={`#${id}`}
      >
        #
      </a>
    </Tag>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\s\w-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function useMDXComponents(): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <Heading as="h1" className="text-4xl font-bold mb-4" {...props}>
        {children}
      </Heading>
    ),
    h2: ({ children, ...props }) => (
      <Heading as="h2" className="text-2xl font-bold my-4 first:mt-0" {...props}>
        {children}
      </Heading>
    ),
    h3: ({ children, ...props }) => (
      <Heading as="h3" className="text-xl font-bold my-4 first:mt-0" {...props}>
        {children}
      </Heading>
    ),
    h4: ({ children, ...props }) => (
      <Heading as="h4" className="text-lg font-bold my-4 first:mt-0" {...props}>
        {children}
      </Heading>
    ),
    h5: ({ children, ...props }) => (
      <Heading as="h5" className="font-bold my-4 first:mt-0" {...props}>
        {children}
      </Heading>
    ),
    p: ({ children, ...props }) => (
      <p className="mb-2" {...props}>
        {children}
      </p>
    ),
    a: ({ children, ...props }) => {
      if (props.href?.startsWith('http')) {
        return (
          <a {...props} rel="noopener noreferrer" target="_blank">
            {children}
          </a>
        );
      }

      return <a {...props}>{children}</a>;
    },
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside mb-4" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside mb-4" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="mb-2" {...props}>
        {children}
      </li>
    ),
    hr: props => <Divider className="my-4" {...props} />,
    table: ({ children, ...props }) => (
      <table className="min-w-full table" {...props}>
        {children}
      </table>
    ),
    thead: ({ children, ...props }) => <thead {...props}>{children}</thead>,
    tbody: ({ children, ...props }) => (
      <tbody className="text-left" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
    th: ({ children, ...props }) => <th {...props}>{children}</th>,
    td: ({ children, ...props }) => <td {...props}>{children}</td>,
    code: ({ children, ...props }) => {
      if ('data-theme' in props) {
        return <code {...props}>{children}</code>;
      }

      return <Code>{children}</Code>;
    },
    pre: ({ children, raw, ...props }: { children: ReactNode; raw?: string }) => (
      <pre className="relative group" {...props}>
        {raw && <CopyButton text={raw} />}
        {children}
      </pre>
    ),
  };
}
