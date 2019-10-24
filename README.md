# DOMinate.js
> HTML element creation in JS using CSS selectors

Dominate is a small one-file library for creating HTML elements.  
It works its magic by parsing CSS selectors into DOM elements.

## Example

Basic example (an input element):
```js
const el = DOMinate.one('input[required][type=email].foo#email');
// Equivalent: <input required type="email" class="foo" id="email">
```

Advanced example (a fully functioning form):
```js
// Create a container for the form
const elContainer = DOMinate.one('div.container');

// Create the form element
const elForm = DOMinate.one('form[action=#][method=POST]');

// Add form elements to the form
DOMinate.append(elForm,
  'h1: Checkout',
  'br',
  'label[for=firstname]: Firstname:',
  'input[type=text][placeholder=First Name][required]#firstname',
  'label[for=lastname]: Lastname:',
  'input[type=text][placeholder=Last Name][required]#lastname',
  'input[type=text][placeholder=Zip][required]#zip',
  'input[type=submit]'
);

// Append the from to the container
DOMinate.append(elContainer, elForm);

// Append the container to the document body
DOMinate.append('body', elContainer);
```
