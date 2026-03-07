import { type FallbackProps, getErrorMessage } from 'react-error-boundary';

export default function ErrorFallback({ error }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{getErrorMessage(error)}</pre>
    </div>
  );
}
