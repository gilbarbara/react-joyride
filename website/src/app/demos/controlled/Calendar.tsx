import { forwardRef } from 'react';
import { Calendar as HeroCalendar } from '@heroui/react';
import { parseDate } from '@internationalized/date';

import ContentBox from '~/components/ContentBox';

const Calendar = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="flex flex-col bg-green p-4 text-center">
      <h2 className="text-2xl font-bold mb-2">Calendar</h2>
      <ContentBox>
        <HeroCalendar
          classNames={{
            base: 'bg-transparent shadow-none',
            headerWrapper: 'bg-transparent',
            gridHeader: 'bg-transparent shadow-none',
            gridHeaderRow: 'text-black',
            nextButton: 'text-black size-6',
            prevButton: 'text-black size-6',
            title: 'text-black',
          }}
          defaultValue={parseDate('2026-02-05')}
        />
      </ContentBox>
    </div>
  );
});

export default Calendar;
