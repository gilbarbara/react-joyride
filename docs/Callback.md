# Callback

You will receive a plain object with the state changes.

Examples:

```
{
  action: 'start',
  controlled: true,
  index: 0,
  lifecycle: 'init',
  size: 4,
  status: 'running',
  step: { the.current.step },
  type: 'tour:start',
}
```

```
{
  action: 'update',
  controlled: true,
  index: 0,
  lifecycle: 'beacon',
  size: 4,
  status: 'running',
  step: { the.current.step },
  type: 'beacon',
}
```

```
{
  action: 'next',
  controlled: true,
  index: 0,
  lifecycle: 'complete',
  size: 4,
  status: 'running',
  step: { the.current.step },
  type: 'step:after',
}
```



You can read more about 

