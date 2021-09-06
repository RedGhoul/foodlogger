import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CurrentWeightComponent } from './list/current-weight.component';
import { CurrentWeightDetailComponent } from './detail/current-weight-detail.component';
import { CurrentWeightUpdateComponent } from './update/current-weight-update.component';
import { CurrentWeightDeleteDialogComponent } from './delete/current-weight-delete-dialog.component';
import { CurrentWeightRoutingModule } from './route/current-weight-routing.module';

@NgModule({
  imports: [SharedModule, CurrentWeightRoutingModule],
  declarations: [CurrentWeightComponent, CurrentWeightDetailComponent, CurrentWeightUpdateComponent, CurrentWeightDeleteDialogComponent],
  entryComponents: [CurrentWeightDeleteDialogComponent],
})
export class CurrentWeightModule {}
