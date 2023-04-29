import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {withTailwind} from '../src/withTailwind.js';
// import baseStyles from './my-styles.css?inline';

@customElement('my-element')
@withTailwind()
class E extends LitElement {
  render() {
    return html`<span class="font-bold">Hello World!</span>`;
  }
}

document.body.appendChild(new E());
