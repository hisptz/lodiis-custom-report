import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'tableHeaders'
})
export class TableHeadersPipe implements PipeTransform {

  transform(value: any[]): string[] {
    const dataRow = value[0];
    return _.keys(dataRow);
  }

}
