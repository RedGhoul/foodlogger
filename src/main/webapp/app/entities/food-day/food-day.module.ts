import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FoodDayComponent } from './list/food-day.component';
import { FoodDayDetailComponent } from './detail/food-day-detail.component';
import { FoodDayUpdateComponent } from './update/food-day-update.component';
import { FoodDayDeleteDialogComponent } from './delete/food-day-delete-dialog.component';
import { FoodDayRoutingModule } from './route/food-day-routing.module';

@NgModule({
  imports: [SharedModule, FoodDayRoutingModule],
  declarations: [FoodDayComponent, FoodDayDetailComponent, FoodDayUpdateComponent, FoodDayDeleteDialogComponent],
  entryComponents: [FoodDayDeleteDialogComponent],
})
export class FoodDayModule {}
