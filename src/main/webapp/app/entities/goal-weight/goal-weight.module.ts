import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GoalWeightComponent } from './list/goal-weight.component';
import { GoalWeightDetailComponent } from './detail/goal-weight-detail.component';
import { GoalWeightUpdateComponent } from './update/goal-weight-update.component';
import { GoalWeightDeleteDialogComponent } from './delete/goal-weight-delete-dialog.component';
import { GoalWeightRoutingModule } from './route/goal-weight-routing.module';

@NgModule({
  imports: [SharedModule, GoalWeightRoutingModule],
  declarations: [GoalWeightComponent, GoalWeightDetailComponent, GoalWeightUpdateComponent, GoalWeightDeleteDialogComponent],
  entryComponents: [GoalWeightDeleteDialogComponent],
})
export class GoalWeightModule {}
