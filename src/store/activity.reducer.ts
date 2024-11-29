
import { createReducer, on } from '@ngrx/store';

import * as ActivityActions from './activity.actions';
 
export interface ActivityState {

  activity: any;

  loading: boolean;

  error: any;

  submissionResponse: any;

}
 
export const initialState: ActivityState = {

  activity: null,

  loading: false,

  error: null,

  submissionResponse: null

};
 
export const activityReducer = createReducer(

  initialState,

  on(ActivityActions.loadActivity, state => ({ ...state, loading: true })),

  on(ActivityActions.loadActivitySuccess, (state, { activity }) => ({ ...state, activity, loading: false })),

  on(ActivityActions.loadActivityFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(ActivityActions.submitActivity, state => ({ ...state, loading: true })),

  on(ActivityActions.submitActivitySuccess, (state, { response }) => ({ ...state, submissionResponse: response, loading: false })),

  on(ActivityActions.submitActivityFailure, (state, { error }) => ({ ...state, error, loading: false }))

);
 