import { createReducer, on } from "@ngrx/store";
import { AddCustomReport, DeleteCustomReport, EditCustomReport, LoadCustomReport, LoadSuccessCustomReport } from "../actions/custom-report.actions";
import { CustomReportState, initialCustomReportState } from "../states/custom-report.state";
import * as _ from "lodash";
import { state } from "@angular/animations";

export const reducer = createReducer(
 initialCustomReportState,
 on(LoadCustomReport,(state) => ({
     ...state,
     loading:true,
 })),
 on(AddCustomReport,(state,{report}) =>({
     ...state,
     isEdited:false
 })),
 on(DeleteCustomReport,(state,{report}) =>({
...state
 })),

 on(LoadSuccessCustomReport,(state,{reports})=>({
   ...state,
   customReport:[...reports],
   loading:false,
   isEdited:false
 })),
 on(EditCustomReport,(state,{report})=>({
   ...state,
  isEdited:true
 }))

)


export function customReportReducer (state:CustomReportState,action:any):CustomReportState {
  return  reducer(state,action);
}
