import { createAction, props } from "@ngrx/store";
import {Report} from "../../shared/models/report.model";

export enum CustomReportReportActionTypes {
LoadCustomReport ='[Report] Load Custom Report Data',
AddCustomReport = '[Report] Add Custom Report Data',
EditCustomReport = '[Report] Edit Custom Report Data',
DeleteCustomReport = '[Report] Delete Custom Report Data',
LoadSuccessCustomReport = '[Report] Custom Report Loaded Success'
}

export const LoadCustomReport = createAction(
    CustomReportReportActionTypes.LoadCustomReport,
)

export const LoadSuccessCustomReport = createAction(
    CustomReportReportActionTypes.LoadSuccessCustomReport,
    props<{reports:Array<Report>}>()
)

export const AddCustomReport = createAction(
    CustomReportReportActionTypes.AddCustomReport,
    props<{report:Report}>()
)

export const EditCustomReport = createAction(
    CustomReportReportActionTypes.EditCustomReport,
    props<{report:Report}>()
)

export const DeleteCustomReport  = createAction(
    CustomReportReportActionTypes.DeleteCustomReport,
    props<{report:Report}>()
)

