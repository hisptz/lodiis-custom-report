import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as _ from 'lodash';
import * as xlsx from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelFileService {

  constructor() {}

  async writeToSingleSheetExcelFile(
    jsonData: any[],
    fileName: string,
    skipHeader = false,
    sheetName = 'sheet1'
  ) {
    try {
      const worksheet = xlsx.utils.json_to_sheet(jsonData, {
        header: _.uniq(_.flattenDeep(_.map(jsonData, (data) => _.keys(data)))),
        skipHeader,
      });
      let workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
      const excelBuffer: any = await xlsx.write(workbook, {
        type: 'array',
        bookType: 'xlsx',
      });
      await this.saveAsExcelFile(excelBuffer, fileName);
    } catch (error) {
      console.log(error.message);
    }
  }

  private async saveAsExcelFile(buffer: any, fileName: string) {
    try {
      const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
      await saveAs(
        data,
        fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION,
      );
    } catch (e) {
      throw e;
    }
  }
}
