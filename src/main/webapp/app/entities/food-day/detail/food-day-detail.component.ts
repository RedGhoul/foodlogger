import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFoodDay } from '../food-day.model';

@Component({
  selector: 'jhi-food-day-detail',
  templateUrl: './food-day-detail.component.html',
})
export class FoodDayDetailComponent implements OnInit {
  foodDay: IFoodDay | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ foodDay }) => {
      this.foodDay = foodDay;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
