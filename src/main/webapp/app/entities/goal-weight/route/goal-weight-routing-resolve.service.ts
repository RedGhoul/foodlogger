import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGoalWeight, GoalWeight } from '../goal-weight.model';
import { GoalWeightService } from '../service/goal-weight.service';

@Injectable({ providedIn: 'root' })
export class GoalWeightRoutingResolveService implements Resolve<IGoalWeight> {
  constructor(protected service: GoalWeightService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGoalWeight> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((goalWeight: HttpResponse<GoalWeight>) => {
          if (goalWeight.body) {
            return of(goalWeight.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new GoalWeight());
  }
}
