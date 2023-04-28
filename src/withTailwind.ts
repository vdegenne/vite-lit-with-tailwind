import {unsafeCSS, getCompatibleStyle, ReactiveElement} from 'lit';
import tailwindStyles from './tailwind.css?inline';

export function withTailwind(inline: string) {
  return function (target: typeof ReactiveElement) {
    target.addInitializer((instance: ReactiveElement) => {
      console.log(inline ?? tailwindStyles);
      const style = getCompatibleStyle(unsafeCSS(inline ?? tailwindStyles));
      (instance.constructor as typeof ReactiveElement).elementStyles.push(
        style
      );
    });
  };
}
