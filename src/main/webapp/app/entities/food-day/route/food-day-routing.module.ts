import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FoodDayComponent } from '../list/food-day.component';
import { FoodDayDetailComponent } from '../detail/food-day-detail.component';
import { FoodDayUpdateComponent } from '../update/food-day-update.component';
import { FoodDayRoutingResolveService } from './food-day-routing-resolve.service';

const foodDayRoute: Routes = [
  {
    path: '',
    component: FoodDayComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FoodDayDetailComponent,
    resolve: {
      foodDay: FoodDayRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FoodDayUpdateComponent,
    resolve: {
      foodDay: FoodDayRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FoodDayUpdateComponent,
    resolve: {
      foodDay: FoodDayRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(foodDayRoute)],
  exports: [RouterModule],
})
export class FoodDayRoutingModule {}
