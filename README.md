# vite-lit-with-tailwind

```javascript
import {withTailwind} from 'vite-lit-with-tailwind';

@customElement('my-element')
@withTailwind()
class MyElement extends LitElement {
  render() {
    return html` <div class="font-bold text-red-500">...</div> `;
  }
}
```

([DEMO](https://vdegenne.github.io/vite-lit-with-tailwind/))

### Menu

- [Details](#details)
- [Installation](#installation)
- [Manual Dark mode](#manual-dark-mode)

## Features

- Easy install.
- Declarative customizable and easy to use decorator.
- Constructed Stylesheets Cache system.
- [Dark mode System](#dark-mode) is also supported.

## Details

Behind the scene, the decorator only injects tailwind utilities into your custom element:

```css
@tailwind utilities;
```

So you can use the classes in your template.

### _Element styles_ VS _Tailwind base styles_

It's usually a good thing to write your tailwind base styles and your custom elements styles into separate files.

Here's different approaches using the decorator:

### One style with default tailwind:

```javascript
import elementStyles from './element-styles.css?inline'

@withTailwind(elementStyles)
```

### Multiple styles with default tailwind:

```javascript
import elementStyles1 from './element-styles1.css?inline'
import elementStyles2 from './element-styles2.css?inline'

@withTailwind([elementStyles1, elementStyles2])
```

### No element styles, custom tailwind base definition:

```javascript
import tailwindBase from './tailwind-base.css?inline'

@withTailwind([], tailwindBase)
```

As you can see, the first argument is an array containing element styles (optional),  
and the second argument is the tailwind base definition (optional too.)

<details>
<summary>Detailed example</summary>

```css
/* tailwindBase.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```css
/* elementStyles.css */
:host {
  @apply bg-gray-500;
}
```

```typescript
/* my-element.ts */
import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {withTailwind} from 'vite-lit-with-tailwind.js';
import elementStyles from './elementStyles.css?inline';
import tailwindBase from '../tailwindBase.css?inline';

@customElement('my-element')
@withTailwind(elementStyles, tailwindBase)
class MyElement extends LitElement {
  render() {
    return html`<div class="text-red-500 p-5">...</div> `;
  }
}
```

</details>

## Installation

### Install this package

```
npm add -D vite-lit-with-tailwind
```

### Create tailwind config file

Create `tailwind.config.js` at the root of your project, with this configuration file:

```javascript
export default {
  content: [
    // change this part to match your files
    'src/**',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Create postcss config file

This file only tells `vite` to activate postcss (therefore tailwind).
Paste this content in `postcss.config.js` at the root of your project too.

```js
export default {
  plugins: {
    tailwindcss: {},
  },
};
```

That's about all, now you can use tailwind and the decorator.  
If you want to support manual dark mode, keep reading!

## "Manual" Dark mode

By default tailwind uses `media` dark mode, that means classes like `dark:x` will only work when the user system uses dark mode. That's fine in most of cases, but sometimes you may want to give end-user the choice to select a mode ('light', 'dark', or 'system'), here's how:

First you'll need to add this line in your `tailwind.config.js`:

```js
darkMode: ['class', ':host(.dark)'], // for dark:x classes in Shadow DOMs
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

_(note: you can always use `:host(.light)` to apply rules when `class="light"` is specifically used on your element)_

## Limitations

At the moment you can't use tailwind inside `css` literals.

## License

MIT Copyright (c) 2023 Valentin Degenne
