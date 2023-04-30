/**
 * To generate this file, along with postcss.config.js
 * you can also run `npx tailwindcss init -p`
 *
 * To use this file, you will need
 * `npm add -D tailwindcss autoprefixer [postcss]
 *
 * You don't need `postcss` in Vite (just generating the config file)
 * because Vite use postcss by default.
 *
 * To use Tailwind in LitElement, you will just need to import the style file
 * ```
 * import myStyles from './my-styles.css?inline'
 * ```
 * and unsafeCSS from lit
 * ```
 * import {unsafeCSS} from 'lit'
 *
 * static styles = [unsafeCSS(myStyles)]
 * ```
 */

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', ':host(.dark)'],
  content: ['**/*.{ts,js,html}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
