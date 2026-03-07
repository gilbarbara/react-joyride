import type { Metadata } from 'next';

import Carousel from './Carousel';

export const metadata: Metadata = { title: 'Carousel (Demo)' };

export default function CarouselPage() {
  return <Carousel />;
}
