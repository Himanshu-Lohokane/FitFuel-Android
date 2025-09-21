/**
 * Date utility functions for the calorie tracker
 */

export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
};

export const getYesterdayDateString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

export const isToday = (dateString: string): boolean => {
  return dateString === getTodayDateString();
};

export const isYesterday = (dateString: string): boolean => {
  return dateString === getYesterdayDateString();
};
