import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFood } from '../food.model';
import { FoodService } from '../service/food.service';

@Component({
  templateUrl: './food-delete-dialog.component.html',
})
export class FoodDeleteDialogComponent {
  food?: IFood;

  constructor(protected foodService: FoodService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.foodService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
