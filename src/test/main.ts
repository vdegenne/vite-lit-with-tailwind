import {LitElement, PropertyValueMap, html, nothing, unsafeCSS} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {withTailwind, ThemeManager} from '../withTailwind.js';
// import tailwindBase from './tailwindBase.css?inline';
import elementStyles from './elementStyles.css?inline';

@customElement('e-1')
@withTailwind(elementStyles)
class E extends LitElement {
  @state() mode = ThemeManager.mode;
  @property({attribute: true, reflect: true})
  class!: string;

  render() {
    console.log('render');
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
      <div
        class="text-gray-600 dark:text-gray-100 py-2"
        ?hide=${this.mode !== ThemeManager.MODES.System}
      >
        Your system is using <b>${ThemeManager.appliedTheme}</b> theme
      </div>

      <p>This page uses:</p>

      <h3>Global Styles (in document's body)</h3>
      <pre>
${`<style>
  .light {
    @apply bg-green-100;
  }
  .dark {
    @apply bg-gray-500;
  }
</style>`}
</pre>
      <br />

      <h3>Shadow DOM/Custom element Styles</h3>
      <pre>
${`:host {
  @apply text-gray-600;
}
:host(.dark) {
  @apply text-gray-100;
}
:host(.light) h3 {
  @apply underline;
}`}
</pre>
      <br />

      <h3>Custom element in-class styles</h3>
      <pre>
${`<span
  class="m-6 p-3 font-bold bg-gray-600 text-white dark:text-black dark:bg-pink-300"
  >
  Hello World!
</span>`}</pre
      >
      <br />
      <span
        class="m-6 p-3 font-bold bg-gray-600 text-white dark:text-black dark:bg-pink-300"
        >Hello World!</span
      >
    `;
  }

  _lightMode() {
    this.mode = ThemeManager.mode = ThemeManager.MODES.Light;
  }
  _darkMode() {
    this.mode = ThemeManager.mode = ThemeManager.MODES.Dark;
  }
  _systemMode() {
    this.mode = ThemeManager.mode = ThemeManager.MODES.System;
  }

  protected async firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): Promise<void> {
    ThemeManager.init();
    this.mode = ThemeManager.mode;
  }
}

document.body.appendChild(new E());
