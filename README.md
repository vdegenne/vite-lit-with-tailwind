# vite-lit-with-tailwind

```javascript
import {LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {withTailwind} from 'vite-lit-with-tailwind';

@customElement('my-element')
@withTailwind()
class MyElement extends LitElement {
  render() {
    return html` <div class="font-bold">...</div> `;
  }
}
```

Now you can use the classes in your templates.

## Installation

### Install this package and tailwindcss

```
npm add -D vite-lit-with-tailwind tailwindcss
```

### Modify your `vite.config.js` to activate tailwind

```javascript
...
import tailwindcss from 'tailwindcss';

export default defineConfig({
  ...
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          content: ['./src/**/*.ts'] // your files
        })
      ],
    },
  }
})
```

## Details

By default, the decorator import these css rules :

````css
@tailwind base;
@tailwind utilities;
@tailwind components;
``

So you can use the classes in your template.  
If you wish to change the injected stylesheet, you can always pass one as the decorator argument.  
For instance:

```css
/* my-styles.css */

:host {
  @apply text-blue-500;
}
````

_(this file won't import any tailwind classes in the html template)_

```javascript
import myStyles from './my-styles.css?inline';

@withTailwind(myStyles)
class MyElement extends LitElement {
  render() {
    // Here the text will be blue but the `font-bold`
    // class doesn't have effect anymore.
    return html`<div class="font-bold">...</div>`;
  }
}
```

## Limitations

You can use tailwind inside `css` literals.