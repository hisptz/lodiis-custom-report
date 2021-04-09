import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

import { TablePagination } from 'src/app/shared/models/table-pagination.model';

@Pipe({
  name: 'pagination',
})
export class PaginationPipe implements PipeTransform {
  transform(tableData: any[], tablePagination: TablePagination): any[] {
    return tablePagination
      ? _.chunk(tableData, tablePagination.itemsPerPage)[
          tablePagination.currentPage - 1
        ]
      : tableData;
  }
}
