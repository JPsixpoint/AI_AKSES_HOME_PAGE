import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a currency value with proper formatting
 */
export function formatCurrency(value: number | string, currency = "USD"): string {
  // Handle different input types
  const numericValue = typeof value === "string" ? parseFloat(value) : value
  
  // Format the currency
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(numericValue)
}

/**
 * Format a date as a relative time (e.g., "2 days ago")
 */
export function formatTimeAgo(date: Date | string): string {
  if (!date) return ""
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    
    if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
      return formatDistanceToNow(dateObj, { addSuffix: true })
    }
    
    return ""
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}

/**
 * Format a date with a specified format
 */
export function formatDate(date: Date | string, formatString = "PPP"): string {
  if (!date) return ""
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    
    if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
      return format(dateObj, formatString)
    }
    
    return ""
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}
