import {LitElement, html, unsafeCSS} from 'lit';
import {customElement} from 'lit/decorators.js';
import {withTailwind, ThemeManager} from '../withTailwind.js';
import tailwindBase from './tailwindBase.css?inline';
import elementStyles from './elementStyles.css?inline';

@customElement('e-1')
@withTailwind([tailwindBase, elementStyles])
class E extends LitElement {
  render() {
    return html`
      <button class="px-2 py-1 cursor-pointer" @click=${this._lightMode}>
        Light
      </button>
      <button class="px-2 py-1 cursor-pointer" @click=${this._darkMode}>
        Dark
      </button>
      <button class="px-2 py-1 cursor-pointer" @click=${this._systemMode}>
        System
      </button>
      <div class="text-gray-600 dark:text-gray-100 m-5">Hello World!</div>
    `;
  }

  _lightMode() {
    ThemeManager.mode = ThemeManager.MODES.Light;
  }
  _darkMode() {
    ThemeManager.mode = ThemeManager.MODES.Dark;
  }
  _systemMode() {
    ThemeManager.mode = ThemeManager.MODES.System;
  }
}

document.body.appendChild(new E());

ThemeManager.init();
