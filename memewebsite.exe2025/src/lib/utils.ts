import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem('token'); 
    return !!token; 
  }
  return false;
};