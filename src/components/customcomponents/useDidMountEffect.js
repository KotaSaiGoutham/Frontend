// src/hooks/useDidMountEffect.js
import { useEffect, useRef } from 'react';

/**
 * A custom useEffect hook that runs the effect callback only once on initial mount,
 * even in React.StrictMode. It will still re-run on dependency changes after the initial mount.
 *
 * This is primarily for development convenience to prevent double API calls
 * during the initial mount phase when StrictMode is active.
 *
 * @param {Function} effect - The effect function to run.
 * @param {Array} dependencies - The dependency array for useEffect.
 */
const useDidMountEffect = (effect, dependencies) => {
  const didMountRef = useRef(false); // Tracks if the component has mounted (first render pass)

  useEffect(() => {
    // Check if it's the first time this effect is running in a component's lifecycle.
    // In StrictMode, this will be false for the very first render, and then true for the simulated second render.
    if (didMountRef.current) {
      // If didMountRef.current is true, it means it's either:
      // 1. A subsequent render due to a dependency change (after initial mount).
      // 2. The second render pass during StrictMode's initial mount.
      // In both cases, we want the effect to run now.
      return effect();
    } else {
      // This branch runs only on the *very first* render pass when the component first mounts.
      // We mark it as mounted and skip running the effect function on this pass.
      didMountRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies); // Pass the dependencies from the component using this hook
};

export default useDidMountEffect;