---
description: >-
  If you are coming from V1, make sure to follow this guide to upgrade your
  setup.
---

# Migration

## Styling

V2 uses inline styles instead of SCSS/CSS, so you must remove the imports. Check [Styling](styling.md) for more information.

## Props

### Renamed \(breaking\)

**allowClicksThruHole** ▶︎ removed (clicks through the spotlight are now always enabled)

**disableOverlay** `false` ▶︎ **disableOverlayClicks** `false`

**keyboardNavigation** `true` ▶︎ **disableCloseOnEsc** `false`  
the space, return, and tab keys are now controlled with tabIndex

**scrollToSteps** `true` ▶︎ disableScrolling `false`

**showBackButton** `true` ▶︎ **hideBackButton** `false`

**showOverlay** `true` ▶︎ **disableOverlay** `false`

**showStepsProgress** `false` ▶︎ **showProgress** `false`

**tooltipOffset** `30` ▶︎ Use the step **offset** prop

**type** `'single'` ▶︎ **continuous** `false`

### Removed \(breaking\)

**autoStart** \(use the `disableBeacon` prop on the first step\)

**offsetParent**

**resizeDebounce**

**resizeDebounceDelay**

## Step

There are a few changes to the step syntax too:

**selector** ▶︎ **target**  
Now, it supports HTMLElement and string.

**position** ▶︎ **placement**  
The default is **bottom** now.

**text** ▶︎ **content**

**type** ▶︎ **event**

**allowClicksThruHole** ▶︎ removed

**style** ▶︎ **styles**  
The properties have changed. Be sure to update to the new [syntax](styling.md).

