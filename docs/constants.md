# Constants

Joyride uses a few constants to keep its state and lifecycle.
You should use them in your component for the [events](events.md).

```typescript
import Joyride, { ACTIONS, EVENTS, LIFECYCLE, ORIGIN, STATUS } from 'react-joyride';
```

**ACTIONS** - The action that updated the state.

| Constant | Value |
|----------|-------|
| `ACTIONS.INIT` | `'init'` |
| `ACTIONS.START` | `'start'` |
| `ACTIONS.STOP` | `'stop'` |
| `ACTIONS.RESET` | `'reset'` |
| `ACTIONS.PREV` | `'prev'` |
| `ACTIONS.NEXT` | `'next'` |
| `ACTIONS.GO` | `'go'` |
| `ACTIONS.CLOSE` | `'close'` |
| `ACTIONS.SKIP` | `'skip'` |
| `ACTIONS.UPDATE` | `'update'` |
| `ACTIONS.COMPLETE` | `'complete'` |

**EVENTS** - The type of the event.

| Constant | Value |
|----------|-------|
| `EVENTS.TOUR_START` | `'tour:start'` |
| `EVENTS.STEP_BEFORE_HOOK` | `'step:before_hook'` |
| `EVENTS.STEP_BEFORE` | `'step:before'` |
| `EVENTS.SCROLL_START` | `'scroll:start'` |
| `EVENTS.SCROLL_END` | `'scroll:end'` |
| `EVENTS.BEACON` | `'beacon'` |
| `EVENTS.TOOLTIP` | `'tooltip'` |
| `EVENTS.STEP_AFTER` | `'step:after'` |
| `EVENTS.STEP_AFTER_HOOK` | `'step:after_hook'` |
| `EVENTS.TOUR_END` | `'tour:end'` |
| `EVENTS.TOUR_STATUS` | `'tour:status'` |
| `EVENTS.TARGET_NOT_FOUND` | `'error:target_not_found'` |
| `EVENTS.ERROR` | `'error'` |

**LIFECYCLE** - The step's lifecycle.

| Constant | Value |
|----------|-------|
| `LIFECYCLE.INIT` | `'init'` |
| `LIFECYCLE.READY` | `'ready'` |
| `LIFECYCLE.BEACON` | `'beacon'` |
| `LIFECYCLE.TOOLTIP` | `'tooltip'` |
| `LIFECYCLE.COMPLETE` | `'complete'` |
| `LIFECYCLE.ERROR` | `'error'` |

**ORIGIN** - The origin of the `CLOSE` action.

| Constant | Value |
|----------|-------|
| `ORIGIN.BUTTON_CLOSE` | `'button_close'` |
| `ORIGIN.BUTTON_SKIP` | `'button_skip'` |
| `ORIGIN.BUTTON_PRIMARY` | `'button_primary'` |
| `ORIGIN.KEYBOARD` | `'keyboard'` |
| `ORIGIN.OVERLAY` | `'overlay'` |

**STATUS** - The tour's status.

| Constant | Value |
|----------|-------|
| `STATUS.IDLE` | `'idle'` |
| `STATUS.READY` | `'ready'` |
| `STATUS.WAITING` | `'waiting'` |
| `STATUS.RUNNING` | `'running'` |
| `STATUS.PAUSED` | `'paused'` |
| `STATUS.SKIPPED` | `'skipped'` |
| `STATUS.FINISHED` | `'finished'` |
| `STATUS.ERROR` | `'error'` |

Consult the [source code](https://github.com/gilbarbara/react-joyride/blob/main/src/literals/index.ts) for more information.
