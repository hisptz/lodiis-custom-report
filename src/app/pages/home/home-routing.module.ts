import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
    path:'validator-report/:onAddReport',
    component:MetadataValidatorComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
