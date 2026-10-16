import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Is the viewport phone-sized?
 *
 * Subscribes to `matchMedia` through `useSyncExternalStore` rather than copying
 * the value into state inside an effect: the media query *is* an external store,
 * and this way the server snapshot is well-defined and there is no extra render
 * on mount.
 */
export function useIsMobile(): boolean {
  const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    [query],
  )

  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    // Server: no viewport, so assume desktop. The client corrects on hydration.
    () => false,
  )
}
