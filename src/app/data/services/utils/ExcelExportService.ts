import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() {}

  async exportToExcel(jsonData: any[], headers: { [key: string]: string }, fileName: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    // Agregar las cabeceras con estilo
    const headerRow = worksheet.addRow(Object.values(headers));
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4169E1' } // Color de fondo royalblue
      };
      cell.font = {
        color: { argb: 'FFFFFF' }, // Color de texto blanco
        bold: true // Negrita
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Alineación opcional
    });

    // Agregar datos al worksheet
    jsonData.forEach(item => {
      const rowData = [];
      for (const key of Object.keys(headers)) {
        rowData.push(item[key] || '');
      }
      worksheet.addRow(rowData);
    });

    // Ajustar el ancho de las columnas al contenido
    worksheet.columns = Object.keys(headers).map(key => ({
      header: headers[key],
      key: key,
      width: Math.max(
        ...[headers[key], ...jsonData.map(item => item[key]?.toString() || '')].map(val => val.length)
      ) + 2 // Añade un poco de espacio extra
    }));

    // Generar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, `${fileName}.xlsx`);
  }
}
