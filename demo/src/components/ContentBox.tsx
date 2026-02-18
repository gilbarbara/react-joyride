import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function ContentBox({ children }: Props) {
  return <div className="flex items-center justify-center flex-1">{children}</div>;
}

export default ContentBox;
