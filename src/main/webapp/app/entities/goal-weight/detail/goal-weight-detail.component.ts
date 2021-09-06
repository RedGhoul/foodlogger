import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGoalWeight } from '../goal-weight.model';

@Component({
  selector: 'jhi-goal-weight-detail',
  templateUrl: './goal-weight-detail.component.html',
})
export class GoalWeightDetailComponent implements OnInit {
  goalWeight: IGoalWeight | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ goalWeight }) => {
      this.goalWeight = goalWeight;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
