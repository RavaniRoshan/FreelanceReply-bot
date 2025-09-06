/**
 * @fileoverview This file contains a custom React hook that checks if the
 * current screen width is less than a mobile breakpoint.
 */

import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * A custom React hook that checks if the current screen width is less than
 * a mobile breakpoint.
 * @returns {boolean} True if the screen width is less than the mobile
 * breakpoint, false otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
