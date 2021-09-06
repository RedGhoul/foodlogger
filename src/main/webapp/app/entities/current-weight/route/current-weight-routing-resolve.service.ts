import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICurrentWeight, CurrentWeight } from '../current-weight.model';
import { CurrentWeightService } from '../service/current-weight.service';

@Injectable({ providedIn: 'root' })
export class CurrentWeightRoutingResolveService implements Resolve<ICurrentWeight> {
  constructor(protected service: CurrentWeightService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICurrentWeight> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((currentWeight: HttpResponse<CurrentWeight>) => {
          if (currentWeight.body) {
            return of(currentWeight.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CurrentWeight());
  }
}
