# Accessibility

react-joyride aims to be fully accessible, using the [WAI-ARIA](https://www.w3.org/WAI/intro/aria) guidelines to support users of assistive technologies.

## Keyboard navigation

When the tooltip is opened, the TAB key will be hijacked to only focus on form elements \(input\|select\|textarea\|button\|object\) within its contents. Elements outside the tooltip won't receive focus.

When the tooltip is closed the focus returns to the default.



