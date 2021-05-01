import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reportName',
})
export class ReportNamePipe implements PipeTransform {
  transform(reportName: string, date = ''): string {
    const sanitizedDate = date.split('T')[0];
    return `${reportName}_${sanitizedDate}`;
  }
}
