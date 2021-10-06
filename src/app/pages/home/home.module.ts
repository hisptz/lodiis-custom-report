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
import { ReportTableComponent } from './components/report-table/report-table.component';
import { ReportDownloadComponent } from './components/report-download/report-download.component';
import { ReportNamePipe } from './pipes/report-name.pipe';
import { ReportListComponent } from './components/report-list/report-list.component';
import { MetadataValidatorComponent } from './components/metadata-validator/metadata-validator.component';
import { CustomReportTableComponent } from './components/custom-report-table/custom-report-table.component';
import { FormsModule } from '@angular/forms';

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
    ReportTableComponent,
    ReportDownloadComponent,
    ReportNamePipe,
    ReportListComponent,
    MetadataValidatorComponent,
    CustomReportTableComponent,
  ],
  imports: [CommonModule, SharedModule, HomeRoutingModule,FormsModule],
  entryComponents: [ReportErrorComponent],
})
export class HomeModule {}
