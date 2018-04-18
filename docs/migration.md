# Migration

Version 2 changed radically and you will need to update your component.

## Props

### Renamed \(breaking\)

**allowClicksThruHole** ▶︎ **spotlightClicks**

**disableOverlay** `false` ▶︎ **disableOverlayClicks** `false`

**keyboardNavigation** `true` ▶︎ **disableCloseOnEsc** `false`  
the space, return and tab keys are now controlled with tabIndex

**scrollToSteps** `true` ▶︎ disableScrolling `false`

**showBackButton** `true` ▶︎ **hideBackButton** `false`

**showOverlay** `true` ▶︎ **disableOverlay** `false`

**showStepsProgress** `false` ▶︎ **showProgress** `false`

**tooltipOffset** `30` ▶︎ **tooltipOptions.offset** `15`

**type** `'single'` ▶︎ **continuous** `false`

### Removed \(breaking\)

**autoStart** \(use the `disableBeacon` prop on the first step\)

**offsetParent**

**resizeDebounce**

**resizeDebounceDelay**

## Step

There are a few changes to the step syntax too:

**selector** ▶︎ **target   
**Now it supports HTMLElement and string.

**position** ▶︎ **placement  
**The default is** `bottom` **now

**text** ▶︎ **content**

**type** ▶︎ **event**

**allowClicksThruHole** ▶︎ **spotlightClicks**

**style** ▶︎ **styles**  
The properties have changed. Be sure to update to the new [syntax](styling.md).

