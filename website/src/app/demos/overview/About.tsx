import Section from './Section';

const stats = [
  { label: 'GitHub Stars', value: '7k+' },
  { label: 'Weekly Downloads', value: '700k+' },
  { label: 'React Versions', value: '16.8–19' },
  { label: 'Bundle Size', value: '~22kb' },
];

interface AboutProps {
  withHeader: boolean;
}

export default function About({ withHeader }: AboutProps) {
  return (
    <Section className="demo__about bg-blue" withHeader={withHeader}>
      <div className="demo__about__content w-full max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">About</h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          React Joyride has been helping developers create better onboarding experiences since 2015.
          Used by thousands of applications worldwide.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(stat => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-4xl font-bold">{stat.value}</span>
              <span className="text-white/70 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
