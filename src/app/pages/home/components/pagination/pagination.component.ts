import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TablePagination } from 'src/app/shared/models/table-pagination.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit, AfterViewInit {
  @Input() totalItems: number;
  @Output()
  paginate: EventEmitter<TablePagination> = new EventEmitter<TablePagination>();
  itemsPerPage: string[];
  selectedItemsPerPage = '50';
  currentlySelectedPage: number;

  constructor() {}

  ngOnInit(): void {
    this.itemsPerPage = ['50', '100', '500', '1000', '5000', '10000'];
    this.currentlySelectedPage = 1;
    this.onPaginate();
  }

  ngAfterViewInit(): void {
  }

  onPaginate(): void {
    const pagination = {
      currentPage: this.currentlySelectedPage,
      itemsPerPage: Number(this.selectedItemsPerPage),
    };
    this.paginate.emit(pagination);
  }

  onChangeItemsPerPage(event) {
    this.selectedItemsPerPage = event.value;
    this.onPaginate();
  }

  getRangeOfCurrentItems() {
    const endValue =
      this.currentlySelectedPage * Number(this.selectedItemsPerPage);
    const startValue = endValue - Number(this.selectedItemsPerPage) + 1;
    return `${startValue}  - ${
      endValue < (this.totalItems || 0) ? endValue : this.totalItems || 0
    }`;
  }

  canPaginateForward(): boolean {
    const lastPage = Math.ceil(
      this.totalItems / Number(this.selectedItemsPerPage)
    );
    return lastPage > this.currentlySelectedPage ;
  }

  canPaginateBackward(): boolean {
    return this.currentlySelectedPage  > 1;
  }

  onOpenFirstPage(): void {
    this.currentlySelectedPage = 1;
    this.onPaginate();
  }

  onOpenLastPage(): void {
    const lastPage = Math.ceil(
      this.totalItems / Number(this.selectedItemsPerPage)
    );
    this.currentlySelectedPage = lastPage;
    this.onPaginate();
  }

  onOpenNextPage(): void {
    const lastPage = Math.ceil(
      this.totalItems / Number(this.selectedItemsPerPage)
    );
    const page = this.currentlySelectedPage + 1;
    this.currentlySelectedPage = page > lastPage ? lastPage : page;
    this.onPaginate();
  }

  onOpenPreviousPage(): void {
    const page = this.currentlySelectedPage - 1;
    this.currentlySelectedPage = page > 1 ? page : 1;
    this.onPaginate();
  }
}
