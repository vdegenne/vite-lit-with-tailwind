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
([Dark mode](#dark-mode) is also supported)

## Installation

### Install this package and tailwindcss

```
npm add -D vite-lit-with-tailwind tailwindcss
```

### Activate tailwind

(Prefer using `tailwind.config.js` so you can use [Tailwindcss VSCode extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss))

```javascript
/* tailwind.config.js */
export default {
  content: ['**/*.{ts,js,html}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

If you use `tailwind.config.js` You'll also need to create `postcss.config.js` to tell Vite to use postcss.

## Details

### Base file

By default, the decorator import all the tailwind layers.

```css
@tailwind base;
@tailwind utilities;
@tailwind components;
```

`utilities` is what is needed to use tailwind class in your template, other layers are just setting some style defaults.

If you wish to change the injected stylesheets, you can always pass them in the decorator.  
For instance:

```css
/* tailwindBase.css */
@tailwind base;
@tailwind utilities; /* classes */

@layer base {
  ...;
}
```

```css
/* elementStyles.css */
:host {
  @apply text-blue-500;
}
```

And then in your element definition file:

```javascript
import tailwindBase from './tailwindBase.css?inline';
import elementStyles from './elementStyles.css?inline';

@withTailwind([tailwindBase, elementStyles])
class MyElement extends LitElement {
  render() {
    return html`<div class="font-bold">...</div>`;
  }
}
```

<span style="color:red">(It's recommended to define tailwind imported styles _and_ your element styles in separate files, because Vite will reprocess CSS files when they change, post-processing tailwind imports on each change may cause slow reloads.)</span>

## Dark mode

By default tailwind uses `media` dark mode, that means classes like `dark:x` will only work when the user system uses dark mode. That's fine in most of the cases, but sometimes you may want to give end-user the choice to select a mode ('light', 'dark', or 'system'), here's how.

First you'll need to change your tailwind config file to include this rule:

```js
/* tailwind.config.js */
export default {
  darkMode: ['class', ':host(.dark)'], // for dark:x classes in Shadow DOMs
  content: ['**/*.{ts,js,html}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

And uses the `ThemeManager` utility class.

```javascript
import {ThemeManager} from 'vite-lit-with-tailwind';

ThemeManager.init();
// Calling this method the first time will set the mode to System,
// and will use 'light'/'dark' theme depending on user system setttings.

// You can change the mode at any time
ThemeManager.mode = ThemeManager.MODES.Dark;
ThemeManager.mode = ThemeManager.MODES.Light;
ThemeManager.mode = ThemeManager.MODES.System;

// The mode is saved in the localstorage
// as to keep the state between page refresh.
// Just make sure to call `init()` early when your app loads.
```

When the theme changes it either adds `class="light"` or `class="dark"` on `<html>` and on all your custom elements using the decorator.

That means, you have to write that:

In the top-level

```html
<style>
  .light {
    ...;
  }
  .dark {
    ...;
  }
</style>
```

to apply global conditional styles.

And in your custom elements you can use `dark:x` in template:

```javascript
class MyElement extends LitElement {
  render() {
    return html` <span class="text-black dark:text-white">Hello</span> `;
  }
}
```

And you can use these css selectors to apply global conditional styles in your element:

```css
:host {
  @apply bg-gray-100; /* default */
}
:host(.dark) {
  @apply bg-gray-600;
  ...;
}
```

_(note: you can always use `:host(.light) to apply rules when `class="light"` is specifically used on your element)_

## Limitations

At the moment you can't use tailwind inside `css` literals.
