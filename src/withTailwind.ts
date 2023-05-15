/**
 * @license
 * Copyright (c) 2023 Valentin Degenne
 * SPDX-License-Identifier: MIT
 */
import {
  unsafeCSS,
  getCompatibleStyle,
  ReactiveElement,
  ReactiveController,
  CSSResultOrNative,
} from 'lit';
import _tailwindBaseStyles from '../tailwind.css?inline';

const cachedStyleSheets: {[plain: string]: CSSResultOrNative | undefined} = {};

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

function getStylesheet(input: string) {
  return (
    cachedStyleSheets[input] ??
    (cachedStyleSheets[input] = getCompatibleStyle(unsafeCSS(input)))
  );
}

export function withTailwind(
  elementStyles?: string | string[],
  tailwindBase?: string
) {
  return function (target: typeof ReactiveElement) {
    // Here one trick is to called protected method `finalize`
    // to make sure the `elementStyles` static field is
    // initialized with user-custom styles.
    // @ts-ignore
    target.finalize();
    // add tailwind styles
    tailwindBase = tailwindBase ?? _tailwindBaseStyles;
    target.elementStyles.unshift(getStylesheet(tailwindBase));
    // add element-specific styles
    if (elementStyles !== undefined) {
      for (const style of Array.isArray(elementStyles)
        ? elementStyles
        : [elementStyles]) {
        const stylesheet = getStylesheet(style);
        const elementStyles = target.elementStyles;
        if (elementStyles.includes(stylesheet)) {
          return;
        } else {
          elementStyles.push(stylesheet);
        }
      }
    }
    // dark/light mode controller on instances
    target.addInitializer((instance: ReactiveElement) => {
      new InstancesController(instance);
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
