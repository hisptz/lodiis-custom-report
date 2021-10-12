import { createSelector } from "@ngrx/store";
import { report } from "process";
import { Report } from "src/app/shared/models/report.model";
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

export const getCustomReportById = (id) => createSelector(
    getCustomReports,
    (reports:Report[])=>{
       let selectedCustomReport:Report;
  reports.forEach((report:Report)=>{
      if(report.id === id){
        selectedCustomReport = report;
      }
      
  })
  return selectedCustomReport;
    }
)