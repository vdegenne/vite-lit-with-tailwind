# vite-lit-with-tailwind

```javascript
import {LitElement, html} from 'lit';
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

### Base file

By default, the decorator import these css rules :

```css
@tailwind base;
@tailwind utilities;
@tailwind components;
```

So you can use the classes in your template.  
If you wish to change the injected stylesheet, you can always pass one as the decorator argument.  
For instance:

```css
/* my-styles.css */

:host {
  @apply text-blue-500;
}
```

_(this file won't import any tailwind classes in the html template)_  
and then

```javascript
import myStyles from './my-styles.css?inline';

@withTailwind(myStyles)
class MyElement extends LitElement {
  render() {
    // Here the text will be blue but the `font-bold`
    // class doesn't have any effect anymore.
    return html`<div class="font-bold">...</div>`;
  }
}
```

## Dark mode

By default tailwind uses `media` dark mode, that means classes like `dark:x` will only work when the user's system uses dark mode. That's fine in most of the case, but sometimes you may want to decide which theme you want to use based on user's preference.  
Problem is `tailwindcss` doesn't work well with Shadow DOMs.  
To have control over this, you have to change your `vite.config.js` file to include this line:

```js
css: {
  postcss: {
    plugins: [
      tailwindcss({
        darkMode: ['class', ':host(.dark)'], // <-
        content: ['...'],
      }),
    ];
  }
}
```

And uses `vite-lit-with-tailwind` specialized methods.

```javascript
import {
  turnDarkModeOn,
  turnDarkModeOff,
  toggleDarkMode
} from 'vite-lit-with-tailwind';

// This function adds `dark` class to `<html>`,
// and to all Shadow DOMs using `@withTailwind` decorator.
turnDarkModeOn()

// This function removes `dark` class from `<html>`,
// and from all Shadow DOMs using `@withTailwind` decorator.
turnDarkModeOff()

// This function calls one of the function above depending
// on the current state of the theme.
toggleDarkMode()
```

## Limitations

You can't use tailwind inside `css` literals.
