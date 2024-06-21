import { MatPaginatorIntl } from '@angular/material/paginator';

export class MatPaginatorIntlEs extends MatPaginatorIntl {
  public override itemsPerPageLabel = 'Registros por página';
  public override nextPageLabel = 'Página siguiente';
  public override previousPageLabel = 'Página anterior';
  public override firstPageLabel = 'Primera página';
  public override lastPageLabel = 'Última página';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  }
}
