import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFoodDay } from '../food-day.model';
import { FoodDayService } from '../service/food-day.service';

@Component({
  templateUrl: './food-day-delete-dialog.component.html',
})
export class FoodDayDeleteDialogComponent {
  foodDay?: IFoodDay;

  constructor(protected foodDayService: FoodDayService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.foodDayService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
