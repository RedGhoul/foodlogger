import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GoalWeightComponent } from '../list/goal-weight.component';
import { GoalWeightDetailComponent } from '../detail/goal-weight-detail.component';
import { GoalWeightUpdateComponent } from '../update/goal-weight-update.component';
import { GoalWeightRoutingResolveService } from './goal-weight-routing-resolve.service';

const goalWeightRoute: Routes = [
  {
    path: '',
    component: GoalWeightComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GoalWeightDetailComponent,
    resolve: {
      goalWeight: GoalWeightRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GoalWeightUpdateComponent,
    resolve: {
      goalWeight: GoalWeightRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GoalWeightUpdateComponent,
    resolve: {
      goalWeight: GoalWeightRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(goalWeightRoute)],
  exports: [RouterModule],
})
export class GoalWeightRoutingModule {}
