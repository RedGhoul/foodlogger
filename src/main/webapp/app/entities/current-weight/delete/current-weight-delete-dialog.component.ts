import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICurrentWeight } from '../current-weight.model';
import { CurrentWeightService } from '../service/current-weight.service';

@Component({
  templateUrl: './current-weight-delete-dialog.component.html',
})
export class CurrentWeightDeleteDialogComponent {
  currentWeight?: ICurrentWeight;

  constructor(protected currentWeightService: CurrentWeightService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.currentWeightService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
