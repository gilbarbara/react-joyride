export default function BeaconComponent() {
  return (
    <span className="inline-flex size-8">
      <span className="absolute inset-0 animate-ping rounded-full bg-[rgba(48,48,232,0.6)]" />
      <span className="absolute inset-0 rounded-full bg-[rgba(48,48,232,0.6)]" />
    </span>
  );
}
