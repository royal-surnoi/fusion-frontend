
import { createAction, props } from '@ngrx/store';
 
export const loadActivity = createAction('[Activity] Load Activity', props<{ id: number }>());

export const loadActivitySuccess = createAction('[Activity] Load Activity Success', props<{ activity: any }>());

export const loadActivityFailure = createAction('[Activity] Load Activity Failure', props<{ error: any }>());
 
export const submitActivity = createAction('[Activity] Submit Activity', props<{ activityId: number, data: any }>());

export const submitActivitySuccess = createAction('[Activity] Submit Activity Success', props<{ response: any }>());

export const submitActivityFailure = createAction('[Activity] Submit Activity Failure', props<{ error: any }>());
 