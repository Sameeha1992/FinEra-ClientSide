// src/lib/utils.ts

/**
 * Helper function to combine multiple class names conditionally.
 * It ignores false, undefined, or null values.
 *
 * Usage:
 *   cn("base-class", isActive && "active-class", size === "large" && "text-lg")
 *   → "base-class active-class text-lg" (if isActive and size are true)
 */
export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}
