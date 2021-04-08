import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { pages } from './pages';
import { OuSelectionComponent } from './components/ou-selection/ou-selection.component';
import { PeSelectionComponent } from './components/pe-selection/pe-selection.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ReportViewComponent } from './components/report-view/report-view.component';
import { CurrentSelectionComponent } from './components/current-selection/current-selection.component';
import { SelectionNamePipe } from './pipes/selection-name.pipe';
import { TableHeadersPipe } from './pipes/table-headers.pipe';
import { TableDataPipe } from './pipes/table-data.pipe';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PaginationPipe } from './pipes/pagination.pipe';
import { ReportErrorComponent } from './components/report-error/report-error.component';

@NgModule({
  declarations: [
    ...pages,
    OuSelectionComponent,
    PeSelectionComponent,
    LoaderComponent,
    ReportViewComponent,
    CurrentSelectionComponent,
    SelectionNamePipe,
    TableHeadersPipe,
    TableDataPipe,
    PaginationComponent,
    PaginationPipe,
    ReportErrorComponent,
  ],
  imports: [CommonModule, SharedModule, HomeRoutingModule],
  entryComponents: [ReportErrorComponent]
})
export class HomeModule {}
