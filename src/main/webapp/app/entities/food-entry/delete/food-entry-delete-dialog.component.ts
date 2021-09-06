import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFoodEntry } from '../food-entry.model';
import { FoodEntryService } from '../service/food-entry.service';

@Component({
  templateUrl: './food-entry-delete-dialog.component.html',
})
export class FoodEntryDeleteDialogComponent {
  foodEntry?: IFoodEntry;

  constructor(protected foodEntryService: FoodEntryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.foodEntryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
