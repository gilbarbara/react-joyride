import { AppProvider } from './context';
import MultiRouteWrapper from './Wrapper';

export default function MultiRoute() {
  return (
    <AppProvider>
      <MultiRouteWrapper />
    </AppProvider>
  );
}
