import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGoalWeight } from '../goal-weight.model';
import { GoalWeightService } from '../service/goal-weight.service';

@Component({
  templateUrl: './goal-weight-delete-dialog.component.html',
})
export class GoalWeightDeleteDialogComponent {
  goalWeight?: IGoalWeight;

  constructor(protected goalWeightService: GoalWeightService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.goalWeightService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
