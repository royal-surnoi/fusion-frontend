
import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';

import { catchError, map, mergeMap } from 'rxjs/operators';

import * as ActivityActions from './activity.actions';

import { ActivityService } from '../app/activity.service';
 
@Injectable()

export class ActivityEffects {

  loadActivity$ = createEffect(() =>

    this.actions$.pipe(

      ofType(ActivityActions.loadActivity),

      mergeMap(action =>

        this.activityService.getActivitiesForCandidate(action.id).pipe(

          map(activity => ActivityActions.loadActivitySuccess({ activity })),

          catchError(error => of(ActivityActions.loadActivityFailure({ error })))

        )

      )

    )

  );
 
  submitActivity$ = createEffect(() =>

    this.actions$.pipe(

      ofType(ActivityActions.submitActivity),

      mergeMap(action =>

        this.activityService.submitActivity(action.activityId, action.data).pipe(

          map(response => ActivityActions.submitActivitySuccess({ response })),

          catchError(error => of(ActivityActions.submitActivityFailure({ error })))

        )

      )

    )

  );
 
  constructor(

    private actions$: Actions,

    private activityService: ActivityService

  ) {}

}
 