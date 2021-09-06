import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFoodDay, FoodDay } from '../food-day.model';
import { FoodDayService } from '../service/food-day.service';

@Injectable({ providedIn: 'root' })
export class FoodDayRoutingResolveService implements Resolve<IFoodDay> {
  constructor(protected service: FoodDayService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFoodDay> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((foodDay: HttpResponse<FoodDay>) => {
          if (foodDay.body) {
            return of(foodDay.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FoodDay());
  }
}
