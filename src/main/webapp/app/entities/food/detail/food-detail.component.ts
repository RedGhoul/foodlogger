import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFood } from '../food.model';

@Component({
  selector: 'jhi-food-detail',
  templateUrl: './food-detail.component.html',
})
export class FoodDetailComponent implements OnInit {
  food: IFood | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ food }) => {
      this.food = food;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
