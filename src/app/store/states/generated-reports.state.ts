import { BaseState, initialBaseState } from './base.state';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { GeneratedReport } from '../../shared/models/generated-report.model';

export interface GeneratedReportsState
  extends BaseState,
    EntityState<GeneratedReport> {}

export function selectGeneratedReportsId(report: GeneratedReport): string {
  return report.id;
}

export const generatedReportAdapter = createEntityAdapter<GeneratedReport>({
  selectId: selectGeneratedReportsId,
});

export const initialGeneratedReportsState: GeneratedReportsState = generatedReportAdapter.getInitialState(
  {
    ...initialBaseState,
  }
);

export const {
  selectAll: selectAllGeneratedReports,
  selectEntities: selectGeneratedReportsEntities,
  selectIds: SelectGeneratedReportsIds,
  selectTotal: selectGeneratedReportsCount,
} = generatedReportAdapter.getSelectors();
