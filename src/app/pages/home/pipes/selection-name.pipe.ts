import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'selectionName',
})
export class SelectionNamePipe implements PipeTransform {
  transform(list: any[]): string {
    return _.map(list, (item) => item.name || '').join(', ');
  }
}
