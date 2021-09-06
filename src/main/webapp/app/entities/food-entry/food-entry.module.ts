import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FoodEntryComponent } from './list/food-entry.component';
import { FoodEntryDetailComponent } from './detail/food-entry-detail.component';
import { FoodEntryUpdateComponent } from './update/food-entry-update.component';
import { FoodEntryDeleteDialogComponent } from './delete/food-entry-delete-dialog.component';
import { FoodEntryRoutingModule } from './route/food-entry-routing.module';

@NgModule({
  imports: [SharedModule, FoodEntryRoutingModule],
  declarations: [FoodEntryComponent, FoodEntryDetailComponent, FoodEntryUpdateComponent, FoodEntryDeleteDialogComponent],
  entryComponents: [FoodEntryDeleteDialogComponent],
})
export class FoodEntryModule {}
