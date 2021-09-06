import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CurrentWeightComponent } from '../list/current-weight.component';
import { CurrentWeightDetailComponent } from '../detail/current-weight-detail.component';
import { CurrentWeightUpdateComponent } from '../update/current-weight-update.component';
import { CurrentWeightRoutingResolveService } from './current-weight-routing-resolve.service';

const currentWeightRoute: Routes = [
  {
    path: '',
    component: CurrentWeightComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CurrentWeightDetailComponent,
    resolve: {
      currentWeight: CurrentWeightRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CurrentWeightUpdateComponent,
    resolve: {
      currentWeight: CurrentWeightRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CurrentWeightUpdateComponent,
    resolve: {
      currentWeight: CurrentWeightRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(currentWeightRoute)],
  exports: [RouterModule],
})
export class CurrentWeightRoutingModule {}
