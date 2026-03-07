'use client';

import { useEffect, useMemo, useState } from 'react';
import { type Props } from 'react-joyride';
import { STATUS, useJoyride } from 'react-joyride';
import { Carousel as ReactCarousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useSetState } from '@gilbarbara/hooks';
import { Button, Link } from '@heroui/react';
import Image from 'next/image';

import { useConfig } from '~/context/ConfigContext';
import useTheme from '~/hooks/useTheme';
import { logGroup, mergeProps } from '~/modules/helpers';

import Container from '~/components/Container';

import CarouselTooltip from './CarouselTooltip';

interface State {
  carouselIndex: number;
  run: boolean;
  steps: Props['steps'];
}

const imageWidth = 1000;
const baseColor = '#fd7c07';

function createTourSteps(images: string[]): Props['steps'] {
  return images.map((_, index) => ({
    content: `Image ${index + 1}`,
    data: { images },
    ...(index === 0 && { skipBeacon: true }),
    target: '.app__carousel',
    tooltipComponent: CarouselTooltip,
  }));
}

function getImageConfig() {
  const isPortrait = window.innerHeight > window.innerWidth;
  const imageHeight = isPortrait ? 700 : 300;
  const prefix = isPortrait ? '1000x700' : '1000x300';

  return {
    ratio: imageHeight / imageWidth,
    images: Array.from({ length: 5 }, (_, index) => `/images/carousel/${prefix}-${index + 1}.jpg`),
  };
}

export default function Carousel() {
  const { joyrideProps, registerConfig } = useConfig();
  const [{ images, ratio }, setImageConfig] = useState({
    ratio: 300 / imageWidth,
    images: Array.from({ length: 5 }, (_, index) => `/images/carousel/1000x300-${index + 1}.jpg`),
  });

  useEffect(() => {
    setImageConfig(getImageConfig());
  }, []);

  const tourSteps = useMemo(() => createTourSteps(images), [images]);

  const [{ carouselIndex, run }, setState] = useSetState<State>({
    carouselIndex: 0,
    run: false,
    steps: tourSteps,
  });
  const { isDarkMode } = useTheme();

  const baseProps = useMemo(
    () =>
      ({
        continuous: true,
        scrollToFirstStep: true,
        options: {
          arrowColor: isDarkMode ? '#1e2939' : '#ffe9d4',
          backgroundColor: isDarkMode ? '#1e2939' : '#ffe9d4',
          primaryColor: baseColor,
          textColor: baseColor,
          buttons: [],
          skipBeacon: true,
          skipScroll: true,
        },
      }) satisfies Omit<Props, 'steps'>,
    [isDarkMode],
  );

  useEffect(() => {
    registerConfig(baseProps);
  }, [baseProps, registerConfig]);

  const handleClickOpen = () => {
    setState({ run: true });
  };

  const { on, state, Tour } = useJoyride({
    onEvent: data => logGroup(data.type, data),
    run,
    steps: tourSteps,
    ...mergeProps(baseProps, joyrideProps),
  });

  useEffect(() => {
    const onTooltip = on('tooltip', () => {
      setState({ carouselIndex: state.index });
    });

    const onEnd = on('tour:end', () => {
      setState({ run: false });
    });

    const onPause = on('tour:status', data => {
      if (data.status === 'paused') {
        setState({ run: false });
      }
    });

    return () => {
      onTooltip();
      onEnd();
      onPause();
    };
  }, [on, setState, state.index]);

  return (
    <div className="bg-red-50 dark:bg-red-950 min-h-screen">
      <Container className="py-8">
        {Tour}
        <h1 className="text-4xl font-bold mb-2 text-center">Carousel</h1>
        <p className="text-center text-default-600 max-w-xl mx-auto mb-8">
          Integrated with{' '}
          <Link href="https://github.com/leandrowd/react-responsive-carousel" isExternal>
            react-responsive-carousel
          </Link>{' '}
          with a custom tooltip.
        </p>
        <div
          className="app__carousel overflow-hidden"
          style={{ aspectRatio: `${imageWidth} / ${Math.floor(imageWidth * ratio)}` }}
        >
          <ReactCarousel
            selectedItem={carouselIndex}
            showArrows={!run}
            showIndicators={false}
            showStatus={false}
            showThumbs={false}
          >
            <Image
              alt="1"
              height={Math.floor(imageWidth * ratio)}
              src={images[0]}
              width={imageWidth}
            />
            <Image
              alt="2"
              height={Math.floor(imageWidth * ratio)}
              src={images[1]}
              width={imageWidth}
            />
            <Image
              alt="3"
              height={Math.floor(imageWidth * ratio)}
              src={images[2]}
              width={imageWidth}
            />
            <Image
              alt="4"
              height={Math.floor(imageWidth * ratio)}
              src={images[3]}
              width={imageWidth}
            />
            <Image
              alt="5"
              height={Math.floor(imageWidth * ratio)}
              src={images[4]}
              width={imageWidth}
            />
          </ReactCarousel>
        </div>
        {!run && (
          <div className="flex items-center justify-center mt-8">
            <Button
              className="text-white"
              data-testid="button-control"
              onPress={handleClickOpen}
              style={{ backgroundColor: baseColor }}
            >
              {state.status === STATUS.PAUSED ? 'Open' : 'Start'}
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
