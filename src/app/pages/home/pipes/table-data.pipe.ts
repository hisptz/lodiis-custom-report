import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'tableData',
})
export class TableDataPipe implements PipeTransform {
  transform(dataValues: any[]): Array<string[]> {
    return _.map(dataValues || [], (dataRow) => _.values(dataRow));
  }
}
