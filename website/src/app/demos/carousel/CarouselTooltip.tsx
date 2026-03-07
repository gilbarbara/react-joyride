import type { TooltipRenderProps } from 'react-joyride';
import { Button, cn } from '@heroui/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';

export default function CarouselTooltip(props: TooltipRenderProps) {
  const {
    backProps: { onClick: _onClickBack, ...backProps },
    controls,
    index,
    primaryProps: { onClick: _onClickNext, ...primaryProps },
    step,
    tooltipProps,
  } = props;

  const images: string[] = step.data?.images ?? [];

  const handleClickBack = () => {
    if (index > 0) {
      controls.prev();
    } else {
      controls.go(images.length - 1);
    }
  };

  const handleClickNext = () => {
    if (index < images.length - 1) {
      controls.next();
    } else {
      controls.go(0);
    }
  };

  const handleClickThumbnail = (index_: number) => {
    controls.go(index_);
  };

  return (
    <div
      {...tooltipProps}
      className="relative rounded-lg overflow-hidden pt-8 pb-2 px-2"
      data-testid="carousel-tooltip"
      style={{
        backgroundColor: step.backgroundColor,
        color: step.textColor,
      }}
    >
      <div className="flex items-center gap-1 px-2">
        <Button
          {...backProps}
          className="shrink-0 rounded-full mr-2"
          data-testid="button-back"
          isIconOnly
          onPress={handleClickBack}
          size="sm"
        >
          <ChevronLeftIcon className="size-5" />
        </Button>
        {images.map((image, imageIndex) => (
          <Button
            key={image}
            className={cn('shrink-0 rounded-full overflow-hidden border-2 transition-colors', {
              'border-default-100 opacity-50': imageIndex !== index,
            })}
            data-testid={`carousel-thumb-${imageIndex}`}
            isIconOnly
            onPress={() => handleClickThumbnail(imageIndex)}
            size="lg"
            style={imageIndex === index ? { borderColor: step.primaryColor } : undefined}
          >
            <Image
              alt={`Slide ${imageIndex + 1}`}
              className="object-cover"
              fill
              sizes="96px"
              src={image}
            />
          </Button>
        ))}
        <Button
          {...primaryProps}
          className="shrink-0 rounded-full ml-2"
          data-testid="button-primary"
          isIconOnly
          onPress={handleClickNext}
          size="sm"
        >
          <ChevronRightIcon className="size-5" />
        </Button>
      </div>
      <div className="text-center mt-1">
        <Button
          data-testid="button-close"
          onPress={() => controls.stop()}
          size="sm"
          variant="light"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
