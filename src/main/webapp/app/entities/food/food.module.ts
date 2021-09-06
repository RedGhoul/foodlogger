import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FoodComponent } from './list/food.component';
import { FoodDetailComponent } from './detail/food-detail.component';
import { FoodUpdateComponent } from './update/food-update.component';
import { FoodDeleteDialogComponent } from './delete/food-delete-dialog.component';
import { FoodRoutingModule } from './route/food-routing.module';

@NgModule({
  imports: [SharedModule, FoodRoutingModule],
  declarations: [FoodComponent, FoodDetailComponent, FoodUpdateComponent, FoodDeleteDialogComponent],
  entryComponents: [FoodDeleteDialogComponent],
})
export class FoodModule {}
