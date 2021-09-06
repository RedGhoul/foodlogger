import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGoalWeight } from '../goal-weight.model';
import { GoalWeightService } from '../service/goal-weight.service';
import { GoalWeightDeleteDialogComponent } from '../delete/goal-weight-delete-dialog.component';

@Component({
  selector: 'jhi-goal-weight',
  templateUrl: './goal-weight.component.html',
})
export class GoalWeightComponent implements OnInit {
  goalWeights?: IGoalWeight[];
  isLoading = false;

  constructor(protected goalWeightService: GoalWeightService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.goalWeightService.query().subscribe(
      (res: HttpResponse<IGoalWeight[]>) => {
        this.isLoading = false;
        this.goalWeights = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IGoalWeight): number {
    return item.id!;
  }

  delete(goalWeight: IGoalWeight): void {
    const modalRef = this.modalService.open(GoalWeightDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.goalWeight = goalWeight;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
