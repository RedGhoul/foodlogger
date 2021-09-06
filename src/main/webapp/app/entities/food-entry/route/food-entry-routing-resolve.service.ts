import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFoodEntry, FoodEntry } from '../food-entry.model';
import { FoodEntryService } from '../service/food-entry.service';

@Injectable({ providedIn: 'root' })
export class FoodEntryRoutingResolveService implements Resolve<IFoodEntry> {
  constructor(protected service: FoodEntryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFoodEntry> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((foodEntry: HttpResponse<FoodEntry>) => {
          if (foodEntry.body) {
            return of(foodEntry.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FoodEntry());
  }
}
