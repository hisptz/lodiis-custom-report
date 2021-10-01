import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCustomReportComponent } from './components/edit-custom-report/edit-custom-report.component';
import { MetadataValidatorComponent } from './components/metadata-validator/metadata-validator.component';
import { ReportListComponent } from './components/report-list/report-list.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path:'report',
    component:ReportListComponent   
  },
  {
    path:'validator-report',
    component:MetadataValidatorComponent
  },
  {
    path:'report/:id',
    component:EditCustomReportComponent
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
