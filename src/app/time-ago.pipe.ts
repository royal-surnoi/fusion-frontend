import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { DatePipe } from '@angular/common';
 
@Pipe({
  name: 'timeAgo',
  pure: true,
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}
 
  transform(value: Date | string | null): string {
    if (!value) return '';
 
    let date: Date;
    if (typeof value === 'string') {
      date = new Date(value);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return ''; // Invalid date string
      }
    } else {
      date = value; // It's already a Date object
    }
 
    const now = new Date();
    const millisecondsDiff = now.getTime() - date.getTime();
    const secondsDiff = Math.round(millisecondsDiff / 1000);
    const minutesDiff = Math.round(secondsDiff / 60);
    const hoursDiff = Math.round(minutesDiff / 60);
    const daysDiff = Math.round(hoursDiff / 24);
 
    if (daysDiff === 0) {
      // Today
      return `Today ${this.formatTime(date)}`;
    } else if (daysDiff === 1 && now.getDate() - 1 === date.getDate()) {
      // Yesterday
      return `Yesterday ${this.formatTime(date)}`;
    } else if (daysDiff < 7) {
      // Within a week
      return `${daysDiff} days ago`;
    } else {
      // More than a week ago
      return this.formatDateTime(date);
    }
  }
 
  private formatTime(date: Date): any {
    const datePipe = new DatePipe(this.locale);
    return datePipe.transform(date, 'shortTime');
  }
 
  private formatDateTime(date: Date): any {
    const datePipe = new DatePipe(this.locale);
    return datePipe.transform(date, 'medium');
  }
}
 
 