/**
 * 2023 \Valentin Degenne
 */
import {
  unsafeCSS,
  getCompatibleStyle,
  ReactiveElement,
  ReactiveController,
} from 'lit';
import tailwindStyles from '../tailwind.css?inline';

const instances: Set<ReactiveElement> = new Set();

class InstancesController implements ReactiveController {
  _host: ReactiveElement;

  constructor(host: ReactiveElement) {
    (this._host = host).addController(this);
  }

  hostConnected(): void {
    instances.add(this._host);
  }

  hostDisconnected(): void {
    instances.delete(this._host);
  }
}

export function withTailwind(inline?: string | string[]) {
  return function (target: typeof ReactiveElement) {
    target.addInitializer((instance: ReactiveElement) => {
      new InstancesController(instance);
      const styles = [
        ...(inline !== undefined
          ? Array.isArray(inline)
            ? inline
            : [inline]
          : tailwindStyles),
      ];
      for (const style of styles) {
        // const style = getCompatibleStyle(unsafeCSS(inline ?? tailwindStyles));
        (instance.constructor as typeof ReactiveElement).elementStyles.push(
          getCompatibleStyle(unsafeCSS(style))
        );
      }
    });
  };
}

const localStorageHandler = 'vite-lit-with-tailwind';
type ModeValues = (typeof ThemeManager.MODES)[keyof typeof ThemeManager.MODES];

export class ThemeManager {
  static MODES = {
    Light: 'light',
    Dark: 'dark',
    System: 'system',
  } as const;

  static #active = false;
  static #mode: ModeValues = this.MODES.System;
  static #lightQuery = window.matchMedia('(prefers-color-scheme: light)');
  static #darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  static get prefersColorScheme(): 'light' | 'dark' | undefined {
    if (this.#darkQuery.matches) {
      return 'dark';
    } else if (this.#lightQuery.matches) {
      return 'light';
    }
    return undefined;
  }

  static get appliedTheme() {
    if (document.documentElement.classList.contains('dark')) {
      return 'dark';
    } else if (document.documentElement.classList.contains('light')) {
      return 'light';
    } else {
      return undefined;
    }
  }

  static get mode() {
    return this.#mode;
  }
  static set mode(value: ModeValues) {
    this.#mode = value;
    this.#applyThemeToDOM();
    this.#saveModeInLocalStorage();
  }

  static init() {
    if (this.#active) {
      return;
    }
    this.#active = true;

    // The light media query only get triggered
    // when the dark one is changed
    // this.#lightQuery.addEventListener(
    //   'change',
    //   this.onPrefersColorSchemeChange.bind(this)
    // );
    this.#darkQuery.addEventListener(
      'change',
      this.#onPrefersColorSchemeChange.bind(this)
    );

    this.#loadModeValue();
    this.#saveModeInLocalStorage();
    this.#applyThemeToDOM();
  }

  static #onPrefersColorSchemeChange(e: MediaQueryListEvent) {
    this.#applyThemeToDOM();
  }

  static #loadModeValue() {
    this.#mode =
      (localStorage.getItem(`${localStorageHandler}:mode`) as ModeValues) ||
      this.MODES.System;
  }
  static #saveModeInLocalStorage() {
    localStorage.setItem(`${localStorageHandler}:mode`, this.#mode);
  }

  static #resolveTheme() {
    switch (this.#mode) {
      case 'light':
      case 'dark':
        return this.#mode;
      case 'system':
        switch (this.prefersColorScheme) {
          case 'light':
          case 'dark':
            return this.prefersColorScheme;
          default:
            // undetermined (default to light)
            return 'light';
        }
    }
  }

  static #applyThemeToDOM() {
    const theme = this.#resolveTheme();
    if (theme == this.appliedTheme) {
      return;
    }
    this.#removeThemeClassesFromCandidates();
    document.documentElement.classList.add(theme);
    for (const instance of instances) {
      instance.classList.add(theme);
    }
  }

  static #removeThemeClassesFromCandidates() {
    ['light', 'dark'].forEach((theme) => {
      document.documentElement.classList.remove(theme);
      for (const instance of instances) {
        instance.classList.remove(theme);
      }
    });
  }
}
