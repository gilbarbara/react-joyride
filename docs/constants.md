# Constants

Joyride uses a few constants to keep its state and lifecycle.  
You should use them in your component for the callback events.

```javascript
import Joyride, { ACTIONS, EVENTS, LIFECYCLE, STATUS } from 'react-joyride';
```

ACTIONS - The action that updated the state.

EVENTS - The type of the event.

LIFECYCLE - The step lifecycle.

STATUS - The tour's status.

Consult the [source code](https://github.com/gilbarbara/react-joyride/blob/main/src/literals/index.ts) for more information.
