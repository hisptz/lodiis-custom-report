import { createSelector } from '@ngrx/store';
import { find } from 'lodash';
import { GeneratedReport } from 'src/app/shared/models/generated-report.model';
import { getRootState, State } from '../reducers';
import { selectAllGeneratedReports } from '../states/generated-reports.state';

export const getGeneratedReportsState = createSelector(
  getRootState,
  (state: State) => state.generatedReports
);

export const getAllGeneratedReports = createSelector(
  getGeneratedReportsState,
  selectAllGeneratedReports
);

export const getSelectedGeneratedReport = (id) =>
  createSelector(
    getAllGeneratedReports,
    (generatedReports: GeneratedReport[]) => {
      const report = find(
        generatedReports,
        (generatedReport) => generatedReport.id === id
      );

      return report ?? null;
    }
  );
