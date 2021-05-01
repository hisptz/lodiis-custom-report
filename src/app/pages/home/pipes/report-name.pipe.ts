import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reportName',
})
export class ReportNamePipe implements PipeTransform {
  transform(reportName: string, date = ''): string {
    const sanitizedDate = date.split('T')[0];
    const reportNamesSections = reportName.split('.');
    return `${reportNamesSections[0] ?? ''}_${sanitizedDate ?? ''}.${
      reportNamesSections[1] ?? ''
    }`;
  }
}
