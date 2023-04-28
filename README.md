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

### Modify your `vite.config.js` to active tailwind

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

By default
