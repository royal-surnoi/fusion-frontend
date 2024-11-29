import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ActivityActions = createActionGroup({
  source: 'Activity',
  events: {
    'Load Activitys': emptyProps(),
    'Load Activitys Success': props<{ data: unknown }>(),
    'Load Activitys Failure': props<{ error: unknown }>(),
  }
});
