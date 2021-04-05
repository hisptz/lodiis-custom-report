import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PeriodFilterComponent } from './containers/period-filter/period-filter.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [PeriodFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    DragDropModule,
  ],
  exports: [PeriodFilterComponent],
})
export class NgxDhis2PeriodFilterModule {}
