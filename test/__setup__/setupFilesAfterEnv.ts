import 'jest';
import '@testing-library/jest-dom';

import { configure } from '@testing-library/react';
import * as extendedMatchers from 'jest-extended';

expect.extend(extendedMatchers);

configure({ testIdAttribute: 'data-test-id' });
