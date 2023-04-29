import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {
  withTailwind,
  turnDarkModeOn,
  turnDarkModeOff,
} from '../src/withTailwind.js';
// import baseStyles from './my-styles.css?inline';

@customElement('e-1')
@withTailwind()
class E1 extends LitElement {
  render() {
    return html`<div class="text-red-500 dark:text-blue-500">Hello e1!</div>`;
  }
}

document.body.appendChild(new E1());
document.body.appendChild(new E1());

setTimeout(() => turnDarkModeOn(), 1000);
setTimeout(() => turnDarkModeOff(), 2000);
