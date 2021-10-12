import { createSelector } from "@ngrx/store";
import { getRootState, State } from "../reducers";
import { CustomReportState } from "../states/custom-report.state";


export const getCustomReportState = createSelector(
    getRootState,
    (state:State) => state.customReportData,
)


export const getCustomReports  = createSelector(
    getCustomReportState,
    (state:CustomReportState) => state.customReport
);

export const getCustomReportLoadingStatus = createSelector(
    getCustomReportState,
    (state:CustomReportState) => state.loading
)
export const getIsEditedStatus = createSelector(
    getCustomReportState,
    (state:CustomReportState) => state.isEdited
)