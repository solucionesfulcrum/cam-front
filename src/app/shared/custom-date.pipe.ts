import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    const today = new Date();

    const yearDifference = today.getFullYear() - date.getFullYear();
    const monthDifference = today.getMonth() - date.getMonth();
    const dayDifference = today.getDate() - date.getDate();

    if (yearDifference === 0) {
      if (monthDifference === 0) {
        if (dayDifference === 0) {
          return 'Hoy';
        } else if (dayDifference === 1) {
          return 'Ayer';
        } else {
          return `Hace ${dayDifference} días`;
        }
      } else if (monthDifference === 1) {
        return 'Hace 1 mes';
      } else {
        return `Hace ${monthDifference} meses`;
      }
    } else if (yearDifference === 1 && monthDifference < 0) {
      return 'Hace 11 meses';
    } else if (yearDifference === 1 && monthDifference >= 0) {
      return 'Hace 1 año';
    } else {
      return `Hace ${yearDifference} años`;
    }
  }
}