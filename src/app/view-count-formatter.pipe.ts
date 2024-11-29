import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'viewCountFormatter'
})
export class ViewCountFormatterPipe implements PipeTransform {

  transform(value: number): string {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    } else {
      return `${value}`;
    }
  }
}
