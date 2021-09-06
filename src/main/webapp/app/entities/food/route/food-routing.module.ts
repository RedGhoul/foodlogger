import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FoodComponent } from '../list/food.component';
import { FoodDetailComponent } from '../detail/food-detail.component';
import { FoodUpdateComponent } from '../update/food-update.component';
import { FoodRoutingResolveService } from './food-routing-resolve.service';

const foodRoute: Routes = [
  {
    path: '',
    component: FoodComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FoodDetailComponent,
    resolve: {
      food: FoodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FoodUpdateComponent,
    resolve: {
      food: FoodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FoodUpdateComponent,
    resolve: {
      food: FoodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(foodRoute)],
  exports: [RouterModule],
})
export class FoodRoutingModule {}
