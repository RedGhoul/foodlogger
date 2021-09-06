import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICurrentWeight } from '../current-weight.model';

@Component({
  selector: 'jhi-current-weight-detail',
  templateUrl: './current-weight-detail.component.html',
})
export class CurrentWeightDetailComponent implements OnInit {
  currentWeight: ICurrentWeight | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ currentWeight }) => {
      this.currentWeight = currentWeight;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
