import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomReportListComponent } from './pages/custom-report-list/rcustom-report-list.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'report',
    component: CustomReportListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
