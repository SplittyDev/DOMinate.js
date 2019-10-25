'use strict';

// The DOMinate parser
class DOMParser {

  // Construct a new instance of `DOMParser`
  constructor(src) {
    this.src = src;
    this.pos = 0;
  }
  
  // Skip whitespace tokens
  skipWhitespace() {
    if (this.pos >= this.src.length) return;
    while (/\s/.test(this.src[this.pos])) {
      this.pos += 1;
    }
  }
  
  // Read all tokens
  readAll() {
    const blocks = [];
    let block = null;
    while (block = this.next()) {
      if (block === true) break;
      if (block === false) {
        console.log('Unable to complete parsing.');
        return [];
      }
      blocks.push(block);
    }
    return blocks;
  }
  
  // Validate token stream
  validate(blocks) {
    const countType = t => blocks.filter(b => b.T === t).length;
    const countNames = countType('NAME');
    const countIds = countType('ID');
    const countContent = countType('CONTENT');
    const validateMax1 = t => countType(t) <= 1;
    const propagateError = msg => { console.error(msg); return false; };
    let error = true;
    error &= validateMax1('NAME') || propagateError('Too many element names (max: 1)');
    error &= validateMax1('ID') || propagateError('Too many IDs (max: 1)');
    error &= validateMax1('CONTENT') || propagateError('Too many content blocks (max: 1)');
    return error;
  }
  
  // Parse source into token stream
  parse() {
    const blocks = this.readAll();
    if (!this.validate(blocks)) return void 0;
    return blocks;
  }
  
  // Process the next token
  next() {
    this.skipWhitespace();
    if (this.pos >= this.src.length) {
      return true;
    }
    if (this.pos === 0 && /[a-z_]+/i.test(this.src)) {
      return this.readName();
    }
    switch (this.src[this.pos]) {
      case '.': return this.readClass();
      case '#': return this.readId();
      case '[': return this.readAttr();
      case ':': return this.readContent();
    }
    console.error(`Invalid character: "${this.src[this.pos]}"`);
    console.error(`== Input was: ${this.src}`);
    return false;
  }
  
  // Read an element name
  readName() {
    const ident = /([a-z_]+[a-z0-9_]*)/i.exec(this.src.slice(this.pos))[1];
    this.pos += ident.length;
    return {T:'NAME', val: ident};
  }
  
  // Read a class
  readClass() {
    const ident = /\.(-?[_a-z]+[_a-z0-9-]*)/i.exec(this.src.slice(this.pos))[1];
    this.pos += 1 + ident.length;
    return {T:'CLASS', val: ident};
  }
  
  // Read an ID
  readId() {
    const ident = /#([a-z][_a-z0-9-]*)/i.exec(this.src.slice(this.pos))[1];
    this.pos += 1 + ident.length;
    return {T:'ID', val: ident};
  }
  
  // Read an attribute
  readAttr() {
    const [_, key, value] = (
      /\[([^\t\n\f \/>"'=.#\[\]]+)(?:=((?:"[^"]*")|(?:.*?)))?\]/i
    ).exec(this.src.slice(this.pos));
    this.pos += (value ? 3 : 2) + key.length + (value || '').length;
    return {T:'ATTR', val: {key, value}};
  }
  
  // Read content
  readContent() {
    const content = /:(.*)/.exec(this.src.slice(this.pos))[1];
    this.pos += 1 + content.length;
    return {T: 'CONTENT', val: content.trim()};
  }
}

// The DOMinate utility class
class DOMinate {

  // Create an element
  static _createElement(q) {
  
    // Return q if it's already an HTMLElement
    if (q instanceof HTMLElement) return q;
    
    // Parse the query string into a kind of AST
    const parser = new DOMParser(q);
    const ast = parser.parse();
    
    // Create the element
    const el = document.createElement((ast.filter(n => n.T === 'NAME')[0] || {val: 'div'}).val);
    
    // Add classes
    el.classList.add(...ast.filter(n => n.T === 'CLASS').map(n => n.val));
    
    // Add the ID
    el.id = (ast.filter(n => n.T === 'ID')[0] || {val: el.id}).val;
    
    // Add attributes
    ast.filter(n => n.T === 'ATTR').map(n => n.val)
      .forEach(({key, value}) => el.setAttribute(key, value || ''));
      
    // Add content
    el.innerHTML = (ast.filter(n => n.T === 'CONTENT')[0] || {val: ''}).val;
    
    // Return the finished element
    return el;
  }
  
  static one(el) {
    return el instanceof HTMLElement ? el : DOMinate._createElement(el);
  }
  
  static many(...elements) {
    return elements.map(q => q instanceof HTMLElement ? q : DOMinate._createElement(q));
  }
  
  static append(baseEl, ...elements) {
    baseEl = typeof baseEl === 'string' ? document.querySelector(baseEl) : baseEl;
    DOMinate.many(...elements).map(el => baseEl.appendChild(el));
  }
}
