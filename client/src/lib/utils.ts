/**
 * @fileoverview This file contains utility functions for the client.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges CSS classes together.
 * @param {...ClassValue[]} inputs - The CSS classes to merge.
 * @returns {string} The merged CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
