import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'generateStars',
  standalone: true
})
export class GenerateStarsPipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }
  transform(rating: number): string {
    return this.generateStars(Math.round(rating));
  }

  private generateStars(rating: number): string {
    let stars = '';
    for (let i = 0; i < rating; i++) {
      stars += '★';
    }
    for (let i = rating; i < 5; i++) {
      stars += '☆';
    }
    return stars;
  }

}
