# DOMinate.js
> HTML element creation in JS using CSS selectors

Dominate is a small one-file library for creating HTML elements.  
It works its magic by parsing CSS selectors into DOM elements.

## Example
```js
const el = DOMinate.one('input[required][type=email].foo#email');
// Equivalent: <input required type="email" class="foo" id="email">
```
