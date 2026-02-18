import type { Step } from 'react-joyride';

export interface AppState {
  run: boolean;
  stepIndex: number;
  steps: Step[];
  tourActive: boolean;
}
