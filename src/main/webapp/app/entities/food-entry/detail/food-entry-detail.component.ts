import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFoodEntry } from '../food-entry.model';

@Component({
  selector: 'jhi-food-entry-detail',
  templateUrl: './food-entry-detail.component.html',
})
export class FoodEntryDetailComponent implements OnInit {
  foodEntry: IFoodEntry | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foodEntry }) => {
      this.foodEntry = foodEntry;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
