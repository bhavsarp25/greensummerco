import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine conditional class names safely with Tailwind. Same `cn()`
 * helper used in the shadcn / 21st.dev sample components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
