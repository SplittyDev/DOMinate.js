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
// Create a container and a form
const [elContainer, elForm] = DOMinate.many(
  'div.container',
  'form[action=#][method=POST]'
);

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

## API

DOMinate.one(el: String | HTMLElement): HTMLElement
> Create a DOM element
> 
> Parameters:  
> &nbsp;&nbsp;&nbsp;`el`: `...(String | HTMLElement)` css selector or existing element
> 
> Example: `DOMinate.one('h1.title: Foo');`

DOMinate.many(...elements: String | HTMLElement): HTMLElement[]
> Create multiple DOM elements
> 
> Parameters:  
> &nbsp;&nbsp;&nbsp;`elements`: `...(String | HTMLElement)` css selectors or existing elements
> 
> Example: `DOMinate.many('h1.title: Foo', 'h2.subtitle: Bar');`

DOMinate.append(baseEl: String | HTMLElement, ...elements: String | HTMLElement): void
> Create and append one or more DOM elements to the specified base element
> 
> Parameters:  
> &nbsp;&nbsp;&nbsp;`baseEl`: `String | HTMLElement` css selector or existing element  
> &nbsp;&nbsp;&nbsp;`elements`: `...(String | HTMLElement)` css selectors or existing elements
> 
> Example A: `DOMinate.append('body', 'h1: Foo')`  
> Example B: `DOMinate.append(document.body, 'h1: Foo')`

## History

I started DOMinate.js out of frustration with JavaScript's DOM API for creating elements.

At first I used a purely regex-based parser. That showed me early on that the idea is viable, and also that pure regex parsing is a terrible idea. So I wrote a tokenizer and validator, and added some utility functions to make working with it easier, like appending to existing elements and supporting both selectors and elements everywhere.

If you're interested, here's a peek into the terrible code this started out with:
```js
function parse(q) {
  const rxName = '(?<name>[_a-z]+)';
  const rxAttr = '(?<attr>(?:\\[[_a-z\\-]+(?:=[ #_a-z0-9\\-]+)?\\])+)?';
  const rxCls = '(?<cls>(?:\\.[_a-z]+)*)';
  const rxId = '(?:#(?<id>[_a-z]+))?';
  const rxRaw = `${rxName}${rxAttr}${rxCls}${rxId}`;
  const rx = new RegExp(rxRaw, 'ig');
  const [_, _name, _attr, _cls, _id] = rx.exec(q);
  console.log(`{name: ${_name}; attr: ${_attr}; cls: ${_cls}; id: ${_id}`);
  const attr = _attr
    .replace(/\[([_a-z]+)(?:=(?:(.*?)|(?:"(.*?)")))?\]/ig, '$1=$2;')
    .split(';').filter(x => x.length > 0).map(x => x.split('=', 2));
  const cls = _cls.split('.').filter(x => x.length > 0);
  const el = document.createElement(_name);
  attr.forEach(([k, v]) => el.setAttribute(k, v));
  el.classList.add(...cls);
  el.id = _id || el.id;
  return el;
}
```
