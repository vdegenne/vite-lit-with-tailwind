/**
 * 2023 \Valentin Degenne
 */
import {
  unsafeCSS,
  getCompatibleStyle,
  ReactiveElement,
  ReactiveController,
  ReactiveControllerHost,
} from 'lit';
import tailwindStyles from '../tailwind.css?inline';

const instances: Set<ReactiveElement> = new Set();
let darkMode = false;

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

export function withTailwind(inline?: string) {
  return function (target: typeof ReactiveElement) {
    target.addInitializer((instance: ReactiveElement) => {
      new InstancesController(instance);
      const style = getCompatibleStyle(unsafeCSS(inline ?? tailwindStyles));
      (instance.constructor as typeof ReactiveElement).elementStyles.push(
        style
      );
    });
  };
}

export function turnDarkModeOn() {
  document.documentElement.classList.add('dark');
  for (const instance of instances) {
    instance.classList.add('dark');
  }
  darkMode = true;
}
export function turnDarkModeOff() {
  document.documentElement.classList.remove('dark');
  for (const instance of instances) {
    instance.classList.remove('dark');
  }
  darkMode = false;
}

export function toggleDarkMode() {
  if (darkMode) {
    turnDarkModeOff();
  } else {
    turnDarkModeOn();
  }
}
