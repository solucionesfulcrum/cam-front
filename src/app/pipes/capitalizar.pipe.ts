import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizar',
  standalone: true,
  pure: true
})
export class CapitalizarPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    const words = value.split(' ');
    const capitalizedWords = words.map(word => this.capitalizeWord(word));
    return capitalizedWords.join(' ');
  }

  private capitalizeWord(word: string): string {
    if (!word) return word;

    const firstChar = word.charAt(0).toLocaleUpperCase();
    const restChars = word.slice(1).toLocaleLowerCase();
    return firstChar + restChars;
  }

}
