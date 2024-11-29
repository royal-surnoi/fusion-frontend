import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yourPipeName',
  standalone: true
})
export class YourPipeNamePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
