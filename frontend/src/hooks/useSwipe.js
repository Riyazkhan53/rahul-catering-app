import { useEffect, useRef } from 'react';

/**
 * Custom hook for detecting swipe gestures
 * @param {Object} handlers - Object with onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown callbacks
 * @param {number} minSwipeDistance - Minimum distance for swipe detection (default: 50px)
 * @param {number} maxSwipeTime - Maximum time for swipe (default: 300ms)
 */
export function useSwipe(handlers = {}, minSwipeDistance = 50, maxSwipeTime = 300) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;
      const touchEndTime = Date.now();

      const distanceX = touchEndX - touchStartX.current;
      const distanceY = touchEndY - touchStartY.current;
      const elapsedTime = touchEndTime - touchStartTime.current;

      // Check if swipe is within time limit
      if (elapsedTime > maxSwipeTime) return;

      const absDistanceX = Math.abs(distanceX);
      const absDistanceY = Math.abs(distanceY);

      // Determine swipe direction
      if (absDistanceX > absDistanceY) {
        // Horizontal swipe
        if (absDistanceX >= minSwipeDistance) {
          if (distanceX > 0) {
            handlers.onSwipeRight?.();
          } else {
            handlers.onSwipeLeft?.();
          }
        }
      } else {
        // Vertical swipe
        if (absDistanceY >= minSwipeDistance) {
          if (distanceY > 0) {
            handlers.onSwipeDown?.();
          } else {
            handlers.onSwipeUp?.();
          }
        }
      }
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Cleanup
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers, minSwipeDistance, maxSwipeTime]);

  return elementRef;
}

/**
 * Hook for horizontal swipe navigation (back/forward)
 * @param {Function} onSwipeRight - Callback for right swipe (back)
 * @param {Function} onSwipeLeft - Callback for left swipe (forward)
 */
export function useSwipeNavigation(onSwipeRight, onSwipeLeft) {
  return useSwipe({
    onSwipeRight,
    onSwipeLeft,
  }, 50, 300);
}
