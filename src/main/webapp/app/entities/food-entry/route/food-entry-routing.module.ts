import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FoodEntryComponent } from '../list/food-entry.component';
import { FoodEntryDetailComponent } from '../detail/food-entry-detail.component';
import { FoodEntryUpdateComponent } from '../update/food-entry-update.component';
import { FoodEntryRoutingResolveService } from './food-entry-routing-resolve.service';

const foodEntryRoute: Routes = [
  {
    path: '',
    component: FoodEntryComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FoodEntryDetailComponent,
    resolve: {
      foodEntry: FoodEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FoodEntryUpdateComponent,
    resolve: {
      foodEntry: FoodEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FoodEntryUpdateComponent,
    resolve: {
      foodEntry: FoodEntryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(foodEntryRoute)],
  exports: [RouterModule],
})
export class FoodEntryRoutingModule {}
